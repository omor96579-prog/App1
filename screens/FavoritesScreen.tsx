import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import IconGrid from '../components/IconGrid';
import SearchBar from '../components/SearchBar';
import { IconDef, findIcon, searchIcons } from '../lib/icons';
import { useStore } from '../lib/store';
import { useTheme } from '../lib/theme';

export default function FavoritesScreen({ navigation }: any) {
  const { palette } = useTheme();
  const { favorites, isFavorite } = useStore();
  const [query, setQuery] = useState('');

  const favoriteIcons = useMemo(
    () => favorites.map((id) => findIcon(id)).filter((icon): icon is IconDef => Boolean(icon)),
    [favorites]
  );

  const data = useMemo(
    () => (query.trim() ? searchIcons(query, favoriteIcons) : favoriteIcons),
    [query, favoriteIcons]
  );

  const header = (
    <View>
      <View style={styles.headRow}>
        <Text style={[styles.title, { color: palette.text }]}>Favorites</Text>
        <View style={[styles.countPill, { backgroundColor: palette.surfaceAlt }]}>
          <Text style={{ color: palette.textMuted, fontWeight: '700', fontSize: 12 }}>
            {favoriteIcons.length}
          </Text>
        </View>
      </View>
      <Text style={[styles.subtitle, { color: palette.textMuted }]}>
        Your hand-picked icons, ready to copy into any screen.
      </Text>
      {favoriteIcons.length > 0 ? (
        <View style={styles.searchWrap}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Search favorites" />
        </View>
      ) : null}
    </View>
  );

  const empty =
    favoriteIcons.length === 0 ? (
      <EmptyState
        icon="heart-outline"
        title="No favorites yet"
        subtitle="Tap the heart on any icon detail to keep it here for quick access."
        actionLabel="Browse the library"
        onAction={() => navigation.navigate('Browse')}
      />
    ) : (
      <EmptyState
        icon="search"
        title="No matches"
        subtitle={`None of your favorites match “${query.trim()}”.`}
        actionLabel="Clear search"
        onAction={() => setQuery('')}
      />
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top']}>
      <IconGrid
        data={data}
        columns={3}
        onPressIcon={(icon) => navigation.navigate('Detail', { id: icon.id })}
        isFavorite={isFavorite}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={{ paddingTop: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  countPill: { minWidth: 30, paddingHorizontal: 8, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  subtitle: { fontSize: 13, paddingHorizontal: 16, marginTop: 5, lineHeight: 18 },
  searchWrap: { paddingHorizontal: 16, marginTop: 14, marginBottom: 4 },
});
