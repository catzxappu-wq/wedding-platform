import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CATZX DIGITAL INVITATION | Bespoke Luxury Digital Invitations",
  description: "Create, customize, manage, and share bespoke, luxury digital wedding invitations.",
  keywords: ["wedding invitations", "digital wedding cards", "CATZX DIGITAL INVITATION", "luxury invitations", "RSVP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Marcellus&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+Kannada:wght@400;600;700&family=Anek+Kannada:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FAF7F2] text-[#1F2937]">
        {children}
      </body>
    </html>
  );
}
