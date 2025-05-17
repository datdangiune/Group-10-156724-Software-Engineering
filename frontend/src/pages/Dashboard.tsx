
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Mock data for the dashboard
const feeCollectionData = [
  { month: 'Jan', amount: 125000000 },
  { month: 'Feb', amount: 130000000 },
  { month: 'Mar', amount: 135000000 },
  { month: 'Apr', amount: 140000000 },
  { month: 'May', amount: 142000000 },
  { month: 'Jun', amount: 145000000 }
];

const feeTypesData = [
  { name: 'Quản lý', value: 45 },
  { name: 'Dịch vụ', value: 25 },
  { name: 'Đỗ xe', value: 15 },
  { name: 'Tiện ích', value: 10 },
  { name: 'Quyên góp', value: 5 },
];

const activeCampaigns = [
  { name: "Quyên góp từ thiện mùa hè", description: "Giúp đỡ người vô gia cư", end: "2025-08-15", collected: 15500000, target: 50000000 },
  { name: "Hỗ trợ trẻ em vùng cao", description: "Mua sách vở và đồ dùng học tập", end: "2025-09-30", collected: 32000000, target: 40000000 },
  { name: "Phát triển cơ sở vật chất", description: "Nâng cấp khu vui chơi", end: "2025-07-20", collected: 45000000, target: 70000000 }
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

// Format percentage
const formatPercentage = (value: number) => {
  return `${value.toFixed(0)}%`;
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng thu phí</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(145000000)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              +8% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Số hộ gia đình</CardDescription>
            <CardTitle className="text-3xl">560</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              120 hộ chưa đóng phí tháng này
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tỷ lệ thu phí</CardDescription>
            <CardTitle className="text-3xl">78.6%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              +2.5% so với tháng trước
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Chiến dịch quyên góp</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Đang hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Phí thu được theo tháng</CardTitle>
            <CardDescription>
              Tổng số tiền thu được qua các tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={feeCollectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="amount" name="Số tiền (VND)" fill="#9b87f5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Phân bổ theo loại phí</CardTitle>
            <CardDescription>
              Phân tích cơ cấu các khoản phí
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={feeTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${formatPercentage(percent * 100)}`}
                >
                  {feeTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Chiến dịch quyên góp đang hoạt động</CardTitle>
          <CardDescription>
            Các chiến dịch quyên góp đang diễn ra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCampaigns.map((campaign, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p>Kết thúc: {new Date(campaign.end).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiến độ</span>
                    <span>{Math.round((campaign.collected / campaign.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${Math.round((campaign.collected / campaign.target) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Đã quyên góp: {formatCurrency(campaign.collected)}</span>
                    <span className="font-medium">Mục tiêu: {formatCurrency(campaign.target)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
