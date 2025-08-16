
"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
  <nav className="w-full flex items-center py-2 absolute top-0 left-0 z-20 text-white" style={{background: 'transparent'}}>
      {/* NJ Logo Left - hidden on mobile menu open */}
      {!menuOpen && (
        <div className="hidden md:flex items-center pl-16 pr-8">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-blue-500 to-purple-600 shadow-lg">
            <span className="text-3xl font-extrabold text-white drop-shadow-lg">NJ</span>
          </div>
        </div>
      )}
      {/* Centered Nav Links - Desktop */}
      <div className="flex-1 justify-center hidden md:flex">
        <ul className="flex gap-8 text-lg font-semibold">
          <li><a href="/" className="hover:underline text-white">Home</a></li>
          <li><a href="/#about-me" className="hover:underline text-white">About Us</a></li>
          <li><a href="/#team" className="hover:underline text-white">Our Team</a></li>
          <li><a href="/gallery" className="hover:underline text-white">Gallery</a></li>
          <li><a href="/music" className="hover:underline text-white">Music</a></li>
        </ul>
      </div>
      {/* Burger Icon - Mobile - top left */}
      <div className="md:hidden flex-1 flex justify-start pl-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-3xl focus:outline-none"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{ position: menuOpen ? 'fixed' : 'static', top: menuOpen ? 20 : undefined, left: menuOpen ? 20 : undefined, zIndex: menuOpen ? 100 : undefined }}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
      </div>
      {/* Dropdown Menu - Mobile (slide up, close on X or outside) */}
      {menuOpen && (
        <div
          className="fixed inset-0 w-full h-full bg-black bg-opacity-60 z-50 flex items-end"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full bg-gray-900 rounded-t-2xl p-8 pb-16 animate-slideup relative"
            style={{ minHeight: '60vh' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 text-white text-3xl"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <ul className="flex flex-col gap-8 text-2xl font-semibold mt-8">
              <li><a href="/" className="hover:underline text-white" onClick={() => setMenuOpen(false)}>Home</a></li>
              <li><a href="#about-me" className="hover:underline text-white" onClick={() => setMenuOpen(false)}>About Us</a></li>
              <li><a href="/team" className="hover:underline text-white" onClick={() => setMenuOpen(false)}>Our Team</a></li>
              <li><a href="/gallery" className="hover:underline text-white" onClick={() => setMenuOpen(false)}>Gallery</a></li>
              <li><a href="/music" className="hover:underline text-white" onClick={() => setMenuOpen(false)}>Music</a></li>
              <li>
                <a href="#contact-info" className="w-36 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white text-base font-semibold shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-pink-500/40 hover:shadow-2xl hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-600 hover:to-blue-500 relative overflow-hidden gap-2" onClick={() => setMenuOpen(false)}>
                  <span className="relative z-10 flex items-center gap-2">
                    <FontAwesomeIcon icon={faPhone} className="text-white text-lg" />
                    Book Now
                  </span>
                  <span className="absolute inset-0 rounded-full opacity-30 blur-lg bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500"></span>
                </a>
              </li>
            </ul>
          </div>
          <style jsx>{`
            @keyframes slideup {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            .animate-slideup {
              animation: slideup 0.3s cubic-bezier(.4,0,.2,1);
            }
          `}</style>
        </div>
      )}
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
