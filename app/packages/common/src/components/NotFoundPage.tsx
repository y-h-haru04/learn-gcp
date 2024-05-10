import { QuestionMarkOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Card, Typography } from "@mui/material";

type Props = {
  onClickToTop: () => void;
};

export const NotFoundPage = ({ onClickToTop }: Props) => {
  return (
    <Box
      sx={{
        transform: "translateY(-50%) translateX(-50%)",
        top: "50%",
        left: "50%",
        position: "absolute",
      }}
    >
      <Card sx={{ width: "400px", margin: "0 auto", padding: "48px 16px" }}>
        <Box sx={{ textAlign: "center" }}>
          <Avatar sx={{ bgcolor: "#1f6cfa", margin: "8px auto" }}>
            <QuestionMarkOutlined />
          </Avatar>
          <Typography component="h2" sx={{ fontSize: "24px" }}>
            404 NotFound
          </Typography>
          <Button
            className="emphasize"
            onClick={onClickToTop}
            variant="outlined"
            sx={{ marginTop: "16px" }}
          >
            Topへ
          </Button>
        </Box>
      </Card>
    </Box>
  );
};
