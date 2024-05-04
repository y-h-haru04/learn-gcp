import { ListItem, ListItemIcon, Button } from "@mui/material";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  title: string;
  to: string;
  icon: ReactNode;
};

const LinkButton = ({ title, to, icon }: Props) => {
  const location = useLocation();

  return (
    <ListItem sx={{ width: "100%" }}>
      <ListItemIcon sx={{ width: "100%" }}>
        <Link to={to} style={{ width: "100%" }}>
          <Button
            sx={{ width: "100%" }}
            startIcon={icon}
            disabled={location.pathname === to ? true : false}
            variant={location.pathname === to ? "contained" : undefined}
          >
            <span>{title}</span>
          </Button>
        </Link>
      </ListItemIcon>
    </ListItem>
  );
};

export default LinkButton;
