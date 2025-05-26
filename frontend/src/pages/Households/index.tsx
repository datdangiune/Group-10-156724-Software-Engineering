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
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddHouseholdDialog } from "./AddHouseholdDialog";
import { useHouseholds } from "@/hooks/useHouseholds";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUserHousehold } from "@/service/admin_v1";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const Households = () => {
  const { toast } = useToast();
  const accessToken = Cookies.get("accessToken");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentHousehold, setCurrentHousehold] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data, isLoading: isLoadingData, error } = useHouseholds(page);
  const { user } = useAuth();
  const households = data?.data || [];
  const total = data?.totalHouseholds || 0;
  const totalPages = data?.totalPages || 1;
  const queryClient = useQueryClient();

  const filteredHouseholds = Array.isArray(households)
    ? households.filter(household =>
        household.householdId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        household.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];


  if (isLoadingData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {(error as Error).message}</div>;
  }
  const handleAddEdit = (household: any = null) => {
    setCurrentHousehold(household);
    setIsDialogOpen(true);
  };


  const handleDelete = async (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await deleteUserHousehold(accessToken, deleteId);
      queryClient.invalidateQueries({queryKey: ["households"]});
      queryClient.invalidateQueries({queryKey: ["userInHouseholds"]});  
      queryClient.invalidateQueries({queryKey: ["householdUnactive"]});   
      queryClient.invalidateQueries({queryKey: ["householdInuse"]}); 
      toast({
        title: "Xóa hộ gia đình thành công",
        description: "Hộ gia đình đã được xóa thành công.",
      });
      setDeleteId(null);
    } catch (error) {
      console.error("Xóa hộ gia đình thất bại:", error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa hộ gia đình.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
    
        { user?.role === "admin" ? (
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm hộ gia đình
          </Button>
        ) : (
          null
        )}
 
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hộ gia đình</CardTitle>
          <CardDescription>
            Tổng cộng có {households.length} hộ gia đình.
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
                      { user?.role === "admin" ? (
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddEdit(household)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(household.householdId)}>
                            Xóa
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                      ): (
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            Bạn không có quyền
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      )}
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
            Hiển thị {filteredHouseholds.length} trên tổng số {total} hộ gia đình
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trước
            </Button>
            <span>
              Trang {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Sau
            </Button>
          </div>
        </CardFooter>
      </Card>
      <AddHouseholdDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        household={currentHousehold}
      />

      {/* Modal xác nhận xóa */}
      <Dialog open={!!deleteId} onOpenChange={open => { if (!open) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa hộ gia đình</DialogTitle>
          </DialogHeader>
          <div>Bạn có chắc chắn muốn xóa hộ gia đình này không? Thao tác này không thể hoàn tác.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isLoading}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={isLoading}>
              {isLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Households;
