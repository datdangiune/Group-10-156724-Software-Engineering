
import { useState, useEffect} from "react";
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
import Cookies from "js-cookie";
import { useHouseholds } from "@/hooks/useHouseholds";
const Households = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHousehold, setCurrentHousehold] = useState<any>(null);
//  const [households, setHouseholds] = useState<Household_User[]>([]);
 // const accessToken = Cookies.get("accessToken");
  const { data: Household_User, isLoading, error } = useHouseholds();
  // useEffect(() => {
  //   const fetchHouseholdUser = async () => {
  //     try {
  //       const response = await getHousehold(accessToken);
  //       if (response.success) {
  //         setHouseholds(response.data);
  //       } else {
  //         toast({
  //           title: "Lỗi",
  //           description: response.message,
  //         });
  //       }
  //     } catch (error) {
  //       toast({
  //         title: "Lỗi",
  //         description: "Không thể tải dữ liệu hộ gia đình.",
  //       });
  //     }
  //   }
  //   fetchHouseholdUser();
  // }, [accessToken]);
  const filteredHouseholds = Array.isArray(Household_User) 
    ? Household_User.filter(household => 
        household.householdId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        household.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];


  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {(error as Error).message}</div>;
  }
  const handleAddEdit = (household: any = null) => {
    setCurrentHousehold(household);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: currentHousehold ? "Hộ gia đình đã được cập nhật" : "Hộ gia đình mới đã được thêm",
      description: `Thao tác với căn hộ ${currentHousehold?.apartmentNumber || 'mới'} thành công.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Hộ gia đình đã được xóa",
      description: "Dữ liệu hộ gia đình đã được xóa thành công.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý hộ gia đình</h2>
          <p className="text-muted-foreground">
            Quản lý danh sách các hộ gia đình và thông tin cư dân.
          </p>
        </div>
        
        <Button onClick={() => handleAddEdit()}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm hộ gia đình
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hộ gia đình</CardTitle>
          <CardDescription>
            Tổng cộng có {Household_User.length} hộ gia đình.
          </CardDescription>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo căn hộ hoặc chủ hộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Chủ hộ</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số cư dân</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHouseholds.map((household) => (
                <TableRow key={household.householdId}>
                  <TableCell className="font-medium">{household.householdId}</TableCell>
                  <TableCell>{household.fullname}</TableCell>
                  <TableCell>{household.phoneNumber}</TableCell>
                  <TableCell>{household.email}</TableCell>
                  <TableCell>{household.memberCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(household)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(household.householdId)}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHouseholds.length === 0 && (
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
            Hiển thị {filteredHouseholds.length} trên tổng số {Household_User.length} hộ gia đình
          </div>
          {/* Pagination can be added here */}
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentHousehold ? "Sửa hộ gia đình" : "Thêm hộ gia đình mới"}</DialogTitle>
            <DialogDescription>
              {currentHousehold ? "Cập nhật thông tin hộ gia đình" : "Nhập thông tin hộ gia đình mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartmentNumber" className="text-right">
                Căn hộ
              </Label>
              <Input
                id="apartmentNumber"
                defaultValue={currentHousehold?.apartmentNumber || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Chủ hộ
              </Label>
              <Input
                id="owner"
                defaultValue={currentHousehold?.owner || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Số điện thoại
              </Label>
              <Input
                id="phone"
                defaultValue={currentHousehold?.phone || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                defaultValue={currentHousehold?.email || ""}
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

export default Households;
