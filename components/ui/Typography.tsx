import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface TypographyProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
    color?: string;
    weight?: 'normal' | 'medium' | 'bold';
}

export const Typography: React.FC<TypographyProps> = ({
    children,
    variant = 'body',
    color,
    weight = 'normal',
    style,
    ...props
}) => {
    const getStyles = () => {
        switch (variant) {
            case 'h1':
                return "text-3xl font-bold text-foreground";
            case 'h2':
                return "text-2xl font-bold text-foreground";
            case 'h3':
                return "text-xl font-semibold text-foreground";
            case 'body':
                return "text-base text-foreground";
            case 'caption':
                return "text-sm text-muted-foreground";
            case 'label':
                return "text-xs font-semibold uppercase tracking-wider text-foreground";
            default:
                return "text-base text-foreground";
        }
    };

    // Note: Class names are constructed for NativeWind. 
    // Custom colors passed via props would need inline styles or dynamic class generation (less efficient).
    // For now, we rely on the variants.

    return (
        <Text
            className={`${getStyles()} ${style}`}
            style={color ? { color } : {}}
            {...props}
        >
            {children}
        </Text>
    );
};

export const H1 = (props: TypographyProps) => <Typography variant="h1" {...props} />;
export const H2 = (props: TypographyProps) => <Typography variant="h2" {...props} />;
export const H3 = (props: TypographyProps) => <Typography variant="h3" {...props} />;
export const Body = (props: TypographyProps) => <Typography variant="body" {...props} />;
export const Caption = (props: TypographyProps) => <Typography variant="caption" {...props} />;
export const Label = (props: TypographyProps) => <Typography variant="label" {...props} />;
