import type { Metadata } from "next";
import { Aleo } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer_component/footer"
//import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Aleo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manage you Deliveries",
  description: "Deleveries at a glance, take more informed decisions  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body className={`${inter.className}`}>
        <div className=" bg-gray-50  h-full flex flex-col py-1 px-2 sm:py-4 sm:px-8 md:px-14 scroll-smooth max-w-[2000px] mx-auto">
          <header className="mt-1">
            <Navbar></Navbar>
          </header>
          <div className="h-full overflow-scroll">
            <div className="">
              {children}
            </div>
            <footer className="" >
              <Footer></Footer>
            </footer>
          </div>

        </div>

      </body>
     {/* <GoogleAnalytics gaId="G-XYZ" /> */}
    </html>
  );
}
