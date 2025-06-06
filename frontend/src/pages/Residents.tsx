import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
import { Search, MoreHorizontal } from "lucide-react";
import { useUserINHouseholds } from "@/hooks/useHouseholds";
import { useAuth } from "@/contexts/AuthContext";
import { deleteMember } from "@/service/admin_v1";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
const Residents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useUserINHouseholds(page);
  const { user } = useAuth();
  const accessToken = Cookies.get("accessToken");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; resident: any | null }>({ open: false, resident: null });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const residents = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const filteredResidents = Array.isArray(residents) 
    ? residents.filter((resident) => 
        resident.householdId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];
    

  const handleDelete = (resident: any) => {
    setDeleteModal({ open: true, resident });
  };

  const confirmDelete = async () => {
    if (!deleteModal.resident) return;
    setDeleteLoading(true);
    try {
      await deleteMember(accessToken, deleteModal.resident.householdId, deleteModal.resident.userId);
      toast({
        title: "Xóa thành viên thành công",
        description: `Đã xóa thành viên ${deleteModal.resident.fullname}.`,
      });
      setDeleteModal({ open: false, resident: null });
      // Có thể cần reload lại dữ liệu, ví dụ:
      queryClient.invalidateQueries({queryKey: ['userInHouseholds', page]});
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.response?.data?.message || error?.message || "Không thể xóa thành viên.",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Danh sách cư dân</CardTitle>
            <CardDescription>
              Quản lý thông tin các cư dân trong tòa nhà
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên cư dân..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên cư dân</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Quan hệ với chủ hộ</TableHead>
                <TableHead>Căn hộ</TableHead>
                <TableHead>CCCD/CMND</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResidents.map((resident) => (
                <TableRow key={resident.userId}>
                  <TableCell className="font-medium">{resident.fullname}</TableCell>
                  <TableCell>{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{resident.gender}</TableCell>
                  <TableCell>{resident.roleInFamily}</TableCell>
                  <TableCell>{resident.householdId}</TableCell>
                  <TableCell>{resident.cccd}</TableCell>
                  <TableCell className="text-right">
                    {user?.role === "admin" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/residents/${resident.userId}`)}>
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(resident)}
                          >
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      null
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredResidents.length === 0 && (
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
            Hiển thị {filteredResidents.length} trên tổng số {total} cư dân
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

      {/* Modal xác nhận xóa thành viên */}
      <Dialog open={deleteModal.open} onOpenChange={open => { if (!open) setDeleteModal({ open: false, resident: null }); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa thành viên</DialogTitle>
          </DialogHeader>
          <div>
            Bạn có chắc chắn muốn xóa thành viên này không? Thao tác này không thể hoàn tác.
            <div className="mt-2 text-sm text-destructive">
              <b>Lưu ý:</b> Nếu muốn xóa chủ hộ, bạn cần chuyển quyền chủ hộ cho thành viên khác trước khi xóa.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, resident: null })} disabled={deleteLoading}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Residents;
