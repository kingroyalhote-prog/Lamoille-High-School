import Image from "next/image"

export default function Loading() {
  return (
    <main className="loading-screen">
      <div className="loading-inner">
        
        <div className="loading-logo-wrap">
          <Image
            src="/images/lamoille-logo.png"
            alt="Lamoille Logo"
            width={120}
            height={120}
            className="loading-logo"
            priority
          />
        </div>

        <h1>Lamoille High School</h1>
        <p>Loading experience...</p>

      </div>
    </main>
  )
}
