import { Avatar, IconButton } from "@mui/material";
import { useMemo } from "react";

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

const stringAvatar = (name: string) => {
  const [fst, snd] = name.split(' ')
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${fst?.[0] || ''}${snd?.[0] || ''}`,
  };
}

type Props = {
  name: string;
  icon: string;
  onClick?: () => void;
}

const CircleAvatar = ({ name, icon, onClick }: Props) => {
  const props = useMemo(() => {
    if (icon?.length > 0) {
      return { src: icon, ...stringAvatar(name) }
    }
    return stringAvatar(name)
  }, [icon, name])

  return (
    <IconButton onClick={onClick} sx={{ p: 0 }}>
      <Avatar {...props} />
    </IconButton>
  )
}

export default CircleAvatar;