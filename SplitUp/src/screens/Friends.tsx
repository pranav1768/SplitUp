import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserPlus, Search, Mail, Check, X } from 'lucide-react';
import { getFriends, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../utils/api';
import { toast } from 'sonner';

export function Friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);
  
  useEffect(() => {
    loadFriends();
  }, []);
  
  const loadFriends = async () => {
    try {
      const { friends: friendsData } = await getFriends();
      setFriends(friendsData);
    } catch (error: any) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFriendEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }
    
    setSendingRequest(true);
    
    try {
      await sendFriendRequest(newFriendEmail);
      toast.success(`Friend request sent to ${newFriendEmail}`);
      setNewFriendEmail('');
      setShowAddFriend(false);
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast.error(error.message || 'Failed to send friend request');
    } finally {
      setSendingRequest(false);
    }
  };
  
  const handleAcceptRequest = async (friendId: string) => {
    try {
      await acceptFriendRequest(friendId);
      toast.success('Friend request accepted');
      loadFriends(); // Reload to update status
    } catch (error: any) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };
  
  const handleRejectRequest = async (friendId: string) => {
    try {
      await rejectFriendRequest(friendId);
      toast.success('Friend request rejected');
      loadFriends(); // Reload to update list
    } catch (error: any) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
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
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#111827]">Friends</h1>
          <Button onClick={() => setShowAddFriend(!showAddFriend)}>
            <UserPlus size={20} />
          </Button>
        </div>
        
        <div className="px-6 py-6 max-w-4xl mx-auto">
          {/* Add Friend Form */}
          {showAddFriend && (
            <Card className="mb-6 border-2 border-blue-100">
              <form onSubmit={handleAddFriend} className="space-y-4">
                <h3 className="font-semibold text-[#111827] flex items-center gap-2">
                  <Mail size={18} />
                  Add Friend by Email
                </h3>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="friend@example.com"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                    required
                    disabled={sendingRequest}
                  />
                  <Button type="submit" disabled={sendingRequest}>
                    {sendingRequest ? 'Sending...' : 'Send Invite'}
                  </Button>
                </div>
              </form>
            </Card>
          )}
          
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
            />
          </div>
          
          {/* Friends List */}
          {filteredFriends.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <UserPlus className="mx-auto mb-4 text-[#6B7280]" size={48} />
                <p className="text-[#6B7280] mb-4">No friends yet</p>
                <button 
                  onClick={() => setShowAddFriend(true)}
                  className="text-[#2563EB] font-medium hover:underline"
                >
                  Add your first friend
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFriends.map((friend) => (
                <Card key={friend.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                        {friend.name[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#111827]">{friend.name}</h3>
                        <p className="text-sm text-[#6B7280]">{friend.email}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {friend.phone && <p className="text-xs text-[#6B7280]">{friend.phone}</p>}
                          {friend.upiId && (
                            <p className="text-xs text-[#2563EB] font-medium">💳 {friend.upiId}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {friend.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptRequest(friend.id)}
                            className="p-2 bg-green-50 text-[#22C55E] rounded-lg hover:bg-green-100"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(friend.id)}
                            className="p-2 bg-red-50 text-[#EF4444] rounded-lg hover:bg-red-100"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : friend.balance === 0 ? (
                        <p className="text-sm text-[#6B7280] font-medium">Settled up</p>
                      ) : friend.balance > 0 ? (
                        <>
                          <p className="text-xs text-[#6B7280]">owes you</p>
                          <p className="font-semibold text-[#22C55E]">₹{friend.balance.toFixed(2)}</p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-[#6B7280]">you owe</p>
                          <p className="font-semibold text-[#EF4444]">₹{Math.abs(friend.balance).toFixed(2)}</p>
                        </>
                      )}
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