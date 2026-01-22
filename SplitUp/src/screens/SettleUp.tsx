import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowLeft, ArrowRight, CheckCircle, Copy, ExternalLink, QrCode } from 'lucide-react';
import { useState } from 'react';

// Mock settlement data
const settlements = [
  { id: 1, from: 'You', to: 'Sarah', amount: 1040, status: 'pending', upiId: 'sarah@paytm', phone: '+91 98765 43210' },
  { id: 2, from: 'Alex', to: 'You', amount: 210, status: 'pending', upiId: 'yourupi@oksbi', phone: '+91 98765 00000' },
  { id: 3, from: 'Mike', to: 'Sarah', amount: 500, status: 'pending', upiId: 'sarah@paytm', phone: '+91 98765 43210' },
];

export function SettleUp() {
  const navigate = useNavigate();
  const [showPaymentOptions, setShowPaymentOptions] = useState<number | null>(null);
  
  const handleMarkSettled = (id: number) => {
    alert('Payment marked as settled!');
  };
  
  const handleCopyUPI = (upiId: string) => {
    navigator.clipboard.writeText(upiId);
    alert(`UPI ID copied: ${upiId}`);
  };
  
  const handlePaymentApp = (app: string, upiId: string, amount: number) => {
    // In a real app, this would open the payment app with pre-filled details
    alert(`Opening ${app} to pay ${upiId} ₹${amount}`);
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
        <h1 className="text-2xl font-bold text-[#111827]">Settle Up</h1>
        <p className="text-[#6B7280] mt-1">Simplified settlements for your group</p>
      </div>
      
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* Info Card */}
        <Card className="bg-blue-50 border-2 border-blue-100 mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                <CheckCircle className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-[#111827] mb-1">Minimized settlements</h3>
              <p className="text-sm text-[#6B7280]">
                We've optimized the payments to minimize the number of transactions needed to settle all balances.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Settlements List */}
        <div className="space-y-3">
          {settlements.map((settlement) => (
            <Card key={settlement.id} className="border-2 border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  {/* From */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                      {settlement.from[0]}
                    </div>
                    <span className="font-medium text-[#111827]">{settlement.from}</span>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRight className="text-[#2563EB] flex-shrink-0" size={24} />
                  
                  {/* To */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white font-semibold">
                      {settlement.to[0]}
                    </div>
                    <span className="font-medium text-[#111827]">{settlement.to}</span>
                  </div>
                </div>
              </div>
              
              {/* Amount */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#2563EB]">₹{settlement.amount}</span>
                  
                  {settlement.from === 'You' && (
                    <button
                      onClick={() => setShowPaymentOptions(showPaymentOptions === settlement.id ? null : settlement.id)}
                      className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
                    >
                      Pay Now
                    </button>
                  )}
                  
                  {settlement.to === 'You' && (
                    <Button variant="secondary" onClick={() => handleMarkSettled(settlement.id)}>
                      Confirm Received
                    </Button>
                  )}
                </div>
                
                {/* UPI Details */}
                {settlement.upiId && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#6B7280]">UPI ID</span>
                      <button
                        onClick={() => handleCopyUPI(settlement.upiId)}
                        className="flex items-center gap-1 text-[#2563EB] text-sm hover:underline"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                    <p className="font-mono font-semibold text-[#111827]">{settlement.upiId}</p>
                  </div>
                )}
                
                {/* Payment Apps - Only show if "Pay Now" is clicked */}
                {showPaymentOptions === settlement.id && settlement.from === 'You' && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3 animate-fadeIn">
                    <p className="text-sm font-medium text-[#111827] mb-3">Choose Payment App</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePaymentApp('Google Pay', settlement.upiId, settlement.amount)}
                        className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          G
                        </div>
                        <span className="font-medium text-[#111827]">Google Pay</span>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentApp('PhonePe', settlement.upiId, settlement.amount)}
                        className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          Pe
                        </div>
                        <span className="font-medium text-[#111827]">PhonePe</span>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentApp('Paytm', settlement.upiId, settlement.amount)}
                        className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          PT
                        </div>
                        <span className="font-medium text-[#111827]">Paytm</span>
                      </button>
                      
                      <button
                        onClick={() => handlePaymentApp('BHIM', settlement.upiId, settlement.amount)}
                        className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          BH
                        </div>
                        <span className="font-medium text-[#111827]">BHIM</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => alert('Showing QR Code for UPI payment')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <QrCode size={20} className="text-[#2563EB]" />
                      <span className="font-medium text-[#111827]">Show QR Code</span>
                    </button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        
        {/* Summary */}
        <Card className="mt-6 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-[#6B7280] mb-1">Total to settle</p>
            <p className="text-3xl font-bold text-[#111827]">₹{settlements.reduce((sum, s) => sum + s.amount, 0)}</p>
            <p className="text-sm text-[#6B7280] mt-2">
              {settlements.length} {settlements.length === 1 ? 'payment' : 'payments'} to complete
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}