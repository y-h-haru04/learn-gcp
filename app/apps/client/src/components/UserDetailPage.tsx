import {
  Box,
  Button,
  Card,
  Divider,
  Input,
  List,
  Typography,
} from "@mui/material";
import CommentItem from "./CommentItem";
import { useParams } from "react-router-dom";
import useCalcOffset from "../hooks/useCalcOffset";
import { firestore } from "./../firebase";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import CircleAvatar from "./CircleAvatar";
import { User } from "../@types";
import { AuthContextProps, useAuth } from "./AuthProvider";
import useUsersSubscription from "../hooks/useUsersSubscription";

type Post = {
  id: string;
  toUserId: string;
  fromUserId: string;
  content: string;
  createdAt: string;
  fromUser?: User;
};

const UserDetailPage = () => {
  const params = useParams();
  const { currentUser } = useAuth() as AuthContextProps;
  const { users } = useUsersSubscription()
  const { ref, offset } = useCalcOffset();

  const [input, setInput] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null)

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const onClickPost = async () => {
    addDoc(collection(firestore, 'posts'), {
      content: input,
      fromUserId: currentUser?.id,
      toUserId: user?.id,
      createdAt: Timestamp.fromDate(new Date()),
    })
    setInput('');
  }

  const fetchUser = useCallback(async () => {
    if (!params.userId) {
      return;
    }
    const userDocRef = doc(firestore, 'users', params.userId)
    const snapshot = await getDoc(userDocRef)
    const data = snapshot.data()
    if (data) {
      setUser({ ...data, id: data.id } as User)
    }
  }, [params.userId])

  useEffect(() => {
    if (!params.userId) {
      return;
    }
    const q = query(
      collection(firestore, 'posts'),
      where('toUserId', '==', params.userId),
      orderBy('createdAt', 'desc')
    )
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts: Post[] = []
      snapshot.forEach((doc) => {
        const data = doc.data();
        newPosts.push({
          ...data,
          createdAt: data.createdAt.toDate().toLocaleString(),
          id: doc.id,
        } as Post);
      })
      setPosts(newPosts)
    })

    return () => {
      unsubscribe();
    }
  }, [params.userId])
  

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const canPost = useMemo<boolean>(() => {
    return input.length > 0
  }, [input])

  const refinedPosts = useMemo(() => {
    return posts.map((post) => {
      return {
        ...post,
        fromUser: users.find((user) => user.id === post.fromUserId)
      }
    })
  }, [users, posts])

  return (
    <>
      <Card
        sx={{
          margin: "0 auto",
          width: "500px",
          padding: "8px 0",
        }}
      >
        <Box sx={{ display: "flex", margin: "0 auto" }}>
          <Box sx={{ padding: "8px 12px" }}>
            <CircleAvatar icon={user?.icon || ''} name={user?.name || ''} /> 
          </Box>

          <Box
            sx={{ display: "flex", flexDirection: "column", margin: "8px 0" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "4px",
              }}
            >
              <small>UserName</small>
              <Typography>{user?.name}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "4px",
              }}
            >
              <small>Email</small>
              <Typography>{user?.email}</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ display: "flex", margin: "8px 0", padding: "8px 16px", }}> 
          <Input sx={{ flexGrow: 1, outline: "none" }} value={input} onChange={onChangeInput} />
          <Button disabled={!canPost} onClick={onClickPost}>投稿</Button>
        </Box>

        <Box
          ref={ref}
          sx={{ overflowY: "scroll", height: `calc(100vh - ${offset}px)` }}
        >
          <List>
            {refinedPosts.map((post) => {
              return (
                <CommentItem
                  key={post.id}
                  content={post.content}
                  userName={post.fromUser?.name || ''}
                  icon={post.fromUser?.icon || ''}
                  postedAt={post.createdAt}
                />
              );
            })}
          </List>
        </Box>
      </Card>
    </>
  );
};

export default UserDetailPage;
