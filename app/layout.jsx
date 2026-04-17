import "./globals.css"
import Footer from "../components/Footer"

export const metadata = {
  title: "Lamoille High School",
  description: "Official website of Lamoille High School",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>

        {/* Page Content */}
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          
          <main style={{ flex: 1 }}>
            {children}
          </main>

          {/* Footer */}
          <Footer />

        </div>

      </body>
    </html>
  )
}
