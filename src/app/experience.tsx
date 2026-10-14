import React, { useId, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { DatePickerField } from "../components/DatePickerField";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { useCVContext } from "../context/CVContext";
import {
  experienceSchema,
  ExperienceFormValues,
} from "../schemas/experience.schema";
import { calendarDateFromString, formatCalendarDate } from "../utils/date";
import { Experience } from "../types/cv.types";
import { Colors } from "../theme/colors";

const initialValues: ExperienceFormValues = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  description: "",
};

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();
  const idPrefix = useId();
  const [nextRecordNumber, setNextRecordNumber] = useState(0);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialValues,
  });
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const onValidSubmit: SubmitHandler<ExperienceFormValues> = (values) => {
    const newExperience: Experience = {
      id: `${idPrefix}-${nextRecordNumber}`,
      ...values,
    };
    addExperience(newExperience);
    setNextRecordNumber((current) => current + 1);
    reset(initialValues);
    Alert.alert("Éxito", "Experiencia agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Experiencia</Text>

        <Controller
          control={control}
          name="company"
          render={({ field }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.company?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="position"
          render={({ field }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.position?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePickerField
              label="Fecha de Inicio *"
              value={field.value}
              onChange={field.onChange}
              error={errors.startDate?.message}
              placeholder="Selecciona la fecha de inicio"
              maximumDate={calendarDateFromString(endDate)}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DatePickerField
              label="Fecha de Fin"
              value={field.value}
              onChange={field.onChange}
              error={errors.endDate?.message}
              placeholder="Selecciona la fecha de fin"
              minimumDate={calendarDateFromString(startDate)}
              optional
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades y logros..."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
              error={errors.description?.message}
            />
          )}
        />

        <NavigationButton
          title="Agregar Experiencia"
          onPress={handleSubmit(onValidSubmit)}
          disabled={isSubmitting}
        />

        {cvData.experiences.length > 0 && (
          <>
            <Text style={styles.listTitle}>Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <View key={exp.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{exp.position}</Text>
                  <Text style={styles.cardSubtitle}>{exp.company}</Text>
                  <Text style={styles.cardDate}>
                    {formatCalendarDate(exp.startDate)} -{" "}
                    {exp.endDate ? formatCalendarDate(exp.endDate) : "Actual"}
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar experiencia en ${exp.company}`}
                  style={styles.deleteButton}
                  onPress={() => handleDelete(exp.id)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        <NavigationButton
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          style={{ marginTop: 16 }}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primaryDark,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.danger,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
