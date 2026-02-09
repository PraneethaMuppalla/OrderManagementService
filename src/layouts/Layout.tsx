import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background/50 flex flex-col">
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
