
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

// Mock data for residents
const mockResidents = [
  { id: 1, householdId: 1, name: "Nguyễn Văn An", dob: "1975-05-20", gender: "Nam", relationship: "Chủ hộ" },
  { id: 2, householdId: 1, name: "Nguyễn Thị Lan", dob: "1980-08-15", gender: "Nữ", relationship: "Vợ" },
  { id: 3, householdId: 1, name: "Nguyễn Minh Tuấn", dob: "2005-03-10", gender: "Nam", relationship: "Con" },
  { id: 4, householdId: 1, name: "Nguyễn Thùy Linh", dob: "2010-12-05", gender: "Nữ", relationship: "Con" },
  { id: 5, householdId: 2, name: "Trần Thị Mai", dob: "1982-04-23", gender: "Nữ", relationship: "Chủ hộ" },
  { id: 6, householdId: 2, name: "Lê Văn Hùng", dob: "1980-09-18", gender: "Nam", relationship: "Chồng" },
  { id: 7, householdId: 2, name: "Lê Minh Anh", dob: "2012-06-30", gender: "Nữ", relationship: "Con" },
];

const Residents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredResidents = mockResidents.filter(resident => 
    resident.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.name}</TableCell>
                  <TableCell>{new Date(resident.dob).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{resident.gender}</TableCell>
                  <TableCell>{resident.relationship}</TableCell>
                  <TableCell>Căn hộ #{resident.householdId}</TableCell>
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
            Hiển thị {filteredResidents.length} trên tổng số {mockResidents.length} cư dân
          </div>
          {/* Pagination can be added here */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Residents;
