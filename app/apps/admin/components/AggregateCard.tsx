import { Card, Typography } from "@mui/material";

type Props = {
  title: string;
  content: string;
};

const AggregateCard = ({ title, content }: Props) => {
  return (
    <Card
      sx={{
        padding: "16px",
        textAlign: "center",
        flexBasis: "25%",
        margin: "0 8px 0 0",
      }}
    >
      <Typography component={"h3"}>{title}</Typography>
      <Typography
        component="strong"
        sx={{ fontWeight: "bold", fontSize: "24px", color: "#01cfbb" }}
      >
        {content}
      </Typography>
    </Card>
  );
};

export default AggregateCard;
