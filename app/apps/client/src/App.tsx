import AccountBoxIcon from "@mui/icons-material/AccountBoxOutlined";
import MessageIcon from "@mui/icons-material/MessageOutlined";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import UserListPage from "./components/UserListPage";
import UserDetailPage from "./components/UserDetailPage";
import {
  Layout,
  AuthProvider,
  NotFoundPage,
  ProfilePage,
  FirestoreProvider,
} from "common";
import * as firebaseContext from "./firebase";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const onClickToTop = () => {
    navigate("/");
  };

  const links = [
    { title: "ユーザー一覧", to: "/users", icon: <MessageIcon /> },
    { title: "プロフィール", to: "/profile", icon: <AccountBoxIcon /> },
  ];

  const onClickAvatar = () => {
    navigate("/profile");
  };

  const onClickLink = (to: string) => {
    navigate(to);
  };

  return (
    <AuthProvider firebaseContext={firebaseContext}>
      <FirestoreProvider>
        <Routes>
          {/* <Route path={"/login"} element={<LoginPage />} /> */}
          <Route
            path="/"
            element={
              <Layout
                title="GCP Sample Client App"
                links={links}
                pathname={location.pathname}
                onClickAvatar={onClickAvatar}
                onClickLink={onClickLink}
              >
                <Outlet />
              </Layout>
            }
          >
            <Route index element={<Navigate to="/users" />} />
            <Route path={"/users"} element={<UserListPage />} />
            <Route path={"/users/:userId"} element={<UserDetailPage />} />
            <Route path={"/profile"} element={<ProfilePage />} />
            <Route
              path={"*"}
              element={<NotFoundPage onClickToTop={onClickToTop} />}
            />
          </Route>
        </Routes>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default App;
