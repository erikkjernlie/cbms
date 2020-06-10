import { firestore } from "firebase";

export interface ProjectData {
  name: string;
  createdAt: Date;
  users: string[];
  admins: string[];
  dashboards: string[];
  currentDashboard: string;
  models: [];
}

export interface ProjectInfo {
  admins: string[];
  createdAt: any;
  name: string;
  users: string[];
}

export interface ChatMessage {
  createdBy: string;
  createdAt: firestore.Timestamp;
  message: String;
  id: string;
}

export interface Profile {
  lastActive: Date;
  project: string;
  projects: string[];
  occupation: string;
  firstName: string;
  lastName: string;
  invites: string[];
  admin?: boolean;
  phoneNumber: string;
}

export interface User {
  email: string;
}
