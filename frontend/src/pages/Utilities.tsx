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
import { useFeeUtility } from "@/hooks/useHouseholds";
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
import { addFeeUtility } from "@/service/admin_v1";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useHouseholdActive } from "@/hooks/useHouseholds";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}
const utilityFormSchema = z.object({
  householdId: z.string({
    required_error: "Vui lòng chọn căn hộ",
  }),
  water: z.number({
    required_error: "Vui lòng nhập số nước",
    invalid_type_error: "Phải là số",
  }).min(0, "Không được âm"),
  electricity: z.number({
    required_error: "Vui lòng nhập số điện",
    invalid_type_error: "Phải là số",
  }).min(0, "Không được âm"),
  internet: z.boolean().default(false),
});
type UtilityFormValues = z.infer<typeof utilityFormSchema>;
const Utilities = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState(getCurrentMonth());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUtility, setCurrentUtility] = useState<any>(null);
  const { data: households } = useHouseholdActive(month);
  console.log("Households data:", households);
  const queryClient = useQueryClient();
  const accessToken = Cookies.get("accessToken");
  // Lấy dữ liệu tiện ích từ backend
  const { data: utilityData, isLoading } = useFeeUtility(month);

  const utilities = Array.isArray(utilityData) ? utilityData : [];

  const filteredUtilities = utilities.filter(utility =>
    utility.householdId?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const form = useForm<UtilityFormValues>({
    resolver: zodResolver(utilityFormSchema),
    defaultValues: {
      householdId: "",
      water: undefined,
      electricity: undefined,
      internet: false,
    },
  });
  const handleAddEdit = (utility: any = null) => {
      setCurrentUtility(utility);
      if (utility) {
        // Edit mode - populate form with existing data
        form.reset({
          householdId: utility.household,
          water: utility.water,
          electricity: utility.electricity,
          internet: utility.internet,
        });
      } else {
        // Add mode - reset form
        form.reset({
          householdId: "",
          water: undefined,
          electricity: undefined,
          internet: false,
        });
      }
      setIsDialogOpen(true);
  };

  const onSubmit = async (data: UtilityFormValues) => {
    console.log("Form submitted:", data);
    const utilityData = {
      householdId: data.householdId,
      water: data.water,
      electricity: data.electricity,
      internet: data.internet,
    };
    try {
      await addFeeUtility(utilityData, accessToken);
      queryClient.invalidateQueries({queryKey: ['feeUtility', month]});
      queryClient.invalidateQueries({queryKey: ['householdActive']});
      toast({
        title: currentUtility ? "Dữ liệu tiện ích đã được cập nhật" : "Dữ liệu tiện ích mới đã được thêm",
        description: `Thao tác với tiện ích căn hộ ${data.householdId} thành công.`,
      });
    
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Bạn đã thêm dữ liệu tiện ích cho hộ gia đình này rồi",
        onError: error,
      });
      return;
    }

  };

  const markAsPaid = (id: string) => {
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredUtilities.map((utility) => (
                <TableRow key={utility.householdId}>
                  <TableCell className="font-medium">{utility.householdId}</TableCell>
                  <TableCell>{utility.electricity}</TableCell>
                  <TableCell>{utility.water}</TableCell>
                  <TableCell>{utility.internet ? "Có" : "Không"}</TableCell>
                  <TableCell>{formatCurrency(utility.totalPrice)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      utility.statusPayment === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {utility.statusPayment === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && filteredUtilities.length === 0 && (
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
            Hiển thị {filteredUtilities.length} trên tổng số {utilities.length} hộ gia đình
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentUtility ? "Sửa thông tin tiện ích" : "Thêm thông tin tiện ích mới"}
            </DialogTitle>
            <DialogDescription>
              {currentUtility ? "Cập nhật dữ liệu tiện ích" : "Nhập dữ liệu tiện ích mới"}
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
                        {households.length === 0 ? (
                          <div className="px-4 py-2 text-muted-foreground">
                            Bạn đã thêm hết các căn hộ rồi
                          </div>
                        ) : (
                          households.map((household, id) => (
                            <SelectItem key={id} value={household.id}>
                              {household.id}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>

                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="electricity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Điện tiêu thụ (kWh)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Nhập số điện"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>Số điện kỳ này</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="water"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nước tiêu thụ (m³)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Nhập số nước"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormDescription>Số nước kỳ này</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="internet"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Sử dụng internet</FormLabel>
                      <FormDescription>
                        Đánh dấu nếu căn hộ sử dụng dịch vụ internet
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
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

export default Utilities;
