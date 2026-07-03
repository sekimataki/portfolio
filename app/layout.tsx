import type { Metadata, Viewport } from "next";
import { Playfair_Display, Playfair, Manrope, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairVariable = Playfair({
  variable: "--font-playfair-variable",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz", "wdth"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sangyu Xi - Product Designer",
  description: "Design AI Teammates at Asana, Master in Design Engineering at Harvard",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${playfairVariable.variable} ${manrope.variable} ${montserrat.variable} min-h-[100dvh] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
