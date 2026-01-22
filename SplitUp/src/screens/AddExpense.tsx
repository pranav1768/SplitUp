import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { ArrowLeft, Check } from 'lucide-react';

// Mock data
const mockMembers = ['You', 'Alex', 'Sarah', 'Mike'];

export function AddExpense() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [splitWith, setSplitWith] = useState<string[]>(['You']);
  
  const handleToggleMember = (member: string) => {
    if (splitWith.includes(member)) {
      setSplitWith(splitWith.filter(m => m !== member));
    } else {
      setSplitWith([...splitWith, member]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - redirect back
    navigate(-1);
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="mb-4 text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-[#111827]">Add Expense</h1>
      </div>
      
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input - Large */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-[#6B7280]">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className="w-full pl-12 pr-4 py-4 text-3xl font-semibold rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* Description */}
          <Input
            type="text"
            label="Description"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          
          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              Paid by
            </label>
            <div className="grid grid-cols-2 gap-2">
              {mockMembers.map((member) => (
                <button
                  key={member}
                  type="button"
                  onClick={() => setPaidBy(member)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    paidBy === member
                      ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                      : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                  }`}
                >
                  {member}
                </button>
              ))}
            </div>
          </div>
          
          {/* Split Between */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              Split between
            </label>
            <Card className="p-0 overflow-hidden">
              {mockMembers.map((member, index) => (
                <button
                  key={member}
                  type="button"
                  onClick={() => handleToggleMember(member)}
                  className={`w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    index !== mockMembers.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <span className="text-[#111827] font-medium">{member}</span>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                    splitWith.includes(member)
                      ? 'bg-[#4F46E5] border-[#4F46E5]'
                      : 'border-gray-300'
                  }`}>
                    {splitWith.includes(member) && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                </button>
              ))}
            </Card>
            <p className="text-sm text-[#6B7280] mt-2">
              Split equally among {splitWith.length} {splitWith.length === 1 ? 'person' : 'people'}
              {amount && splitWith.length > 0 && (
                <span className="font-medium text-[#111827]">
                  {' '}• ₹{(parseFloat(amount) / splitWith.length).toFixed(2)} each
                </span>
              )}
            </p>
          </div>
          
          <Button type="submit" fullWidth className="mt-8">
            Save Expense
          </Button>
        </form>
      </div>
    </div>
  );
}