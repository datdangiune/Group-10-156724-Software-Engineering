import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
//import { availableApartments } from "./index";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {  Trash2, UserPlus, Users } from "lucide-react";
import { MemberForm } from "./MemberForm";
import { useHouseholdUnactive } from "@/hooks/useHouseholds";
import { PersonData, HouseholdData, AddHouseholdDialogProps } from "@/service/admin_v1";
import Cookies from "js-cookie";
import { addHouseholdAndUser } from "@/service/admin_v1";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
export const AddHouseholdDialog = ({ 
  open, 
  onOpenChange,     
  household 
}: AddHouseholdDialogProps) => {
  const isEditing = !!household;
  const [activeTab, setActiveTab] = useState("apartment");
  const [householdData, setHouseholdData] = useState<HouseholdData>({
    householdId: household?.id ? `RI${household.id}` : `RI${Math.floor(Math.random() * 10000)}`,
    owner: {
      email: household?.email || "",
      fullname: household?.owner || "",
      phoneNumber: household?.phone || "",
      gender: "Nam",
      dateOfBirth: "",
      cccd: "",
    },
    members: [],
  });
    const {toast} = useToast();
    const { data: availableApartments } = useHouseholdUnactive();
    const [selectedApartment, setSelectedApartment] = useState(
        household ? household.apartmentNumber : ""
    );
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
  
  const handleApartmentSelect = (value: string) => {
    setSelectedApartment(value);
  };
  
  const handleOwnerChange = (field: keyof PersonData, value: string) => {
    setHouseholdData(prev => ({
      ...prev,
      owner: {
        ...prev.owner,
        [field]: value
      }
    }));
  };
  
  const addMember = () => {
    setHouseholdData(prev => ({
      ...prev,
      members: [
        ...prev.members,
        {
          email: "",
          fullname: "",
          phoneNumber: "",
          gender: "Nam",
          dateOfBirth: "",
          cccd: "",
          roleInFamily: ""
        }
      ]
    }));
  };
  
  const updateMember = (index: number, field: keyof PersonData, value: string) => {
    setHouseholdData(prev => {
      const newMembers = [...prev.members];
      newMembers[index] = {
        ...newMembers[index],
        [field]: value
      };
      return {
        ...prev,
        members: newMembers
      };
    });
  };
  
  const removeMember = (index: number) => {
    setHouseholdData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const accessToken = Cookies.get("accessToken");
      const payload: HouseholdData = {
          ...householdData,
          householdId: selectedApartment || householdData.householdId,
      };
      console.log(payload);
      const result = await addHouseholdAndUser(payload, accessToken || "");
      if (result.success) {
          toast({
              title: isEditing ? "Cập nhật hộ gia đình thành công" : "Thêm hộ gia đình thành công",
              description: `Hộ gia đình ${householdData.householdId} đã được ${isEditing ? "cập nhật" : "thêm"} thành công.`,
          });
          queryClient.invalidateQueries({queryKey: ["households"]});
          queryClient.invalidateQueries({queryKey: ["userInHouseholds"]});  
          queryClient.invalidateQueries({queryKey: ["householdUnactive"]});    
          onOpenChange(false);
      } else {
        toast({
          title: "Lỗi",
          description: result.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
    const canMoveToOwner = selectedApartment !== "";
    const canMoveToMembers = Object.values(householdData.owner).every(
        value => value !== ""
    );
  
  const canSubmit = 
    canMoveToOwner && 
    canMoveToMembers && 
    householdData.members.every(member => 
      Object.values(member).every(value => value !== "")
    );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Sửa hộ gia đình" : "Thêm hộ gia đình mới"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Cập nhật thông tin hộ gia đình" 
              : "Nhập thông tin hộ gia đình mới theo các bước"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="apartment">Căn hộ</TabsTrigger>
            <TabsTrigger 
              value="owner" 
              disabled={!canMoveToOwner}
            >
              Chủ hộ
            </TabsTrigger>
            <TabsTrigger 
              value="members" 
              disabled={!canMoveToMembers}
            >
              Thành viên
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="apartment" className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apartment">Chọn căn hộ</Label>
                <Select 
                  value={selectedApartment} 
                  onValueChange={handleApartmentSelect}
                >
                  <SelectTrigger id="apartment">
                    <SelectValue placeholder="Chọn căn hộ" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableApartments?.map((apt) => (
                      <SelectItem key={apt.id} value={apt.id}>
                        {`${apt.id} (${apt.area})` } 
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setActiveTab("owner")}
                  disabled={!canMoveToOwner}
                  className="w-full"
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="owner" className="space-y-4 py-4">
            <div className="space-y-4">
              <MemberForm 
                data={householdData.owner} 
                onChange={handleOwnerChange}
                showRole={false}
              />

              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("apartment")}
                >
                  Quay lại
                </Button>
                <Button 
                  onClick={() => setActiveTab("members")}
                  disabled={!canMoveToMembers}
                >
                  Tiếp tục
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="space-y-6 py-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Thành viên hộ gia đình</h3>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addMember}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Thêm thành viên
                </Button>
              </div>

              {householdData.members.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có thành viên nào. Bấm "Thêm thành viên" để bắt đầu.
                </div>
              ) : (
                <>
                  {householdData.members.map((member, index) => (
                    <div key={index} className="p-4 border rounded-md space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          Thành viên {index + 1}
                          {member.fullname && ` - ${member.fullname}`}
                        </h4>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xóa thành viên?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa thành viên này không?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => removeMember(index)}
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <MemberForm 
                        data={member} 
                        onChange={(field, value) => updateMember(index, field, value)}
                        showRole={true}
                      />
                    </div>
                  ))}
                </>
              )}

              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("owner")}
                >
                  Quay lại
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                >
                  {isLoading
                    ? "Loading..."
                    : isEditing ? "Cập nhật" : "Lưu"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="border-t pt-4 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};