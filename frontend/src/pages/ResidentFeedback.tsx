import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { getHousehold, getUserInHousehold, createReportUserWithType, updateReportUserResponse, updateReportUserStatusInProgress, updateReportUserStatusResolved } from "@/service/admin_v1";
import { useReportUser } from "@/hooks/useHouseholds";

import { useQueryClient } from "@tanstack/react-query";

const ResidentFeedback = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [responseText, setResponseText] = useState("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    householdId: "",
    userId: "",
    topic: "",
    content: "",
  });
  const [households, setHouseholds] = useState<any[]>([]);
  const [usersInHousehold, setUsersInHousehold] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { data: reportUserData, isLoading: isLoadingReportUser } = useReportUser();

  // Lấy danh sách căn hộ khi mở dialog
  useEffect(() => {
    if (isDialogOpen) {
      const fetchHouseholds = async () => {
        try {
          const accessToken = Cookies.get("accessToken");
          const res = await getHousehold(accessToken, 1);
          setHouseholds(res.data || []);
        } catch {
          setHouseholds([]);
        }
      };
      fetchHouseholds();
    }
  }, [isDialogOpen]);

  // Lấy user trong căn hộ khi chọn householdId
  useEffect(() => {
    if (newFeedback.householdId) {
      setLoadingUsers(true);
      const fetchUsers = async () => {
        try {
          const accessToken = Cookies.get("accessToken");
          const res = await getUserInHousehold(accessToken, 1);
          // Lọc user theo householdId
          const users = (res.data || []).filter((u: any) => u.householdId === newFeedback.householdId);
          setUsersInHousehold(users);
        } catch {
          setUsersInHousehold([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    } else {
      setUsersInHousehold([]);
    }
  }, [newFeedback.householdId]);

  // Sử dụng dữ liệu thực tế nếu có, fallback về mockFeedback nếu chưa có
  const feedbackList = Array.isArray(reportUserData) && reportUserData.length > 0
    ? reportUserData.map((item) => ({
        id: item.id,
        residentName: item.User?.fullname || "",
        apartment: item.Household?.id || "",
        subject: item.topic,
        message: item.content,
        status: item.status === "Đang xử lý" ? "in_progress"
              : item.status === "Chờ xử lý" ? "pending"
              : item.status === "Đã giải quyết" ? "resolved"
              : item.status,
        createdAt: item.createdAt,
        response: item.response,
      }))
    : [];

  const filteredFeedback = feedbackList.filter(feedback =>
    feedback.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Chờ xử lý</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="text-blue-600"><MessageSquare className="w-3 h-3 mr-1" />Đang xử lý</Badge>;
      case "resolved":
        return <Badge variant="outline" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Đã giải quyết</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    const accessToken = Cookies.get("accessToken");
    try {
      if (newStatus === "in_progress") {
        await updateReportUserStatusInProgress(accessToken, feedbackId);
        toast({
          title: "Đã chuyển sang trạng thái Đang xử lý",
          description: "Phản hồi đã được cập nhật trạng thái.",
        });
        queryClient.invalidateQueries({ queryKey: ['reportUser'] });
      }
      if (newStatus === "resolved") {
        await updateReportUserStatusResolved(accessToken, feedbackId);
        toast({
          title: "Đã chuyển sang trạng thái Đã giải quyết",
          description: "Phản hồi đã được cập nhật trạng thái.",
        });
        queryClient.invalidateQueries({ queryKey: ['reportUser'] });
      }

    } catch (error: any) {
      toast({
        title: "Lỗi cập nhật trạng thái",
        description: error?.message || "Không thể cập nhật trạng thái.",
      });
    }
  };

  const handleSubmitResponse = async (feedbackId: string) => {
    try {
      const accessToken = Cookies.get("accessToken");
      await updateReportUserResponse(accessToken, {
        id: feedbackId,
        response: responseText,
      });
      toast({
        title: "Phản hồi thành công",
        description: "Phản hồi đã được gửi cho cư dân.",
      });
      queryClient.invalidateQueries({ queryKey: ['reportUser'] });
      setRespondingTo(null);
      setResponseText("");
    } catch (error: any) {
      toast({
        title: "Lỗi gửi phản hồi",
        description: error?.message || "Không thể gửi phản hồi.",
      });
    }
  };

  const handleNewFeedbackChange = (field: string, value: string) => {
    setNewFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Reset userId nếu đổi household
    if (field === "householdId") {
      setNewFeedback((prev) => ({ ...prev, userId: "" }));
    }
  };

  const handleSubmitNewFeedback = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      await createReportUserWithType(accessToken, {
        userId: newFeedback.userId,
        householdId: newFeedback.householdId,
        topic: newFeedback.topic,
        content: newFeedback.content,
      });
      toast({
        title: "Gửi phản hồi thành công",
        description: "Phản hồi của bạn đã được gửi đến ban quản lý.",
      });
      queryClient.invalidateQueries({queryKey: ['reportUser']});
      setIsDialogOpen(false);
      setNewFeedback({ householdId: "", userId: "", topic: "", content: "" });
    } catch (error: any) {
      toast({
        title: "Lỗi gửi phản hồi",
        description: error?.response?.data?.message || "Không thể gửi phản hồi.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Phản hồi cư dân
          </CardTitle>
          <Button onClick={() => setIsDialogOpen(true)}>
            Gửi phản hồi mới
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, căn hộ hoặc chủ đề..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cư dân</TableHead>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingReportUser ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : filteredFeedback.map((feedback) => (
                <>
                  <TableRow key={feedback.id}>
                    <TableCell className="font-medium">{feedback.residentName}</TableCell>
                    <TableCell>{feedback.apartment}</TableCell>
                    <TableCell>{feedback.subject}</TableCell>
                    <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                    <TableCell>{new Date(feedback.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setRespondingTo(feedback.id);
                            setResponseText(feedback.response || "");
                          }}>
                            Phản hồi
                          </DropdownMenuItem>
                          {/* Hiển thị "Đánh dấu đang xử lý" nếu chưa ở trạng thái "Đang xử lý" hoặc "Đã giải quyết" */}
                          {feedback.status !== "in_progress" && feedback.status !== "resolved" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "in_progress")}>
                              Đánh dấu đang xử lý
                            </DropdownMenuItem>
                          )}
                          {/* Hiển thị "Đánh dấu đã giải quyết" nếu chưa ở trạng thái "Đã giải quyết" */}
                          {feedback.status !== "resolved" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "resolved")}>
                              Đánh dấu đã giải quyết
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} className="bg-muted/30">
                      <div className="space-y-3">
                        <div>
                          <strong>Nội dung:</strong>
                          <p className="mt-1 text-sm">{feedback.message}</p>
                        </div>
                        
                        {feedback.response && (
                          <div>
                            <strong>Phản hồi:</strong>
                            <p className="mt-1 text-sm text-blue-600">{feedback.response}</p>
                          </div>
                        )}

                        {respondingTo === feedback.id && (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Nhập phản hồi..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleSubmitResponse(feedback.id)}>
                                Gửi phản hồi
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setRespondingTo(null)}>
                                Hủy
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))}
              {!isLoadingReportUser && filteredFeedback.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Không có phản hồi nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog gửi phản hồi mới */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gửi phản hồi mới</DialogTitle>
            <DialogDescription>
              Vui lòng chọn căn hộ, cư dân và nhập chủ đề, nội dung phản hồi.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Chọn căn hộ</label>
              <Select
                value={newFeedback.householdId}
                onValueChange={(v) => handleNewFeedbackChange("householdId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn căn hộ" />
                </SelectTrigger>
                <SelectContent>
                  {households.map((h) => (
                    <SelectItem key={h.householdId || h.id} value={h.householdId || h.id}>
                      {h.householdId || h.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-medium">Chọn cư dân</label>
              <Select
                value={newFeedback.userId}
                onValueChange={(v) => handleNewFeedbackChange("userId", v)}
                disabled={!newFeedback.householdId || loadingUsers}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingUsers ? "Đang tải..." : "Chọn cư dân"} />
                </SelectTrigger>
                <SelectContent>
                  {usersInHousehold.length === 0 && (
                    <div className="px-4 py-2 text-muted-foreground">Không có cư dân</div>
                  )}
                  {usersInHousehold.map((u) => (
                    <SelectItem key={u.userId || u.id} value={u.userId || u.id}>
                      {u.fullname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Chủ đề phản hồi"
              value={newFeedback.topic}
              onChange={(e) => handleNewFeedbackChange("topic", e.target.value)}
            />
            <Textarea
              placeholder="Nội dung phản hồi"
              value={newFeedback.content}
              onChange={(e) => handleNewFeedbackChange("content", e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmitNewFeedback}
              disabled={
                !newFeedback.householdId ||
                !newFeedback.userId ||
                !newFeedback.topic ||
                !newFeedback.content
              }
            >
              Gửi
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResidentFeedback;