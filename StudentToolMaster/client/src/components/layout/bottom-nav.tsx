import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Clock, 
  GraduationCap, 
  Briefcase,
  Wrench
} from "lucide-react";

const navigationItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", iconComponent: Home, path: "/" },
  { id: "productivity", label: "Tools", icon: "timer", iconComponent: Clock, path: "/productivity" },
  { id: "academic", label: "Academic", icon: "library_books", iconComponent: GraduationCap, path: "/academic" },
  { id: "career", label: "Career", icon: "work", iconComponent: Briefcase, path: "/career" },
  { id: "utilities", label: "Utilities", icon: "build", iconComponent: Wrench, path: "/utilities" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border lg:hidden z-30">
      <div className="flex justify-around py-2">
        {navigationItems.map((item) => (
          <Link 
            key={item.id} 
            href={item.path}
            className="flex flex-col items-center py-2 px-3"
          >
            <item.iconComponent 
              className={cn(
                "w-5 h-5",
                location === item.path ? "text-primary" : "text-text-secondary"
              )}
            />
            <span 
              className={cn(
                "text-xs mt-1",
                location === item.path ? "text-primary" : "text-text-secondary"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
