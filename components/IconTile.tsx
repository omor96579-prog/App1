import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { IconDef } from '../lib/icons';
import { hexA, useTheme } from '../lib/theme';
import IconGlyph from './IconGlyph';

interface Props {
  icon: IconDef;
  width: number;
  onPress: () => void;
  favorite?: boolean;
  showLabel?: boolean;
}

export default function IconTile({ icon, width, onPress, favorite = false, showLabel = true }: Props) {
  const { palette } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 40, bounciness: 2 }).start();
  };
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 26, bounciness: 8 }).start();
  };

  const boxSize = Math.max(44, width - 6);
  const labelHeight = showLabel ? 15 : 0;

  return (
    <Animated.View style={{ width, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        accessibilityRole="button"
        accessibilityLabel={`${icon.pretty} icon from ${icon.familyLabel}`}
        style={styles.pressable}
      >
        <View
          style={[
            styles.box,
            {
              width: boxSize,
              height: boxSize,
              borderRadius: Math.round(boxSize * 0.3),
              backgroundColor: hexA(icon.accent, palette.dark ? 0.16 : 0.1),
            },
          ]}
        >
          <IconGlyph family={icon.family} name={icon.name} size={boxSize * 0.46} color={icon.accent} />
          {favorite ? (
            <View style={[styles.badge, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <Ionicons name="heart" size={9} color={palette.danger} />
            </View>
          ) : null}
        </View>
        {showLabel ? (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.65}
            style={[styles.label, { color: palette.textMuted, height: labelHeight }]}
          >
            {icon.pretty}
          </Text>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pressable: { alignItems: 'center' },
  box: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
