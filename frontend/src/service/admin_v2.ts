import axios from "axios";
const url = 'https://apis.thaihadtp.id.vn/api/v1'
interface addVehicleResponse {
    success: boolean;
    message: string;
}
type Vehicle = {
    householdId: string;
    vehicleType: string;
    plateNumber: string;
    
}
type Vehicles = {
    householdId: string;
    vehicleType: string;
    plateNumber: string;
    pricePerMonth: number;
    
}
interface getVehicle {
    success: boolean;
    message: string;
    data: Vehicles[]
}
export async function addVehicle(data: Vehicle, accessToken: string): Promise<addVehicleResponse> {
    try {
        const response = await axios.post(`${url}/admin/addVehicle`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        });
        const result = response.data;
        if (!result.success) {
            throw new Error(result.message);
        }
        return result;
    } catch (error) {  
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred');
        } else {
            throw new Error('An unknown error occurred');
        }
        
    }
}
export async function getVehicle(accessToken: string): Promise<getVehicle> {
    try {
        const response = await axios.get(`${url}/admin/getVehicle`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getVehicle = response.data;
        if (!response.data.success) {
            throw new Error(data.message);
        }
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred');
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}