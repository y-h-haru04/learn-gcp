import { Box, Card, Divider, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

const AggregationSectionCard = ({ title, children }: Props) => {
  return (
    <Card
      sx={{
        margin: "0 auto",
        padding: "8px 16px",
        maxWidth: "800px",
      }}
    >
      <Typography
        component={"h2"}
        sx={{ display: "inline-block" }}
        className="emphasize"
      >
        {title}
      </Typography>

      <Divider />

      <Box
        sx={{
          padding: "12px 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {children}
      </Box>
    </Card>
  );
};

export default AggregationSectionCard;
