import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

import { Typography, H1 } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useExpense } from '@/hooks/useExpense';
import { colors } from '@/constants/theme';
import { aiService } from '@/services/ai';

export default function AddExpenseScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { addExpense, categories } = useExpense();

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        // Smart Default: Select 'Food' or first category if nothing selected
        if (!selectedCategory && categories.length > 0) {
            const food = categories.find(c => c.name.toLowerCase().includes('food'));
            setSelectedCategory(food ? food.id : categories[0].id);
        }
    }, [categories]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need access to your photos to scan receipts.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            analyzeReceipt(result.assets[0].base64);
        }
    };

    const analyzeReceipt = async (base64: string) => {
        setAnalyzing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        const { data, error } = await aiService.parseExpense(undefined, base64, 'photo');

        setAnalyzing(false);

        if (error || !data) {
            Alert.alert('Scan Failed', 'Could not extract details from receipt.');
            return;
        }

        // Auto-populate
        if (data.amount) setAmount(data.amount.toString());
        if (data.description) setDescription(data.description);

        // Try to match category
        if (data.category && categories.length > 0) {
            const match = categories.find(c => c.name.toLowerCase() === data.category.toLowerCase())
                || categories.find(c => c.name.toLowerCase().includes(data.category.toLowerCase()));
            if (match) setSelectedCategory(match.id);
        }

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleSave = async () => {
        if (!amount || !selectedCategory) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        setSubmitting(true);
        try {
            await addExpense({
                amount: parseFloat(amount),
                description: description || 'Expense',
                category_id: selectedCategory,
                date: new Date().toISOString(),
                input_method: 'manual',
            });

            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
        } catch (error) {
            console.error(error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert('Error', 'Failed to save expense');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-background">
            <View style={{ paddingTop: insets.top }} className="flex-row items-center justify-between px-4 mb-4">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <Ionicons name="close" size={28} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <Typography variant="h3" className="ml-4">New Expense</Typography>
                </View>

                <TouchableOpacity
                    onPress={pickImage}
                    disabled={analyzing}
                    className="bg-surface-highlight px-4 py-2 rounded-full flex-row items-center border border-gray-200"
                >
                    {analyzing ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <>
                            <Ionicons name="scan" size={18} color={colors.primary} />
                            <Typography variant="caption" className="ml-2 font-bold text-primary">Scan</Typography>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6">

                    {/* Amount Input */}
                    <View className="items-center my-8">
                        <Typography variant="h2" className="text-secondary opacity-50 mb-2">$</Typography>
                        <Input
                            className="text-5xl font-bold text-center border-none bg-transparent h-20"
                            placeholder="0.00"
                            keyboardType="decimal-pad"
                            autoFocus={!analyzing}
                            value={amount}
                            onChangeText={setAmount}
                            containerClassName="border-0 bg-transparent w-full"
                        />
                    </View>

                    {/* Category Selection */}
                    <Typography variant="h3" className="mb-4">Category</Typography>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                        <View className="flex-row gap-3 pr-8">
                            {categories.map(cat => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            setSelectedCategory(cat.id);
                                        }}
                                        style={{ backgroundColor: isSelected ? cat.color : colors.surface }}
                                        className={`
                      px-5 py-3 rounded-full flex-row items-center
                      ${isSelected ? 'shadow-md' : 'border border-gray-100'}
                    `}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={18}
                                            color={isSelected ? 'white' : colors.textSecondary}
                                        />
                                        <Typography
                                            className={`ml-2 font-medium ${isSelected ? 'text-white' : 'text-secondary'}`}
                                        >
                                            {cat.name}
                                        </Typography>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </ScrollView>

                    {/* Details */}
                    <Input
                        label="Note (Optional)"
                        placeholder="What was this for?"
                        value={description}
                        onChangeText={setDescription}
                        containerClassName="mb-6"
                    />

                    <View className="flex-row items-center justify-between mb-8 bg-surface p-4 rounded-xl border border-gray-100">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                                <Ionicons name="repeat" size={20} color="#0984E3" />
                            </View>
                            <View>
                                <Typography variant="body" className="font-semibold">Recurring</Typography>
                                <Typography variant="caption">Monthly subscription?</Typography>
                            </View>
                        </View>
                        <Switch
                            value={isRecurring}
                            onValueChange={setIsRecurring}
                            trackColor={{ false: '#E0E0E0', true: '#0984E3' }}
                        />
                    </View>

                    <Button
                        title="Save Expense"
                        onPress={handleSave}
                        size="lg"
                        className="mb-10 shadow-lg shadow-blue-500/30"
                        loading={submitting}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
