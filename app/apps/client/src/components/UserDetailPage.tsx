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
import { ChangeEvent, useMemo, useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { CircleAvatar, useFirestore } from "common";
import { AuthContextProps, useAuth } from "common";

const UserDetailPage = () => {
  const params = useParams();
  const { currentUser } = useAuth() as AuthContextProps;
  const { ref, offset } = useCalcOffset();
  const { users, posts } = useFirestore();

  const [input, setInput] = useState<string>("");

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onClickPost = async () => {
    addDoc(collection(firestore, "posts"), {
      content: input,
      fromUserId: currentUser?.id,
      toUserId: user?.id,
      createdAt: Timestamp.fromDate(new Date()),
    });
    setInput("");
  };

  const canPost = useMemo<boolean>(() => {
    return input.length > 0;
  }, [input]);

  const user = useMemo(() => {
    if (!params.userId) {
      return null;
    }
    return users.find((user) => user.id === params.userId);
  }, [users, params.userId]);

  const targetPosts = useMemo(() => {
    if (!params.userId) {
      return [];
    }
    return posts.filter((post) => post.toUserId === params.userId);
  }, [params.userId, posts]);

  const refinedPosts = useMemo(() => {
    return targetPosts.map((post) => {
      return {
        ...post,
        fromUser: users.find((user) => user.id === post.fromUserId),
      };
    });
  }, [users, targetPosts]);

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
            <CircleAvatar icon={user?.icon || ""} name={user?.name || ""} />
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

        <Box sx={{ display: "flex", margin: "8px 0", padding: "8px 16px" }}>
          <Input
            sx={{ flexGrow: 1, outline: "none" }}
            value={input}
            onChange={onChangeInput}
          />
          <Button disabled={!canPost} onClick={onClickPost}>
            投稿
          </Button>
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
                  userName={post.fromUser?.name || ""}
                  icon={post.fromUser?.icon || ""}
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
