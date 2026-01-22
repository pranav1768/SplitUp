import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft } from 'lucide-react';
import { signup, login } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await signup(email, password, name, phone || undefined, upiId || undefined);
      toast.success('Account created successfully!');
      
      // Auto login after signup
      await login(email, password);
      await refreshUser();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-8">
      <button 
        onClick={() => navigate('/')}
        className="mb-8 text-[#6B7280] hover:text-[#111827] transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Create account</h1>
        <p className="text-[#6B7280] mb-8">Start splitting bills with friends</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="text"
            label="Name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
          
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          <Input
            type="tel"
            label="Phone (Optional)"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
          
          <Input
            type="text"
            label="UPI ID (Optional)"
            placeholder="yourname@upi"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            disabled={loading}
          />
          
          <Input
            type="password"
            label="Password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <Button type="submit" fullWidth className="mt-6" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-[#6B7280]">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="text-[#2563EB] font-medium hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}