import { useQuery } from "@tanstack/react-query";
import { getHousehold, getUserInHousehold, getFeeService, getHouseholdUnactive } from "@/service/admin_v1";
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