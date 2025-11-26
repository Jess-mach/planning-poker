import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`button button--${variant} button--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

