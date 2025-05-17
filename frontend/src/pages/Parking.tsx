
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

// Mock data for vehicles
const mockVehicles = [
  { id: 1, household: "A1201", type: "car", licensePlate: "51F-123.45", active: true, fee: 1200000 },
  { id: 2, household: "A1201", type: "motorbike", licensePlate: "59P1-12345", active: true, fee: 70000 },
  { id: 3, household: "B0502", type: "motorbike", licensePlate: "59M2-54321", active: true, fee: 70000 },
  { id: 4, household: "C1803", type: "car", licensePlate: "51G-678.90", active: true, fee: 1200000 },
  { id: 5, household: "C1803", type: "motorbike", licensePlate: "59P2-67890", active: false, fee: 0 },
  { id: 6, household: "D0704", type: "motorbike", licensePlate: "59N1-13579", active: true, fee: 70000 },
  { id: 7, household: "A0601", type: "motorbike", licensePlate: "59M1-24680", active: true, fee: 70000 },
];

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

// Translate vehicle type to Vietnamese
const translateVehicleType = (type: string) => {
  return type === "car" ? "Ô tô" : "Xe máy";
};

const Parking = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  
  const filteredVehicles = mockVehicles.filter(vehicle => 
    vehicle.household.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEdit = (vehicle: any = null) => {
    setCurrentVehicle(vehicle);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: currentVehicle ? "Thông tin phương tiện đã được cập nhật" : "Phương tiện mới đã được thêm",
      description: `Thao tác với phương tiện biển số ${currentVehicle?.licensePlate || 'mới'} thành công.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Phương tiện đã được xóa",
      description: "Dữ liệu phương tiện đã được xóa thành công.",
    });
  };

  const toggleActive = (id: number, currentActive: boolean) => {
    toast({
      title: currentActive ? "Phương tiện đã bị vô hiệu hóa" : "Phương tiện đã được kích hoạt",
      description: `Trạng thái phương tiện đã được thay đổi thành ${currentActive ? 'không hoạt động' : 'hoạt động'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quản lý bãi đỗ xe</CardTitle>
            <CardDescription>
              Quản lý phương tiện và thu phí gửi xe
            </CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm phương tiện
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo căn hộ hoặc biển số..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Loại phương tiện</TableHead>
                <TableHead>Biển số</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Phí hàng tháng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.household}</TableCell>
                  <TableCell>{translateVehicleType(vehicle.type)}</TableCell>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.active ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell>{vehicle.active ? formatCurrency(vehicle.fee) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(vehicle)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleActive(vehicle.id, vehicle.active)}>
                          {vehicle.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(vehicle.id)}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVehicles.length === 0 && (
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
            Hiển thị {filteredVehicles.length} trên tổng số {mockVehicles.length} phương tiện
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentVehicle ? "Sửa thông tin phương tiện" : "Thêm phương tiện mới"}
            </DialogTitle>
            <DialogDescription>
              {currentVehicle ? "Cập nhật thông tin phương tiện" : "Nhập thông tin phương tiện mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="household" className="text-right">
                Căn hộ
              </Label>
              <Input
                id="household"
                defaultValue={currentVehicle?.household || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Loại phương tiện
              </Label>
              <Input
                id="type"
                defaultValue={currentVehicle?.type || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="licensePlate" className="text-right">
                Biển số
              </Label>
              <Input
                id="licensePlate"
                defaultValue={currentVehicle?.licensePlate || ""}
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

export default Parking;
