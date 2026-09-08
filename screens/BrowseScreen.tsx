import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChipRow, { ChipItem } from '../components/ChipRow';
import EmptyState from '../components/EmptyState';
import IconGlyph from '../components/IconGlyph';
import IconGrid from '../components/IconGrid';
import SearchBar from '../components/SearchBar';
import {
  CATEGORIES,
  FAMILIES,
  FAMILY_LABEL,
  ICONS,
  ICON_INDEX,
  IconDef,
  TOTAL_ICONS,
  iconsForFamily,
  searchIcons,
  FamilyKey,
} from '../lib/icons';
import { useStore } from '../lib/store';
import { hexA, useTheme } from '../lib/theme';

const FAMILY_CHIPS: ChipItem[] = [
  { key: 'all', label: 'All sets' },
  ...FAMILIES.map((family) => ({ key: family.key, label: family.label, accent: family.accent })),
];

const CATEGORY_CHIPS: ChipItem[] = [
  { key: 'all', label: 'All categories' },
  ...CATEGORIES.map((category) => ({ key: category.key, label: `${category.key} · ${category.count}` })),
];

export default function BrowseScreen({ navigation }: any) {
  const { palette } = useTheme();
  const { recents, isFavorite, columns, setColumns } = useStore();
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<FamilyKey | 'all'>('all');
  const [category, setCategory] = useState('all');

  const data = useMemo(() => {
    const pool = iconsForFamily(family);
    let result = query.trim() ? searchIcons(query, pool) : pool;
    if (category !== 'all') result = result.filter((icon) => icon.category === category);
    return result;
  }, [query, family, category]);

  const recentIcons = useMemo(
    () =>
      recents
        .map((id) => ICON_INDEX[id])
        .filter((icon): icon is IconDef => Boolean(icon)),
    [recents]
  );

  const filtersActive = query.trim().length > 0 || family !== 'all' || category !== 'all';

  const clearFilters = () => {
    setQuery('');
    setFamily('all');
    setCategory('all');
  };

  const openRandom = () => {
    const pick = ICONS[Math.floor(Math.random() * ICONS.length)];
    navigation.navigate('Detail', { id: pick.id });
  };

  const cycleColumns = () => setColumns(columns >= 5 ? 3 : columns + 1);

  const openIcon = (icon: IconDef) => navigation.navigate('Detail', { id: icon.id });

  const iconButton = [styles.iconButton, { backgroundColor: palette.surface, borderColor: palette.border }];

  const header = (
    <View>
      <View style={styles.brandRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.brand, { color: palette.text }]}>Iconary</Text>
          <Text style={[styles.brandSub, { color: palette.textMuted }]}>
            {TOTAL_ICONS.toLocaleString()} icons · {FAMILIES.length} sets
          </Text>
        </View>
        <Pressable
          onPress={openRandom}
          style={({ pressed }) => [iconButton, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityLabel="Show a random icon"
        >
          <Ionicons name="shuffle" size={17} color={palette.accent} />
        </Pressable>
        <Pressable
          onPress={cycleColumns}
          style={({ pressed }) => [iconButton, { opacity: pressed ? 0.7 : 1, flexDirection: 'row', gap: 4 }]}
          accessibilityLabel={`Grid density: ${columns} columns. Tap to change.`}
        >
          <Ionicons name="grid" size={13} color={palette.accent} />
          <Text style={{ color: palette.accent, fontWeight: '800', fontSize: 12 }}>{columns}</Text>
        </Pressable>
      </View>

      <View style={styles.searchWrap}>
        <SearchBar value={query} onChangeText={setQuery} placeholder={`Search ${TOTAL_ICONS.toLocaleString()} icons…`} />
      </View>

      <View style={styles.chipGap}>
        <ChipRow items={FAMILY_CHIPS} selected={family} onSelect={(key) => setFamily(key as FamilyKey | 'all')} />
      </View>
      <View style={styles.chipGap}>
        <ChipRow items={CATEGORY_CHIPS} selected={category} onSelect={setCategory} />
      </View>

      {!filtersActive && recentIcons.length > 0 ? (
        <View style={styles.recentBlock}>
          <Text style={[styles.sectionLabel, { color: palette.textFaint }]}>RECENTLY VIEWED</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentRow}
            keyboardShouldPersistTaps="handled"
          >
            {recentIcons.map((icon) => (
              <Pressable
                key={icon.id}
                onPress={() => openIcon(icon)}
                style={({ pressed }) => [
                  styles.recentTile,
                  {
                    backgroundColor: hexA(icon.accent, palette.dark ? 0.16 : 0.1),
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                accessibilityLabel={`${icon.pretty} icon`}
              >
                <IconGlyph family={icon.family} name={icon.name} size={22} color={icon.accent} />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View style={[styles.summaryRow, { borderBottomColor: palette.border }]}>
        <Text style={[styles.summary, { color: palette.textMuted }]}>
          {data.length.toLocaleString()} {data.length === 1 ? 'icon' : 'icons'}
        </Text>
        <Text style={[styles.summary, { color: palette.textFaint }]}>sorted A → Z</Text>
      </View>
    </View>
  );

  const empty = (
    <EmptyState
      icon="search"
      title="No icons found"
      subtitle={
        family !== 'all'
          ? `Nothing in ${FAMILY_LABEL[family as FamilyKey]} matches “${query.trim()}”. Try another set or clear the filters.`
          : `Nothing matches “${query.trim()}”. Try a shorter word — names like “chart-line” work best.`
      }
      actionLabel="Clear filters"
      onAction={clearFilters}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top']}>
      <IconGrid
        data={data}
        columns={columns}
        onPressIcon={openIcon}
        isFavorite={isFavorite}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
      />
      {filtersActive ? (
        <Pressable
          onPress={clearFilters}
          style={[styles.floatingClear, { backgroundColor: palette.text }]}
          accessibilityLabel="Clear all filters"
        >
          <Ionicons name="close" size={14} color={palette.bg} />
          <Text style={{ color: palette.bg, fontWeight: '700', fontSize: 12.5 }}>Clear</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, gap: 8 },
  brand: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  brandSub: { fontSize: 12.5, marginTop: 2, fontWeight: '500' },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchWrap: { paddingHorizontal: 16, marginTop: 16 },
  chipGap: { marginTop: 10 },
  recentBlock: { marginTop: 14 },
  sectionLabel: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8, paddingHorizontal: 16, marginBottom: 8 },
  recentRow: { paddingHorizontal: 16, gap: 8 },
  recentTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    marginTop: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  summary: { fontSize: 12, fontWeight: '600' },
  floatingClear: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 19,
    opacity: 0.95,
  },
});
