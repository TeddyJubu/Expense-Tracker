import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

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
  const anchorRef = useRef<View>(null);
  const [visible, setVisible] = useState(false);
  const [anchorLayout, setAnchorLayout] = useState<AnchorLayout | null>(null);

  const open = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorLayout({ x, y, width, height });
      setVisible(true);
    });
  };

  const close = () => setVisible(false);

  const menuPosition =
    anchorLayout == null
      ? { top: 0, right: 0 }
      : {
          top: anchorLayout.y + anchorLayout.height + 8,
          right: Math.max(8, windowWidth - (anchorLayout.x + anchorLayout.width)),
        };

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
          <Ionicons name="ellipsis-vertical" size={18} color="#a1a1aa" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={close}>
        <Pressable style={{ flex: 1 }} onPress={close}>
          <View
            style={[
              {
                position: 'absolute',
                minWidth: 200,
              },
              menuPosition,
            ]}
            className="bg-card border border-border rounded-xl overflow-hidden"
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
                  <Ionicons name={item.icon} size={18} color="#e4e4e7" />
                ) : null}
                <Text className="text-foreground text-sm font-medium flex-1">
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
