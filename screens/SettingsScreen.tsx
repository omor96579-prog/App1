import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Chip from '../components/Chip';
import { FAMILIES, FAMILY_COUNTS, TOTAL_ICONS } from '../lib/icons';
import { useStore } from '../lib/store';
import { ThemeMode, hexA, useTheme } from '../lib/theme';

const MODES: { key: ThemeMode; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { palette, mode, setMode } = useTheme();
  const { columns, setColumns, clearFavorites, clearRecents, favorites, recents } = useStore();
  const [confirming, setConfirming] = useState<'favorites' | 'recents' | null>(null);

  const confirmAction = (target: 'favorites' | 'recents', run: () => void) => {
    if (confirming === target) {
      run();
      setConfirming(null);
      return;
    }
    setConfirming(target);
    setTimeout(() => setConfirming((current) => (current === target ? null : current)), 3200);
  };

  const card = [styles.card, { backgroundColor: palette.surface, borderColor: palette.border }];
  const sectionTitle = [styles.sectionTitle, { color: palette.textFaint }];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        <Text style={[styles.title, { color: palette.text }]}>Settings</Text>

        <Animated.View entering={FadeInDown.duration(240)}>
          <Text style={sectionTitle}>APPEARANCE</Text>
          <View style={card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: palette.text }]}>Theme</Text>
                <Text style={[styles.rowSub, { color: palette.textMuted }]}>
                  Follow the system or lock a mode.
                </Text>
              </View>
            </View>
            <View style={styles.chipWrap}>
              {MODES.map((item) => (
                <Chip
                  key={item.key}
                  label={item.label}
                  selected={mode === item.key}
                  onPress={() => setMode(item.key)}
                />
              ))}
            </View>
            <View style={[styles.divider, { backgroundColor: palette.border }]} />
            <Text style={[styles.rowTitle, { color: palette.text }]}>Grid density</Text>
            <Text style={[styles.rowSub, { color: palette.textMuted, marginBottom: 12 }]}>
              How many icons fit in a row on Browse.
            </Text>
            <View style={styles.chipWrap}>
              {[3, 4, 5].map((count) => (
                <Chip
                  key={count}
                  label={`${count} per row`}
                  selected={columns === count}
                  onPress={() => setColumns(count)}
                />
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(240)}>
          <Text style={sectionTitle}>LIBRARY</Text>
          <View style={card}>
            <View style={styles.statRow}>
              <Text style={[styles.bigStat, { color: palette.accent }]}>{TOTAL_ICONS.toLocaleString()}</Text>
              <Text style={[styles.rowSub, { color: palette.textMuted, flex: 1 }]}>
                total glyphs indexed locally — search works fully offline.
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: palette.border }]} />
            {FAMILIES.map((family) => (
              <View key={family.key} style={styles.familyRow}>
                <View style={[styles.dot, { backgroundColor: family.accent }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: palette.text }]}>{family.label}</Text>
                  <Text style={[styles.rowSub, { color: palette.textMuted }]}>{family.blurb}</Text>
                </View>
                <Text style={[styles.familyCount, { color: palette.textFaint }]}>
                  {(FAMILY_COUNTS[family.key] ?? 0).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(110).duration(240)}>
          <Text style={sectionTitle}>DATA</Text>
          <View style={[card, { paddingVertical: 4 }]}>
            <Pressable
              onPress={() => confirmAction('recents', clearRecents)}
              style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="time-outline" size={18} color={palette.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: palette.text }]}>
                  {confirming === 'recents' ? 'Tap again to clear history' : 'Clear recently viewed'}
                </Text>
                <Text style={[styles.rowSub, { color: confirming === 'recents' ? palette.danger : palette.textMuted }]}>
                  {recents.length} icon{recents.length === 1 ? '' : 's'} in your history.
                </Text>
              </View>
              <Ionicons
                name={confirming === 'recents' ? 'alert-circle' : 'chevron-forward'}
                size={17}
                color={confirming === 'recents' ? palette.danger : palette.textFaint}
              />
            </Pressable>
            <View style={[styles.divider, { backgroundColor: palette.border }]} />
            <Pressable
              onPress={() => confirmAction('favorites', clearFavorites)}
              style={({ pressed }) => [styles.actionRow, { opacity: pressed ? 0.6 : 1 }]}
            >
              <Ionicons name="heart-outline" size={18} color={palette.textMuted} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowTitle, { color: palette.text }]}>
                  {confirming === 'favorites' ? 'Tap again to remove all' : 'Clear favorites'}
                </Text>
                <Text style={[styles.rowSub, { color: confirming === 'favorites' ? palette.danger : palette.textMuted }]}>
                  {favorites.length} saved icon{favorites.length === 1 ? '' : 's'}.
                </Text>
              </View>
              <Ionicons
                name={confirming === 'favorites' ? 'alert-circle' : 'chevron-forward'}
                size={17}
                color={confirming === 'favorites' ? palette.danger : palette.textFaint}
              />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(240)}>
          <Text style={sectionTitle}>ABOUT</Text>
          <View style={card}>
            <Text style={[styles.rowTitle, { color: palette.text }]}>Iconary 1.0</Text>
            <Text style={[styles.body, { color: palette.textMuted }]}>
              A pocket browser for the Material icon universe — from the Compose artifact
            </Text>
            <View style={[styles.gradleChip, { backgroundColor: hexA(palette.accent, palette.dark ? 0.18 : 0.1) }]}>
              <Text selectable style={[styles.gradle, { color: palette.accent }]}>
                implementation(&quot;androidx.compose.material:material-icons-extended&quot;)
              </Text>
            </View>
            <Text style={[styles.body, { color: palette.textMuted, marginTop: 12 }]}>
              …to every glyph you can actually ship in React Native. No network calls, no accounts —
              just icons, search, and copy-ready snippets.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4, paddingHorizontal: 16, paddingTop: 14 },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.9,
    paddingHorizontal: 16,
    marginTop: 26,
    marginBottom: 10,
  },
  card: { marginHorizontal: 16, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  rowBetween: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { fontSize: 14.5, fontWeight: '700' },
  rowSub: { fontSize: 12.5, marginTop: 3, lineHeight: 17 },
  chipWrap: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 14 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 14 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bigStat: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
  familyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  familyCount: { fontSize: 12.5, fontWeight: '700' },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 2 },
  body: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  gradleChip: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12 },
  gradle: { fontSize: 11.5, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
