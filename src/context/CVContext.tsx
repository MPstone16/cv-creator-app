import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  CVData,
  PersonalInfo,
  Experience,
  Education,
  SkillCategory,
} from "../types/cv.types";

interface CVContextType {
  cvData: CVData;
  updatePersonalInfo: (info: Omit<PersonalInfo, "photoUri">) => void;
  updatePhotoUri: (photoUri: string | null) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Experience) => void;
  deleteExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Education) => void;
  deleteEducation: (id: string) => void;
  addSkill: (category: SkillCategory, skill: string) => void;
  deleteSkill: (category: SkillCategory, skill: string) => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const CVProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, setCVData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
      photoUri: null,
    },
    experiences: [],
    education: [],
    softSkills: [],
    hardSkills: [],
  });

  const updatePersonalInfo = (info: Omit<PersonalInfo, "photoUri">) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const updatePhotoUri = (photoUri: string | null) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, photoUri },
    }));
  };

  const addExperience = (exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, exp],
    }));
  };

  const updateExperience = (id: string, exp: Experience) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? exp : e)),
    }));
  };

  const deleteExperience = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  };

  const addEducation = (edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  const updateEducation = (id: string, edu: Education) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.map((e) => (e.id === id ? edu : e)),
    }));
  };

  const deleteEducation = (id: string) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  };

  const addSkill = (category: SkillCategory, skill: string) => {
    const normalizedSkill = skill.trim();
    if (!normalizedSkill) {
      return;
    }

    const skillsKey = category === "soft" ? "softSkills" : "hardSkills";
    setCVData((prev) => {
      const skills = prev[skillsKey];
      const duplicateExists = skills.some(
        (existingSkill) =>
          existingSkill.trim().toLowerCase() === normalizedSkill.toLowerCase(),
      );

      return duplicateExists
        ? prev
        : { ...prev, [skillsKey]: [...skills, normalizedSkill] };
    });
  };

  const deleteSkill = (category: SkillCategory, skill: string) => {
    const skillsKey = category === "soft" ? "softSkills" : "hardSkills";
    setCVData((prev) => ({
      ...prev,
      [skillsKey]: prev[skillsKey].filter(
        (existingSkill) => existingSkill !== skill,
      ),
    }));
  };

  return (
    <CVContext.Provider
      value={{
        cvData,
        updatePersonalInfo,
        updatePhotoUri,
        addExperience,
        updateExperience,
        deleteExperience,
        addEducation,
        updateEducation,
        deleteEducation,
        addSkill,
        deleteSkill,
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCVContext = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error("useCVContext debe usarse dentro de CVProvider");
  }
  return context;
};