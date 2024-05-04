import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useCalcOffset from "../hooks/useCalcOffset";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import type { User } from "../@types";
import CircleAvatar from "./CircleAvatar";
import { useAuth, AuthContextProps } from "./AuthProvider";

const UserListPage = () => {
  const { currentUser } = useAuth() as AuthContextProps;
  const navigate = useNavigate();
  const { ref: tableBodyRef, offset } =
    useCalcOffset<HTMLTableSectionElement>();

  const [users, setUsers] = useState<User[]>([]);

  const onClickRow = (id: string) => {
    navigate(`/users/${id}`);
  };

  useEffect(() => {
    const fetchUserList = async () => {
      const usersCollectionRef = collection(firestore, "users");
      const q = query(usersCollectionRef, where('id', '!=', currentUser?.id), )
      const snapshot = await getDocs(q);
      setUsers(
        snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id } as User;
        })
      );
    }

    fetchUserList();
  }, []);

  return (
    <Card
      sx={{
        margin: "0 auto",
        padding: "8px 16px",
      }}
    >

      <Box>
        <TableContainer
          ref={tableBodyRef}
          sx={{
            overflowY: "scroll",
            width: "100%",
            height: `calc(100vh - ${offset}px)`,
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>アイコン</TableCell>
                <TableCell>ユーザー名</TableCell>
                <TableCell>メールアドレス</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.name}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { background: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                  onClick={() => onClickRow(user.id)}
                >
                  <TableCell>
                    <CircleAvatar icon={user?.icon || ''} name={user?.name || ''}  />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Card>
  );
};

export default UserListPage;
