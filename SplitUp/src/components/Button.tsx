interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  className = '',
  fullWidth = false
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-xl transition-all duration-200 font-medium";
  
  const variantStyles = {
    primary: "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:scale-95",
    secondary: "bg-white text-[#2563EB] border-2 border-[#2563EB] hover:bg-[#F9FAFB] active:scale-95"
  };
  
  const widthStyle = fullWidth ? "w-full" : "";
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
}