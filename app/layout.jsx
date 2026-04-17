import "./globals.css"
import Footer from "../components/Footer"

export const metadata = {
  title: "Lamoille High School",
  description: "Official website of Lamoille High School",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* MAIN CONTENT */}
        {children}

        {/* GLOBAL FOOTER */}
        <Footer />

      </body>
    </html>
  )
}
