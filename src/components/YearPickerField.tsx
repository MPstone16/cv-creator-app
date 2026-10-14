import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "../theme/colors";

interface YearPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function YearPickerField({
  label,
  value,
  onChange,
  error,
  placeholder = "Selecciona un año",
}: YearPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear + 20 - 1900 + 1 },
    (_unused, index) => String(currentYear + 20 - index)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value || placeholder}`}
        accessibilityHint="Abre la lista de años"
        onPress={() => setIsOpen(true)}
        style={[
          styles.button,
          isOpen && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        <Text style={value ? styles.value : styles.placeholder}>
          {value || placeholder}
        </Text>
      </Pressable>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {isOpen && (
        <Modal
          visible
          animationType="slide"
          transparent
          onRequestClose={() => setIsOpen(false)}
        >
          <View style={styles.modalRoot}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cerrar selector de año"
              onPress={() => setIsOpen(false)}
              style={styles.backdrop}
            />
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>{label}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsOpen(false)}
                  hitSlop={8}
                >
                  <Text style={styles.closeText}>Cerrar</Text>
                </Pressable>
              </View>
              <FlatList
                data={years}
                keyExtractor={(year) => year}
                initialScrollIndex={
                  value && years.includes(value) ? years.indexOf(value) : 0
                }
                getItemLayout={(_data, index) => ({
                  length: 52,
                  offset: 52 * index,
                  index,
                })}
                renderItem={({ item }) => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: item === value }}
                    onPress={() => {
                      onChange(item);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.yearItem,
                      item === value && styles.selectedYearItem,
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        item === value && styles.selectedYearText,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
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
  button: {
    minHeight: 48,
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
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  sheet: {
    maxHeight: "75%",
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: Colors.cardBackground,
  },
  sheetHeader: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: {
    color: Colors.primaryDark,
    fontSize: 18,
    fontWeight: "600",
  },
  closeText: {
    color: Colors.primary,
    fontSize: 16,
  },
  yearItem: {
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.inputBorder,
  },
  selectedYearItem: {
    backgroundColor: Colors.accent,
  },
  yearText: {
    color: Colors.textPrimary,
    fontSize: 18,
  },
  selectedYearText: {
    color: Colors.dark,
    fontWeight: "700",
  },
});
