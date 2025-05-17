
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Search, MoreHorizontal, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for campaigns
const mockCampaigns = [
  { 
    id: 1, 
    name: "Quyên góp từ thiện mùa hè", 
    description: "Giúp đỡ người vô gia cư trong khu vực tòa nhà", 
    startDate: "2025-05-01", 
    endDate: "2025-08-15", 
    target: 50000000,
    collected: 15500000,
    status: "active" 
  },
  { 
    id: 2, 
    name: "Hỗ trợ trẻ em vùng cao", 
    description: "Mua sách vở và đồ dùng học tập cho trẻ em vùng cao", 
    startDate: "2025-05-15", 
    endDate: "2025-09-30", 
    target: 40000000,
    collected: 32000000,
    status: "active" 
  },
  { 
    id: 3, 
    name: "Phát triển cơ sở vật chất", 
    description: "Nâng cấp khu vui chơi cho trẻ em trong tòa nhà", 
    startDate: "2025-04-01", 
    endDate: "2025-07-20", 
    target: 70000000,
    collected: 45000000,
    status: "active" 
  },
  { 
    id: 4, 
    name: "Hỗ trợ người già neo đơn", 
    description: "Quyên góp cho người già neo đơn trong khu vực", 
    startDate: "2025-01-01", 
    endDate: "2025-04-01", 
    target: 30000000,
    collected: 30000000,
    status: "completed" 
  },
];

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

const Campaigns = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<any>(null);
  
  const filteredCampaigns = mockCampaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEdit = (campaign: any = null) => {
    setCurrentCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: currentCampaign ? "Chiến dịch đã được cập nhật" : "Chiến dịch mới đã được thêm",
      description: `Thao tác với chiến dịch ${currentCampaign?.name || 'mới'} thành công.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Chiến dịch đã được xóa",
      description: "Dữ liệu chiến dịch đã được xóa thành công.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Chiến dịch quyên góp</CardTitle>
            <CardDescription>
              Quản lý các chiến dịch quyên góp của cộng đồng
            </CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm chiến dịch
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mô tả chiến dịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chiến dịch</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Mục tiêu</TableHead>
                <TableHead>Đã quyên góp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.description}</TableCell>
                  <TableCell>
                    {new Date(campaign.startDate).toLocaleDateString('vi-VN')} - {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>{formatCurrency(campaign.target)}</TableCell>
                  <TableCell>
                    {formatCurrency(campaign.collected)}
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((campaign.collected / campaign.target) * 100))}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {campaign.status === 'active' ? 'Đang diễn ra' : 'Đã hoàn thành'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(campaign)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(campaign.id)}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCampaigns.length === 0 && (
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
            Hiển thị {filteredCampaigns.length} trên tổng số {mockCampaigns.length} chiến dịch
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentCampaign ? "Sửa chiến dịch" : "Thêm chiến dịch mới"}</DialogTitle>
            <DialogDescription>
              {currentCampaign ? "Cập nhật thông tin chiến dịch" : "Nhập thông tin chiến dịch mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên chiến dịch
              </Label>
              <Input
                id="name"
                defaultValue={currentCampaign?.name || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Input
                id="description"
                defaultValue={currentCampaign?.description || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Ngày bắt đầu
              </Label>
              <Input
                id="startDate"
                type="date"
                defaultValue={currentCampaign?.startDate || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Ngày kết thúc
              </Label>
              <Input
                id="endDate"
                type="date"
                defaultValue={currentCampaign?.endDate || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">
                Mục tiêu (VNĐ)
              </Label>
              <Input
                id="target"
                type="number"
                defaultValue={currentCampaign?.target || ""}
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

export default Campaigns;
