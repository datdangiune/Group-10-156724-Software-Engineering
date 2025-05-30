import { useQuery } from "@tanstack/react-query";
import { 
    getHousehold, 
    getUserInHousehold, 
    getAllFee,
    getFeeService, 
    getHouseholdInuse,
    getHouseholdUnactive, 
    getFeeUtility, 
    getHouseholdActive, 
    getAllFeeOfHousehold,
    getFeeCollectionData, 
    getFeeTypeDistribution, 
    getActiveCampaigns,

    getContribution,

    getTotalHouseholds,
    getUnpaidHouseholds,
    getFeeSummary,

    getUnpaidHouseholdDetails,
    getContributionPayment,

    getUserResidenceInfo, // <-- thêm import này
} from "@/service/admin_v1";
import { getAdminInfo } from "@/service/auth";
import {getVehicle} from "@/service/admin_v2";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
const staleTime = 1000 * 60 * 5; // 5 minutes
const gcTime = 1000 * 60 * 20; // 20 minutes

export const useHouseholds = (page: number) => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['households', page],
        queryFn: async () => {
            try {
                const response = await getHousehold(accessToken, page);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime,
        gcTime: gcTime,
    });
}

export const useUserINHouseholds = (page: number) => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['userInHouseholds', page],
        queryFn: async () => {
            try {
                const response = await getUserInHousehold(accessToken, page);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime,
        gcTime: gcTime,
    })
}
export const useFeeService = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['feeService'],
        queryFn: async () => {
            try {
                const response = await getFeeService(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}
export const useHouseholdUnactive = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['householdUnactive'],
        queryFn: async () => {
            try {
                const response = await getHouseholdUnactive(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}
export const useAdminInfo = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['adminInfo'],
        queryFn: async () => {
            try {
                const response = await getAdminInfo(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}

export const useFeeUtility = (month: string) => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['feeUtility', month],
        queryFn: async () => {
            try {
                const response = await getFeeUtility(accessToken, month);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}

export const useHouseholdActive = (month: string) => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['householdActive', month],
        queryFn: async () => {
            try {
                const response = await getHouseholdActive(accessToken, month);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}

export const useHouseholdUInuse = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['householdInuse'],
        queryFn: async () => {
            try {
                const response = await getHouseholdInuse(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}

export const useVehicle = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['vehicle'],
        queryFn: async () => {
            try {
                const response = await getVehicle(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}
export const useGetAll = (month: string) => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['getAllFeeService', month],
        queryFn: async () => {
            try {
                const response = await getAllFee(accessToken, month);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu hộ gia đình.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}
export const useGetAllFeeOfHousehold = (month: string) => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['getAllFeeOfHousehold', month],
        queryFn: async () => {
            try {
                const response = await getAllFeeOfHousehold(accessToken, month);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu.",
                });
            }
        },
        staleTime: staleTime, // 5 minutes
        gcTime: gcTime, // 5 minutes
    })
}

export const useFeeCollectionData = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['feeCollectionData'],
        queryFn: async () => {
            try {
                const response = await getFeeCollectionData(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu tổng thu phí.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}

export const useFeeTypeDistribution = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['feeTypeDistribution'],
        queryFn: async () => {
            try {
                const response = await getFeeTypeDistribution(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu phân bổ loại phí.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}

export const useActiveCampaigns = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['activeCampaigns'],
        queryFn: async () => {
            try {
                const response = await getActiveCampaigns(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu chiến dịch quyên góp.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}

export const useContribution = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['contribution'],
        queryFn: async () => {
            try {
                const response = await getContribution(accessToken);
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu chiến dịch quyên góp."
                });
            }
        },
        staleTime,
        gcTime,
    });
}


export const useTotalHouseholds = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['totalHouseholds'],
        queryFn: async () => {
            try {
                const response = await getTotalHouseholds(accessToken);

                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.total;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải tổng số hộ gia đình.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}

export const useUnpaidHouseholds = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['unpaidHouseholds'],
        queryFn: async () => {
            try {
                const response = await getUnpaidHouseholds(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.unpaidCount;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải số hộ chưa đóng phí.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}

export const useFeeSummary = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['feeSummary'],
        queryFn: async () => {
            try {
                const response = await getFeeSummary(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải tổng hợp phí tháng hiện tại.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}

export const useUnpaidHouseholdDetails = (month?: string) => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['unpaidHouseholdDetails', month],
        queryFn: async () => {
            try {
                const response = await getUnpaidHouseholdDetails(accessToken, month);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải danh sách hộ chưa thanh toán.",
                });
            }
        },
        staleTime,
        gcTime,
    });
}


export const useContributionPayment = () => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['contributionPayment'],
        queryFn: async () => {
            try {
                const response = await getContributionPayment(accessToken);
                if (!response.success) {
                    toast({
                        title: "Lỗi",
                        description: response.message,
                    });
                }
                return response.data;
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải dữ liệu thanh toán quyên góp.",
                });
            }
        },

        staleTime,
        gcTime,
    });
}

export const useUserResidenceInfo = (userId: string) => {
    const { toast } = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['userResidenceInfo', userId],
        queryFn: async () => {
            try {
                const response = await getUserResidenceInfo(accessToken, userId);
                return {
                    permanentResidence: response.permanentResidence,
                    temporaryResidence: response.temporaryResidence
                };
            } catch (error) {
                toast({
                    title: "Lỗi",
                    description: "Không thể tải thông tin hộ khẩu.",
                });
                return {
                    permanentResidence: null,
                    temporaryResidence: null
                };
            }
        },
        enabled: !!userId,
        staleTime,
        gcTime,
    });
}