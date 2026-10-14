import React, { useState } from "react";
import {
  DateTimePickerAndroid,
  default as DateTimePicker,
} from "@react-native-community/datetimepicker";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  calendarDateFromString,
  calendarDateToString,
  formatCalendarDate,
} from "../utils/date";
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = calendarDateFromString(value);
  const pickerValue =
    selectedDate ?? minimumDate ?? maximumDate ?? new Date();

  const openPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: pickerValue,
        mode: "date",
        minimumDate,
        maximumDate,
        onValueChange: (_event, date) => {
          onChange(calendarDateToString(date));
        },
      });
      return;
    }

    setIsOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controlRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label}: ${selectedDate ? formatCalendarDate(value) : placeholder}`}
          accessibilityHint="Abre el selector de fecha"
          onPress={openPicker}
          style={[
            styles.button,
            isOpen && styles.inputFocused,
            error && styles.inputError,
          ]}
        >
          <Text style={selectedDate ? styles.value : styles.placeholder}>
            {selectedDate ? formatCalendarDate(value) : placeholder}
          </Text>
        </Pressable>
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
      {Platform.OS === "ios" && isOpen && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={pickerValue}
            mode="date"
            display="spinner"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onValueChange={(_event, date) => {
              onChange(calendarDateToString(date));
            }}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsOpen(false)}
            style={styles.doneButton}
          >
            <Text style={styles.doneText}>Listo</Text>
          </Pressable>
        </View>
      )}
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
  button: {
    minHeight: 48,
    flex: 1,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
  },
  inputFocused: {
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  placeholder: {
    color: Colors.textMuted,
    fontSize: 16,
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
  pickerContainer: {
    marginTop: 8,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: Colors.cardBackground,
  },
  doneButton: {
    alignItems: "flex-end",
    padding: 12,
  },
  doneText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
