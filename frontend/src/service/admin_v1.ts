import axios from "axios";
const url = 'http://localhost:3000/api/v1'
type Household_User = {
    id: string;
    householdId: string;
    fullname: string;
    email: string;
    phoneNumber: string;
    memberCount: number;
    dateOfBirth: Date;
    gender: string;
    roleInFamily: string;
    userId: string;
    area: string;
    cccd: string;
}
type FeeService = {
    id: string;
    serviceName: string;
    type: string;
    unit: string;
    isRequired: boolean;
    servicePrice: number;
}
interface getFeeServiceResponse {
    success: boolean;
    message: string;
    data: FeeService[];
}
interface getHouseholdResponse {
    success: boolean;
    message: string;
    totalHouseholds: number;
    totalPages: number;
    page: number;
    data: Household_User[]
}
interface getUserInHouseholdResponse {
    success: boolean;
    message: string;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    data: Household_User[];
}
interface getHouseholdUnactiveResponse {
    success: boolean;
    message: string;
    data: Household_User[]
}
export type PersonData = {
  email: string;
  fullname: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  cccd: string;
  roleInFamily?: string;
};

export type HouseholdData = {
  householdId: string;
  owner: PersonData;
  members: PersonData[];
};

export interface AddHouseholdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  household?: any;
}
export async function getHousehold(accessToken: string, page:number): Promise<getHouseholdResponse> {
    try {
        const response = await axios.get(`${url}/admin/household?page=${page}`, {
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
export async function getUserInHousehold(accessToken: string, page: number): Promise<getUserInHouseholdResponse> {
    try {
        const response = await axios.get(`${url}/admin/user?page=${page}`, {
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
export async function getFeeService(accessToken: string): Promise<getFeeServiceResponse> {
    try {
        const response = await axios.get(`${url}/admin/feeService`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getFeeServiceResponse = response.data;
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
export async function getHouseholdUnactive(accessToken: string): Promise<getHouseholdUnactiveResponse> {
    try {
        const response = await axios.get(`${url}/admin/getHouseholdUnactive`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getHouseholdUnactiveResponse = response.data;
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
export async function addHouseholdAndUser(data: HouseholdData, accessToken: string) {
    try {
        const response = await axios.post(`${url}/admin/addHouseholdAndUser`, data, {
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