import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, User, Bell, Settings, LogOut, ArrowDownUp, BarChart3 } from 'lucide-react';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/groups', icon: Users, label: 'Groups' },
    { path: '/friends', icon: User, label: 'Friends' },
    { path: '/activity', icon: Bell, label: 'Activity' },
    { path: '/statistics', icon: BarChart3, label: 'Statistics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];
  
  const handleLogout = () => {
    navigate('/');
  };
  
  return (
    <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-white md:border-r md:border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl flex items-center justify-center">
          <ArrowDownUp size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#111827]">SplitUp</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-[#2563EB] font-medium' 
                    : 'text-[#6B7280] hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Profile Section */}
      <div className="border-t border-gray-200 px-3 py-4">
        <button
          onClick={() => navigate('/profile')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all mb-2 ${
            location.pathname === '/profile'
              ? 'bg-blue-50 text-[#2563EB] font-medium'
              : 'text-[#6B7280] hover:bg-gray-50'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold">
            J
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium">John Doe</p>
          </div>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[#EF4444] hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}