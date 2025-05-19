import axios from "axios";
const url = 'http://localhost:3000/api/v1'
export type Household_User = {
    householdId: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    memberCount: number;
    dateOfBirth: Date;
    gender: string;
    roleInFamily: string;
    userId: string;
}
interface getHouseholdResponse {
    success: boolean;
    message: string;
    totalHouseholds: number;
    data: Household_User[]
}
interface getUserInHouseholdResponse {
    success: boolean;
    message: string;
    total: number;
    data: Household_User[];
}
export async function getHousehold(accessToken: string): Promise<getHouseholdResponse> {
    try {
        const response = await axios.get(`${url}/admin/household`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data: getHouseholdResponse = response.data;
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
export async function getUserInHousehold(accessToken: string): Promise<getUserInHouseholdResponse> {
    try {
        const response = await axios.get(`${url}/admin/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getUserInHouseholdResponse = response.data;
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