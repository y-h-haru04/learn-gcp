import { PropsWithChildren, createContext, useContext } from "react";
import { Post, User } from "../@types";
import { useUsersSubscription } from "../hooks/useUsersSubscription";
import { usePostsSubscription } from "../hooks/usePostsSubscription";

export type FirestoreProviderProps = {
  users: User[];
  posts: Post[];
};

const FirestoreContext = createContext<FirestoreProviderProps | null>(null);

export const useFirestore = () => {
  return useContext(FirestoreContext) as FirestoreProviderProps;
};

export const FirestoreProvider = ({ children }: PropsWithChildren) => {
  const { users } = useUsersSubscription();
  const { posts } = usePostsSubscription();

  return (
    <FirestoreContext.Provider
      value={{
        users,
        posts,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};
