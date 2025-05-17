
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

// Mock data for contributions
const mockContributions = [
  { id: 1, campaignId: 1, campaignName: "Quyên góp từ thiện mùa hè", household: "A1201", amount: 2000000, date: "2025-05-10" },
  { id: 2, campaignId: 1, campaignName: "Quyên góp từ thiện mùa hè", household: "B0502", amount: 1500000, date: "2025-05-12" },
  { id: 3, campaignId: 1, campaignName: "Quyên góp từ thiện mùa hè", household: "C1803", amount: 3000000, date: "2025-05-15" },
  { id: 4, campaignId: 2, campaignName: "Hỗ trợ trẻ em vùng cao", household: "A1201", amount: 1000000, date: "2025-05-20" },
  { id: 5, campaignId: 2, campaignName: "Hỗ trợ trẻ em vùng cao", household: "D0704", amount: 2000000, date: "2025-05-22" },
  { id: 6, campaignId: 2, campaignName: "Hỗ trợ trẻ em vùng cao", household: "A0601", amount: 5000000, date: "2025-05-25" },
  { id: 7, campaignId: 3, campaignName: "Phát triển cơ sở vật chất", household: "B0502", amount: 10000000, date: "2025-05-05" },
  { id: 8, campaignId: 3, campaignName: "Phát triển cơ sở vật chất", household: "C1803", amount: 15000000, date: "2025-05-08" },
];

// Mock data for campaigns (for dropdown)
const mockCampaigns = [
  { id: 1, name: "Quyên góp từ thiện mùa hè" },
  { id: 2, name: "Hỗ trợ trẻ em vùng cao" },
  { id: 3, name: "Phát triển cơ sở vật chất" },
];

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

const Donations = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<number | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContribution, setCurrentContribution] = useState<any>(null);
  
  const filteredContributions = mockContributions.filter(contribution => 
    (selectedCampaign === "all" || contribution.campaignId === selectedCampaign) &&
    (contribution.household.toLowerCase().includes(searchTerm.toLowerCase()) || 
     contribution.campaignName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddEdit = (contribution: any = null) => {
    setCurrentContribution(contribution);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    toast({
      title: currentContribution ? "Đóng góp đã được cập nhật" : "Đóng góp mới đã được thêm",
      description: `Thao tác với đóng góp của hộ ${currentContribution?.household || 'mới'} thành công.`,
    });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Đóng góp đã được xóa",
      description: "Dữ liệu đóng góp đã được xóa thành công.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Đóng góp</CardTitle>
            <CardDescription>
              Quản lý các đóng góp từ các hộ gia đình
            </CardDescription>
          </div>
          <Button onClick={() => handleAddEdit()}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm đóng góp
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="campaign" className="whitespace-nowrap">Chiến dịch:</Label>
              <select
                id="campaign"
                value={selectedCampaign.toString()}
                onChange={(e) => setSelectedCampaign(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                className="h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Tất cả các chiến dịch</option>
                {mockCampaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id.toString()}>{campaign.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo hộ gia đình..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[250px]"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chiến dịch</TableHead>
                <TableHead>Hộ gia đình</TableHead>
                <TableHead>Số tiền đóng góp</TableHead>
                <TableHead>Ngày đóng góp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell>{contribution.campaignName}</TableCell>
                  <TableCell className="font-medium">{contribution.household}</TableCell>
                  <TableCell>{formatCurrency(contribution.amount)}</TableCell>
                  <TableCell>{new Date(contribution.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAddEdit(contribution)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(contribution.id)}>
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredContributions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {filteredContributions.length} trên tổng số {
              selectedCampaign === "all" 
                ? mockContributions.length 
                : mockContributions.filter(c => c.campaignId === selectedCampaign).length
            } đóng góp
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentContribution ? "Sửa đóng góp" : "Thêm đóng góp mới"}</DialogTitle>
            <DialogDescription>
              {currentContribution ? "Cập nhật thông tin đóng góp" : "Nhập thông tin đóng góp mới"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="campaign" className="text-right">
                Chiến dịch
              </Label>
              <select
                id="campaign"
                defaultValue={currentContribution?.campaignId || ""}
                className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {mockCampaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="household" className="text-right">
                Hộ gia đình
              </Label>
              <Input
                id="household"
                defaultValue={currentContribution?.household || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Số tiền (VNĐ)
              </Label>
              <Input
                id="amount"
                type="number"
                defaultValue={currentContribution?.amount || ""}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Ngày đóng góp
              </Label>
              <Input
                id="date"
                type="date"
                defaultValue={currentContribution?.date || ""}
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

export default Donations;
