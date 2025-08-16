

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neeraj Bakshi | Singer",
  description: "Official website of singer Neeraj Bakshi.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased text-black relative`}
      style={{ minHeight: '100vh', background: 'transparent' }}
    >
      {/* Blurred overlay for depth, similar to Gitar theme */}
      {/* Optional: Blurred overlay for depth, can be removed if still causing lines */}
      <div style={{
        position: 'fixed',
        top: '10%',
        left: '50%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, #ff4ecd33 0%, #4f8cff22 60%, transparent 100%)',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none',
        transform: 'translateX(-50%)',
      }} />
        <Navbar />
        {children}
        <footer className="w-full bg-gray-950 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-lg font-bold">Neeraj Bakshi</div>
            <div className="flex gap-6 text-sm">
              <a href="/" className="hover:underline">Home</a>
              <a href="/#about-me" className="hover:underline">About Us</a>
              <a href="/team" className="hover:underline">Our Team</a>
              <a href="/gallery" className="hover:underline">Gallery</a>
              <a href="/music" className="hover:underline">Music</a>
              <a href="/booking" className="hover:underline">Booking</a>
            </div>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/singeperformerrneerajbakshi" className="bg-black text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200" aria-label="Facebook Page" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} size="2x" color="#fff" />
              </a>
              <a href="https://www.instagram.com/neerajbakshiofficial" className="bg-black text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200" aria-label="Instagram ID" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="2x" color="#fff" />
              </a>
              <a href="https://youtube.com/@neerajbakshi?si=h7CJ-oHNp8xmsphB" className="bg-black text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faYoutube} size="2x" color="#fff" />
              </a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-400 mt-6">Copyright © 2025 All Rights Reserved.</div>
        </footer>
      </body>
    </html>
  );
}
