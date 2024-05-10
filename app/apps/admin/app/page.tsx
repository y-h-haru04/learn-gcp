"use client";

import { Box } from "@mui/material";
import AggregateCard from "../components/AggregateCard";
import AggregationSectionCard from "../components/AggregationSectionCard";
import { useFirestore } from "common";
import { useMemo } from "react";

const DashboardPage = () => {
  const { posts } = useFirestore();

  const messageAggregationList = useMemo(() => {
    let avgLength = 0;
    if (posts.length) {
      avgLength =
        posts.reduce((acc, cur) => acc + cur.content.length, 0) / posts.length;
    }

    const lengthList = posts.map((post) => post.content.length);
    const maxLen = lengthList.length > 0 ? Math.max(...lengthList) : 0;
    const minLen = lengthList.length > 0 ? Math.min(...lengthList) : 0;
    return [
      { title: "Count", content: posts.length.toString() },
      { title: "Average Length", content: avgLength.toString() },
      { title: "Max Length", content: maxLen.toString() },
      { title: "Min Length", content: minLen.toString() },
    ];
  }, [posts]);

  return (
    <Box sx={{ width: "100%" }}>
      <AggregationSectionCard title="Messages">
        {messageAggregationList.map((elem) => (
          <AggregateCard
            key={elem.title}
            title={elem.title}
            content={elem.content}
          />
        ))}
      </AggregationSectionCard>
    </Box>
  );
};

export default DashboardPage;
