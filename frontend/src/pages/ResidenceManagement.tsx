
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Save, X } from "lucide-react";

// Mock data for residents with residence info
const mockResidents = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    apartment: "A1201",
    permanentAddress: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
    temporaryAddress: "Căn hộ A1201, Chung cư BlueMoon, Quận 7, TP.HCM"
  },
  {
    id: 2,
    name: "Nguyễn Thị Lan",
    apartment: "A1201",
    permanentAddress: "456 Đường DEF, Phường UVW, Quận 3, TP.HCM",
    temporaryAddress: "Căn hộ A1201, Chung cư BlueMoon, Quận 7, TP.HCM"
  },
  {
    id: 3,
    name: "Trần Thị Mai",
    apartment: "B0502",
    permanentAddress: "789 Đường GHI, Phường RST, Quận 5, TP.HCM",
    temporaryAddress: "Căn hộ B0502, Chung cư BlueMoon, Quận 7, TP.HCM"
  }
];

const ResidenceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{[key: string]: string}>({});

  const filteredResidents = mockResidents.filter(resident =>
    resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resident.apartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number, type: 'permanent' | 'temporary', currentValue: string) => {
    setEditingId(id);
    setEditData({ [`${id}_${type}`]: currentValue });
  };

  const handleSave = (id: number, type: 'permanent' | 'temporary') => {
    // Here you would save the data to your backend
    console.log(`Saving ${type} address for resident ${id}:`, editData[`${id}_${type}`]);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const renderAddressCell = (resident: any, type: 'permanent' | 'temporary') => {
    const isEditing = editingId === resident.id;
    const address = type === 'permanent' ? resident.permanentAddress : resident.temporaryAddress;
    const editKey = `${resident.id}_${type}`;

    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editData[editKey] || address}
            onChange={(e) => setEditData({ ...editData, [editKey]: e.target.value })}
            className="flex-1"
          />
          <Button size="sm" onClick={() => handleSave(resident.id, type)}>
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between">
        <span className="flex-1">{address}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleEdit(resident.id, type, address)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý nơi ở</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên cư dân hoặc căn hộ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs defaultValue="temporary" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="temporary">Tạm trú</TabsTrigger>
              <TabsTrigger value="permanent">Thường trú</TabsTrigger>
            </TabsList>
            
            <TabsContent value="temporary" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên cư dân</TableHead>
                    <TableHead>Căn hộ</TableHead>
                    <TableHead>Địa chỉ tạm trú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell>{resident.apartment}</TableCell>
                      <TableCell className="max-w-md">
                        {renderAddressCell(resident, 'temporary')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="permanent" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên cư dân</TableHead>
                    <TableHead>Căn hộ</TableHead>
                    <TableHead>Địa chỉ thường trú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResidents.map((resident) => (
                    <TableRow key={resident.id}>
                      <TableCell className="font-medium">{resident.name}</TableCell>
                      <TableCell>{resident.apartment}</TableCell>
                      <TableCell className="max-w-md">
                        {renderAddressCell(resident, 'permanent')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidenceManagement;