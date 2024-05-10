import { Avatar, IconButton } from "@mui/material";
import { getBlob, ref } from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const stringAvatar = (name: string) => {
  const [fst, snd] = name.split(" ");
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${fst?.[0] || ""}${snd?.[0] || ""}`,
  };
};

type Props = {
  name: string;
  icon: string;
  onClick?: () => void;
};

export const CircleAvatar = ({ name, icon, onClick }: Props) => {
  const { storage } = useAuth();
  const [iconSrc, setIconSrc] = useState<string>("");

  const props = useMemo(() => {
    if (iconSrc?.length > 0) {
      return { src: iconSrc, ...stringAvatar(name) };
    }
    return stringAvatar(name);
  }, [iconSrc, name]);

  useEffect(() => {
    if (!icon) {
      return;
    }
    const fetchIcon = async () => {
      const iconRef = ref(storage, icon);
      const blob = await getBlob(iconRef);
      setIconSrc(URL.createObjectURL(blob));
    };
    if (icon.startsWith("http") || icon.startsWith("https")) {
      return setIconSrc(icon);
    }
    fetchIcon();
  }, [icon]);

  return (
    <IconButton onClick={onClick} sx={{ p: 0 }}>
      <Avatar {...props} />
    </IconButton>
  );
};
