
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
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for monthly fees
const mockMonthlyFees = [
  { id: 1, household: "A1201", feeName: "Phí quản lý", amount: 1440000, status: "paid", paidAt: "2025-05-05T10:30:00" },
  { id: 2, household: "A1201", feeName: "Phí dịch vụ", amount: 960000, status: "paid", paidAt: "2025-05-05T10:30:00" },
  { id: 3, household: "A1201", feeName: "Phí gửi xe máy", amount: 140000, status: "paid", paidAt: "2025-05-05T10:30:00" },
  { id: 4, household: "A1201", feeName: "Phí điện", amount: 875000, status: "unpaid", paidAt: null },
  { id: 5, household: "A1201", feeName: "Phí nước", amount: 375000, status: "unpaid", paidAt: null },
  { id: 6, household: "B0502", feeName: "Phí quản lý", amount: 720000, status: "paid", paidAt: "2025-05-10T14:15:00" },
  { id: 7, household: "B0502", feeName: "Phí dịch vụ", amount: 480000, status: "paid", paidAt: "2025-05-10T14:15:00" },
  { id: 8, household: "B0502", feeName: "Phí điện", amount: 462000, status: "paid", paidAt: "2025-05-10T14:15:00" },
  { id: 9, household: "B0502", feeName: "Phí nước", amount: 195000, status: "paid", paidAt: "2025-05-10T14:15:00" },
  { id: 10, household: "B0502", feeName: "Phí Internet", amount: 200000, status: "paid", paidAt: "2025-05-10T14:15:00" },
];

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
  
  const filteredFees = mockMonthlyFees.filter(fee => 
    fee.household.toLowerCase().includes(searchTerm.toLowerCase()) || 
    fee.feeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAsPaid = (id: number) => {
    toast({
      title: "Đã đánh dấu đã thanh toán",
      description: "Khoản phí đã được đánh dấu là đã thanh toán.",
    });
  };

  const markAsUnpaid = (id: number) => {
    toast({
      title: "Đã đánh dấu chưa thanh toán",
      description: "Khoản phí đã được đánh dấu là chưa thanh toán.",
    });
  };
  
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
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.household}</TableCell>
                  <TableCell>{fee.feeName}</TableCell>
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
                    {fee.paidAt 
                      ? new Date(fee.paidAt).toLocaleString('vi-VN') 
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {fee.status === 'unpaid' ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsPaid(fee.id)}
                      >
                        Đánh dấu đã thu
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsUnpaid(fee.id)}
                      >
                        Đánh dấu chưa thu
                      </Button>
                    )}
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
            Hiển thị {filteredFees.length} trên tổng số {mockMonthlyFees.length} khoản phí
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MonthlyFees;
