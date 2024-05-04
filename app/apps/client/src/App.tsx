import {
  AppBar,
  Box,
  Card,
  Container,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBoxOutlined";
import MessageIcon from "@mui/icons-material/MessageOutlined";
import LinkButton from "./components/LinkButtton";
import { Navigate, Route, Routes } from "react-router-dom";
import UserListPage from "./components/UserListPage";
import ProfilePage from "./components/ProfilePage";
import UserDetailPage from "./components/UserDetailPage";
import { AuthContextProps, useAuth } from "./components/AuthProvider";
import CircleAvatar from "./components/CircleAvatar";

function App() {
  const { currentUser } = useAuth() as AuthContextProps;

  const links = [
    { title: "ユーザー一覧", to: "/users", icon: <MessageIcon /> },
    { title: "プロフィール", to: "/profile", icon: <AccountBoxIcon /> },
  ];

  return (
      <>
        <AppBar
          position="static"
          color="transparent"
          sx={{ zIndex: 1000, position: "sticky" }}
        >
          <Container maxWidth="xl" sx={{ display: "flex" }}>
            <Toolbar disableGutters sx={{ display: "flex", width: "100%" }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex' }}>
                  <Typography className='emphasize' variant="h6" noWrap component="div">
                    GCP Sample App
                  </Typography>
                </Box>
              </Box>

              <Box>
                <CircleAvatar icon={currentUser?.icon || ''} name={currentUser?.name || ''}  /> 
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
          <Card sx={{ minWidth: 200, borderRadius: 0, zIndex: 100 }}>
            <List>
              {links.map((link) => (
                <LinkButton
                  key={link.title}
                  to={link.to}
                  title={link.title}
                  icon={link.icon}
                ></LinkButton>
              ))}
            </List>
          </Card>

          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              margin: "16px",
            }}
          >
            <Routes>
              <Route path={"/"} element={<Navigate to="/users" />} />
              <Route path={"/users"} element={<UserListPage />} />
              <Route path={"/users/:userId"} element={<UserDetailPage />} />
              <Route path={"/profile"} element={<ProfilePage />} />
            </Routes>
          </Box>
        </Box>
      </>
  );
}

export default App;
