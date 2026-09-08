import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { hexA, useTheme } from '../lib/theme';

interface Props {
  label: string;
  selected?: boolean;
  accent?: string;
  onPress: () => void;
}

export default function Chip({ label, selected = false, accent, onPress }: Props) {
  const { palette } = useTheme();
  const tint = accent ?? palette.accent;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? tint : palette.dark ? hexA(palette.surface, 0.6) : palette.surface,
          borderColor: selected ? tint : palette.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <Text numberOfLines={1} style={[styles.label, { color: selected ? '#fff' : palette.textMuted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 13,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: 190,
  },
  label: { fontSize: 12.5, fontWeight: '600', letterSpacing: 0.2 },
});
