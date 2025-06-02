
import { useState } from "react";
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

// Mock data for feedback
const mockFeedback = [
  {
    id: 1,
    residentName: "Nguyễn Văn An",
    apartment: "A1201",
    subject: "Vấn đề về thang máy",
    message: "Thang máy số 2 thường xuyên bị hỏng, mong ban quản lý sửa chữa sớm.",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
    response: null
  },
  {
    id: 2,
    residentName: "Trần Thị Mai",
    apartment: "B0502",
    subject: "Góp ý về khu vui chơi trẻ em",
    message: "Khu vui chơi trẻ em cần được bảo trì và bổ sung thêm thiết bị an toàn.",
    status: "resolved",
    createdAt: "2024-01-10T14:20:00Z",
    response: "Cảm ơn góp ý. Chúng tôi đã lên kế hoạch bảo trì khu vui chơi trong tháng này."
  },
  {
    id: 3,
    residentName: "Lê Văn Hùng",
    apartment: "C0703",
    subject: "Tiếng ồn từ tầng trên",
    message: "Căn hộ tầng trên thường xuyên gây tiếng ồn vào ban đêm, ảnh hưởng đến giấc ngủ.",
    status: "in_progress",
    createdAt: "2024-01-12T20:15:00Z",
    response: "Chúng tôi đã liên hệ với cư dân tầng trên và đang theo dõi tình hình."
  }
];

const ResidentFeedback = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [responseText, setResponseText] = useState("");
  const [respondingTo, setRespondingTo] = useState<number | null>(null);

  const filteredFeedback = mockFeedback.filter(feedback =>
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

  const handleStatusChange = (feedbackId: number, newStatus: string) => {
    // Here you would update the status in your backend
    console.log(`Updating feedback ${feedbackId} status to ${newStatus}`);
  };

  const handleSubmitResponse = (feedbackId: number) => {
    // Here you would submit the response to your backend
    console.log(`Submitting response for feedback ${feedbackId}:`, responseText);
    setRespondingTo(null);
    setResponseText("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Phản hồi cư dân
          </CardTitle>
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
              {filteredFeedback.map((feedback) => (
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
                          <DropdownMenuItem onClick={() => setRespondingTo(feedback.id)}>
                            Phản hồi
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "in_progress")}>
                            Đánh dấu đang xử lý
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(feedback.id, "resolved")}>
                            Đánh dấu đã giải quyết
                          </DropdownMenuItem>
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
              {filteredFeedback.length === 0 && (
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
    </div>
  );
};

export default ResidentFeedback;