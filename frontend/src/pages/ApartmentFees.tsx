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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useGetAllFeeOfHousehold } from "@/hooks/useHouseholds";
import { updatePayment } from "@/service/admin_v1";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};
const getCurrentMonth = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Thêm số 0 nếu tháng < 10
  return `${year}-${month}`;
};
const ApartmentFees = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const token =  Cookies.get('accessToken');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState(getCurrentMonth());
  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: dataHousehold} = useGetAllFeeOfHousehold(month);
  const dataHouseholds = Array.isArray(dataHousehold) ? dataHousehold : [];
  console.log(dataHouseholds)
  const filteredApartments = dataHouseholds.filter(apartment => 
    apartment.householdId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    apartment.owner?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApartmentClick = (apartmentId: string) => {
    setSelectedApartment(apartmentId);
    setIsDialogOpen(true);
  };

  const handleStatusChange = async (feeId: string) => {
    try {
      setLoading(true)
      const response = await updatePayment(token, feeId);
        if(!response.success){
          toast({
            title: "Cập nhật không thành công",
            description: "Có lỗi xảy ra"
          })
        }
        queryClient.invalidateQueries({queryKey: ['getAllFeeOfHousehold', month]})
        queryClient.invalidateQueries({queryKey: ['getAllFeeService', month]})
        queryClient.invalidateQueries({queryKey: ['feeUtility', month]})
        queryClient.invalidateQueries({queryKey: ['feeService']})
        toast({
            title: "Cập nhật thành công",
            description: "Dữ liệu đã được cập nhật"
        })
    } catch (error) {
        toast({
            title: "Cập nhật thành công",
            description: error
        })
    } finally {
      setLoading(false)
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Phí theo căn hộ</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các khoản phí theo từng căn hộ
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách căn hộ</CardTitle>
          <CardDescription>
            Tổng cộng có {dataHouseholds.length} căn hộ với các khoản phí tháng {month}.
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
                placeholder="Tìm kiếm theo căn hộ hoặc chủ sở hữu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số căn hộ</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Diện tích (m²)</TableHead>
                <TableHead>Tổng phí</TableHead>
                <TableHead>Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApartments.map((apartment) => (
                <TableRow key={apartment.householdId} className="cursor-pointer hover:bg-muted/60">
                  <TableCell className="font-medium">{apartment.householdId}</TableCell>
                  <TableCell>{apartment.owner?.fullname}</TableCell>
                  <TableCell>{apartment.area}</TableCell>
                  <TableCell>{formatCurrency(apartment.totalPrice)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {handleApartmentClick(apartment.householdId); console.log(apartment.householdId)}}
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApartments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filteredApartments.length} trên tổng số {dataHouseholds.length} căn hộ
          </div>
        </CardFooter>
      </Card>

      {selectedApartment && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Chi tiết phí tháng {month} - Căn hộ {dataHouseholds.find(a => a.householdId === selectedApartment)?.householdId}
              </DialogTitle>
              <DialogDescription>
                Chủ sở hữu: {dataHouseholds.find(a => a.householdId === selectedApartment)?.owner?.fullname}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại phí</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataHouseholds.find((h) => h.householdId === selectedApartment)?.fees?.map((fee) => (
                    <TableRow key={fee.feeServiceId}>
                      <TableCell className="font-medium">{fee.serviceName}</TableCell>
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
                        {fee.paymentDate
                          ? new Date(fee.paymentDate).toLocaleString('vi-VN') 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {user?.role === 'ketoan' ? (
                          fee.status === 'pending' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleStatusChange(fee.id)}
                              disabled={loading}
                            >
                              {loading  ? 'Đang xử lý...' : 'Đánh dấu đã thu'}
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              disabled
                            >
                              Thu thành công
                            </Button>
                          )
                        ) : null}
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-medium">
                Tổng cộng: {formatCurrency(
                  dataHouseholds
                    .find(h => h.householdId === selectedApartment)
                    ?.fees
                    ?.reduce((sum, fee) => sum + fee.amount, 0) || 0
                )}

              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ApartmentFees;
