"use client";

import "./globals.css";
import { Layout, AuthProvider, FirestoreProvider } from "common";
import AccountBoxIcon from "@mui/icons-material/AccountBoxOutlined";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import MessageIcon from "@mui/icons-material/MessageOutlined";
import * as firebaseContext from "./firebase";
import { usePathname, useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    {
      title: "ダッシュボード",
      to: "/",
      icon: <BarChartIcon />,
    },
    {
      title: "ユーザー一覧",
      to: "/users",
      icon: <AccountBoxIcon />,
    },
    {
      title: "メッセージ一覧",
      to: "/posts",
      icon: <MessageIcon />,
    },
    {
      title: "プロフィール",
      to: "/profile",
      icon: <AccountBoxIcon />,
    },
  ];

  const onClickLink = (to: string) => {
    router.push(to);
  };

  const onClickAvatar = () => {
    router.push("/profile");
  };

  return (
    <html lang="en">
      <body>
        <AuthProvider adminOnly firebaseContext={firebaseContext}>
          <FirestoreProvider>
            <Layout
              title="GCP Sample Admin App"
              pathname={pathname}
              links={links}
              onClickAvatar={onClickAvatar}
              onClickLink={onClickLink}
            >
              {children}
            </Layout>
          </FirestoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
