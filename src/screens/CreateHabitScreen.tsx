import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateHabit } from '@/hooks';
import { ROUTES } from '@/navigation/routes';
import { useTheme, HABIT_COLORS, HABIT_ICONS } from '@/theme';
import { SPACING, RADIUS } from '@/theme';

export function CreateHabitScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { createHabit, isSaving, error, validationErrors, clearError } = useCreateHabit();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [color, setColor] = useState(HABIT_COLORS[0]);
  const [icon, setIcon] = useState(HABIT_ICONS[0]);

  const handleSave = async () => {
    const result = await createHabit({
      name,
      description: description || undefined,
      color,
      icon,
    });

    if (result?.id) {
      router.replace(ROUTES.HABIT.DETAIL(result.id));
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (validationErrors.name) clearError();
  };

  const canSave = name.trim().length > 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            color: theme.textPrimary,
            borderColor: validationErrors.name ? theme.error : 'transparent',
          },
        ]}
        value={name}
        onChangeText={handleNameChange}
        placeholder="e.g. Morning walk"
        placeholderTextColor={theme.textTertiary}
        autoCapitalize="words"
        editable={!isSaving}
      />
      {validationErrors.name ? (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {validationErrors.name}
        </Text>
      ) : null}

      {!showDescription && !description ? (
        <Pressable
          onPress={() => setShowDescription(true)}
          style={styles.addNoteLink}
        >
          <Text style={[styles.addNoteText, { color: theme.primary }]}>
            Add a note
          </Text>
        </Pressable>
      ) : (
        <View style={styles.descriptionSection}>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: theme.surface,
                color: theme.textPrimary,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note..."
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={3}
            editable={!isSaving}
          />
        </View>
      )}

      <Text style={[styles.label, { color: theme.textTertiary }]}>Icon</Text>
      <View style={styles.iconRow}>
        {HABIT_ICONS.map((i) => (
          <Pressable
            key={i}
            style={[
              styles.iconOption,
              {
                backgroundColor: theme.surface,
                borderColor: icon === i ? theme.primary : 'transparent',
                borderWidth: icon === i ? 2 : 0,
              },
            ]}
            onPress={() => !isSaving && setIcon(i)}
            disabled={isSaving}
          >
            <Text style={styles.iconText}>{i}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.textTertiary }]}>Color</Text>
      <View style={styles.colorRow}>
        {HABIT_COLORS.map((c) => (
          <Pressable
            key={c}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && {
                borderWidth: 2,
                borderColor: theme.textPrimary,
              },
            ]}
            onPress={() => !isSaving && setColor(c)}
            disabled={isSaving}
          />
        ))}
      </View>

      {error ? (
        <Text style={[styles.persistError, { color: theme.error }]}>{error}</Text>
      ) : null}

      <Pressable
        style={[
          styles.saveButton,
          {
            backgroundColor: theme.primary,
            opacity: !canSave || isSaving ? 0.5 : 1,
          },
        ]}
        onPress={handleSave}
        disabled={!canSave || isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveText}>Create</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: SPACING.xxl,
  },
  input: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    minHeight: 48,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 13,
    marginTop: SPACING.sm,
  },
  addNoteLink: {
    marginTop: SPACING.lg,
  },
  addNoteText: {
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionSection: {
    marginTop: SPACING.lg,
  },
  textArea: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  colorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  persistError: {
    fontSize: 14,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  saveButton: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    minHeight: 52,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
