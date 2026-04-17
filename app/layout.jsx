import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Lamoille High School",
  description: "Official school website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
