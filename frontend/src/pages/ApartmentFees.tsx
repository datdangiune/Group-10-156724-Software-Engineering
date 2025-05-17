
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for apartments
const mockApartments = [
  { id: 1, number: "A1201", owner: "Nguyễn Văn An", area: 120, totalFees: 3790000 },
  { id: 2, number: "B0502", owner: "Trần Thị Mai", area: 60, totalFees: 2057000 },
  { id: 3, number: "C1803", owner: "Lê Minh Tuấn", area: 90, totalFees: 2980000 },
  { id: 4, number: "D0704", owner: "Phạm Hoàng Linh", area: 75, totalFees: 2450000 },
  { id: 5, number: "A0601", owner: "Vũ Thị Hương", area: 45, totalFees: 1620000 },
];

// Mock data for detailed fees per apartment
const mockDetailedFees = {
  1: [
    { id: 101, name: "Phí quản lý", amount: 1440000, status: "paid", paidAt: "2025-05-05T10:30:00" },
    { id: 102, name: "Phí dịch vụ", amount: 960000, status: "paid", paidAt: "2025-05-05T10:30:00" },
    { id: 103, name: "Phí gửi xe máy", amount: 140000, status: "paid", paidAt: "2025-05-05T10:30:00" },
    { id: 104, name: "Phí điện", amount: 875000, status: "unpaid", paidAt: null },
    { id: 105, name: "Phí nước", amount: 375000, status: "unpaid", paidAt: null },
  ],
  2: [
    { id: 201, name: "Phí quản lý", amount: 720000, status: "paid", paidAt: "2025-05-10T14:15:00" },
    { id: 202, name: "Phí dịch vụ", amount: 480000, status: "paid", paidAt: "2025-05-10T14:15:00" },
    { id: 203, name: "Phí điện", amount: 462000, status: "paid", paidAt: "2025-05-10T14:15:00" },
    { id: 204, name: "Phí nước", amount: 195000, status: "paid", paidAt: "2025-05-10T14:15:00" },
    { id: 205, name: "Phí Internet", amount: 200000, status: "paid", paidAt: "2025-05-10T14:15:00" },
  ],
  3: [
    { id: 301, name: "Phí quản lý", amount: 1080000, status: "paid", paidAt: "2025-05-08T09:20:00" },
    { id: 302, name: "Phí dịch vụ", amount: 720000, status: "paid", paidAt: "2025-05-08T09:20:00" },
    { id: 303, name: "Phí gửi xe máy", amount: 210000, status: "paid", paidAt: "2025-05-08T09:20:00" },
    { id: 304, name: "Phí điện", amount: 570000, status: "unpaid", paidAt: null },
    { id: 305, name: "Phí nước", amount: 400000, status: "unpaid", paidAt: null },
  ],
  4: [
    { id: 401, name: "Phí quản lý", amount: 900000, status: "unpaid", paidAt: null },
    { id: 402, name: "Phí dịch vụ", amount: 600000, status: "unpaid", paidAt: null },
    { id: 403, name: "Phí gửi xe máy", amount: 140000, status: "paid", paidAt: "2025-05-15T16:45:00" },
    { id: 404, name: "Phí điện", amount: 510000, status: "paid", paidAt: "2025-05-15T16:45:00" },
    { id: 405, name: "Phí nước", amount: 300000, status: "paid", paidAt: "2025-05-15T16:45:00" },
  ],
  5: [
    { id: 501, name: "Phí quản lý", amount: 540000, status: "paid", paidAt: "2025-05-12T11:10:00" },
    { id: 502, name: "Phí dịch vụ", amount: 360000, status: "paid", paidAt: "2025-05-12T11:10:00" },
    { id: 503, name: "Phí điện", amount: 420000, status: "paid", paidAt: "2025-05-12T11:10:00" },
    { id: 504, name: "Phí nước", amount: 200000, status: "paid", paidAt: "2025-05-12T11:10:00" },
    { id: 505, name: "Phí Internet", amount: 100000, status: "unpaid", paidAt: null },
  ]
};

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

const ApartmentFees = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [month, setMonth] = useState("2025-05"); // Default to current month
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const filteredApartments = mockApartments.filter(apartment => 
    apartment.number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    apartment.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApartmentClick = (apartmentId: number) => {
    setSelectedApartment(apartmentId);
    setIsDialogOpen(true);
  };

  const handleStatusChange = (feeId: number) => {
    if (!selectedApartment) return;
    
    const fees = mockDetailedFees[selectedApartment as keyof typeof mockDetailedFees];
    const fee = fees.find(fee => fee.id === feeId);
    
    if (fee) {
      const status = fee.status === 'paid' ? 'unpaid' : 'paid';
      toast({
        title: status === 'paid' ? "Đã đánh dấu đã thanh toán" : "Đã đánh dấu chưa thanh toán",
        description: `Khoản phí ${fee.name} đã được cập nhật.`,
      });
      
      // In a real application, you would update the status in the database
      fee.status = status;
      fee.paidAt = status === 'paid' ? new Date().toISOString() : null;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Phí theo căn hộ</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi các khoản phí theo từng căn hộ
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách căn hộ</CardTitle>
          <CardDescription>
            Tổng cộng có {mockApartments.length} căn hộ với các khoản phí tháng {month}.
          </CardDescription>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="month">Tháng:</Label>
              <Input
                id="month"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo căn hộ hoặc chủ sở hữu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Số căn hộ</TableHead>
                <TableHead>Chủ sở hữu</TableHead>
                <TableHead>Diện tích (m²)</TableHead>
                <TableHead>Tổng phí</TableHead>
                <TableHead>Chi tiết</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApartments.map((apartment) => (
                <TableRow key={apartment.id} className="cursor-pointer hover:bg-muted/60">
                  <TableCell className="font-medium">{apartment.number}</TableCell>
                  <TableCell>{apartment.owner}</TableCell>
                  <TableCell>{apartment.area}</TableCell>
                  <TableCell>{formatCurrency(apartment.totalFees)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleApartmentClick(apartment.id)}
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApartments.length === 0 && (
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
            Hiển thị {filteredApartments.length} trên tổng số {mockApartments.length} căn hộ
          </div>
        </CardFooter>
      </Card>

      {selectedApartment && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Chi tiết phí tháng {month} - Căn hộ {mockApartments.find(a => a.id === selectedApartment)?.number}
              </DialogTitle>
              <DialogDescription>
                Chủ sở hữu: {mockApartments.find(a => a.id === selectedApartment)?.owner}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loại phí</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDetailedFees[selectedApartment as keyof typeof mockDetailedFees].map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.name}</TableCell>
                      <TableCell>{formatCurrency(fee.amount)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          fee.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {fee.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {fee.paidAt 
                          ? new Date(fee.paidAt).toLocaleString('vi-VN') 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {fee.status === 'unpaid' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(fee.id)}
                          >
                            Đánh dấu đã thu
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleStatusChange(fee.id)}
                          >
                            Đánh dấu chưa thu
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-medium">
                Tổng cộng: {formatCurrency(
                  mockDetailedFees[selectedApartment as keyof typeof mockDetailedFees]
                    .reduce((sum, fee) => sum + fee.amount, 0)
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ApartmentFees;
