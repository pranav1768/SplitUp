import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Filter, Calendar, Users, TrendingUp, TrendingDown } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'expense', date: '2026-01-19', group: 'Weekend Trip', description: 'Dinner', amount: 450, paidBy: 'You', icon: TrendingDown },
  { id: 2, type: 'settlement', date: '2026-01-18', from: 'Alex', to: 'You', amount: 200, icon: TrendingUp },
  { id: 3, type: 'expense', date: '2026-01-17', group: 'Roommates', description: 'Groceries', amount: 1200, paidBy: 'Sarah', icon: TrendingDown },
  { id: 4, type: 'group_created', date: '2026-01-17', group: 'Movie Night', members: 4, icon: Users },
  { id: 5, type: 'expense', date: '2026-01-16', group: 'Weekend Trip', description: 'Hotel', amount: 3000, paidBy: 'Mike', icon: TrendingDown },
  { id: 6, type: 'settlement', date: '2026-01-15', from: 'You', to: 'Sarah', amount: 500, icon: TrendingDown },
];

export function Activity() {
  const [filter, setFilter] = useState<'all' | 'expenses' | 'settlements'>('all');
  
  const filteredActivities = mockActivities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'expenses') return activity.type === 'expense';
    if (filter === 'settlements') return activity.type === 'settlement';
    return true;
  });
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <Layout>
      <div className="pb-20 md:pb-8">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-[#111827]">Activity</h1>
        </div>
        
        <div className="px-6 py-6 max-w-4xl mx-auto">
          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                filter === 'all'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-[#6B7280] border border-gray-200 hover:border-gray-300'
              }`}
            >
              All Activity
            </button>
            <button
              onClick={() => setFilter('expenses')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                filter === 'expenses'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-[#6B7280] border border-gray-200 hover:border-gray-300'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilter('settlements')}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                filter === 'settlements'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-[#6B7280] border border-gray-200 hover:border-gray-300'
              }`}
            >
              Settlements
            </button>
          </div>
          
          {/* Activity Timeline */}
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <Card key={activity.id}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'settlement' && activity.to === 'You'
                        ? 'bg-green-50 text-[#22C55E]'
                        : activity.type === 'settlement'
                        ? 'bg-red-50 text-[#EF4444]'
                        : activity.type === 'group_created'
                        ? 'bg-blue-50 text-[#2563EB]'
                        : 'bg-gray-50 text-[#6B7280]'
                    }`}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1">
                      {activity.type === 'expense' && (
                        <>
                          <p className="font-medium text-[#111827]">{activity.description}</p>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {activity.paidBy} paid ₹{activity.amount} in {activity.group}
                          </p>
                        </>
                      )}
                      
                      {activity.type === 'settlement' && (
                        <>
                          <p className="font-medium text-[#111827]">Payment settled</p>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {activity.from} paid {activity.to} ₹{activity.amount}
                          </p>
                        </>
                      )}
                      
                      {activity.type === 'group_created' && (
                        <>
                          <p className="font-medium text-[#111827]">Group created</p>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {activity.group} with {activity.members} members
                          </p>
                        </>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-[#6B7280]">
                        <Calendar size={14} />
                        {formatDate(activity.date)}
                      </div>
                    </div>
                    
                    {activity.type === 'expense' && (
                      <div className="text-right">
                        <p className="font-semibold text-[#111827]">₹{activity.amount}</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
