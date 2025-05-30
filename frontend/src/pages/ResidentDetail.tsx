import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Home, MapPin } from "lucide-react";
import { useUserResidenceInfo, useUserINHouseholds } from "@/hooks/useHouseholds";

const ResidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Lấy thông tin cư dân từ danh sách userInHouseholds
  const { data: userList, isLoading: isUserLoading } = useUserINHouseholds(1); // hoặc fetch tất cả nếu cần
  const resident = userList?.data?.find((r) => r.userId === id);

  // Lấy thông tin thường trú/tạm trú từ API
  const { data: residenceInfo, isLoading: isResidenceLoading } = useUserResidenceInfo(id || "");

  if (isUserLoading || isResidenceLoading) {
    return <div>Loading...</div>;
  }

  if (!resident) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/residents")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Không tìm thấy thông tin cư dân</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/residents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách cư dân
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Họ và tên</label>
                <p className="text-base font-medium">{resident.fullname}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Ngày sinh</label>
                <p className="text-base">{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Giới tính</label>
                <p className="text-base">{resident.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CCCD</label>
                <p className="text-base">{resident.cccd}</p>
              </div>
            </div>
            <div className="space-y-4">
              {/* Nếu có phone/email thì bổ sung ở đây */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Quan hệ với chủ hộ</label>
                <p className="text-base">{resident.roleInFamily}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Căn hộ</label>
                <p className="text-base">{resident.householdId}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Household Registration Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Thông tin đăng ký hộ khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                Thường trú
              </label>
              <p className="text-base bg-muted/30 p-3 rounded-md">
                {residenceInfo?.permanentResidence || "Chưa cập nhật thông tin thường trú"}
              </p>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                <MapPin className="h-4 w-4" />
                Tạm trú
              </label>
              <p className="text-base bg-muted/30 p-3 rounded-md">
                {residenceInfo?.temporaryResidence || "Chưa cập nhật thông tin tạm trú"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentDetail;
