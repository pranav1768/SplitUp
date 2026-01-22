import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowDownUp, Sparkles } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA]">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-300">
              <div className="relative">
                <ArrowDownUp size={44} className="text-[#2563EB]" strokeWidth={2.5} />
                <Sparkles size={20} className="text-[#60A5FA] absolute -top-2 -right-2" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-green-400 rounded-full opacity-80"></div>
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">SplitUp</h1>
        
        {/* Tagline */}
        <p className="text-xl text-blue-100 mb-12">Split bills. Settle smart.</p>
        
        {/* Buttons */}
        <div className="space-y-4 max-w-sm mx-auto">
          <button
            onClick={() => navigate('/register')}
            className="w-full px-6 py-3 rounded-xl bg-white text-[#2563EB] hover:bg-gray-50 shadow-xl font-semibold transition-all duration-200 active:scale-95"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 font-semibold transition-all duration-200 active:scale-95"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}