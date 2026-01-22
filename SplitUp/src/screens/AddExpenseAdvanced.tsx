import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { ArrowLeft, Check, Upload, Calendar, Tag, Repeat } from 'lucide-react';

const mockMembers = ['You', 'Alex', 'Sarah', 'Mike'];

const categories = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: 'bg-red-50 text-red-600' },
  { id: 'transport', name: 'Transportation', icon: '🚗', color: 'bg-yellow-50 text-yellow-600' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-purple-50 text-purple-600' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-50 text-pink-600' },
  { id: 'utilities', name: 'Utilities', icon: '⚡', color: 'bg-green-50 text-green-600' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-gray-50 text-gray-600' },
];

type SplitMethod = 'equal' | 'percentage' | 'exact';

export function AddExpenseAdvanced() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food');
  const [paidBy, setPaidBy] = useState('You');
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');
  const [splitWith, setSplitWith] = useState<string[]>(['You']);
  const [customSplits, setCustomSplits] = useState<Record<string, number>>({});
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  
  const handleToggleMember = (member: string) => {
    if (splitWith.includes(member)) {
      setSplitWith(splitWith.filter(m => m !== member));
    } else {
      setSplitWith([...splitWith, member]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(-1);
  };
  
  const calculateSplit = (member: string) => {
    if (!amount) return 0;
    const total = parseFloat(amount);
    
    if (splitMethod === 'equal') {
      return (total / splitWith.length).toFixed(2);
    } else if (splitMethod === 'percentage') {
      return ((total * (customSplits[member] || 0)) / 100).toFixed(2);
    } else {
      return (customSplits[member] || 0).toFixed(2);
    }
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
        <h1 className="text-2xl font-bold text-[#111827]">Add Expense</h1>
      </div>
      
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">Amount</label>
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
          
          {/* Description & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">
                <Calendar size={16} className="inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">
              <Tag size={16} className="inline mr-1" />
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-3 rounded-xl border-2 transition-all ${
                    category === cat.id
                      ? `border-[#2563EB] ${cat.color}`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">{cat.name.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">Paid by</label>
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
          
          {/* Split Method */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">Split method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSplitMethod('equal')}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  splitMethod === 'equal'
                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                    : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                }`}
              >
                Equal
              </button>
              <button
                type="button"
                onClick={() => setSplitMethod('percentage')}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  splitMethod === 'percentage'
                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                    : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() => setSplitMethod('exact')}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  splitMethod === 'exact'
                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-medium'
                    : 'border-gray-200 text-[#6B7280] hover:border-gray-300'
                }`}
              >
                Exact
              </button>
            </div>
          </div>
          
          {/* Split Between */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-3">Split between</label>
            <Card className="p-0 overflow-hidden">
              {mockMembers.map((member, index) => (
                <div
                  key={member}
                  className={`px-5 py-4 ${
                    index !== mockMembers.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => handleToggleMember(member)}
                      className="flex items-center gap-3 flex-1"
                    >
                      <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        splitWith.includes(member)
                          ? 'bg-[#2563EB] border-[#2563EB]'
                          : 'border-gray-300'
                      }`}>
                        {splitWith.includes(member) && (
                          <Check size={16} className="text-white" />
                        )}
                      </div>
                      <span className="text-[#111827] font-medium">{member}</span>
                    </button>
                    
                    {splitWith.includes(member) && splitMethod !== 'equal' && (
                      <input
                        type="number"
                        placeholder={splitMethod === 'percentage' ? '0%' : '₹0'}
                        value={customSplits[member] || ''}
                        onChange={(e) => setCustomSplits({
                          ...customSplits,
                          [member]: parseFloat(e.target.value) || 0
                        })}
                        className="w-24 px-3 py-2 text-right rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    )}
                  </div>
                  
                  {splitWith.includes(member) && (
                    <p className="text-sm text-[#6B7280] ml-9">
                      Pays: ₹{calculateSplit(member)}
                    </p>
                  )}
                </div>
              ))}
            </Card>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional details..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none"
            />
          </div>
          
          {/* Recurring */}
          <Card className="bg-gray-50">
            <button
              type="button"
              onClick={() => setIsRecurring(!isRecurring)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Repeat size={20} className="text-[#6B7280]" />
                <span className="font-medium text-[#111827]">Recurring Expense</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${
                isRecurring ? 'bg-[#2563EB]' : 'bg-gray-300'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  isRecurring ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </div>
            </button>
          </Card>
          
          {/* Attachment */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-[#2563EB] transition-colors cursor-pointer">
            <button type="button" className="w-full flex flex-col items-center gap-2 py-4">
              <Upload size={32} className="text-[#6B7280]" />
              <p className="font-medium text-[#111827]">Upload Receipt</p>
              <p className="text-sm text-[#6B7280]">JPG, PNG or PDF</p>
            </button>
          </Card>
          
          <Button type="submit" fullWidth className="mt-8">
            Save Expense
          </Button>
        </form>
      </div>
    </div>
  );
}
