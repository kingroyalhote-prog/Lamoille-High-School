import "./globals.css"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export const metadata = {
  title: "Lamoille High School",
  description: "Official website of Lamoille High School",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
export const metadata = {
  title: "Lamoille High School",
  description: "Official school website",
  icons: {
    icon: "/images/lamoille-logo.png",
  },
}
