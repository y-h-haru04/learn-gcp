import {
  AppBar,
  Box,
  Button,
  Card,
  Container,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { CircleAvatar } from "./CircleAvatar";
import { AuthContextProps, useAuth } from "./AuthProvider";

type LinkProps = {
  title: string;
  to: string;
  icon: ReactNode;
};

type Props = {
  title: string;
  pathname: string;
  links: LinkProps[];
  children: ReactNode;
  onClickAvatar: () => void;
  onClickLink: (to: string) => void;
};

export const Layout = ({
  title,
  pathname,
  links,
  children,
  onClickAvatar,
  onClickLink,
}: Props) => {
  const { currentUser } = useAuth() as AuthContextProps;

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
              <Box sx={{ display: "flex" }}>
                <Typography
                  className="emphasize"
                  variant="h6"
                  noWrap
                  component="div"
                >
                  {title}
                </Typography>
              </Box>
            </Box>

            <Box>
              <CircleAvatar
                icon={currentUser?.icon || ""}
                name={currentUser?.name || ""}
                onClick={onClickAvatar}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box sx={{ display: "flex", height: "calc(100vh - 64px)" }}>
        <Card sx={{ minWidth: 200, borderRadius: 0, zIndex: 100 }}>
          <List>
            {links.map((link: LinkProps) => (
              <ListItem key={link.title} sx={{ width: "100%" }}>
                <Button
                  sx={{ width: "100%" }}
                  startIcon={link.icon}
                  variant={pathname === link.to ? "contained" : undefined}
                  onClick={() => onClickLink(link.to)}
                >
                  <span>{link.title}</span>
                </Button>
              </ListItem>
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
          {children}
        </Box>
      </Box>
    </>
  );
};
