import { useQuery } from "@tanstack/react-query";
import { getHousehold, getUserInHousehold} from "@/service/admin_v1";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

export const useHouseholds = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['households'],
        queryFn: async () => {
            try {
                const response = await getHousehold(accessToken);
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
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    })
}
export const useUserINHouseholds = () => {
    const {toast} = useToast();
    const accessToken = Cookies.get("accessToken");
    return useQuery({
        queryKey: ['userInHouseholds'],
        queryFn: async () => {
            try {
                const response = await getUserInHousehold(accessToken);
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
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 5, // 5 minutes
    })
}