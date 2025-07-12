import { Search, Bell, GraduationCap } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="bg-surface shadow-sm fixed top-0 left-0 right-0 z-50 lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-medium text-text-primary">StudySync</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-surface-variant rounded-full">
            <Search className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="p-2 hover:bg-surface-variant rounded-full">
            <Bell className="w-5 h-5 text-text-secondary" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100" 
              alt="User profile" 
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
