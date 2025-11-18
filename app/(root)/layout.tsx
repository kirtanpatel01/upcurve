import SidebarClientWrapper from "@/components/SidebarClientWrapper";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarClientWrapper>
      {children}
    </SidebarClientWrapper>
  );
}
