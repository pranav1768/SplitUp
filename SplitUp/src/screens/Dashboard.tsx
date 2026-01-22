import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Layout } from '../components/Layout';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { ArrowUpRight, ArrowDownLeft, Users, TrendingUp } from 'lucide-react';
import { getBalances, getExpenses } from '../utils/api';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const [balances, setBalances] = useState({ totalOwed: 0, totalOwing: 0, netBalance: 0 });
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [balancesData, expensesData] = await Promise.all([
        getBalances(),
        getExpenses()
      ]);
      
      setBalances(balancesData);
      setRecentExpenses(expensesData.expenses.slice(0, 5)); // Get last 5
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#6B7280]">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="pb-20 md:pb-8">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        </div>
        
        <div className="px-6 py-6 max-w-4xl mx-auto">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="border-2 border-red-100">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="text-[#EF4444]" size={20} />
                <span className="text-sm text-[#6B7280]">You Owe</span>
              </div>
              <p className="text-2xl font-bold text-[#EF4444]">₹{balances.totalOwing.toFixed(0)}</p>
            </Card>
            
            <Card className="border-2 border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDownLeft className="text-[#22C55E]" size={20} />
                <span className="text-sm text-[#6B7280]">You Get</span>
              </div>
              <p className="text-2xl font-bold text-[#22C55E]">₹{balances.totalOwed.toFixed(0)}</p>
            </Card>
            
            <Card 
              className="border-2 border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/statistics')}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-[#2563EB]" size={20} />
                <span className="text-sm text-[#6B7280]">Net Balance</span>
              </div>
              <p className={`text-2xl font-bold ${balances.netBalance >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                ₹{Math.abs(balances.netBalance).toFixed(0)}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">View Stats →</p>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Recent Activity</h2>
            
            {recentExpenses.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <p className="text-[#6B7280]">No expenses yet</p>
                  <p className="text-sm text-[#6B7280] mt-2">Add your first expense to get started!</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map((expense) => (
                  <Card key={expense.id} onClick={() => navigate(`/groups/${expense.groupId}`)}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={16} className="text-[#2563EB]" />
                          <span className="text-sm text-[#6B7280]">{expense.groupName}</span>
                        </div>
                        <p className="font-medium text-[#111827]">{expense.description}</p>
                        <p className="text-sm text-[#6B7280] mt-1">
                          Paid by {expense.paidByName} • {formatDate(expense.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#111827]">₹{expense.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <FloatingActionButton onClick={() => navigate('/add-expense')} />
      </div>
    </Layout>
  );
}