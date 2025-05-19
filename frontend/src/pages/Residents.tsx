
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
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { getUserInHousehold, Household_User} from "@/service/admin_v1";
import { useUserINHouseholds } from "@/hooks/useHouseholds";
import Cookies from "js-cookie";
const Residents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  //const [residents, setResidents] = useState<Household_User[]>([]);
  //const accessToken = Cookies.get("accessToken");
  const { data: residents, isLoading, error } = useUserINHouseholds();
  // useEffect(() => {
  //   const fetchResidents = async () => {
  //     try {
  //       const response = await getUserInHousehold(accessToken);
  //       if(!response.success){
  //         throw new Error(response.message);
  //       }
  //       setResidents(response.data);
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error("Error fetching residents:", error.message);
  //       } else {
  //         console.error("Unexpected error:", error);
  //       }
  //     }
  //   }
  //   fetchResidents();
  // }, [accessToken]);
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Thêm cư dân
          </Button>
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
            Hiển thị {filteredResidents.length} trên tổng số {residents.length} cư dân
          </div>
          {/* Pagination can be added here */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Residents;
