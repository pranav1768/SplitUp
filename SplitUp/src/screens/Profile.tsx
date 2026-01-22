import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Settings, LogOut, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { logout, getGroups, getExpenses, getFriends } from '../utils/api';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState({ groups: 0, expenses: 0, friends: 0 });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const [groupsData, expensesData, friendsData] = await Promise.all([
        getGroups(),
        getExpenses(),
        getFriends()
      ]);
      
      setStats({
        groups: groupsData.groups.length,
        expenses: expensesData.expenses.length,
        friends: friendsData.friends.filter((f: any) => f.status === 'active').length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to logout');
    }
  };
  
  if (!user) return null;
  
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
  
  return (
    <Layout>
      <div className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-[#111827]">Profile</h1>
        </div>
        
        <div className="px-6 py-6 max-w-2xl mx-auto">
          {/* Profile Info Card */}
          <Card className="mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#111827]">{user.name}</h2>
                <p className="text-[#6B7280]">Member since {memberSince}</p>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-[#6B7280]" />
                <span className="text-[#111827]">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-[#6B7280]" />
                  <span className="text-[#111827]">{user.phone}</span>
                </div>
              )}
              {user.upiId && (
                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-[#6B7280]" />
                  <span className="text-[#111827]">{user.upiId}</span>
                </div>
              )}
            </div>
          </Card>
          
          {/* Stats Cards */}
          {loading ? (
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="text-center">
                  <div className="w-12 h-8 bg-gray-200 animate-pulse rounded mx-auto"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="text-center">
                <p className="text-2xl font-bold text-[#2563EB]">{stats.groups}</p>
                <p className="text-sm text-[#6B7280] mt-1">Groups</p>
              </Card>
              <Card className="text-center">
                <p className="text-2xl font-bold text-[#2563EB]">{stats.expenses}</p>
                <p className="text-sm text-[#6B7280] mt-1">Expenses</p>
              </Card>
              <Card className="text-center">
                <p className="text-2xl font-bold text-[#2563EB]">{stats.friends}</p>
                <p className="text-sm text-[#6B7280] mt-1">Friends</p>
              </Card>
            </div>
          )}
          
          {/* Actions */}
          <div className="space-y-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <button 
                onClick={() => navigate('/settings')}
                className="w-full flex items-center gap-3 text-left"
              >
                <Settings size={20} className="text-[#6B7280]" />
                <span className="font-medium text-[#111827]">Settings</span>
              </button>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 text-left">
                <LogOut size={20} className="text-[#EF4444]" />
                <span className="font-medium text-[#EF4444]">Logout</span>
              </button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}