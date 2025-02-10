import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-serif py-10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="relative h-[400px] bg-center bg-no-repeat bg-cover mb-[-50px]"
               style={{ backgroundImage: "url(/404.jpg)" }}>
            <h1 className="absolute inset-0 flex items-center justify-center text-8xl font-bold">
              404
            </h1>
          </div>

          <div className="mt-12">

            <p className="mb-8">
              The page you are looking for is not available!
            </p>

            <Link href="/" 
                  className="inline-block px-5 py-2 bg-[#39ac31] text-white hover:bg-[#2d8a26] transition-colors">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
