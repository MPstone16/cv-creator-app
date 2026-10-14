import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from "react-native";
import { Colors } from "../theme/colors";

interface InputFieldProps extends TextInputProps {
    label: string;
    error?:string;
}

export const InputField = ({
    label,
    error,
    onFocus,
    onBlur,
    ...props
}: InputFieldProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                ]}
                placeholderTextColor={Colors.textMuted}
                onFocus={(event) => {
                    setIsFocused(true);
                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    setIsFocused(false);
                    onBlur?.(event);
                }}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom:16,
    },
    label:{
        fontSize: 16,
        fontWeight:"600",
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    input:{
        borderWidth:1,
        borderColor: Colors.inputBorder,
        borderRadius:8,
        padding:12,
        fontSize:16,
        backgroundColor: Colors.cardBackground
    },
    inputFocused: {
        borderColor: Colors.border,
    },
    inputError:{
        borderColor: Colors.danger,
    },
    errorText:{
        color: Colors.danger,
        fontSize:12,
        marginTop:4,
    },
})