import "./globals.css";

export const metadata = {
  title: "LMS Pro | Leave Management System",
  description: "Modern employee leave management solution",
};

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
