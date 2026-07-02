import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SummerSemesterPopup from "../components/SummerSemesterPopup"
import WebsiteAlert from "../components/WebsiteAlert"

export const metadata = {
  title: "Lamoille ISD",
  description: "Where Ambition Meets Opportunity",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <SummerSemesterPopup />
        <WebsiteAlert />

        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Navbar />

          <main style={{ flex: 1 }}>
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  )
}
