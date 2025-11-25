import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

function Providers({ children }: { children: React.ReactNode }) {
  return (
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
  );
}

export default Providers;
