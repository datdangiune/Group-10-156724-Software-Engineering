
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-blue-600 text-white p-1.5 rounded-md">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              fill="currentColor" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">BlueMoon</h1>
      </div>
      
      <div className="text-center space-y-4">
        <h1 className="text-9xl font-extrabold tracking-widest text-blue-600">404</h1>
        <p className="text-2xl font-semibold md:text-3xl">Không tìm thấy trang</p>
        <p className="text-muted-foreground">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="mt-8"
        >
          Quay về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
