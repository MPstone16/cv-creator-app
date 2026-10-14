export interface PersonalInfo{
    fullName: string;
    email:string;
    phone:string;
    location:string;
    summary:string;
    photoUri: string | null;
}

export type SkillCategory = "soft" | "hard";

export interface Experience {
    id:string;
    company:string;
    position:string;
    startDate:string;
    endDate:string;
    description:string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
}

export interface CVData {
    personalInfo: PersonalInfo;
    experiences: Experience[];
    education: Education[];
    softSkills: string[];
    hardSkills: string[];
}