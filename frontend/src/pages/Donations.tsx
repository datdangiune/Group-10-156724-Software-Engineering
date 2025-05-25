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
import { useContribution, useHouseholdUInuse} from "@/hooks/useHouseholds";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addUserToContribution } from "@/service/admin_v1";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import { useContributionPayment } from "@/hooks/useHouseholds";
import { useQueryClient } from "@tanstack/react-query";
const contributionFormSchema = z.object({
  householdId: z.string({ required_error: "Vui lòng chọn căn hộ" }),
  contributionId: z.string({ required_error: "Vui lòng chọn chiến dịch" }),
  amount: z.preprocess((val) => Number(val), z.number({ required_error: "Vui lòng nhập số tiền đóng góp" }).min(1, "Số tiền phải lớn hơn 0")),
});
type ContributionForm = z.infer<typeof contributionFormSchema>;
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
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContribution, setCurrentContribution] = useState<any>(null);
  const token = Cookies.get("accessToken");
  const { data: contributions } = useContribution();
  const { data: households } = useHouseholdUInuse();
  const { user } = useAuth();
  const { data: ContributionPayment } = useContributionPayment();
  const contributionsData = Array.isArray(ContributionPayment) ? ContributionPayment : [];
  const filteredContributions = contributionsData.filter(contribution => 
    (selectedCampaign === "all" || contribution.contributionId === selectedCampaign) &&
    (contribution.householdId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     contribution.Contribution?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const form = useForm<ContributionForm>({
    resolver: zodResolver(contributionFormSchema),
    defaultValues: {
      householdId: "",
      contributionId: "",
      amount: 0,
    },
  });

  const handleAddEdit = (contribution: any = null) => {
    setCurrentContribution(contribution);
    if (contribution) {
      form.reset({
        householdId: contribution.household,
        contributionId: contribution.campaignId,
        amount: contribution.amount,
      });
    } else {
      form.reset({
        householdId: "",
        contributionId: "",
        amount: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ContributionForm) => {
    try {
      const response = await addUserToContribution(
        {
          householdId: data.householdId,
          contributionId: data.contributionId,
          amount: data.amount,
        },
        token
      );
      if (!response.success) {
        toast({
          title: "Lỗi",
          description: response.message,
          variant: "destructive",
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['contributionPayment'] });
      queryClient.invalidateQueries({ queryKey: ['contribution'] });
      toast({
        title: currentContribution ? "Đóng góp đã được cập nhật" : "Đóng góp mới đã được thêm",
        description: response.message,
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể thực hiện thao tác",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
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
          {user?.role === "ketoan" ? (
            <Button onClick={() => handleAddEdit()}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đóng góp
            </Button>
          ) : (
            null
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="campaign" className="whitespace-nowrap">Chiến dịch:</Label>
              <select
                id="campaign"
                value={selectedCampaign.toString()}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="h-10 w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">Tất cả các chiến dịch</option>
                {contributions?.map((campaign) => (
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
                  <TableCell>{contribution.Contribution?.name}</TableCell>
                  <TableCell className="font-medium">{contribution.householdId}</TableCell>
                  <TableCell>{formatCurrency(contribution.amount)}</TableCell>
                  <TableCell>{new Date(contribution.paymentDate).toLocaleDateString('vi-VN')}</TableCell>
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
                ? contributionsData.length 
                : contributionsData.filter(c => c.contributionId === selectedCampaign).length
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contributionId" className="text-right">
                  Chiến dịch
                </Label>
                <select
                  id="contributionId"
                  {...form.register("contributionId")}
                  className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Chọn chiến dịch</option>
                  {contributions?.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="householdId" className="text-right">
                  Hộ gia đình
                </Label>
                <select
                  id="householdId"
                  {...form.register("householdId")}
                  className="col-span-3 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Chọn hộ gia đình</option>
                  {households?.map((h) => (
                    <option key={h.id} value={h.id}>{h.id}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Số tiền (VNĐ)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  {...form.register("amount")}
                  className="col-span-3"
                  min={1}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Donations;
