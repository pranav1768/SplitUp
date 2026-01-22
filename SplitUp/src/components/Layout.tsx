import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  showBottomNav?: boolean;
}

export function Layout({ children, showBottomNav = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="md:pl-64">
        {children}
      </div>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
