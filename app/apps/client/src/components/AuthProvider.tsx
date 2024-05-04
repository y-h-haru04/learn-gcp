import { Backdrop, CircularProgress } from "@mui/material";
import { auth, firestore } from "../firebase";
import {
  useContext,
  createContext,
  useState,
  PropsWithChildren,
} from "react";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  User as FirebaseUser,
} from "firebase/auth";
import LoginPage from "./LoginPage";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "../@types";

export type AuthContextProps = {
  currentUser: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wait, setWait] = useState<boolean>(true);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  const logout = () => {
    return auth.signOut();
  };

  onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
    if (user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const snapshot = await getDoc(userDocRef)

      if (!snapshot.exists()) {
        const usersCollectionRef = collection(firestore, 'users')
        await setDoc(doc(usersCollectionRef, user.uid), {
          name: user.displayName,
          email: user.email,
          icon: user.photoURL,
          id: user.uid,
        });
      }

      const loginUserSnapshot = await getDoc(userDocRef);
      setCurrentUser({ ...loginUserSnapshot.data(), id: user.uid } as User);
    } else {
      setCurrentUser(null);
    }
    setWait(false)
  });

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {wait && <Backdrop sx={{color: '#fff', zIndex: 1000 }} open={wait}>
        <CircularProgress color='inherit' />
      </Backdrop>}
      {!currentUser ? <LoginPage /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
