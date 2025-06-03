import axios from "axios";
const url = 'http://localhost:3000/api/v1'
export type Household_User = {
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
  permanentResidence: string;
  temporaryResidence: string;
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

//Dashboard/statistics API types
export interface FeeCollectionDataItem {
  month: string;
  amount: number;
}
export interface FeeCollectionDataResponse {
  success: boolean;
  message: string;
  data: FeeCollectionDataItem[];
}

export interface FeeTypeDistributionItem {
  name: string;
  value: number;
}
export interface FeeTypeDistributionResponse {
  success: boolean;
  message: string;
  data: FeeTypeDistributionItem[];
}

export interface ActiveCampaignItem {
  name: string;
  description: string;
  end: string;
  collected: number;
  target: number;
}
export interface ActiveCampaignsResponse {
  success: boolean;
  message: string;
  data: ActiveCampaignItem[];
}

// Fetch fee collection data
export async function getFeeCollectionData(accessToken: string): Promise<FeeCollectionDataResponse> {
  try {
    const response = await axios.get(`${url}/admin/fee-collection-data`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data: FeeCollectionDataResponse = response.data;
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

// Fetch fee type distribution
export async function getFeeTypeDistribution(accessToken: string): Promise<FeeTypeDistributionResponse> {
  try {
    const response = await axios.get(`${url}/admin/fee-type-distribution`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data: FeeTypeDistributionResponse = response.data;
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

// Fetch active campaigns
export async function getActiveCampaigns(accessToken: string): Promise<ActiveCampaignsResponse> {
  try {
    const response = await axios.get(`${url}/admin/active-campaigns`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data: ActiveCampaignsResponse = response.data;
    if (!data.success) throw new Error(data.message);
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


export type Contribution = {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    goal: number;
    donate: number;
    status: string;
}
interface getContributionResponse {
    success: boolean;
    message: string;
    data: Contribution[];
}
export async function getContribution(accessToken: string): Promise<getContributionResponse> {
    try {
        const response = await axios.get(`${url}/admin/getContribution`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getContributionResponse = response.data;
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
export async function addContribution(data: Contribution, accessToken: string): Promise<getContributionResponse> {
    try {
        const response = await axios.post(`${url}/admin/addContribution`, data, {
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
    

// Tổng số hộ gia đình đang hoạt động
export interface TotalHouseholdsResponse {
  success: boolean;
  message: string;
  total: number;
}

// Số hộ chưa đóng phí tháng hiện tại
export interface UnpaidHouseholdsResponse {
  success: boolean;
  message: string;
  unpaidCount: number;
}

export async function getTotalHouseholds(accessToken: string): Promise<TotalHouseholdsResponse> {
  try {
    const response = await axios.get(`${url}/admin/total-households`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data: TotalHouseholdsResponse = response.data;
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

export async function getUnpaidHouseholds(accessToken: string): Promise<UnpaidHouseholdsResponse> {
  try {
    const response = await axios.get(`${url}/admin/unpaid-households`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data: UnpaidHouseholdsResponse = response.data;
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

// Tổng hợp phí tháng hiện tại (tổng đã thu, chưa thu, phải thu)
export interface FeeSummaryResponse {
  success: boolean;
  message: string;
  totalPaid: number;
  totalUnpaid: number;
  total: number;
}

export async function getFeeSummary(accessToken: string): Promise<FeeSummaryResponse> {
  try {
    const response = await axios.get(`${url}/admin/fee-summary`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data: FeeSummaryResponse = response.data;
    if (!data.success) throw new Error(data.message);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'An error occurred');
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

// Lấy danh sách chi tiết hộ gia đình chưa thanh toán trong tháng
export interface UnpaidHouseholdDetail {
  household: string;
  owner: string;
  unpaidAmount: number;
}
export interface GetUnpaidHouseholdDetailsResponse {
  success: boolean;
  message: string;
  data: UnpaidHouseholdDetail[];
}

export async function getUnpaidHouseholdDetails(accessToken: string, month?: string): Promise<GetUnpaidHouseholdDetailsResponse> {
  const params = month ? `?month=${month}` : "";
  const response = await axios.get(`${url}/admin/unpaid-household-details${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
}


export interface addUserToContributions {
    householdId: string;
    contributionId: string;
    amount: number;
}
interface addUserToContributionResponse {
    success: boolean;
    message: string;
    error: string | null;
}
export async function addUserToContribution(data: addUserToContributions, accessToken: string): Promise<addUserToContributionResponse> {
    try {
        const response = await axios.post(`${url}/admin/addContributionPayment`, data, {
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
type contributionPayment = {
    id: string;
    householdId: string;
    contributionId: string;
    amount: number;
    paymentDate: Date;
    Contribution: {
        name: string;
    }
}
interface getContributionPaymentResponse {
    success: boolean;
    message: string;
    data: contributionPayment[];
    error: string | null;
}
export async function getContributionPayment(accessToken: string): Promise<getContributionPaymentResponse> {
    try {
        const response = await axios.get(`${url}/admin/getContributionPayment`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: getContributionPaymentResponse = response.data;
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

export async function deleteUserHousehold(accessToken: string, householdId: string): Promise<{ success: boolean; message: string }> {
    try {
        const response = await axios.delete(`${url}/admin/deleteHousehold`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            data: {
                householdId
            }
        });
        const data = response.data;
        if (!data.success) {
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
// Lấy thông tin thường trú, tạm trú của user
export interface UserResidenceInfoResponse {
  success: boolean;
  message: string;
  permanentResidence: string | null;
  temporaryResidence: string | null;
}

export async function getUserResidenceInfo(accessToken: string, userId: string): Promise<UserResidenceInfoResponse> {
  const response = await axios.get(`${url}/admin/user-residence/${userId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
}

export interface AddressResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        fullname: string;
        permanentResidence: string;
        temporaryResidence: string;
        UserHouseholds: {
            householdId: string;
        }[];
    }[]
}
export async function getAddress(accessToken: string): Promise<AddressResponse> {
    try {
        const response = await axios.get(`${url}/admin/address`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        const data: AddressResponse = response.data;
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

/**
 * Gửi file .xlsx lên server để import phí tiện ích qua API /admin/import-fees
 * @param accessToken Token xác thực
 * @param file File .xlsx (kiểu File hoặc Blob)
 * @returns Promise<any>
 */
export async function importFeeFromExcel(accessToken: string, file: File | Blob): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(
            `${url}/admin/import-fees`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'An error occurred');
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}