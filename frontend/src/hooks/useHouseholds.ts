import { useQuery } from "@tanstack/react-query";
import { getHousehold, getUserInHousehold, getAllFee,getFeeService, getHouseholdInuse,getHouseholdUnactive, getFeeUtility, getHouseholdActive, getAllFeeOfHousehold} from "@/service/admin_v1";
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