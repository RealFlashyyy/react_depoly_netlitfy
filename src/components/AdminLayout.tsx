import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Layout, 
  Gauge, 
  FileQuestion, 
  Users, 
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { icon: <Gauge className="h-5 w-5" />, label: "Dashboard", path: "/admin" },
    { icon: <FileQuestion className="h-5 w-5" />, label: "Quizzes", path: "/admin/quizzes" },
    { icon: <Users className="h-5 w-5" />, label: "Users", path: "/admin/users" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-border">
        <div className="flex items-center h-16 px-6 border-b border-border">
          <Link to="/admin" className="flex items-center">
            <div className="h-8 w-8 bg-quiz-purple rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="ml-2 text-xl font-bold text-foreground">Admin</span>
          </Link>
        </div>
        
        <div className="flex-grow py-6 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-quiz-purple text-white"
                      : "text-muted-foreground hover:bg-gray-100"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-border">
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Exit Admin
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-border h-16 flex items-center px-6">
          <div className="md:hidden mr-4">
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <Layout className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find(item => isActive(item.path))?.label || "Admin Dashboard"}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-quiz-purple/10 flex items-center justify-center">
                <span className="text-quiz-purple font-medium">A</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
