import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', expenses: 4500, settlements: 2000 },
  { month: 'Feb', expenses: 3200, settlements: 1500 },
  { month: 'Mar', expenses: 5100, settlements: 3200 },
  { month: 'Apr', expenses: 4800, settlements: 2800 },
  { month: 'May', expenses: 6200, settlements: 4100 },
];

const categoryData = [
  { name: 'Food & Dining', value: 12500, color: '#EF4444' },
  { name: 'Transportation', value: 8200, color: '#F59E0B' },
  { name: 'Entertainment', value: 6800, color: '#8B5CF6' },
  { name: 'Shopping', value: 9500, color: '#EC4899' },
  { name: 'Utilities', value: 5200, color: '#10B981' },
];

export function Statistics() {
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const totalSettlements = monthlyData.reduce((sum, m) => sum + m.settlements, 0);
  const avgExpensePerMonth = (totalExpenses / monthlyData.length).toFixed(0);
  
  return (
    <Layout>
      <div className="pb-20 md:pb-8">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-[#111827]">Statistics</h1>
          <p className="text-[#6B7280] mt-1">Your spending insights</p>
        </div>
        
        <div className="px-6 py-6 max-w-6xl mx-auto space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-[#2563EB]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Total Expenses</p>
                  <p className="text-xl font-bold text-[#111827]">₹{totalExpenses}</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-[#22C55E]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Settlements</p>
                  <p className="text-xl font-bold text-[#111827]">₹{totalSettlements}</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-l-4 border-purple-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Calendar className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Avg/Month</p>
                  <p className="text-xl font-bold text-[#111827]">₹{avgExpensePerMonth}</p>
                </div>
              </div>
            </Card>
            
            <Card className="border-l-4 border-red-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <TrendingDown className="text-[#EF4444]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#6B7280]">Outstanding</p>
                  <p className="text-xl font-bold text-[#111827]">₹{totalExpenses - totalSettlements}</p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Monthly Trends */}
          <Card>
            <h2 className="text-lg font-semibold text-[#111827] mb-4">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="expenses" fill="#2563EB" radius={[8, 8, 0, 0]} />
                <Bar dataKey="settlements" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-lg font-semibold text-[#111827] mb-4">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            
            <Card>
              <h2 className="text-lg font-semibold text-[#111827] mb-4">Category Details</h2>
              <div className="space-y-3">
                {categoryData.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-[#111827]">{category.name}</span>
                    </div>
                    <span className="font-semibold text-[#111827]">₹{category.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
