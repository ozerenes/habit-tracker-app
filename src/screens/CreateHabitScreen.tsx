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

const COLORS = ['#2d5a47', '#5a2d47', '#472d5a', '#5a472d', '#2d475a'];
const ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🌙', '✍️', '🎯'];

export function CreateHabitScreen() {
  const router = useRouter();
  const { createHabit, isSaving, error, validationErrors, clearError } = useCreateHabit();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={[styles.input, validationErrors.name && styles.inputError]}
        value={name}
        onChangeText={handleNameChange}
        placeholder="e.g. Morning run"
        placeholderTextColor="#555"
        autoCapitalize="words"
        editable={!isSaving}
      />
      {validationErrors.name ? (
        <Text style={styles.errorText}>{validationErrors.name}</Text>
      ) : null}

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Add a note..."
        placeholderTextColor="#555"
        multiline
        editable={!isSaving}
      />

      <Text style={styles.label}>Icon</Text>
      <View style={styles.iconRow}>
        {ICONS.map((i) => (
          <Pressable
            key={i}
            style={[styles.iconOption, icon === i && styles.iconSelected]}
            onPress={() => !isSaving && setIcon(i)}
            disabled={isSaving}
          >
            <Text style={styles.iconText}>{i}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {COLORS.map((c) => (
          <Pressable
            key={c}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              color === c && styles.colorSelected,
            ]}
            onPress={() => !isSaving && setColor(c)}
            disabled={isSaving}
          />
        ))}
      </View>

      {error ? (
        <Text style={styles.persistError}>{error}</Text>
      ) : null}

      <Pressable
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.saveText}>Create Habit</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#e55',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 13,
    color: '#e55',
    marginTop: 6,
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: '#2d5a47',
  },
  iconText: {
    fontSize: 24,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  persistError: {
    fontSize: 14,
    color: '#e55',
    marginTop: 16,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2d5a47',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    minHeight: 52,
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
