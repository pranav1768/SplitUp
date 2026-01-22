import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { ArrowLeft, Phone, Mail, Scan, UserPlus } from 'lucide-react';

export function AddByPhone() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<'phone' | 'email' | 'upi'>('phone');
  const [searchValue, setSearchValue] = useState('');
  const [foundUser, setFoundUser] = useState<any>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock search result
    setFoundUser({
      name: 'Alex Johnson',
      phone: searchValue,
      email: 'alex@example.com',
      upiId: 'alex@paytm'
    });
  };
  
  const handleAddFriend = () => {
    alert('Friend added successfully!');
    navigate('/friends');
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#111827]">Add Friend</h1>
        <p className="text-[#6B7280] mt-1">Search by phone, email, or UPI ID</p>
      </div>
      
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* Search Type Selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setSearchType('phone')}
            className={`px-4 py-3 rounded-xl border-2 transition-all ${
              searchType === 'phone'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
            }`}
          >
            <Phone size={20} className="mx-auto mb-1" />
            <span className="text-sm">Phone</span>
          </button>
          
          <button
            onClick={() => setSearchType('email')}
            className={`px-4 py-3 rounded-xl border-2 transition-all ${
              searchType === 'email'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
            }`}
          >
            <Mail size={20} className="mx-auto mb-1" />
            <span className="text-sm">Email</span>
          </button>
          
          <button
            onClick={() => setSearchType('upi')}
            className={`px-4 py-3 rounded-xl border-2 transition-all ${
              searchType === 'upi'
                ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
            }`}
          >
            <Scan size={20} className="mx-auto mb-1" />
            <span className="text-sm">UPI ID</span>
          </button>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <Input
              type={searchType === 'email' ? 'email' : 'text'}
              placeholder={
                searchType === 'phone' 
                  ? '+91 98765 43210' 
                  : searchType === 'email'
                  ? 'friend@example.com'
                  : 'username@upi'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              required
            />
            <Button type="submit" className="whitespace-nowrap">
              Search
            </Button>
          </div>
        </form>
        
        {/* Search Result */}
        {foundUser && (
          <Card className="border-2 border-blue-100 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl font-semibold">
                  {foundUser.name[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">{foundUser.name}</h3>
                  <p className="text-sm text-[#6B7280]">{foundUser.phone}</p>
                  <p className="text-sm text-[#6B7280]">{foundUser.email}</p>
                  {foundUser.upiId && (
                    <p className="text-sm text-[#2563EB] font-medium mt-1">
                      💳 {foundUser.upiId}
                    </p>
                  )}
                </div>
              </div>
              
              <Button onClick={handleAddFriend}>
                <UserPlus size={18} className="mr-2" />
                Add
              </Button>
            </div>
          </Card>
        )}
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-[#6B7280] mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <button className="w-full flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Scan size={20} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Scan QR Code</p>
                  <p className="text-sm text-[#6B7280]">Add friend by scanning their QR</p>
                </div>
              </button>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <button className="w-full flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Phone size={20} className="text-[#22C55E]" />
                </div>
                <div>
                  <p className="font-medium text-[#111827]">Import from Contacts</p>
                  <p className="text-sm text-[#6B7280]">Find friends from your phone</p>
                </div>
              </button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
