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
type Utility = {
    householdId: string;
    water: number;
    electricity: number;
    internet: boolean;
    totalPrice: number;
    statusPayment: string;
}
type FeeUtility = {
    householdId: string;
    water: number;
    electricity: number;
    internet: boolean;
}
interface getFeeUtilityResponse {
    success: boolean;
    message: string;
    data: Utility[];
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
export async function getFeeUtility(token: string, month: string): Promise<getFeeUtilityResponse> {
    try {
        const response = await axios.get(`${url}/admin/getFeeUtility?month=${month}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        const data: getFeeUtilityResponse = response.data;
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
export async function getHouseholdActive(accessToken: string, month: string): Promise<getHouseholdUnactiveResponse> {
    try {
        const response = await axios.get(`${url}/admin/activeHousehold?month=${month}`, {
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
export async function addFeeUtility(data: FeeUtility, accessToken: string) {
    try {
        const response = await axios.post(`${url}/admin/addFeeUtility`, data, {
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

export async function getHouseholdInuse(accessToken: string): Promise<getHouseholdUnactiveResponse> {
    try {
        const response = await axios.get(`${url}/admin/householdInuse`, {
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

export async function autoAdd(accessToken: string, month: string) {
    try {
        const response = await axios.post(`${url}/admin/autoAdd?month=${month}`, {},{
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data = response.data;
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
type getAllFee = {
    id: string;
    householdId: string;
    feeServiceId: string;
    month: string;
    amount: number;
    status: string;
    paymentDate: Date;
    FeeService: FeeService;
}
interface getAllReponse {
    success: boolean;
    message: string;
    data: getAllFee[];
}
export async function getAllFee(accessToken: string, month: string): Promise<getAllReponse> {
    try {
        const response = await axios.get(`${url}/admin/getAll?month=${month}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getAllReponse = response.data;
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


//News

type Fees = {
    id: string,
    amount: number;
    status: string;
    paymentDate: Date;
    feeServiceId: string;
    serviceName: string;
    servicePrice: number;
    unit: string;
}
type Owner = {
    roleInFamily: string;
    isOwner: boolean;
    fullname: string;
}
interface getAllFeeOfHouseholdResponse {
    success: boolean;
    message: string;
    data: {
        householdId: string;
        area: string;
        totalPrice: number;
        fees: Fees[];
        owner: Owner;
    }[]
}
export async function getAllFeeOfHousehold(accessToken: string, month: string): Promise<getAllFeeOfHouseholdResponse> {
    try {
        const response = await axios.get(`${url}/admin/allHouseholdPerMonth?month=${month}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getAllFeeOfHouseholdResponse = response.data;
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
interface updatePaymentResponse {
    success: boolean,
    message: string
}
export async function updatePayment(accessToken: string, id: string): Promise<updatePaymentResponse>{
    try {
        const response = await axios.put(`${url}/admin/updatePayment`, {
            id
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: updatePaymentResponse = response.data
        if (!response.data.success) {
            throw new Error(data.message);
        }
        return data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message || 'An error occurred');
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}