import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { Functions } from "firebase/functions";
import { FirebaseStorage } from "firebase/storage";

export type User = {
  id: string;
  name: string;
  email: string;
  icon: string;
  auth: UserAuth;
};

export enum UserAuth {
  Common,
  Admin,
}

export type Post = {
  id: string;
  toUserId: string;
  fromUserId: string;
  toUserName?: string;
  fromUserName?: string;
  content: string;
  createdAt: string;
  fromUser?: User;
};

export type FirebaseContext = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
  functions: Functions;
};
