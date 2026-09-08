import React from 'react';
import { FlatList, ListRenderItemInfo, StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import { IconDef } from '../lib/icons';
import IconTile from './IconTile';

const H_PADDING = 16;
const GAP = 10;

interface Props {
  data: IconDef[];
  columns: number;
  onPressIcon: (icon: IconDef) => void;
  isFavorite?: (id: string) => boolean;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export default function IconGrid({
  data,
  columns,
  onPressIcon,
  isFavorite,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}: Props) {
  const { width } = useWindowDimensions();
  const tileWidth = (width - H_PADDING * 2 - GAP * (columns - 1)) / columns;

  const renderItem = ({ item }: ListRenderItemInfo<IconDef>) => (
    <IconTile
      icon={item}
      width={tileWidth}
      onPress={() => onPressIcon(item)}
      favorite={isFavorite ? isFavorite(item.id) : false}
    />
  );

  return (
    <FlatList
      data={data}
      key={`grid-${columns}`}
      numColumns={columns}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      columnWrapperStyle={columns > 1 ? { gap: GAP } : undefined}
      contentContainerStyle={[
        { paddingHorizontal: H_PADDING, paddingBottom: 132, rowGap: GAP, flexGrow: 1 },
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      initialNumToRender={28}
      maxToRenderPerBatch={60}
      windowSize={9}
      removeClippedSubviews
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
}
