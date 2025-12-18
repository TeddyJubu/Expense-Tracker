import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography } from './Typography';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    className?: string; // Additional classes
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    className = '',
}) => {
    const handlePress = () => {
        if (disabled || loading) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
    };

    const getContainerStyles = () => {
        let base = "flex-row items-center justify-center rounded-xl";

        // Variants
        if (variant === 'primary') base += " bg-primary";
        else if (variant === 'secondary') base += " bg-surface border border-secondary/20";
        else if (variant === 'ghost') base += " bg-transparent";
        else if (variant === 'danger') base += " bg-danger"; // Assuming 'danger' color is defined

        // Sizes
        if (size === 'sm') base += " px-3 py-2";
        else if (size === 'md') base += " px-4 py-3";
        else if (size === 'lg') base += " px-6 py-4";

        // State
        if (disabled) base += " opacity-50";

        return base;
    };

    const getTextVariant = () => {
        if (variant === 'primary' || variant === 'danger') return "text-white font-bold";
        if (variant === 'secondary') return "text-primary font-medium";
        return "text-primary font-medium";
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className={`${getContainerStyles()} ${className}`}
            activeOpacity={0.7}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? 'white' : 'black'} />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    <Typography className={getTextVariant()}>
                        {title}
                    </Typography>
                </>
            )}
        </TouchableOpacity>
    );
};
