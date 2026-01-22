import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Layout } from '../components/Layout';
import { Users, ChevronRight, Plus } from 'lucide-react';
import { getGroups } from '../utils/api';
import { toast } from 'sonner';

export function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchGroups();
  }, []);
  
  const fetchGroups = async () => {
    try {
      const { groups: groupsData } = await getGroups();
      setGroups(groupsData);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#111827]">Groups</h1>
          <button 
            onClick={() => navigate('/create-group')}
            className="flex items-center gap-2 text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Create</span>
          </button>
        </div>
        
        <div className="px-6 py-6 max-w-4xl mx-auto">
          {groups.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <Users className="mx-auto mb-4 text-[#6B7280]" size={48} />
                <p className="text-[#6B7280] mb-4">No groups yet</p>
                <button 
                  onClick={() => navigate('/create-group')}
                  className="text-[#2563EB] font-medium hover:underline"
                >
                  Create your first group
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <Card 
                  key={group.id}
                  onClick={() => navigate(`/groups/${group.id}`)}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center">
                          <Users className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#111827]">{group.name}</h3>
                          <p className="text-sm text-[#6B7280]">{group.members} members</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {group.balance === 0 ? (
                          <p className="text-sm text-[#6B7280] font-medium">Settled up</p>
                        ) : group.balance > 0 ? (
                          <>
                            <p className="text-xs text-[#6B7280]">You get</p>
                            <p className="font-semibold text-[#22C55E]">₹{group.balance.toFixed(2)}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-[#6B7280]">You owe</p>
                            <p className="font-semibold text-[#EF4444]">₹{Math.abs(group.balance).toFixed(2)}</p>
                          </>
                        )}
                      </div>
                      <ChevronRight className="text-[#6B7280]" size={20} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}