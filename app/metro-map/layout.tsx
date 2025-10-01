"use client";

import { ReactNode } from "react";
import Layout from "@/components/kokonutui/layout";

interface MetroMapLayoutProps {
  children: ReactNode;
}

export default function MetroMapLayout({ children }: MetroMapLayoutProps) {
  return <Layout>{children}</Layout>;
}