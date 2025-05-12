export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  
      <body>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </body>
 
  )
}