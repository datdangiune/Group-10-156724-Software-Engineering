
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { autoAdd } from "@/service/admin_v1";
import { useGetAll } from "@/hooks/useHouseholds";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

const MonthlyFees = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("2025-05"); // Default to current month
  const accessToken = Cookies.get("accessToken");
  const { data: mockMonthlyFees } = useGetAll(month);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  console.log(accessToken)
  const filteredFees = (mockMonthlyFees ?? []).filter(fee => 
    fee?.householdId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    fee?.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAutoAdd = async () => {
    try {
      const response = await autoAdd(accessToken, month);
      console.log(accessToken)
      if (response.success) {
        queryClient.invalidateQueries({queryKey: ['getAllFeeService', month]});
        queryClient.invalidateQueries({queryKey: ['getAllFeeOfHousehold', month]});
        toast({
          title: "Thành công",
          description: "Đã tự động thu phí cho tháng này.",
        });
      } else {
        toast({
          title: "Lỗi",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tự động thu phí.",
      });
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thu phí hàng tháng</CardTitle>
          <CardDescription>
            Quản lý các khoản phí theo tháng của các hộ gia đình
          </CardDescription>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="month">Tháng:</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo căn hộ hoặc loại phí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            {user?.role === 'ketoan' && (
              <Button onClick={handleAutoAdd} className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Tự động thu phí
              </Button>
            )}

          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Loại phí</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày thanh toán</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.householdId}</TableCell>
                  <TableCell>{fee.FeeService.serviceName}</TableCell>
                  <TableCell>{formatCurrency(fee.amount)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      fee.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {fee.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {fee.status === 'paid'
                      ? new Date(fee.paymentDate).toLocaleString('vi-VN')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
              {filteredFees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filteredFees?.length} trên tổng số {mockMonthlyFees?.length} khoản phí
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MonthlyFees;
