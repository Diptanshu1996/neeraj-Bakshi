
"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
  <nav className="w-full flex items-center py-4 absolute top-0 left-0 z-20 text-white" style={{background: 'transparent'}}>
      {/* NJ Logo Left */}
      <div className="flex items-center pl-16 pr-8">
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-blue-500 to-purple-600 shadow-lg">
          <span className="text-3xl font-extrabold text-white drop-shadow-lg">NJ</span>
        </div>
      </div>
      {/* Centered Nav Links */}
      <div className="flex-1 flex justify-center">
        <ul className="flex gap-8 text-lg font-semibold">
          <li><a href="/" className="hover:underline text-white">Home</a></li>
          <li><a href="#about-me" className="hover:underline text-white">About Us</a></li>
          <li><a href="/team" className="hover:underline text-white">Our Team</a></li>
          <li><a href="/gallery" className="hover:underline text-white">Gallery</a></li>
          <li><a href="/music" className="hover:underline text-white">Music</a></li>
        </ul>
      </div>
      {/* Book Now Button Right */}
      <div className="flex items-center pl-8 pr-16">
          <a href="#contact-info" className="w-36 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white text-sm font-semibold shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-pink-500/40 hover:shadow-2xl hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-600 hover:to-blue-500 relative overflow-hidden gap-2">
            <span className="relative z-10 flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-white text-lg" />
              Book Now
            </span>
            <span className="absolute inset-0 rounded-full opacity-30 blur-lg bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500"></span>
          </a>
      </div>
  </nav>
  );
}
