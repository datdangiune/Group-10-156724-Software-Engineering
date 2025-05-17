
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
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Mock data for utility usage
const mockUtilityUsage = [
  { id: 1, household: "A1201", month: "2025-05", electricity: 250, water: 25, internet: true, total: 1450000, status: "unpaid", paidAt: null },
  { id: 2, household: "B0502", month: "2025-05", electricity: 132, water: 13, internet: true, total: 857000, status: "paid", paidAt: "2025-05-10T14:15:00" },
  { id: 3, household: "C1803", month: "2025-05", electricity: 320, water: 32, internet: false, total: 1520000, status: "paid", paidAt: "2025-05-08T09:20:00" },
  { id: 4, household: "D0704", month: "2025-05", electricity: 180, water: 18, internet: true, total: 1030000, status: "unpaid", paidAt: null },
  { id: 5, household: "A0601", month: "2025-05", electricity: 95, water: 10, internet: false, total: 532500, status: "paid", paidAt: "2025-05-07T11:45:00" },
];

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

const Utilities = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("2025-05"); // Default to current month
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUtility, setCurrentUtility] = useState<any>(null);
  
  const filteredUtilities = mockUtilityUsage.filter(utility => 
    utility.household.toLowerCase().includes(searchTerm.toLowerCase()) &&
    utility.month === month
  );

  const handleAddEdit = (utility: any = null) => {
    setCurrentUtility(utility);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: currentUtility ? "Dữ liệu tiện ích đã được cập nhật" : "Dữ liệu tiện ích mới đã được thêm",
      description: `Thao tác với tiện ích căn hộ ${currentUtility?.household || 'mới'} thành công.`,
    });
    setIsDialogOpen(false);
  };

  const markAsPaid = (id: number) => {
    toast({
      title: "Đã đánh dấu đã thanh toán",
      description: "Khoản phí tiện ích đã được đánh dấu là đã thanh toán.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tiện ích hàng tháng</CardTitle>
            <CardDescription>
              Quản lý tiện ích và thu phí tiện ích
            </CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm dữ liệu tiện ích
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="month" className="whitespace-nowrap">Tháng:</Label>
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
                placeholder="Tìm kiếm theo căn hộ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Điện (kWh)</TableHead>
                <TableHead>Nước (m³)</TableHead>
                <TableHead>Internet</TableHead>
                <TableHead>Tổng phí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUtilities.map((utility) => (
                <TableRow key={utility.id}>
                  <TableCell className="font-medium">{utility.household}</TableCell>
                  <TableCell>{utility.electricity}</TableCell>
                  <TableCell>{utility.water}</TableCell>
                  <TableCell>{utility.internet ? "Có" : "Không"}</TableCell>
                  <TableCell>{formatCurrency(utility.total)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      utility.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {utility.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(utility)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        {utility.status === 'unpaid' && (
                          <DropdownMenuItem onClick={() => markAsPaid(utility.id)}>
                            Đánh dấu đã thu
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUtilities.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filteredUtilities.length} trên tổng số {mockUtilityUsage.filter(u => u.month === month).length} hộ gia đình
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentUtility ? "Sửa thông tin tiện ích" : "Thêm thông tin tiện ích mới"}
            </DialogTitle>
            <DialogDescription>
              {currentUtility ? "Cập nhật dữ liệu tiện ích" : "Nhập dữ liệu tiện ích mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="household" className="text-right">
                Căn hộ
              </Label>
              <Input
                id="household"
                defaultValue={currentUtility?.household || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="electricity" className="text-right">
                Điện (kWh)
              </Label>
              <Input
                id="electricity"
                type="number"
                defaultValue={currentUtility?.electricity || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="water" className="text-right">
                Nước (m³)
              </Label>
              <Input
                id="water"
                type="number"
                defaultValue={currentUtility?.water || ""}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Utilities;
