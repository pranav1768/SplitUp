import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft } from 'lucide-react';
import { login } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(email, password);
      await refreshUser();
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
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
        <h1 className="text-3xl font-bold text-[#111827] mb-2">Welcome back</h1>
        <p className="text-[#6B7280] mb-8">Login to manage your expenses</p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          
          <div className="flex justify-end">
            <button 
              type="button"
              className="text-sm text-[#2563EB] hover:underline"
            >
              Forgot password?
            </button>
          </div>
          
          <Button type="submit" fullWidth className="mt-6" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <p className="text-center mt-6 text-[#6B7280]">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')}
            className="text-[#2563EB] font-medium hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}