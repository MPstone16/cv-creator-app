import React, { createElement, useId } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { calendarDateToString } from "../utils/date";
import { DatePickerFieldProps } from "./DatePickerField.types";
import { Colors } from "../theme/colors";

export type { DatePickerFieldProps } from "./DatePickerField.types";

export function DatePickerField({
  label,
  value,
  onChange,
  error,
  placeholder = "Selecciona una fecha",
  minimumDate,
  maximumDate,
  optional = false,
}: DatePickerFieldProps) {
  const inputId = useId();
  const inputStyle: React.CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    minHeight: 48,
    border: `1px solid ${error ? Colors.danger : Colors.inputBorder}`,
    borderRadius: 8,
    padding: "12px",
    backgroundColor: Colors.cardBackground,
    color: Colors.textPrimary,
    fontSize: 16,
  };

  return (
    <View style={styles.container}>
      <Text nativeID={`${inputId}-label`} style={styles.label}>
        {label}
      </Text>
      <View style={styles.controlRow}>
        {createElement("input", {
          id: inputId,
          type: "date",
          value,
          min: minimumDate ? calendarDateToString(minimumDate) : undefined,
          max: maximumDate ? calendarDateToString(maximumDate) : undefined,
          placeholder,
          "aria-labelledby": `${inputId}-label`,
          "aria-invalid": Boolean(error),
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            onChange(event.currentTarget.value),
          style: inputStyle,
        })}
        {optional && value !== "" && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Limpiar ${label.toLocaleLowerCase()}`}
            onPress={() => onChange("")}
            style={styles.clearButton}
          >
            <Text style={styles.clearText}>Limpiar</Text>
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  controlRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearButton: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  clearText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
