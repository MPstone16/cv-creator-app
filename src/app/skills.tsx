import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { InputField } from "@/components/InputField";
import { NavigationButton } from "@/components/NavigationButton";
import { useCVContext } from "@/context/CVContext";
import { SkillsFormValues, skillsSchema } from "@/schemas/skills.schema";
import { SkillCategory } from "@/types/cv.types";
import { Colors } from "@/theme/colors";

const initialValues: SkillsFormValues = {
  skill: "",
  category: "soft",
};

export default function SkillsScreen() {
  const router = useRouter();
  const { cvData, addSkill, deleteSkill } = useCVContext();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    resetField,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: initialValues,
  });

  const notifyUser = (title: string, message: string) => {
    if (Platform.OS === "web") {
      setFeedback(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const onValidSubmit: SubmitHandler<SkillsFormValues> = (values) => {
    const skills =
      values.category === "soft" ? cvData.softSkills : cvData.hardSkills;
    const duplicateExists = skills.some(
      (skill) =>
        skill.trim().toLocaleLowerCase() ===
        values.skill.trim().toLocaleLowerCase(),
    );

    if (duplicateExists) {
      setError("skill", {
        type: "validate",
        message: "Esta habilidad ya está registrada en esta categoría",
      });
      return;
    }

    addSkill(values.category, values.skill);
    resetField("skill", { defaultValue: "" });
    notifyUser("Éxito", "Habilidad agregada correctamente");
  };

  const handleDelete = (category: SkillCategory, skill: string) => {
    if (Platform.OS === "web") {
      deleteSkill(category, skill);
      notifyUser("Éxito", "Habilidad eliminada correctamente");
      return;
    }

    Alert.alert("Confirmar", `¿Quieres eliminar la habilidad "${skill}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteSkill(category, skill),
      },
    ]);
  };

  const renderSkills = (
    category: SkillCategory,
    title: string,
    skills: string[],
  ) => (
    <View style={styles.skillSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {skills.length === 0 ? (
        <Text style={styles.emptyText}>
          Aún no hay habilidades en esta categoría.
        </Text>
      ) : (
        skills.map((skill) => (
          <View key={skill} style={styles.skillRow}>
            <Text style={styles.skillText}>{skill}</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Eliminar habilidad ${skill}`}
              onPress={() => handleDelete(category, skill)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        {feedback && (
          <Text accessibilityLiveRegion="polite" style={styles.feedback}>
            {feedback}
          </Text>
        )}
        <Text style={styles.title}>Agregar una habilidad</Text>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <View style={styles.categoryField}>
              <Text style={styles.label}>Categoría *</Text>
              <View style={styles.categoryOptions}>
                {(
                  [
                    ["soft", "Blandas"],
                    ["hard", "Duras"],
                  ] as const
                ).map(([category, label]) => {
                  const selected = field.value === category;
                  return (
                    <TouchableOpacity
                      key={category}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => field.onChange(category)}
                      style={[
                        styles.categoryButton,
                        selected && styles.categoryButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          selected && styles.categoryButtonTextSelected,
                        ]}
                      >
                        Habilidades {label.toLowerCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        />
        <Controller
          control={control}
          name="skill"
          render={({ field }) => (
            <InputField
              label="Habilidad *"
              placeholder="Ej. Comunicación o Excel"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              onSubmitEditing={handleSubmit(onValidSubmit)}
              returnKeyType="done"
              error={errors.skill?.message}
            />
          )}
        />
        <NavigationButton
          title="Agregar habilidad"
          onPress={handleSubmit(onValidSubmit)}
          disabled={isSubmitting}
        />

        {renderSkills("soft", "Habilidades blandas", cvData.softSkills)}
        {renderSkills("hard", "Habilidades duras", cvData.hardSkills)}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={styles.backButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  feedback: {
    color: Colors.dark,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  categoryField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: "row",
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    alignItems: "center",
  },
  categoryButtonSelected: {
    backgroundColor: Colors.primary,
  },
  categoryButtonText: {
    color: Colors.primary,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryButtonTextSelected: {
    color: Colors.white,
  },
  skillSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.cardBackground,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  skillText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    color: Colors.danger,
    fontWeight: "600",
  },
  backButton: {
    marginTop: 16,
  },
});
