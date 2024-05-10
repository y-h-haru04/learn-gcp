import { Box, Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { User } from "../@types";
import {
  useAuth,
  AuthContextProps,
  CircleAvatar,
  DataTable,
  useFirestore,
} from "common";
import { useMemo } from "react";

const UserListPage = () => {
  const { currentUser } = useAuth() as AuthContextProps;
  const { users } = useFirestore();
  const navigate = useNavigate();

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
  ] as const;

  const onClickRow = (user: User) => {
    navigate(`/users/${user.id}`);
  };

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
        <DataTable<User>
          cols={cols}
          rows={usersWithoutMe}
          onClickRow={onClickRow}
        />
      </Card>
    </Box>
  );
};

export default UserListPage;
