import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-[#2563EB] text-white rounded-full shadow-lg hover:bg-[#1D4ED8] active:scale-95 transition-all duration-200 flex items-center justify-center z-50"
    >
      <Plus size={24} />
    </button>
  );
}