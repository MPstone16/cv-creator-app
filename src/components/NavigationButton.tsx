import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../theme/colors";

interface NavigationButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger";
    style?: ViewStyle;
    disabled?: boolean;
}

export const NavigationButton = ({
    title,
    onPress,
    variant = "primary",
    style,
    disabled = false,
}: NavigationButtonProps) =>{
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                pressed && variant === "primary" && styles.primaryPressed,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            accessibilityRole="button"
        >
            <Text
                style={[
                    styles.text,
                    variant === "secondary" && styles.textSecondary,
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button:{
        padding:16,
        borderRadius:8,
        alignItems:"center",
        marginVertical:8,
    },
    primary:{
        backgroundColor: Colors.primary,
    },
    primaryPressed: {
        backgroundColor: Colors.primaryDark,
    },
    secondary:{
        backgroundColor:"transparent",
        borderWidth:2,
        borderColor: Colors.border,
    },
    danger:{
        backgroundColor: Colors.danger,
    },
    disabled:{
        opacity:0.6,
    },
    text:{
        color: Colors.white,
        fontSize:16,
        fontWeight:"600",
    },
    textSecondary:{
        color: Colors.primary,
    }
})