import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  Bell, 
  Globe, 
  CreditCard, 
  Shield, 
  Download,
  ChevronRight,
  Check,
  Smartphone,
  Copy
} from 'lucide-react';

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('INR');
  const [upiId, setUpiId] = useState('yourupi@oksbi');
  const [isEditingUPI, setIsEditingUPI] = useState(false);
  
  const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD'];
  
  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    alert('UPI ID copied!');
  };
  
  const handleSaveUPI = () => {
    setIsEditingUPI(false);
    alert('UPI ID updated successfully!');
  };
  
  return (
    <Layout>
      <div className="pb-20 md:pb-8">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>
        </div>
        
        <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
          {/* Account Settings */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Account</h2>
            <Card className="space-y-4">
              <div>
                <Input
                  label="Name"
                  type="text"
                  value="John Doe"
                />
              </div>
              <div>
                <Input
                  label="Email"
                  type="email"
                  value="john.doe@example.com"
                />
              </div>
              <div>
                <Input
                  label="Phone"
                  type="tel"
                  value="+91 98765 43210"
                />
              </div>
              <Button fullWidth>Update Profile</Button>
            </Card>
          </div>
          
          {/* Notifications */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Notifications</h2>
            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-[#6B7280]" />
                  <div>
                    <p className="font-medium text-[#111827]">Push Notifications</p>
                    <p className="text-sm text-[#6B7280]">Get notified about expenses and settlements</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? 'bg-[#2563EB]' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </Card>
          </div>
          
          {/* Currency */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Currency</h2>
            <Card className="p-0 overflow-hidden">
              {currencies.map((curr, index) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors ${
                    index !== currencies.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-[#6B7280]" />
                    <span className="font-medium text-[#111827]">{curr}</span>
                  </div>
                  {currency === curr && (
                    <Check size={20} className="text-[#2563EB]" />
                  )}
                </button>
              ))}
            </Card>
          </div>
          
          {/* Payment Settings */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Payment Settings</h2>
            <Card>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone size={20} className="text-[#6B7280]" />
                  <h3 className="font-medium text-[#111827]">UPI ID</h3>
                </div>
                
                {isEditingUPI ? (
                  <div className="space-y-3">
                    <Input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleSaveUPI} className="flex-1">
                        Save
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={() => setIsEditingUPI(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-mono font-semibold text-[#111827]">{upiId}</p>
                      <button
                        onClick={handleCopyUPI}
                        className="flex items-center gap-1 text-[#2563EB] text-sm hover:underline"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={() => setIsEditingUPI(true)}
                      fullWidth
                    >
                      Edit UPI ID
                    </Button>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-[#6B7280] mb-3">Preferred Payment Apps</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-500 rounded-md"></div>
                      <span className="text-sm font-medium">Google Pay</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg">
                      <div className="w-6 h-6 bg-purple-600 rounded-md"></div>
                      <span className="text-sm font-medium">PhonePe</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
                      <span className="text-sm font-medium">Paytm</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg">
                      <div className="w-6 h-6 bg-orange-500 rounded-md"></div>
                      <span className="text-sm font-medium">BHIM</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Data & Privacy */}
          <div>
            <h2 className="text-lg font-semibold text-[#111827] mb-3">Data & Privacy</h2>
            <Card className="space-y-3">
              <button className="w-full flex items-center justify-between py-2 hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-3">
                  <Download size={20} className="text-[#6B7280]" />
                  <span className="font-medium text-[#111827]">Export Data</span>
                </div>
                <ChevronRight size={20} className="text-[#6B7280]" />
              </button>
              
              <button className="w-full flex items-center justify-between py-2 hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-3">
                  <Shield size={20} className="text-[#6B7280]" />
                  <span className="font-medium text-[#111827]">Privacy Policy</span>
                </div>
                <ChevronRight size={20} className="text-[#6B7280]" />
              </button>
              
              <button className="w-full flex items-center justify-between py-2 hover:opacity-70 transition-opacity">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-[#6B7280]" />
                  <span className="font-medium text-[#111827]">Terms of Service</span>
                </div>
                <ChevronRight size={20} className="text-[#6B7280]" />
              </button>
            </Card>
          </div>
          
          {/* Danger Zone */}
          <div>
            <h2 className="text-lg font-semibold text-[#EF4444] mb-3">Danger Zone</h2>
            <Card>
              <Button 
                className="bg-[#EF4444] hover:bg-[#DC2626]"
                fullWidth
              >
                Delete Account
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}