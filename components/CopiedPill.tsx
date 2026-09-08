import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

interface Props {
  message: string | null;
}

export default function CopiedPill({ message }: Props) {
  if (!message) return null;
  return (
    <Animated.View
      key={message}
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(220)}
      pointerEvents="none"
      style={styles.pill}
    >
      <Ionicons name="checkmark-circle" size={16} color="#fff" />
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    bottom: 34,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(20, 24, 34, 0.94)',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 22,
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
