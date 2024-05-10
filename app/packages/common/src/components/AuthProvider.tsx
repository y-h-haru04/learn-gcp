import { Alert, Backdrop, CircularProgress } from "@mui/material";
import { useContext, createContext, useState, ReactNode } from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  User as FirebaseUser,
  Auth,
} from "firebase/auth";
import { Firestore, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseContext, User, UserAuth } from "../@types";
import LoginPage from "./LoginPage";
import { FirebaseApp } from "firebase/app";
import { FirebaseStorage } from "firebase/storage";
import { Functions } from "firebase/functions";

export type AuthContextProps = {
  currentUser: User | null;
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  functions: Functions;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | null>(null);

type Props = {
  adminOnly?: boolean;
  children: ReactNode;
  firebaseContext: FirebaseContext;
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextProps;
};

export const AuthProvider = ({
  adminOnly = false,
  children,
  firebaseContext,
}: Props) => {
  const { auth, firestore } = firebaseContext;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wait, setWait] = useState<boolean>(true);
  const [showAdminAlert, setShowAdminAlert] = useState<boolean>(false);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const logout = () => {
    return auth.signOut();
  };

  onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      const snapshot = await getDoc(userDocRef);

      if (!snapshot.exists()) {
        if (adminOnly) {
          setShowAdminAlert(true);
          setCurrentUser(null);
          setWait(false);
          return;
        }

        const usersCollectionRef = collection(firestore, "users");
        await setDoc(doc(usersCollectionRef, user.uid), {
          name: user.displayName,
          email: user.email,
          icon: user.photoURL,
          id: user.uid,
          auth: UserAuth.Common,
        });
      }

      const loginUserSnapshot = await getDoc(userDocRef);
      const userInfo = loginUserSnapshot.data() as User;
      if (adminOnly && userInfo.auth !== UserAuth.Admin) {
        setShowAdminAlert(true);
        setCurrentUser(null);
      } else {
        setShowAdminAlert(false);
        setCurrentUser({ ...userInfo, id: user.uid } as User);
      }
    } else {
      setShowAdminAlert(false);
      setCurrentUser(null);
    }
    setWait(false);
  });

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        ...firebaseContext,
        login,
        logout,
      }}
    >
      {wait && (
        <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={wait}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {showAdminAlert && (
        <Alert severity="error">管理者のみログイン可能です</Alert>
      )}
      {!currentUser ? wait ? <></> : <LoginPage /> : children}
    </AuthContext.Provider>
  );
};
