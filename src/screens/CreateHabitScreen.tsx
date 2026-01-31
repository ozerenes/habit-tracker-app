import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useHabits } from '@/hooks';
import { ROUTES } from '@/navigation/routes';

const COLORS = ['#2d5a47', '#5a2d47', '#472d5a', '#5a472d', '#2d475a'];
const ICONS = ['💪', '📚', '🧘', '🏃', '💧', '🌙', '✍️', '🎯'];

export function CreateHabitScreen() {
  const router = useRouter();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    try {
      const habit = await addHabit({
        name: trimmed,
        description: description.trim() || undefined,
        color,
        icon,
        frequency: 'daily',
        targetDays: [0, 1, 2, 3, 4, 5, 6],
      });
      router.replace(ROUTES.HABIT.DETAIL(habit.id));
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to create habit');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Morning run"
        placeholderTextColor="#555"
        autoCapitalize="words"
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Add a note..."
        placeholderTextColor="#555"
        multiline
      />

      <Text style={styles.label}>Icon</Text>
      <View style={styles.iconRow}>
        {ICONS.map((i) => (
          <Pressable
            key={i}
            style={[styles.iconOption, icon === i && styles.iconSelected]}
            onPress={() => setIcon(i)}
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
            onPress={() => setColor(c)}
          />
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Create Habit</Text>
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  saveButton: {
    backgroundColor: '#2d5a47',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
