import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Clock, 
  GraduationCap, 
  Settings, 
  BookOpen,
  CheckSquare,
  PenTool,
  Briefcase,
  Wrench
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", iconComponent: Home, path: "/" },
  { id: "productivity", label: "Productivity", icon: "timer", iconComponent: Clock, path: "/productivity" },
  { id: "academic", label: "Academic Tools", icon: "school", iconComponent: GraduationCap, path: "/academic" },
  { id: "career", label: "Career", icon: "work", iconComponent: Briefcase, path: "/career" },
  { id: "utilities", label: "Utilities", icon: "build", iconComponent: Wrench, path: "/utilities" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-surface material-shadow-2 z-40 border-r border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">StudySync</h1>
            <p className="text-sm text-text-secondary">All-in-One Student Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link 
            key={item.id} 
            href={item.path}
            className={cn(
              "flex items-center space-x-3 p-4 rounded-xl transition-all duration-200 block card-hover",
              location === item.path
                ? "gradient-primary text-white shadow-lg"
                : "hover:bg-surface-variant text-text-primary hover:shadow-md"
            )}
          >
            <item.iconComponent className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Stats Section */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-border rounded-lg p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">30+</div>
            <div className="text-sm text-text-secondary">Study Tools</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
