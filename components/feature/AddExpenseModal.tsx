import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/constants/theme';
import { useExpense } from '@/hooks/useExpense';
import { aiService } from '@/services/ai';
import { useAlert } from '@/template';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  initialMode?: 'select' | 'chat' | 'voice' | 'photo';
}

export function AddExpenseModal({ visible, onClose, initialMode = 'select' }: AddExpenseModalProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { categories, addExpense } = useExpense();
  const { showAlert } = useAlert();

  const [mode, setMode] = useState<'select' | 'chat' | 'voice' | 'photo'>(initialMode);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (visible) {
      setMode(initialMode);
      setChatInput('');
      setLoading(false);
      setRecording(null);
      setIsRecording(false);
    }
  }, [visible, initialMode]);


  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await aiService.parseExpense(chatInput, undefined, 'chat');

      if (error) {
        showAlert('Error', error);
        setLoading(false);
        return;
      }

      if (data) {
        const category = categories.find(c => c.name === data.category);
        await addExpense({
          amount: data.amount,
          description: data.description,
          category_id: category?.id || null,
          date: data.date,
          input_method: 'chat',
          photo_url: null,
        });

        showAlert('Success', 'Expense added successfully');
        setChatInput('');
        setMode('select');
        onClose();
      }
    } catch (error: any) {
      showAlert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceRecord = async () => {
    try {
      if (isRecording && recording) {
        setIsRecording(false);
        setLoading(true);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        if (uri) {
          // Convert audio to base64
          const audioBase64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const { data, error } = await aiService.parseExpense(undefined, undefined, 'voice', audioBase64);

          if (error) {
            showAlert('Error', error);
          } else if (data) {
            const category = categories.find(c => c.name === data.category);
            await addExpense({
              amount: data.amount,
              description: data.description,
              category_id: category?.id || null,
              date: data.date,
              input_method: 'voice',
              photo_url: null,
            });

            showAlert('Success', 'Expense added from voice');
            setMode('select');
            onClose();
          }

          setRecording(null);
          setLoading(false);
        }
      } else {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          showAlert('Error', 'Microphone permission required');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(newRecording);
        setIsRecording(true);
      }
    } catch (error: any) {
      showAlert('Error', error.message);
      setIsRecording(false);
      setRecording(null);
    }
  };

  const handlePhotoScan = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Error', 'Camera roll permission required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setLoading(true);
        const imageBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;

        const { data, error } = await aiService.parseExpense(undefined, imageBase64, 'photo');

        if (error) {
          showAlert('Error', error);
          setLoading(false);
          return;
        }

        if (data) {
          const category = categories.find(c => c.name === data.category);
          await addExpense({
            amount: data.amount,
            description: data.description,
            category_id: category?.id || null,
            date: data.date,
            input_method: 'photo',
            photo_url: result.assets[0].uri,
          });

          showAlert('Success', 'Expense added from photo');
          setMode('select');
          onClose();
        }
        setLoading(false);
      }
    } catch (error: any) {
      showAlert('Error', error.message);
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (mode === 'select') {
      return (
        <View style={styles.optionsContainer}>
          <Text style={[styles.title, { color: isDark ? colors.textDark : colors.text }]}>
            Add Expense
          </Text>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: isDark ? colors.surfaceDark : colors.surface }]}
            onPress={() => setMode('chat')}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: `${colors.primary}15` }]}>
              <Ionicons name="chatbubble" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: isDark ? colors.textDark : colors.text }]}>
                Chat Input
              </Text>
              <Text style={[styles.optionDescription, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                Type naturally: &quot;Lunch at cafe $25&quot;
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? colors.textSecondaryDark : colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: isDark ? colors.surfaceDark : colors.surface }]}
            onPress={() => setMode('voice')}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: `${colors.success}15` }]}>
              <Ionicons name="mic" size={24} color={colors.success} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: isDark ? colors.textDark : colors.text }]}>
                Voice Input
              </Text>
              <Text style={[styles.optionDescription, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                Speak your expense naturally
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? colors.textSecondaryDark : colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: isDark ? colors.surfaceDark : colors.surface }]}
            onPress={handlePhotoScan}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: `${colors.info}15` }]}>
              <Ionicons name="camera" size={24} color={colors.info} />
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: isDark ? colors.textDark : colors.text }]}>
                Scan Receipt
              </Text>
              <Text style={[styles.optionDescription, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                AI extracts expense from photo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? colors.textSecondaryDark : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      );
    }

    if (mode === 'chat') {
      return (
        <View style={styles.chatContainer}>
          <TouchableOpacity onPress={() => setMode('select')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? colors.textDark : colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: isDark ? colors.textDark : colors.text }]}>
            Chat Input
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            Describe your expense naturally
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? colors.surfaceDark : colors.surface,
                color: isDark ? colors.textDark : colors.text,
                borderColor: isDark ? colors.borderDark : colors.border,
              }
            ]}
            placeholder="e.g., Dinner at Italian restaurant $45"
            placeholderTextColor={isDark ? colors.textSecondaryDark : colors.textSecondary}
            value={chatInput}
            onChangeText={setChatInput}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              { backgroundColor: colors.primary },
              (!chatInput.trim() || loading) && styles.submitButtonDisabled
            ]}
            onPress={handleChatSubmit}
            disabled={!chatInput.trim() || loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <>
                <Ionicons name="send" size={20} color={colors.background} />
                <Text style={styles.submitButtonText}>Parse & Add</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    if (mode === 'voice') {
      return (
        <View style={styles.voiceContainer}>
          <TouchableOpacity onPress={() => setMode('select')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? colors.textDark : colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: isDark ? colors.textDark : colors.text }]}>
            Voice Input
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
            {isRecording ? 'Recording... Tap to stop' : 'Tap to start recording'}
          </Text>

          <TouchableOpacity
            style={[
              styles.recordButton,
              { backgroundColor: isRecording ? colors.error : colors.success }
            ]}
            onPress={handleVoiceRecord}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} size="large" />
            ) : (
              <Ionicons
                name={isRecording ? 'stop' : 'mic'}
                size={48}
                color={colors.background}
              />
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent,
          { backgroundColor: isDark ? colors.backgroundDark : colors.background }
        ]}>
          {(loading && (mode === 'photo' || mode === 'voice')) ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: isDark ? colors.textDark : colors.text }]}>
                {mode === 'photo' ? 'Analyzing receipt...' : 'Analyzing voice...'}
              </Text>
            </View>
          ) : (
            renderContent()
          )}

          {mode === 'select' && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.closeButtonText, { color: isDark ? colors.textSecondaryDark : colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: '80%',
  },
  optionsContainer: {
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    ...typography.bodySmall,
  },
  closeButton: {
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  closeButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
  chatContainer: {
    gap: spacing.md,
  },
  voiceContainer: {
    gap: spacing.md,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    minHeight: 100,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    ...typography.body,
    color: colors.background,
    fontWeight: '600',
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
  },
});
