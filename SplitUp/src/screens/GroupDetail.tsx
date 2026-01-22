import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, Plus } from 'lucide-react';

// Mock data
const mockExpenses = [
  { id: 1, description: 'Dinner at Italian restaurant', amount: 450, paidBy: 'You', date: 'Jan 18', splits: [{ name: 'You', amount: 150 }, { name: 'Alex', amount: 150 }, { name: 'Sarah', amount: 150 }] },
  { id: 2, description: 'Uber to restaurant', amount: 120, paidBy: 'Alex', date: 'Jan 18', splits: [{ name: 'You', amount: 40 }, { name: 'Alex', amount: 40 }, { name: 'Sarah', amount: 40 }] },
  { id: 3, description: 'Hotel booking', amount: 3000, paidBy: 'Sarah', date: 'Jan 17', splits: [{ name: 'You', amount: 1000 }, { name: 'Alex', amount: 1000 }, { name: 'Sarah', amount: 1000 }] },
];

export function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const groupName = 'Weekend Trip';
  const members = ['You', 'Alex', 'Sarah', 'Mike'];
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button 
          onClick={() => navigate('/groups')}
          className="mb-4 text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <h1 className="text-2xl font-bold text-[#111827] mb-3">{groupName}</h1>
        
        {/* Member Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {members.map((member, index) => (
              <div 
                key={index}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white flex items-center justify-center text-white text-sm font-medium"
              >
                {member[0]}
              </div>
            ))}
          </div>
          <span className="text-sm text-[#6B7280] ml-2">{members.length} members</span>
        </div>
      </div>
      
      <div className="px-6 py-6 max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            variant="secondary"
            onClick={() => navigate('/add-expense')}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Expense
          </Button>
          <Button onClick={() => navigate(`/groups/${id}/settle`)}>
            Settle Up
          </Button>
        </div>
        
        {/* Expenses List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#111827] mb-4">Expenses</h2>
          
          <div className="space-y-3">
            {mockExpenses.map((expense) => (
              <Card key={expense.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-[#111827]">{expense.description}</p>
                    <p className="text-sm text-[#6B7280] mt-1">Paid by {expense.paidBy} • {expense.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#111827]">₹{expense.amount}</p>
                  </div>
                </div>
                
                {/* Split details */}
                <div className="pt-3 border-t border-gray-100 space-y-1">
                  {expense.splits.map((split, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">{split.name}</span>
                      <span className="text-[#6B7280]">₹{split.amount}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
