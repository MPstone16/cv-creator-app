import React, { useId, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { InputField } from "../components/InputField";
import { NavigationButton } from "../components/NavigationButton";
import { YearPickerField } from "../components/YearPickerField";
import { useCVContext } from "../context/CVContext";
import {
  educationSchema,
  EducationFormValues,
} from "../schemas/education.schema";
import { Education } from "../types/cv.types";
import { Colors } from "../theme/colors";

const initialValues: EducationFormValues = {
  institution: "",
  degree: "",
  field: "",
  graduationYear: "",
};

export default function EducationScreen() {
  const router = useRouter();
  const { cvData, addEducation, deleteEducation } = useCVContext();
  const idPrefix = useId();
  const [nextRecordNumber, setNextRecordNumber] = useState(0);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialValues,
  });

  const onValidSubmit: SubmitHandler<EducationFormValues> = (values) => {
    const newEducation: Education = {
      id: `${idPrefix}-${nextRecordNumber}`,
      ...values,
    };
    addEducation(newEducation);
    setNextRecordNumber((current) => current + 1);
    reset(initialValues);
    Alert.alert("Éxito", "Educación agregada correctamente");
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Estás seguro de eliminar esta educación?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteEducation(id),
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Agregar Nueva Educación</Text>

        <Controller
          control={control}
          name="institution"
          render={({ field }) => (
            <InputField
              label="Institución *"
              placeholder="Nombre de la universidad/institución"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.institution?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="degree"
          render={({ field }) => (
            <InputField
              label="Título/Grado *"
              placeholder="Ej: Licenciatura, Maestría"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.degree?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="field"
          render={({ field }) => (
            <InputField
              label="Área de Estudio"
              placeholder="Ej: Ingeniería en Sistemas"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.field?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="graduationYear"
          render={({ field }) => (
            <YearPickerField
              label="Año de Graduación"
              placeholder="Selecciona el año"
              value={field.value}
              onChange={field.onChange}
              error={errors.graduationYear?.message}
            />
          )}
        />

        <NavigationButton
          title="Agregar Educación"
          onPress={handleSubmit(onValidSubmit)}
          disabled={isSubmitting}
        />

        {cvData.education.length > 0 && (
          <>
            <Text style={styles.listTitle}>Educación Agregada</Text>
            {cvData.education.map((edu) => (
              <View key={edu.id} style={styles.card}>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{edu.degree}</Text>
                  {edu.field !== "" && (
                    <Text style={styles.cardSubtitle}>{edu.field}</Text>
                  )}
                  <Text style={styles.cardInstitution}>{edu.institution}</Text>
                  {edu.graduationYear !== "" && (
                    <Text style={styles.cardDate}>{edu.graduationYear}</Text>
                  )}
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar educación en ${edu.institution}`}
                  style={styles.deleteButton}
                  onPress={() => handleDelete(edu.id)}
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
  cardInstitution: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 2,
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
