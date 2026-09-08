import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Chip from './Chip';

export interface ChipItem {
  key: string;
  label: string;
  accent?: string;
}

interface Props {
  items: ChipItem[];
  selected: string;
  onSelect: (key: string) => void;
}

export default function ChipRow({ items, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {items.map((item) => (
        <Chip
          key={item.key}
          label={item.label}
          accent={item.accent}
          selected={selected === item.key}
          onPress={() => onSelect(item.key)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, gap: 8, paddingVertical: 2 },
});
