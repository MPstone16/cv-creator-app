import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { InputField } from "@/components/InputField";
import { NavigationButton } from "@/components/NavigationButton";
import { useCVContext } from "@/context/CVContext";
import { Colors } from "@/theme/colors";
import {
  personalInfoSchema,
  PersonalInfoFormValues,
} from "@/schemas/personalInfo.schema";

export default function PersonalInfoScreen() {
  const router = useRouter();
  const { cvData, updatePersonalInfo, updatePhotoUri } = useCVContext();
  const [feedback, setFeedback] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: cvData.personalInfo.fullName,
      email: cvData.personalInfo.email,
      phone: cvData.personalInfo.phone,
      location: cvData.personalInfo.location,
      summary: cvData.personalInfo.summary,
    },
  });

  useEffect(() => {
    reset({
      fullName: cvData.personalInfo.fullName,
      email: cvData.personalInfo.email,
      phone: cvData.personalInfo.phone,
      location: cvData.personalInfo.location,
      summary: cvData.personalInfo.summary,
    });
  }, [
    cvData.personalInfo.fullName,
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.location,
    cvData.personalInfo.summary,
    reset,
  ]);

  const onValidSubmit: SubmitHandler<PersonalInfoFormValues> = (values) => {
    updatePersonalInfo(values);
    if (Platform.OS === "web") {
      router.back();
      return;
    }
    Alert.alert("Éxito", "Información guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const notifyUser = (title: string, message: string) => {
    if (Platform.OS === "web") {
      setFeedback(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const selectPhoto = async (source: "gallery" | "camera") => {
    setFeedback(null);
    try {
      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          notifyUser(
            "Permiso denegado",
            "Autoriza el acceso a la cámara en la configuración del dispositivo para tomar una foto.",
          );
          return;
        }
      }

      const result =
        source === "gallery"
          ? await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      if (result.canceled) {
        notifyUser(
          "Selección cancelada",
          "No se realizaron cambios en tu foto de perfil.",
        );
        return;
      }

      const photoUri = result.assets[0]?.uri;
      if (!photoUri) {
        notifyUser(
          "No se pudo obtener la foto",
          "Inténtalo de nuevo seleccionando o tomando otra imagen.",
        );
        return;
      }

      updatePhotoUri(photoUri);
    } catch (error) {
      console.error("Error al seleccionar la foto de perfil:", error);
      notifyUser(
        "Error",
        "No se pudo acceder a la imagen. Verifica los permisos e inténtalo de nuevo.",
      );
    }
  };

  const confirmRemovePhoto = () => {
    if (Platform.OS === "web") {
      updatePhotoUri(null);
      return;
    }

    Alert.alert(
      "Eliminar foto",
      "¿Quieres quitar la foto de perfil del currículum?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => updatePhotoUri(null),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {feedback && (
          <Text accessibilityLiveRegion="polite" style={styles.feedback}>
            {feedback}
          </Text>
        )}
        <View style={styles.photoSection}>
          <Text style={styles.photoTitle}>Foto de perfil</Text>
          {cvData.personalInfo.photoUri ? (
            <Image
              source={{ uri: cvData.personalInfo.photoUri }}
              style={styles.photo}
              accessibilityLabel="Foto de perfil seleccionada"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>
                Aún no has añadido una foto
              </Text>
            </View>
          )}
          <NavigationButton
            title="Elegir de la galería"
            onPress={() => selectPhoto("gallery")}
          />
          <NavigationButton
            title="Tomar una foto"
            onPress={() => selectPhoto("camera")}
            variant="secondary"
          />
          {cvData.personalInfo.photoUri && (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={confirmRemovePhoto}
              style={styles.removePhotoButton}
            >
              <Text style={styles.removePhotoText}>Quitar foto</Text>
            </TouchableOpacity>
          )}
        </View>

        <Controller
          control={control}
          name="fullName"
          render={({ field }) => (
            <InputField
              label="Nombre Completo *"
              placeholder="Adrian Lopez"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.fullName?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <InputField
              label="Email *"
              placeholder="mateo@gmail.com"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <InputField
              label="Teléfono"
              placeholder="+593 99 999 9999"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="phone-pad"
              error={errors.phone?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="location"
          render={({ field }) => (
            <InputField
              label="Ubicación"
              placeholder="Quito, Ecuador"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.location?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="summary"
          render={({ field }) => (
            <InputField
              label="Resumen Profesional"
              placeholder="Describe brevemente tu perfil profesional..."
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
              error={errors.summary?.message}
            />
          )}
        />
        <NavigationButton
          title="Guardar Información"
          onPress={handleSubmit(onValidSubmit)}
          disabled={isSubmitting}
        />
        <NavigationButton
          title="Cancelar"
          onPress={() => router.back()}
          variant="secondary"
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
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.cardBackground,
    borderLeftWidth: 3,
    borderLeftColor: Colors.border,
    borderRadius: 12,
  },
  feedback: {
    color: Colors.dark,
    backgroundColor: Colors.accent,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  photoTitle: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  photo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    marginBottom: 8,
  },
  photoPlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 8,
  },
  photoPlaceholderText: {
    color: Colors.textMuted,
    textAlign: "center",
  },
  removePhotoButton: {
    padding: 12,
  },
  removePhotoText: {
    color: Colors.danger,
    fontWeight: "600",
  },
});
