import "@fontsource/manrope/latin-400.css"
import "@fontsource/manrope/latin-600.css"
import "@fontsource/manrope/latin-700.css"
import "@fontsource/manrope/latin-800.css"
import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SummerSemesterPopup from "../components/SummerSemesterPopup"
import WebsiteAlert from "../components/WebsiteAlert"

export const metadata = {
  metadataBase: new URL("https://lamoille-high-school.vercel.app"),
  title: {
    default: "Lamoille ISD | Where Ambition Meets Opportunity",
    template: "%s | Lamoille ISD",
  },
  description:
    "Lamoille Independent School District is a focused virtual school community built around excellence, leadership, and opportunity.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Lamoille ISD | Where Ambition Meets Opportunity",
    description:
      "Learn, lead, compete, and belong at Lamoille Independent School District.",
    type: "website",
    images: [
      {
        url: "https://lamoille-high-school.vercel.app/og.png",
        width: 1672,
        height: 941,
        alt: "Lamoille ISD — Where Ambition Meets Opportunity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lamoille ISD | Where Ambition Meets Opportunity",
    description:
      "Learn, lead, and belong at Lamoille Independent School District.",
    images: ["https://lamoille-high-school.vercel.app/og.png"],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SummerSemesterPopup />

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />
          <WebsiteAlert />

          <div className="site-content">{children}</div>

          <Footer />
        </div>
      </body>
    </html>
  )
}
