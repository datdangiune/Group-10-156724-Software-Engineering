const { Household, UserHousehold, User, FeeService,  FeeHousehold, Vehicle} = require('../models/index');
const {Op} = require('sequelize');

const addVehicle = async (req, res) => {
    const { householdId, plateNumber, vehicleType } = req.body;
    try {
        const isHouseholdExist = await Household.findOne({
            where: {
                id: householdId,
                isActive: true
            }
        });
        if (!isHouseholdExist) {
            return res.status(404).json({
                success: false,
                message: 'Household not found or inactive'
            });
        }
        const isVehicleExist = await Vehicle.findOne({
            where: {
                plateNumber: plateNumber,
                householdId: householdId
            }
        });
        if (isVehicleExist) {
            return res.status(409).json({
                success: false,
                message: 'Vehicle already exists for this household'
            });
        }

        let feeServiceId = null;
        if (vehicleType === "Xe máy") {
            feeServiceId = "e3b0486d-394e-46a7-9d26-31ea0cd2431f";
        } else if (vehicleType === "Ô tô") {
            feeServiceId = "971f6415-25bd-4194-ab98-b9c689fb95ae";
        }
        let pricePerMonth = 0;
        if (feeServiceId) {
            const feeService = await FeeService.findByPk(feeServiceId);
            if (!feeService) {
                return res.status(404).json({
                    success: false,
                    message: 'FeeService not found for vehicle type'
                });
            }
            pricePerMonth = feeService.servicePrice;
        }

        const newVehicle = await Vehicle.create({
            plateNumber: plateNumber,
            vehicleType: vehicleType,
            householdId: householdId,
            pricePerMonth: pricePerMonth
        });
        return res.status(201).json({
            success: true,
            message: 'Vehicle added successfully',
            data: newVehicle
        });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}
const getVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findAll();
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: vehicle
        });
    } catch (error) {
        console.error('Error getting vehicle:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
        
    }
}

module.exports = {addVehicle, getVehicle}