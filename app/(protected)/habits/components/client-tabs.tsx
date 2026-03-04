"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@/components/ui/tabs";

export default function ClientTabs({
  currentTab,
  children,
}: {
  currentTab: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      {children}
    </Tabs>
  );
}
