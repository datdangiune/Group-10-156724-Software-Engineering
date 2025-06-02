
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, Plus, Edit, Trash2, Car } from "lucide-react";

// Mock data for vehicles
const mockVehicles = [
  {
    id: 1,
    licensePlate: "51A-12345",
    ownerName: "Nguyễn Văn An",
    apartment: "A1201",
    vehicleType: "Ô tô",
    parkingSpot: "A-15",
    registeredDate: "2024-01-01"
  },
  {
    id: 2,
    licensePlate: "51B-67890",
    ownerName: "Trần Thị Mai",
    apartment: "B0502",
    vehicleType: "Xe máy",
    parkingSpot: "M-23",
    registeredDate: "2024-01-05"
  }
];

const ParkingFull = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    licensePlate: "",
    ownerName: "",
    apartment: "",
    vehicleType: "",
    parkingSpot: ""
  });

  const filteredVehicles = mockVehicles.filter(vehicle =>
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.apartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddVehicle = () => {
    // Here you would add the vehicle to your backend
    console.log("Adding vehicle:", newVehicle);
    setIsAddDialogOpen(false);
    setNewVehicle({
      licensePlate: "",
      ownerName: "",
      apartment: "",
      vehicleType: "",
      parkingSpot: ""
    });
  };

  const handleDeleteVehicle = (vehicleId: number) => {
    // Here you would delete the vehicle from your backend
    console.log("Deleting vehicle:", vehicleId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Quản lý bãi đỗ xe (Toàn quyền)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Chỉ dành cho nhân viên kế toán - có thể thêm/xóa phương tiện
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm phương tiện
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm phương tiện mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="licensePlate">Biển số xe</Label>
                  <Input
                    id="licensePlate"
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                    placeholder="51A-12345"
                  />
                </div>
                <div>
                  <Label htmlFor="ownerName">Tên chủ xe</Label>
                  <Input
                    id="ownerName"
                    value={newVehicle.ownerName}
                    onChange={(e) => setNewVehicle({...newVehicle, ownerName: e.target.value})}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <Label htmlFor="apartment">Căn hộ</Label>
                  <Input
                    id="apartment"
                    value={newVehicle.apartment}
                    onChange={(e) => setNewVehicle({...newVehicle, apartment: e.target.value})}
                    placeholder="A1201"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Loại phương tiện</Label>
                  <Select onValueChange={(value) => setNewVehicle({...newVehicle, vehicleType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại xe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ô tô">Ô tô</SelectItem>
                      <SelectItem value="Xe máy">Xe máy</SelectItem>
                      <SelectItem value="Xe đạp">Xe đạp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="parkingSpot">Vị trí đỗ xe</Label>
                  <Input
                    id="parkingSpot"
                    value={newVehicle.parkingSpot}
                    onChange={(e) => setNewVehicle({...newVehicle, parkingSpot: e.target.value})}
                    placeholder="A-15"
                  />
                </div>
                <Button onClick={handleAddVehicle} className="w-full">
                  Thêm phương tiện
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo biển số, tên chủ xe hoặc căn hộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Biển số xe</TableHead>
                <TableHead>Tên chủ xe</TableHead>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Loại xe</TableHead>
                <TableHead>Vị trí đỗ</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.ownerName}</TableCell>
                  <TableCell>{vehicle.apartment}</TableCell>
                  <TableCell>{vehicle.vehicleType}</TableCell>
                  <TableCell>{vehicle.parkingSpot}</TableCell>
                  <TableCell>{new Date(vehicle.registeredDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingFull;