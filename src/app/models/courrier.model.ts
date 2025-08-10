export interface Courrier {
  id?: number;
  numCourrier: string;
  objet: string;
  type: TypeCourrier;
  nature: NatureCourrier;
  pdfFile?: string;
  destinataire: string;
  expediteur: string;
  date: string; // Format ISO date string
  suivis?: Suivi[];
}

export enum TypeCourrier {
  INTERNE = 'INTERNE',
  EXTERNE = 'EXTERNE'
}

export enum NatureCourrier {
  ARRIVE = 'ARRIVE',
  DEPART = 'DEPART'
}

export interface Suivi {
  id?: number;
  courrier?: Courrier;
  instruction: string;
  description?: string;
  date: string; // Format ISO date string
}

export interface User {
  id?: number;
  nom: string;
  prenom: string;
  username: string;
  matricule: string;
  active: boolean;
  roleFonction: string;
  email: string;
  password?: string;
  telephone: string;
}

// DTOs pour les formulaires
export interface CourrierCreateRequest {
  numCourrier: string;
  objet: string;
  type: TypeCourrier;
  nature: NatureCourrier;
  destinataire: string;
  expediteur: string;
  date: string;
}

export interface SuiviCreateRequest {
  instruction: string;
  description?: string;
  date: string;
}

export interface UserCreateRequest {
  nom: string;
  prenom: string;
  username: string;
  matricule: string;
  roleFonction: string;
  email: string;
  password: string;
  telephone: string;
}

