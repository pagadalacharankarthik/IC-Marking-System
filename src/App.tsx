import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Login } from "@/components/Login";
import { Layout } from "@/components/Layout";
import { WorkerDashboard } from "@/components/WorkerDashboard";
import { SupervisorDashboard } from "@/components/SupervisorDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const getDashboardTitle = () => {
    switch (user.role) {
      case 'worker': return 'Worker Dashboard';
      case 'supervisor': return 'Supervisor Dashboard';
      case 'admin': return 'Admin Dashboard';
      default: return 'Dashboard';
    }
  };

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'worker': return <WorkerDashboard />;
      case 'supervisor': return <SupervisorDashboard />;
      case 'admin': return <AdminDashboard />;
      default: return <div>Unknown role</div>;
    }
  };

  return (
    <Layout title={getDashboardTitle()}>
      {getDashboardComponent()}
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
