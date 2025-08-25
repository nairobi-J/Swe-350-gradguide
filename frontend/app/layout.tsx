export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body >
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <div className="hidden-scrollbar">
       <main>{children}</main>
        </div>
       
      </body>
    </html>
  )
}