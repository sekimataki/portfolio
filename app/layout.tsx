import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mazeani = localFont({
  src: "../public/fonts/Mazaeni-Regular.ttf",
  variable: "--font-mazeani",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sangyu Xi - Product Designer",
  description: "Design AI Teammates at Asana, Master in Design Engineering at Harvard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} ${mazeani.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
