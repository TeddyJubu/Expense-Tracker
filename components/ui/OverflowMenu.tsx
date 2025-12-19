import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors } from '@/constants/theme';

export type OverflowMenuItem = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

type AnchorLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function OverflowMenu({ items }: { items: OverflowMenuItem[] }) {
  const { width: windowWidth } = useWindowDimensions();
  const anchorRef = useRef<View | null>(null);
  const [visible, setVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<AnchorLayout | null>(null);
  const [menuWidth, setMenuWidth] = useState<number | null>(null);

  const open = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorLayout({ x, y, width, height });
      setVisible(true);
    });
  };

  const close = () => setVisible(false);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const horizontalPadding = 8;
  const fallbackWidth = 220;
  const effectiveMenuWidth = menuWidth ?? fallbackWidth;

  const menuPosition =
    anchorLayout == null
      ? { top: 0, left: horizontalPadding }
      : (() => {
          const top = anchorLayout.y + anchorLayout.height + 8;
          const left = clamp(
            anchorLayout.x + anchorLayout.width - effectiveMenuWidth,
            horizontalPadding,
            Math.max(horizontalPadding, windowWidth - effectiveMenuWidth - horizontalPadding),
          );

          return { top, left };
        })();

  return (
    <>
      <View ref={anchorRef} collapsable={false}>
        <TouchableOpacity
          onPress={open}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          className="p-2 rounded-full border border-border bg-card"
          activeOpacity={0.7}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
        <View style={{ flex: 1 }} pointerEvents="box-none">
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Close menu"
          />

          <View style={[{ position: 'absolute' }, menuPosition]} pointerEvents="box-none">
            <View
              onLayout={(event) => setMenuWidth(event.nativeEvent.layout.width)}
              className="bg-card border border-border rounded-xl overflow-hidden"
              style={{ minWidth: 200 }}
              pointerEvents="auto"
            >
              {items.map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    close();
                    item.onPress();
                  }}
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  {item.icon ? (
                    <Ionicons name={item.icon} size={18} color={colors.text} />
                  ) : null}
                  <Text className="text-foreground text-sm font-medium flex-1">
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
