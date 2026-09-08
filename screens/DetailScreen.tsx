import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Chip from '../components/Chip';
import CopiedPill from '../components/CopiedPill';
import IconGlyph from '../components/IconGlyph';
import { composeName, findIcon, relatedTo } from '../lib/icons';
import { useStore } from '../lib/store';
import { hexA, useTheme } from '../lib/theme';

type Format = 'rn' | 'compose' | 'xml';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });
const PREVIEW_SIZES = [12, 16, 24, 32, 48];

export default function DetailScreen({ route, navigation }: any) {
  const { palette } = useTheme();
  const { pushRecent, isFavorite, toggleFavorite } = useStore();
  const iconId: string | undefined = route.params?.id;
  const icon = findIcon(iconId);
  const [format, setFormat] = useState<Format>('rn');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (iconId) pushRecent(iconId);
  }, [iconId]);

  const related = useMemo(() => (icon ? relatedTo(icon, 12) : []), [icon?.id]);

  if (!icon) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }}>
        <Text style={{ color: palette.text, padding: 24 }}>This icon is no longer available.</Text>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(icon.id);

  const copy = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(label);
    } catch {
      setCopied('Could not copy');
    }
  };

  const rnSnippet = `import { ${icon.family} } from '@expo/vector-icons';

<${icon.family}
  name="${icon.name}"
  size={24}
  color="${palette.text}"
/>`;

  const composeSnippet = `implementation("androidx.compose.material:material-icons-extended")

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*

ImageVector = Icons.Filled.${composeName(icon.name)}`;

  const xmlSnippet = `<ImageView
    android:id="@+id/icon"
    android:layout_width="24dp"
    android:layout_height="24dp"
    app:srcCompat="@drawable/ic_${icon.name}" />`;

  const snippet = format === 'rn' ? rnSnippet : format === 'compose' ? composeSnippet : xmlSnippet;
  const snippetLabel = format === 'rn' ? 'React Native snippet' : format === 'compose' ? 'Compose snippet' : 'Android XML snippet';

  const isFav = favorite;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.bg }} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.circleButton,
            { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.7 : 1 },
          ]}
          accessibilityLabel="Close"
        >
          <Ionicons name="chevron-back" size={20} color={palette.text} />
        </Pressable>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => copy(snippet, snippetLabel)}
            style={({ pressed }) => [
              styles.circleButton,
              { backgroundColor: palette.surface, borderColor: palette.border, opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityLabel="Copy snippet"
          >
            <Ionicons name="copy" size={17} color={palette.text} />
          </Pressable>
          <Pressable
            onPress={() => toggleFavorite(icon.id)}
            style={({ pressed }) => [
              styles.circleButton,
              {
                backgroundColor: isFav ? hexA(palette.danger, palette.dark ? 0.2 : 0.12) : palette.surface,
                borderColor: isFav ? 'transparent' : palette.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={palette.danger} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(260)} style={styles.heroWrap}>
          <LinearGradient
            colors={[hexA(icon.accent, 0.24), hexA(icon.accent, 0.06)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hero, { borderColor: hexA(icon.accent, 0.28) }]}
          >
            <IconGlyph family={icon.family} name={icon.name} size={96} color={icon.accent} />
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(260)} style={styles.nameBlock}>
          <Text style={[styles.name, { color: palette.text }]}>{icon.pretty}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: hexA(icon.accent, palette.dark ? 0.2 : 0.12) }]}>
              <Text style={{ color: icon.accent, fontWeight: '700', fontSize: 11.5 }}>{icon.familyLabel}</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: palette.surfaceAlt }]}>
              <Text style={{ color: palette.textMuted, fontWeight: '700', fontSize: 11.5 }}>{icon.category}</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: palette.surfaceAlt }]}>
              <Text style={{ color: palette.textMuted, fontWeight: '700', fontSize: 11.5, fontFamily: MONO }}>
                {icon.unicode}
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(110).duration(260)} style={styles.section}>
          <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
            <Text style={[styles.cardTitle, { color: palette.textFaint }]}>PREVIEW SIZES</Text>
            <View style={styles.previewRow}>
              {PREVIEW_SIZES.map((size) => (
                <View key={size} style={styles.previewItem}>
                  <IconGlyph family={icon.family} name={icon.name} size={size} color={palette.text} />
                  <Text style={[styles.previewLabel, { color: palette.textFaint }]}>{size}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(260)} style={styles.section}>
          <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border, paddingVertical: 4 }]}>
            <CopyRow
              label="Icon name"
              value={icon.name}
              onPress={() => copy(icon.name, 'Icon name')}
              mono
            />
            <View style={[styles.divider, { backgroundColor: palette.border }]} />
            <CopyRow
              label="Unicode point"
              value={icon.unicode}
              onPress={() => copy(icon.unicode, 'Unicode point')}
              mono
            />
            <View style={[styles.divider, { backgroundColor: palette.border }]} />
            <CopyRow
              label="Import"
              value={`@expo/vector-icons`}
              onPress={() => copy(`@expo/vector-icons`, 'Package name')}
              mono
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(190).duration(260)} style={styles.section}>
          <View style={styles.formatRow}>
            <Chip label="React Native" selected={format === 'rn'} onPress={() => setFormat('rn')} />
            <Chip label="Compose" selected={format === 'compose'} onPress={() => setFormat('compose')} accent={icon.accent} />
            <Chip label="Android XML" selected={format === 'xml'} onPress={() => setFormat('xml')} />
          </View>
          <View
            style={[
              styles.codeCard,
              { backgroundColor: palette.dark ? '#0B0F18' : '#F1F3F9', borderColor: palette.border },
            ]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text selectable style={[styles.code, { color: palette.dark ? '#B9C6E0' : '#28324E' }]}>
                {snippet}
              </Text>
            </ScrollView>
            <Pressable
              onPress={() => copy(snippet, snippetLabel)}
              style={({ pressed }) => [
                styles.copyButton,
                { backgroundColor: palette.accent, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons name="copy" size={14} color={palette.onAccent} />
              <Text style={{ color: palette.onAccent, fontWeight: '700', fontSize: 12.5 }}>Copy</Text>
            </Pressable>
          </View>
        </Animated.View>

        {related.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(230).duration(260)} style={styles.section}>
            <Text style={[styles.relatedTitle, { color: palette.text }]}>More in {icon.category}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedRow}>
              {related.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => navigation.push('Detail', { id: item.id })}
                  style={({ pressed }) => [
                    styles.relatedTile,
                    {
                      backgroundColor: hexA(item.accent, palette.dark ? 0.16 : 0.1),
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <IconGlyph family={item.family} name={item.name} size={24} color={item.accent} />
                  <Text numberOfLines={1} style={[styles.relatedName, { color: palette.textMuted }]}>
                    {item.pretty}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        ) : null}
      </ScrollView>

      <CopiedPill message={copied} />
    </SafeAreaView>
  );
}

function CopyRow({
  label,
  value,
  onPress,
  mono,
}: {
  label: string;
  value: string;
  onPress: () => void;
  mono?: boolean;
}) {
  const { palette } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.copyRow, { opacity: pressed ? 0.6 : 1 }]}
      accessibilityLabel={`Copy ${label}`}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.copyLabel, { color: palette.textFaint }]}>{label}</Text>
        <Text numberOfLines={1} style={[styles.copyValue, { color: palette.text, fontFamily: mono ? MONO : undefined }]}>
          {value}
        </Text>
      </View>
      <Ionicons name="copy-outline" size={17} color={palette.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroWrap: { paddingHorizontal: 16, marginTop: 4 },
  hero: {
    borderRadius: 28,
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  nameBlock: { paddingHorizontal: 16, marginTop: 20, alignItems: 'center' },
  name: { fontSize: 24, fontWeight: '800', textAlign: 'center', letterSpacing: -0.3 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, justifyContent: 'center' },
  metaPill: { paddingHorizontal: 11, height: 26, borderRadius: 13, justifyContent: 'center' },
  section: { paddingHorizontal: 16, marginTop: 18 },
  card: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 16 },
  cardTitle: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8, marginBottom: 14 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  previewItem: { alignItems: 'center', gap: 8 },
  previewLabel: { fontSize: 10, fontWeight: '700' },
  copyRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  copyLabel: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  copyValue: { fontSize: 14, fontWeight: '600', marginTop: 3 },
  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },
  formatRow: { flexDirection: 'row', gap: 8, marginBottom: 10, flexWrap: 'wrap' },
  codeCard: { borderRadius: 20, borderWidth: StyleSheet.hairlineWidth, padding: 16, paddingBottom: 52 },
  code: { fontSize: 12.5, lineHeight: 20, fontFamily: MONO },
  copyButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
  },
  relatedTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  relatedRow: { gap: 10, paddingRight: 8 },
  relatedTile: { width: 104, borderRadius: 18, paddingVertical: 16, alignItems: 'center', gap: 10 },
  relatedName: { fontSize: 11, fontWeight: '600', paddingHorizontal: 6 },
});
