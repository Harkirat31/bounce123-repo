import type { Metadata } from "next";
import { Saira } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer_component/footer"

const inter = Saira({ subsets: ["latin"] });

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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className}`}>
        <div className=" bg-gray-50  h-full flex flex-col">
          <header className="py-4 px-16">
            <Navbar></Navbar>
          </header>
          <div className="h-full overflow-scroll">
            <div className="px-16">
              {children}
            </div>
            <footer className="py-4 px-16" >
              <Footer></Footer>
            </footer>
          </div>

        </div>

      </body>
    </html>
  );
}
