import React, { useState } from 'react';
import { TextInput, View, TextInputProps, TouchableOpacity } from 'react-native';
import { Typography } from './Typography';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    rightElement?: React.ReactNode;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    rightElement,
    containerClassName = '',
    className = '',
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus && onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur && onBlur(e);
    };

    return (
        <View className={`mb-4 ${containerClassName}`}>
            {label && (
                <Typography variant="label" className="mb-2 ml-1 text-secondary">
                    {label}
                </Typography>
            )}

            <View
                className={`
          flex-row items-center bg-surface px-4 py-3 rounded-xl border
          ${error ? 'border-danger' : isFocused ? 'border-primary' : 'border-transparent'}
        `}
            >
                {icon && <View className="mr-3">{icon}</View>}

                <TextInput
                    className={`flex-1 text-base text-primary font-sans ${className}`}
                    placeholderTextColor="#9CA3AF"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...props}
                />

                {rightElement && <View className="ml-2">{rightElement}</View>}
            </View>

            {error && (
                <Typography variant="caption" className="mt-1 ml-1 text-danger">
                    {error}
                </Typography>
            )}
        </View>
    );
};
