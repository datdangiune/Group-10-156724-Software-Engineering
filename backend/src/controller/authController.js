const Admin = require('../models/admin');
const {genAccessToken, genRefreshToken} = require('../util/jwt');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    async register(req, res) {
        const { email, password, fullname, phoneNumber } = req.body;
        try {
            const existingAdmin = await Admin.findOne({ where: { email } });
            if (existingAdmin) {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            await Admin.create({ email, password, fullname, role: 'admin', phoneNumber });
            return res.status(201).json({ success: true, message: 'Admin created successfully'});
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        try {
            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(400).json({ success: false, message: 'Tai khoan khong ton tai' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Invalid email or password' });
            }
            const accessToken = genAccessToken(admin.id, admin.role, admin.fullname, admin.email);
            console.log('Access token:', accessToken);
            const refreshToken = genRefreshToken(admin.id);
            await Admin.update({ refreshToken }, { where: { id: admin.id } });
            res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 10*24*60*60*1000, sameSite: 'Lax'})
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                accessToken: accessToken,
            });
        } catch (error) {
            console.error(error); 
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }
    async resetAccessToken(req, res) {
        const cookie = req.cookies;

        if (!cookie || !cookie.refreshToken) {
            return res.status(403).json({ success: false, message: "Refresh token is missing!" });
        }

        try {
            const result = jwt.verify(cookie.refreshToken, process.env.REFRESH_TOKEN_SECRET);

            const admin = await Admin.findOne({
                where: {
                    id: result.id, // hoặc result._id tùy thuộc genRefreshToken
                    refreshToken: cookie.refreshToken
                }
            });

            if (!admin) {
                return res.status(403).json({ success: false, message: "Refresh token is invalid!" });
            }

            const newAccessToken = genAccessToken(admin.id, admin.role, admin.fullname, admin.email);

            return res.status(200).json({
                success: true,
                message: "Access token is generated successfully",
                newAccessToken
            });
        } catch (err) {
            console.error("Token verify error:", err);
            return res.status(403).json({ success: false, message: "Refresh token is invalid!" });
        }
    }
    async logout(req, res) {
        console.log("Logout called");
        const cookie = req.cookies;
        const refreshToken = cookie?.refreshToken;

        if (!refreshToken) {
            console.log("No refresh token");
            return res.status(403).json({ success: false, message: "Refresh token is missing!" });
        }

        try {
            const admin = await Admin.findOne({ where: { refreshToken } });

            if (!admin) {
                return res.status(403).json({ success: false, message: "Refresh token is invalid!" });
            }

            await Admin.update(
                { refreshToken: null },
                { where: { id: admin.id } }
            );

            res.clearCookie('refreshToken', { httpOnly: true, secure: false }); // secure: true nếu dùng HTTPS
            return res.status(200).json({ success: true, message: "Logout successfully" });
        } catch (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    }

    async getAdminInfo(req, res) {
        try {
            const adminId = req.user?._id || req.adminId || req.body.adminId || req.query.adminId;
            if (!adminId) {
                return res.status(400).json({ success: false, message: 'Missing admin id' });
            }
            const admin = await Admin.findByPk(adminId, {
                attributes: { exclude: ['password', 'refreshToken'] }
            });
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            return res.status(200).json({ success: true, data: admin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }

    async updateAdminInfo(req, res) {
        try {
            const adminId = req.user?._id;
            const { fullname, phoneNumber } = req.body;
            if (!adminId) {
                return res.status(400).json({ success: false, message: 'Missing admin id' });
            }
            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            if (fullname) admin.fullname = fullname;
            if (phoneNumber) admin.phoneNumber = phoneNumber;
            await admin.save();
            return res.status(200).json({ success: true, message: 'Admin info updated successfully', data: admin });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }

    async changeAdminPassword(req, res) {
        try {
            const adminId = req.user?.id || req.adminId || req.body.adminId || req.query.adminId;
            const { oldPassword, newPassword } = req.body;
            if (!adminId || !oldPassword || !newPassword) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
            const admin = await Admin.findByPk(adminId);
            if (!admin) {
                return res.status(404).json({ success: false, message: 'Admin not found' });
            }
            const isMatch = await bcrypt.compare(oldPassword, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Old password is incorrect' });
            }
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(newPassword, salt);
            await admin.save();
            return res.status(200).json({ success: true, message: 'Password changed successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error });
        }
    }

}

module.exports = new AuthController();