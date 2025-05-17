
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for fee types
const mockFeeTypes = [
  { id: 1, name: "Phí quản lý", type: "management", amount: 12000, unit: "m²", mandatory: true },
  { id: 2, name: "Phí dịch vụ", type: "service", amount: 8000, unit: "m²", mandatory: true },
  { id: 3, name: "Phí gửi xe máy", type: "parking", amount: 70000, unit: "xe", mandatory: false },
  { id: 4, name: "Phí gửi ô tô", type: "parking", amount: 1200000, unit: "xe", mandatory: false },
  { id: 5, name: "Phí điện", type: "utility", amount: 3500, unit: "kWh", mandatory: true },
  { id: 6, name: "Phí nước", type: "utility", amount: 15000, unit: "m³", mandatory: true },
  { id: 7, name: "Phí Internet", type: "utility", amount: 200000, unit: "căn hộ", mandatory: false },
];

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

// Translate fee type to Vietnamese
const translateFeeType = (type: string) => {
  const types: Record<string, string> = {
    "management": "Quản lý",
    "service": "Dịch vụ",
    "parking": "Đỗ xe",
    "utility": "Tiện ích",
    "donation": "Quyên góp"
  };
  return types[type] || type;
};

const FeeTypes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<any>(null);
  
  const filteredFeeTypes = mockFeeTypes.filter(fee => 
    fee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    translateFeeType(fee.type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEdit = (fee: any = null) => {
    setCurrentFee(fee);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: currentFee ? "Loại phí đã được cập nhật" : "Loại phí mới đã được thêm",
      description: `Thao tác với phí ${currentFee?.name || 'mới'} thành công.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Loại phí đã được xóa",
      description: "Dữ liệu loại phí đã được xóa thành công.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cấu hình loại phí</CardTitle>
            <CardDescription>
              Quản lý các loại phí trong tòa nhà
            </CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm loại phí
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc loại phí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phí</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Đơn vị tính</TableHead>
                <TableHead>Bắt buộc</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeeTypes.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell>{translateFeeType(fee.type)}</TableCell>
                  <TableCell>{formatCurrency(fee.amount)}</TableCell>
                  <TableCell>{fee.unit}</TableCell>
                  <TableCell>{fee.mandatory ? "Có" : "Không"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(fee)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(fee.id)}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredFeeTypes.length === 0 && (
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
            Hiển thị {filteredFeeTypes.length} trên tổng số {mockFeeTypes.length} loại phí
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentFee ? "Sửa loại phí" : "Thêm loại phí mới"}</DialogTitle>
            <DialogDescription>
              {currentFee ? "Cập nhật thông tin loại phí" : "Nhập thông tin loại phí mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feeName" className="text-right">
                Tên phí
              </Label>
              <Input
                id="feeName"
                defaultValue={currentFee?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feeType" className="text-right">
                Loại phí
              </Label>
              <Input
                id="feeType"
                defaultValue={currentFee?.type || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feeAmount" className="text-right">
                Đơn giá
              </Label>
              <Input
                id="feeAmount"
                type="number"
                defaultValue={currentFee?.amount || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feeUnit" className="text-right">
                Đơn vị tính
              </Label>
              <Input
                id="feeUnit"
                defaultValue={currentFee?.unit || ""}
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

export default FeeTypes;
