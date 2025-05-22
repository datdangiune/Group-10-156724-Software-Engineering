import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import {
  useFeeCollectionData,
  useFeeTypeDistribution,
  useUnpaidHouseholdDetails
} from "@/hooks/useHouseholds";

// Mock data for reports
const monthlyFeesByType = [
  { type: "Quản lý", amount: 72000000 },
  { type: "Dịch vụ", amount: 48000000 },
  { type: "Đỗ xe", amount: 18900000 },
  { type: "Tiện ích", amount: 35650000 },
  { type: "Quyên góp", amount: 38500000 },
];

const unpaidHouseholds = [
  { household: "A1201", owner: "Nguyễn Văn An", unpaidAmount: 1250000 },
  { household: "D0704", owner: "Phạm Hoàng Linh", unpaidAmount: 950000 },
  { household: "E0301", owner: "Trần Minh Quân", unpaidAmount: 1720000 },
  { household: "B0402", owner: "Lê Thị Hồng", unpaidAmount: 650000 },
  { household: "C0901", owner: "Vũ Đình Nam", unpaidAmount: 1450000 },
];

const monthlyCollectionData = [
  { month: 'Jan', amount: 155000000 },
  { month: 'Feb', amount: 160000000 },
  { month: 'Mar', amount: 175000000 },
  { month: 'Apr', amount: 180000000 },
  { month: 'May', amount: 213050000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Format Vietnamese currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(value);
};

const Reports = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  // Lấy accessToken từ cookie như Dashboard
  const accessToken = Cookies.get("accessToken");

  // Fetch data từ backend
  const { data: monthlyCollectionData = [], isLoading: loadingCollection } = useFeeCollectionData();
  const { data: monthlyFeesByType = [], isLoading: loadingType } = useFeeTypeDistribution();
  const { data: unpaidHouseholds = [], isLoading: loadingUnpaid } = useUnpaidHouseholdDetails(selectedMonth);

  const handleExport = (format: string) => {
    toast({
      title: `Xuất báo cáo sang định dạng ${format.toUpperCase()}`,
      description: "Báo cáo đã được tải xuống thành công.",
    });
  };

  if (loadingCollection || loadingType || loadingUnpaid) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo thống kê</h2>
          <p className="text-muted-foreground">
            Xem và tải xuống các báo cáo thống kê
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="reportMonth">Tháng báo cáo:</Label>
          <input
            id="reportMonth"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* Total Collection Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tổng thu theo tháng</CardTitle>
          <CardDescription>
            Biểu đồ tổng thu theo các tháng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => handleExport('csv')}>
              <Download className="mr-2 h-4 w-4" />
              Xuất CSV
            </Button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="amount" name="Số tiền thu được (VND)" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Fee Collection by Type */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Thu phí theo loại</CardTitle>
            <CardDescription>
              Thống kê thu phí theo từng loại phí
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="ml-auto" onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Xuất PDF
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại phí</TableHead>
                  <TableHead className="text-right">Tổng thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyFeesByType.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {item.name || item.type}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.value || item.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">Tổng cộng</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(monthlyFeesByType.reduce((sum: number, item: any) => sum + (item.value || item.amount), 0))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phân bổ theo loại phí</CardTitle>
            <CardDescription>
              Biểu đồ tròn thể hiện tỷ lệ các loại phí
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={monthlyFeesByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {monthlyFeesByType.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unpaid Households */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hộ gia đình chưa thanh toán</CardTitle>
          <CardDescription>
            Các hộ gia đình có khoản phí chưa thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => handleExport('excel')}>
              <Download className="mr-2 h-4 w-4" />
              Xuất Excel
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Chủ hộ</TableHead>
                <TableHead className="text-right">Số tiền chưa thanh toán</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unpaidHouseholds.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.household}</TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unpaidAmount)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="font-bold">Tổng cộng</TableCell>
                <TableCell className="text-right font-bold">
                  {formatCurrency(unpaidHouseholds.reduce((sum: number, item: any) => sum + (item.unpaidAmount || 0), 0))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
