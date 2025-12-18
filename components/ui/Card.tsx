import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
    variant?: 'elevated' | 'outlined' | 'flat';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'elevated',
    padding = 'md',
    className = '',
    ...props
}) => {
    const getStyles = () => {
        let base = "rounded-2xl";

        // Variants - Dark mode optimized
        if (variant === 'elevated') base += " bg-card border border-border shadow-sm";
        else if (variant === 'outlined') base += " bg-transparent border border-border";
        else if (variant === 'flat') base += " bg-muted";

        // Padding
        if (padding === 'sm') base += " p-3";
        else if (padding === 'md') base += " p-4";
        else if (padding === 'lg') base += " p-6";

        return base;
    };

    return (
        <View className={`${getStyles()} ${className}`} {...props}>
            {children}
        </View>
    );
};
