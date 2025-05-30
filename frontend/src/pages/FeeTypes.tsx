
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
import { useFeeService } from "@/hooks/useHouseholds";

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};


const FeeTypes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState<any>(null);
  const {data: feeTypes, isLoading, error} = useFeeService();
  const filteredFeeTypes =  Array.isArray(feeTypes) ? feeTypes.filter(fee => 
    fee.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    fee.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fee.unit?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
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

  const handleDelete = (id: string) => {
    toast({
      title: "Loại phí đã được xóa",
      description: "Dữ liệu loại phí đã được xóa thành công.",
    });
  };
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div>Có lỗi xảy ra: {(error as Error).message}</div>;
  }
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
                  <TableCell className="font-medium">{fee.serviceName}</TableCell>
                  <TableCell>{fee.type}</TableCell>
                  <TableCell>{formatCurrency(fee.servicePrice)}</TableCell>
                  <TableCell>{fee.unit}</TableCell>
                  <TableCell>{fee.isRequired ? "Có" : "Không"}</TableCell>
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
            Hiển thị {filteredFeeTypes.length} trên tổng số {feeTypes.length} loại phí
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
