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
import { useContribution } from "@/hooks/useHouseholds";
import { Contribution, addContribution } from "@/service/admin_v1";
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

const Campaigns = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Contribution | null>(null);
  const [formCampaign, setFormCampaign] = useState<Partial<Contribution>>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    goal: 0,
    donate: 0,
    status: "Đang diễn ra"
  });
  const { data: mockCampaigns } = useContribution();
  const mockCampaign = Array.isArray(mockCampaigns) ? mockCampaigns : [];
  const filteredCampaigns = mockCampaign.filter(campaign => 
    campaign.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const accessToken = Cookies.get("accessToken");
  const handleAddEdit = (campaign: Contribution | null) => {
    setCurrentCampaign(campaign);
    if (campaign) {
      setFormCampaign({
        ...campaign,
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().slice(0, 10) : "",
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 10) : "",
      });
    } else {
      setFormCampaign({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        goal: 0,
        donate: 0,
        status: "Đang diễn ra"
      });
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormCampaign(prev => ({
      ...prev,
      [id]: id === "goal" ? Number(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      // Chỉ lấy các trường cần thiết
      const dataToSend: Contribution = {
        ...formCampaign,
        goal: Number(formCampaign.goal) || 0,
        donate: Number(formCampaign.donate) || 0,
        status: formCampaign.status || "Đang diễn ra"
      } as Contribution;
      const response = await addContribution(dataToSend, accessToken);
      if (response.success) {
        toast({
          title: "Chiến dịch đã được lưu",
          description: "Dữ liệu chiến dịch đã được lưu thành công.",
        });
        queryClient.invalidateQueries({ queryKey: ["contribution"] });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu chiến dịch.",
        variant: "destructive",
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
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
          <Button onClick={() => handleAddEdit(null)}>
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
                  <TableCell>{formatCurrency(campaign.goal)}</TableCell>
                  <TableCell>
                    {formatCurrency(campaign.donate)}
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((campaign.donate / campaign.goal) * 100))}%` }}
                      ></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'Đã hoàn thành' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {campaign.status === 'Đang diễn ra' ? 'Đang diễn ra' : 'Đã hoàn thành'}
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
            Hiển thị {filteredCampaigns?.length} trên tổng số {mockCampaigns?.length} chiến dịch
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
                value={formCampaign.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Input
                id="description"
                value={formCampaign.description || ""}
                onChange={handleInputChange}
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
                value={formCampaign.startDate || ""}
                onChange={handleInputChange}
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
                value={formCampaign.endDate || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal" className="text-right">
                Mục tiêu (VNĐ)
              </Label>
              <Input
                id="goal"
                type="number"
                value={formCampaign.goal || ""}
                onChange={handleInputChange}
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
