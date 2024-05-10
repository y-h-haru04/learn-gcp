"use client";

import { Box, Card, Switch } from "@mui/material";
import {
  CircleAvatar,
  DataTable,
  User,
  UserAuth,
  useAuth,
  useFirestore,
} from "common";
import { collection, doc, setDoc } from "firebase/firestore";
import { ChangeEvent, useMemo } from "react";
import { firestore } from "../firebase";

const UserListPage = () => {
  const { currentUser } = useAuth();
  const { users } = useFirestore();

  const onChangeAuth = async (e: ChangeEvent<HTMLInputElement>, user: User) => {
    e.stopPropagation();
    const auth = e.target.checked ? UserAuth.Admin : UserAuth.Common;
    const usersCollectionRef = collection(firestore, "users");
    await setDoc(doc(usersCollectionRef, user.id), {
      ...user,
      auth,
    });
  };

  const cols = [
    {
      id: "icon",
      title: "アイコン",
      template: (user: User) => (
        <CircleAvatar name={user.name || ""} icon={user.icon || ""} />
      ),
    },
    { id: "name", title: "ユーザー名" },
    { id: "email", title: "メールアドレス" },
    {
      id: "auth",
      title: "管理者",
      template: (user: User) => {
        return (
          <Switch
            defaultChecked={user.auth === UserAuth.Admin}
            onChange={(e) => onChangeAuth(e, user)}
          ></Switch>
        );
      },
    },
  ] as const;

  const usersWithoutMe = useMemo(() => {
    if (!currentUser) {
      return users;
    }
    return users.filter((user) => user.id !== currentUser.id);
  }, [users, currentUser]);

  return (
    <Box sx={{ width: "100%" }}>
      <Card
        sx={{
          margin: "0 auto",
          padding: "8px 16px",
        }}
      >
        <DataTable<User> cols={cols} rows={usersWithoutMe} />
      </Card>
    </Box>
  );
};

export default UserListPage;
