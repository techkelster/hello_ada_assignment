"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/tasks"); // Redirect to /tasks
  }, [router]);

  return null; // Render nothing while redirecting
};

export default RedirectPage;
