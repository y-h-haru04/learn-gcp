import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Post } from "../@types";
import { useAuth } from "../components/AuthProvider";

export const usePostsSubscription = () => {
  const { firestore } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, "posts"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newPosts.push({
          ...data,
          createdAt: data.createdAt.toDate().toLocaleString(),
          id: doc.id,
        } as Post);
      });
      setPosts(newPosts);
    });
    return () => {
      unsubscribe();
    };
  }, [firestore]);

  return {
    posts,
  };
};
