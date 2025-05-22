import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useFeeCollectionData, useFeeTypeDistribution, useActiveCampaigns } from "@/hooks/useHouseholds";
import Cookies from "js-cookie";

// Mock data for the dashboard
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
  const accessToken = Cookies.get("accessToken");
  const { data: feeCollectionData = [], isLoading: loadingFeeCol } = useFeeCollectionData();
  const { data: feeTypesData = [], isLoading: loadingFeeType } = useFeeTypeDistribution();
  const { data: activeCampaigns = [], isLoading: loadingCampaigns } = useActiveCampaigns();

  // Tổng thu phí tháng mới nhất
  const totalFee = feeCollectionData.length > 0
    ? feeCollectionData[feeCollectionData.length - 1].amount
    : 0;

  // Số chiến dịch quyên góp đang hoạt động
  const campaignCount = activeCampaigns.length;

  // Tỷ lệ thu phí (ví dụ: tổng các loại phí đã thu / tổng mục tiêu, hoặc bạn có thể lấy từ backend nếu có)
  // Ở đây chỉ demo, bạn có thể thay bằng logic thực tế
  const feeRate = feeTypesData.reduce((acc, cur) => cur.name !== "Quyên góp" ? acc + cur.value : acc, 0);

  // Số hộ gia đình và số hộ chưa đóng phí: cần fetch thêm từ backend nếu muốn realtime
  const totalHouseholds = 560; // TODO: fetch thực tế nếu cần
  const unpaidHouseholds = 120; // TODO: fetch thực tế nếu cần

  if (loadingFeeCol || loadingFeeType || loadingCampaigns) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng thu phí</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalFee)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {/* Có thể tính toán % tăng giảm nếu muốn */}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Số hộ gia đình</CardDescription>
            <CardTitle className="text-3xl">{totalHouseholds}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {unpaidHouseholds} hộ chưa đóng phí tháng này
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tỷ lệ thu phí</CardDescription>
            <CardTitle className="text-3xl">{feeRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {/* Có thể tính toán % tăng giảm nếu muốn */}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Chiến dịch quyên góp</CardDescription>
            <CardTitle className="text-3xl">{campaignCount}</CardTitle>
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
