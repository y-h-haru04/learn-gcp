"use client";

import { Box, Card } from "@mui/material";
import { DataTable, Post, useFirestore } from "common";
import { useMemo } from "react";

const PostListPage = () => {
  const { posts, users } = useFirestore();

  const cols = [
    { id: "createdAt", title: "投稿日時" },
    { id: "content", title: "投稿内容" },
    { id: "fromUserName", title: "ユーザー名(from)" },
    { id: "toUserName", title: "ユーザー名(to)" },
  ] as const;

  const userIdToNameDict = useMemo(() => {
    return users.reduce(
      (acc, cur) => {
        acc[cur.id] = cur.name;
        return acc;
      },
      {} as { [key: string]: string }
    );
  }, [users]);

  const refinedPosts = useMemo(() => {
    return posts.map((post) => {
      const fromUserName = userIdToNameDict[post.fromUserId];
      const toUserName = userIdToNameDict[post.toUserId];
      return {
        ...post,
        fromUserName: fromUserName || "",
        toUserName: toUserName || "",
      };
    });
  }, [userIdToNameDict, posts]);

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          margin: "0 auto",
          padding: "8px 16px",
        }}
      >
        <DataTable<Post> cols={cols} rows={refinedPosts} />
      </Card>
    </Box>
  );
};

export default PostListPage;
