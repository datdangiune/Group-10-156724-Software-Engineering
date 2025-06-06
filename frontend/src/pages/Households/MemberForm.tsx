import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PersonData = {
  email: string;
  fullname: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  cccd: string;
  roleInFamily?: string;
  permanentResidence: string;
  temporaryResidence: string;
};

interface MemberFormProps {
  data: PersonData;
  onChange: (field: keyof PersonData, value: string) => void;
  showRole: boolean;
}

export const MemberForm = ({ data, onChange, showRole }: MemberFormProps) => {
  const handleInputChange = (field: keyof PersonData, e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };
  
  const genderOptions = ["Nam", "Nữ", "Khác"];
  const roleOptions = ["Chủ hộ", "Vợ", "Chồng", "Con", "Ông", "Bà", "Khác"];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="fullname">Họ và tên</Label>
        <Input
          id="fullname"
          value={data.fullname}
          onChange={(e) => handleInputChange("fullname", e)}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Số điện thoại</Label>
        <Input
          id="phoneNumber"
          value={data.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e)}
          placeholder="0912345678"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Giới tính</Label>
        <Select
          value={data.gender}
          onValueChange={(value) => onChange("gender", value)}
        >
          <SelectTrigger id="gender">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => handleInputChange("dateOfBirth", e)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cccd">CCCD/CMND</Label>
        <Input
          id="cccd"
          value={data.cccd}
          onChange={(e) => handleInputChange("cccd", e)}
          placeholder="123456789012"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => handleInputChange("email", e)}
          placeholder="email@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="permanentResidence">Địa chỉ thường trú</Label>
        <Input
          id="permanentResidence"
          value={data.permanentResidence}
          onChange={(e) => handleInputChange("permanentResidence", e)}
          placeholder="Số nhà, Đường, Phường, Quận, Tỉnh"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="temporaryResidence">Địa chỉ tạm trú</Label>
        <Input
          id="temporaryResidence"
          value={data.temporaryResidence}
          onChange={(e) => handleInputChange("temporaryResidence", e)}
          placeholder="Số nhà, Đường, Phường, Quận, Tỉnh"
        />
      </div>
      {showRole && (
        <div className="space-y-2 col-span-2">
          <Label htmlFor="roleInFamily">Quan hệ với chủ hộ</Label>
          <Select
            value={data.roleInFamily}
            onValueChange={(value) => onChange("roleInFamily", value)}
          >
            <SelectTrigger id="roleInFamily">
              <SelectValue placeholder="Chọn mối quan hệ" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};