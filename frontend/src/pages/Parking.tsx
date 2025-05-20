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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addVehicle } from "@/service/admin_v2";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useHouseholdUInuse, useVehicle } from "@/hooks/useHouseholds";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};


const vehicleFormSchema = z.object({
  householdId: z.string({
    required_error: "Vui lòng chọn căn hộ",
  }),
  plateNumber: z.string({
    required_error: "Vui lòng nhập biển số",
  }).min(1, "Vui lòng nhập biển số"),
  vehicleType: z.enum(["Xe máy", "Ô tô", "Xe đạp"], {
    errorMap: () => ({ message: "Vui lòng chọn loại phương tiện" }),
  }),
});
type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
const Parking = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);
  const accessToken = Cookies.get("accessToken");
  const { data: vehicles } = useVehicle();
  const queryClient = useQueryClient();
  const { data: households } = useHouseholdUInuse();
  const  vehicleDatas = Array.isArray(vehicles) ? vehicles : [];
  const filteredVehicles = vehicleDatas.filter(vehicle => 
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const form = useForm<VehicleFormValues>({
      resolver: zodResolver(vehicleFormSchema),
      defaultValues: {
        householdId: "",
        plateNumber: "",
        vehicleType: "Xe máy",
      },
  });
  const handleAddEdit = (vehicle: any = null) => {
      setCurrentVehicle(vehicle);
      if (vehicle) {
        // Edit mode - populate form with existing data
        form.reset({
          householdId: vehicle.household,
          plateNumber: vehicle.licensePlate,
          vehicleType: vehicle.type,
        });
      } else {
        // Add mode - reset form
        form.reset({
          householdId: "",
          plateNumber: "",
          vehicleType: "Xe máy",
        });
      }
      setIsDialogOpen(true);
  };
    const onSubmit = async (data: VehicleFormValues) => {
      console.log("Form submitted:", data);
      const vehicleData = {
        householdId: data.householdId,
        plateNumber: data.plateNumber,
        vehicleType: data.vehicleType,
      };
      try {
        await addVehicle(vehicleData, accessToken);
        queryClient.invalidateQueries({queryKey: ['vehicle']});
        // queryClient.invalidateQueries({queryKey: ['householdActive']});
        toast({
          title: currentVehicle ? "Dữ liệu phương tiện đã được cập nhật" : "Dữ liệu phương tiện mới đã được thêm",
          description: `Thao tác với phương tiện căn hộ ${data.householdId} thành công.`,
        });
      
        setIsDialogOpen(false);
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Bạn đã thêm dữ liệu phương tiện cho hộ gia đình này rồi",
          onError: error,
        });
        return;
      }
  
    };

  const handleDelete = (id: string) => {
    toast({
      title: "Phương tiện đã được xóa",
      description: "Dữ liệu phương tiện đã được xóa thành công.",
    });
  };

  const toggleActive = (id: string, currentActive: boolean) => {
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
                <TableHead>Phí hàng tháng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.plateNumber}>
                  <TableCell className="font-medium">{vehicle.householdId}</TableCell>
                  <TableCell>{vehicle.vehicleType}</TableCell>
                  <TableCell>{vehicle.plateNumber}</TableCell>
    
                  <TableCell>{formatCurrency(vehicle.pricePerMonth)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleDelete(vehicle.plateNumber)}>
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
            Hiển thị {filteredVehicles.length} trên tổng số {vehicleDatas.length} phương tiện
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentVehicle ? "Sửa thông tin phương tiện" : "Thêm thông tin phương tiện mới"}
            </DialogTitle>
            <DialogDescription>
              {currentVehicle ? "Cập nhật dữ liệu phương tiện" : "Nhập dữ liệu phương tiện mới"}
            </DialogDescription>
          </DialogHeader>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="householdId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Căn hộ</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn căn hộ" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {households?.map((household, id) => (
                    <SelectItem key={id} value={household.id}>
                      {household.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biển số xe</FormLabel>
                <FormControl>
                  <Input
                    type="string"
                    placeholder="Nhập biển số xe"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription>Biển số xe</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phương tiện</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại phương tiện" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Xe máy">Xe máy</SelectItem>
                    <SelectItem value="Ô tô">Ô tô</SelectItem>
                    <SelectItem value="Xe đạp">Xe đạp</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button type="submit">Lưu</Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
    </div>
  );
};

export default Parking;
