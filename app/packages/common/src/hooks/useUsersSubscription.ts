import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "../@types";
import { useAuth } from "../components/AuthProvider";

export const useUsersSubscription = () => {
  const { firestore } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newUsers: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newUsers.push({
          ...data,
          id: doc.id,
        } as User);
      });
      setUsers(newUsers);
    });
    return () => {
      unsubscribe();
    };
  }, [firestore]);

  return {
    users,
  };
};
