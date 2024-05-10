import { Box, Button, Card, Input } from "@mui/material";
import { AuthContextProps, useAuth } from "common";
import { collection, doc, setDoc } from "firebase/firestore";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { CircleAvatar } from "./CircleAvatar";
import { ref, uploadBytes } from "firebase/storage";

export const ProfilePage = () => {
  const { firestore, storage } = useAuth();
  const imageUploadRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const { currentUser, logout } = useAuth() as AuthContextProps;

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangeImageUploadInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file && currentUser) {
      const path = `images/${currentUser.id}-${new Date().toLocaleTimeString()}`;
      const imageRef = ref(storage, path);
      await uploadBytes(imageRef, file);

      const usersCollectionRef = collection(firestore, "users");
      await setDoc(doc(usersCollectionRef, currentUser.id), {
        ...currentUser,
        icon: path,
      });
    }
  };

  const onClickAvatar = () => {
    imageUploadRef.current?.click();
  };

  const updateUserInfo = async () => {
    const usersCollectionRef = collection(firestore, "users");
    await setDoc(doc(usersCollectionRef, currentUser?.id), {
      ...currentUser,
      name,
      email,
    });
  };

  useEffect(() => {
    setName(currentUser?.name || "");
    setEmail(currentUser?.email || "");
  }, [currentUser]);

  const canUpdate = useMemo<boolean>(() => {
    return name !== currentUser?.name || email !== currentUser?.email;
  }, [currentUser, name, email]);

  return (
    <div>
      <Card
        sx={{
          margin: "0 auto",
          width: "500px",
          padding: "8px 16px",
        }}
      >
        <Box sx={{ display: "flex", margin: "0 auto" }}>
          <Box sx={{ padding: "8px 12px" }}>
            <CircleAvatar
              icon={currentUser?.icon || ""}
              name={currentUser?.name || ""}
              onClick={onClickAvatar}
            />
            <input
              type="file"
              ref={imageUploadRef}
              style={{ display: "none" }}
              onChange={onChangeImageUploadInput}
            />
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
              <label htmlFor="user-name-input">ユーザー名</label>
              <Input
                id="user-name-input"
                sx={{ flexGrow: 1, outline: "none" }}
                defaultValue={currentUser?.name || ""}
                onChange={onChangeName}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "4px",
              }}
            >
              <label htmlFor="email-input">メールアドレス</label>
              <Input
                id="email-input"
                sx={{ flexGrow: 1, outline: "none" }}
                defaultValue={currentUser?.email || ""}
                onChange={onChangeEmail}
              />
            </Box>

            <Box sx={{ marginTop: "4px" }}>
              <Button disabled={!canUpdate} onClick={updateUserInfo}>
                更新
              </Button>
              <Button color="error" onClick={logout}>
                ログアウト
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </div>
  );
};
