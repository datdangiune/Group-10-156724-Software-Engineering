
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Key } from "lucide-react";

// Schema for profile information validation
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  phone: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 ký tự.",
  }),
  position: z.string().optional(),
});

// Schema for password change validation
const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự.",
  }),
  newPassword: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới không khớp.",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Account = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Default form values
  const defaultProfileValues: Partial<ProfileFormValues> = {
    name: "Quản Trị Viên",
    email: user?.email || "admin@bluemoon.com",
    phone: "0912345678",
    position: "Trưởng Ban Quản Lý",
  };

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultProfileValues,
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle profile update
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);
    
    try {
      // Simulating API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success message
      toast({
        title: "Cập nhật thông tin thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật.",
      });
      
    } catch (error) {
      // Error message
      toast({
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật thông tin.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password change
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsChangingPassword(true);
    
    try {
      // In a real app, this would call an API endpoint to change the password
      // For this demo, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in a real app, this would be handled by the backend
      if (data.currentPassword !== "admin123") {
        toast({
          title: "Mật khẩu hiện tại không đúng",
          description: "Vui lòng kiểm tra lại mật khẩu hiện tại.",
          variant: "destructive",
        });
        setIsChangingPassword(false);
        return;
      }
      
      // Success message
      toast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật.",
      });
      
      // Reset form
      passwordForm.reset();
      
    } catch (error) {
      // Error message
      toast({
        title: "Đổi mật khẩu thất bại",
        description: "Có lỗi xảy ra khi đổi mật khẩu.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Thông tin cá nhân</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Bảo mật</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab Content */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Cập nhật thông tin cá nhân của bạn tại đây. Các thông tin sẽ được hiển thị công khai.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên</FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn A" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="0912345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chức vụ</FormLabel>
                          <FormControl>
                            <Input placeholder="Trưởng Ban Quản Lý" {...field} />
                          </FormControl>
                          <FormDescription>
                            Chức vụ của bạn trong Ban Quản Lý.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Tab Content */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>
                Quản lý mật khẩu và các thiết lập bảo mật cho tài khoản của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu hiện tại</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu mới</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormDescription>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Key className="h-3 w-3" />
                              <span>Mật khẩu phải có ít nhất 6 ký tự.</span>
                            </div>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
