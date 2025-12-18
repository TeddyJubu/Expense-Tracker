import { View, StyleSheet, ScrollView, useColorScheme, TouchableOpacity, Text } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const privacyPolicyContent = `
# Privacy Policy

**Effective Date:** December 18, 2025

Welcome to ExpenseTracker ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us.

## 1. Information We Collect

We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application, or otherwise when you contact us.

- **Personal Information Provided by You:** We collect names; email addresses; usernames; passwords; and other similar information.
- **Financial Data:** We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.

## 2. How We Use Your Information

We use personal information collected via our application for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.

- **To facilitate account creation and logon process.**
- **To send you administrative information.**
- **To protect our Services.**
- **To enforce our terms, conditions, and policies.**

## 3. Will Your Information Be Shared With Anyone?

We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.

## 4. How Long Do We Keep Your Information?

We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.

## 5. How Do We Keep Your Information Safe?

We adhere to strict security protocols to protect your data. However, please also do your part by keeping your account credentials secure.

## 6. Contact Us

If you have questions or comments about this policy, you may contact us within the app support section.
`;

export default function PrivacyPolicyScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: isDark ? colors.backgroundDark : colors.background }]}>
            <View style={[
                styles.header,
                {
                    paddingTop: Math.max(10, insets.top + spacing.sm),
                    backgroundColor: isDark ? colors.backgroundDark : colors.background,
                    borderBottomColor: isDark ? colors.borderDark : colors.border
                }
            ]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={isDark ? colors.textDark : colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: isDark ? colors.textDark : colors.text }]}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Markdown
                    style={{
                        body: {
                            color: isDark ? colors.textDark : colors.text,
                            fontSize: 16,
                            lineHeight: 24,
                        },
                        heading1: {
                            color: isDark ? colors.textDark : colors.text,
                            marginBottom: 10,
                            fontWeight: 'bold',
                        },
                        heading2: {
                            color: isDark ? colors.textDark : colors.text,
                            marginTop: 20,
                            marginBottom: 10,
                            fontWeight: '600',
                        },
                        bullet_list_icon: {
                            color: isDark ? colors.textDark : colors.text,
                        },
                        bullet_list_content: {
                            color: isDark ? colors.textDark : colors.text,
                        },
                    }}
                >
                    {privacyPolicyContent}
                </Markdown>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: spacing.sm,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
    },
});
