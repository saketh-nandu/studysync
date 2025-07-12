import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Plus } from "lucide-react";
import Dashboard from "@/pages/dashboard";
import Productivity from "@/pages/productivity";
import Academic from "@/pages/academic";
import Career from "@/pages/career";
import Utilities from "@/pages/utilities";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Sidebar />
      
      <main className="pt-16 pb-16 lg:pt-0 lg:pb-0 lg:ml-64 min-h-screen">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/productivity" component={Productivity} />
          <Route path="/academic" component={Academic} />
          <Route path="/career" component={Career} />
          <Route path="/utilities" component={Utilities} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <BottomNav />
      
      {/* Floating Action Button */}
      <button className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-colors z-40">
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
