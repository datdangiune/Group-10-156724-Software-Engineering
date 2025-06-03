
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Households from "./pages/Households";
import Residents from "./pages/Residents";
import FeeTypes from "./pages/FeeTypes";
import MonthlyFees from "./pages/MonthlyFees";
import Utilities from "./pages/Utilities";
import Parking from "./pages/Parking";
import Campaigns from "./pages/Campaigns";
import Donations from "./pages/Donations";
import Reports from "./pages/Reports";
import ApartmentFees from "./pages/ApartmentFees";
import Account from "./pages/Account";
import NotFoundPage from "./pages/NotFoundPage";
import ResidentDetail from "./pages/ResidentDetail";
import ResidenceManagement from "./pages/ResidenceManagement";

import ResidentFeedback from "./pages/ResidentFeedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="households" element={<Households />} />
              <Route path="residents" element={<Residents />} />
              <Route path="residents/:id" element={<ResidentDetail />} />
              <Route path="residence" element={<ResidenceManagement />} />
              <Route path="feedback" element={<ResidentFeedback />} />

              <Route path="fees" element={<FeeTypes />} />
              <Route path="monthly-fees" element={<MonthlyFees />} />
              <Route path="apartment-fees" element={<ApartmentFees />} />
              <Route path="utilities" element={<Utilities />} />
              <Route path="parking" element={<Parking />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="donations" element={<Donations />} />
              <Route path="reports" element={<Reports />} />
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
