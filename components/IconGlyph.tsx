import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { COMPONENTS, FamilyKey } from '../lib/icons';

interface Props {
  family: FamilyKey;
  name: string;
  size: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

export default function IconGlyph({ family, name, size, color, style }: Props) {
  const Component = COMPONENTS[family] ?? COMPONENTS.MaterialIcons;
  return <Component name={name} size={size} color={color} style={style} />;
}
