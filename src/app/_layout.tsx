import {Stack} from "expo-router";
import { CVProvider } from "@/context/CVContext";
import { Colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <CVProvider>
      <Stack
        screenOptions={{
          headerStyle:{
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle:{
            fontWeight:"bold",
            color: Colors.white,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title:"Crear CV",
            headerShown:true,
          }}
        />
        <Stack.Screen
          name="personal-info"
          options={{
            title:"Información Perosnal",
          }}
        />
        <Stack.Screen
          name="experience"
          options={{
            title:"Experiencia Laboral",
          }}
        />
        <Stack.Screen
          name="education"
          options={{
            title:"Educación",
          }}
        />
        <Stack.Screen
          name="skills"
          options={{
            title:"Habilidades",
          }}
        />
        <Stack.Screen
          name="preview"
          options={{
            title:"Vista Previa",
            presentation:"modal",
          }}
        />
      </Stack>
    </CVProvider>
  );
}