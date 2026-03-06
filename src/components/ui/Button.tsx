import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = 'font-body font-medium rounded-button transition-all duration-200 hover:animate-hover-lift';

    const variants = {
        primary: 'bg-secondary text-background-base hover:bg-secondary-hover',
        secondary: 'bg-brand-primary text-text-primary hover:bg-brand-primary-hover',
        outline: 'border-2 border-secondary text-secondary hover:bg-secondary/10'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};