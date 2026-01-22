import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { ArrowLeft, X, UserPlus, Search } from 'lucide-react';
import { createGroup, getFriends, searchUsers } from '../utils/api';
import { toast } from 'sonner';

export function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  
  useEffect(() => {
    loadFriends();
  }, []);
  
  const loadFriends = async () => {
    try {
      const { friends: friendsData } = await getFriends();
      setFriends(friendsData.filter((f: any) => f.status === 'active'));
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    setSearching(true);
    try {
      const { users } = await searchUsers(searchQuery);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };
  
  const handleAddMember = (member: any) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }
    
    setLoading(true);
    
    try {
      const memberIds = selectedMembers.map(m => m.id);
      await createGroup(groupName, memberIds);
      toast.success('Group created successfully!');
      navigate('/groups');
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button 
          onClick={() => navigate('/groups')}
          className="mb-4 text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#111827]">Create New Group</h1>
      </div>
      
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            label="Group Name"
            placeholder="e.g., Weekend Trip, Roommates"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            disabled={loading}
          />
          
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              Add Members
            </label>
            
            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
                <input
                  type="text"
                  placeholder="Search by email, phone, or UPI ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <Button 
                type="button"
                onClick={handleSearch}
                disabled={loading || searching}
              >
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card className="mb-4">
                <p className="text-sm font-medium text-[#6B7280] mb-2">Search Results</p>
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[#111827]">{user.name}</p>
                        <p className="text-sm text-[#6B7280]">{user.email}</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleAddMember(user)}
                        className="text-sm"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Friends List */}
            {friends.length > 0 && searchResults.length === 0 && !searchQuery && (
              <Card className="mb-4">
                <p className="text-sm font-medium text-[#6B7280] mb-2">Your Friends</p>
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[#111827]">{friend.name}</p>
                        <p className="text-sm text-[#6B7280]">{friend.email}</p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleAddMember(friend)}
                        className="text-sm"
                        disabled={selectedMembers.find(m => m.id === friend.id)}
                      >
                        {selectedMembers.find(m => m.id === friend.id) ? 'Added' : 'Add'}
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            
            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <Card className="p-0 overflow-hidden">
                <p className="text-sm font-medium text-[#6B7280] px-4 pt-3 pb-2">Selected Members</p>
                {selectedMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between px-4 py-3 ${
                      index !== selectedMembers.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div>
                      <p className="font-medium text-[#111827]">{member.name}</p>
                      <p className="text-sm text-[#6B7280]">{member.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-[#EF4444] hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </Card>
            )}
            
            <p className="text-sm text-[#6B7280] mt-2">
              {selectedMembers.length} {selectedMembers.length === 1 ? 'member' : 'members'} added
            </p>
          </div>
          
          <Button type="submit" fullWidth className="mt-8" disabled={loading}>
            {loading ? 'Creating...' : 'Create Group'}
          </Button>
        </form>
      </div>
    </div>
  );
}