const Admin = require('../models/admin');
const {genAccessToken, genRefreshToken} = require('../middleware/jwt')
const bcrypt = require('bcrypt');

class AuthController {
    async register(req, res) {
        const { email, password, fullname, phoneNumber } = req.body;
        try {
            const existingAdmin = await Admin.findOne({ where: { email } });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Email already exists' });
            }
            const newAdmin = await Admin.create({ email, password, fullname, role: 'admin', phoneNumber });
            return res.status(201).json({ message: 'Admin created successfully', admin: newAdmin });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    async login(req, res) {
        const { email, password } = req.body;
        try {
            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }
            const accessToken = genAccessToken(admin.id, admin.role, admin.fullname, admin.email);
            const refreshToken = genRefreshToken(admin.id);
            res.cookie('accessToken', accessToken, { httpOnly: true });
            await Admin.update({ refreshToken }, { where: { id: admin.id } });
            return res.sendStatus(200);
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
}
module.exports = new AuthController();