"use client";

import { NotFoundPage } from "common";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  const onClickToTop = () => {
    router.push("/");
  };

  return <NotFoundPage onClickToTop={onClickToTop} />;
};

export default NotFound;
