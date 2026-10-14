import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { CVData } from "../types/cv.types";
import { formatCalendarDate } from "../utils/date";
import { Colors } from "../theme/colors";

interface CVPreviewProps {
  cvData: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ cvData }) => {
  const { personalInfo, experiences, education, softSkills, hardSkills } = cvData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Header con información personal */}
        <View style={styles.header}>
          <View style={styles.headerDetails}>
            <Text style={styles.name}>
              {personalInfo.fullName || "Tu Nombre"}
            </Text>
            <View style={styles.contactInfo}>
              {personalInfo.email && (
                <Text style={styles.contactText}>📧 {personalInfo.email}</Text>
              )}
              {personalInfo.phone && (
                <Text style={styles.contactText}>📱 {personalInfo.phone}</Text>
              )}
              {personalInfo.location && (
                <Text style={styles.contactText}>📍 {personalInfo.location}</Text>
              )}
            </View>
          </View>
          {personalInfo.photoUri && (
            <Image
              source={{ uri: personalInfo.photoUri }}
              style={styles.profilePhoto}
              accessibilityLabel="Foto de perfil"
            />
          )}
        </View>

        {/* Resumen profesional */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMEN PROFESIONAL</Text>
            <Text style={styles.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Experiencia laboral */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.itemDate}>
                  {formatCalendarDate(exp.startDate)} -{" "}
                  {exp.endDate ? formatCalendarDate(exp.endDate) : "Actual"}
                </Text>
                {exp.description && (
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Educación */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            {education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <Text style={styles.itemTitle}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.itemSubtitle}>{edu.field}</Text>
                )}
                <Text style={styles.itemInstitution}>{edu.institution}</Text>
                {edu.graduationYear && (
                  <Text style={styles.itemDate}>{edu.graduationYear}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {softSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES BLANDAS</Text>
            <Text style={styles.skillsText}>{softSkills.join(" · ")}</Text>
          </View>
        )}

        {hardSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HABILIDADES DURAS</Text>
            <Text style={styles.skillsText}>{hardSkills.join(" · ")}</Text>
          </View>
        )}

        {/* Mensaje si no hay datos */}
        {!personalInfo.fullName &&
          !personalInfo.photoUri &&
          experiences.length === 0 &&
          education.length === 0 &&
          softSkills.length === 0 &&
          hardSkills.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay información para mostrar.{"\n"}
                Completa las secciones para ver tu CV.
              </Text>
            </View>
          )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border,
    paddingBottom: 16,
    marginBottom: 24,
  },
  headerDetails: {
    flex: 1,
  },
  profilePhoto: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 12,
  },
  contactInfo: {
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginBottom: 12,
    letterSpacing: 1,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  skillsText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  item: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  itemInstitution: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: "italic",
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
});
