import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer_component/footer"
//import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ease Your Tasks - Smart Delivery Management Platform",
          description: "Streamline your delivery operations with smart route optimization, real-time tracking, and comprehensive logistics management. Take control of your deliveries with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-slate-50">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <Navbar />
            </div>
          </header>
          
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
              {children}
            </div>
          </main>
          
          <footer className="bg-white border-t border-slate-200/60 mt-8 sm:mt-12">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
              <Footer />
            </div>
          </footer>
        </div>
      </body>
     {/* <GoogleAnalytics gaId="G-XYZ" /> */}
    </html>
  );
}
