
"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#1c1c1c] flex flex-col items-center justify-center text-white font-sans relative overflow-hidden">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-r from-pink-500 via-blue-500 to-purple-600 opacity-30"></div>
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-24 px-4 text-center relative z-10 min-h-[700px]">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <img
            src="/hero-bg.JPG"
            alt="Neeraj Bakshi Hero"
            className="w-full h-full object-cover opacity-40"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
              objectPosition: "center top",
            }}
          />
        </div>
        <div className="relative">
          <h1
            className="text-[2.875rem] md:text-[6.9rem] font-extrabold tracking-tight font-gitar mt-60 text-white uppercase"
            style={{
              textShadow: "0 2px 6px #000, 0 0 2px #000, 1px 1px 0 #000",
            }}
          >
            NEERAJ BAKSHI
          </h1>
          <p className="text-base md:text-xl mb-8 max-w-2xl mx-auto drop-shadow font-bold">
            Live Singer | Bollywood | Sufi | Punjabi | Weddings | Corporate |
            Festivals | Dandiya
          </p>
          {/* Animated Social Media Icons */}
          <div className="w-full flex flex-col items-center mb-2">
            <div className="rounded-full px-8 py-2 mb-1 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <h3
                className="text-lg font-extrabold text-center text-white drop-shadow"
                style={{ fontSize: "1rem" }}
              >
                Find me online
                <br />
              </h3>
            </div>
          </div>
          <div className="flex gap-8 justify-center mt-4">
            <div className="flex gap-8 justify-center w-full">
              <div className="flex gap-8 justify-center w-full items-center">
                <a
                  href="https://www.facebook.com/singeperformerrneerajbakshi"
                  className="bg-blue-400 text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200"
                  aria-label="Facebook Page"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" color="#fff" />
                </a>
                <a
                  href="https://www.instagram.com/neerajbakshiofficial"
                  className="bg-pink-400 text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200"
                  aria-label="Instagram ID"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faInstagram} size="lg" color="#fff" />
                </a>
                <a
                  href="https://youtube.com/@neerajbakshi?si=h7CJ-oHNp8xmsphB"
                  className="bg-red-400 text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faYoutube} size="lg" color="#fff" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="w-full flex flex-wrap justify-center gap-10 py-10 bg-gray-900/80">
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-blue-400">12</span>
          <span className="text-lg mt-2">Years Of Experience</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-pink-400">18</span>
          <span className="text-lg mt-2">Skilled Professionals</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-yellow-400">32</span>
          <span className="text-lg mt-2">Visited Conferences</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-green-400">1K</span>
          <span className="text-lg mt-2">Projects Worldwide</span>
        </div>
      </section>
      {/* About Me Section */}
      <section
        id="about-me"
        className="w-full py-12 px-4 bg-purple-950 text-white flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold mb-10">About Me</h2>
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-0">
          {/* Left Column: Image */}
          <div className="w-full md:w-[30%] flex justify-center items-stretch mb-8 md:mb-0">
            <img
              src="/IMG_4603.JPG"
              alt="Neeraj Bakshi"
              className="rounded-xl shadow-lg object-cover w-full h-full"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                aspectRatio: "3/4",
              }}
            />
          </div>
          {/* Vertical Divider */}
          <div className="hidden md:flex h-[340px] w-px bg-gradient-to-b from-purple-700 via-pink-600 to-purple-900 mx-8" />
          {/* Right Column: Text */}
          <div className="w-full md:w-[70%] text-lg font-light leading-relaxed text-left">
            <p>
              <strong>Neeraj Bakshi – Indian Idol Fame &amp; Powerhouse Performer</strong><br /><br />
              Neeraj Bakshi is known for his versatile voice and electrifying stage presence.<br />
              He blends emotion and energy, captivating audiences worldwide.<br />
              His Punjabi hits "Supna",<a href="https://www.youtube.com/watch?v=ViXnFM6c4e8" className="underline text-red-400" target="_blank" rel="noopener noreferrer"> Fail Kare Garmi</a>, and "Peg Mukni Ni" have won many hearts.<br />
              Neeraj’s voice has graced radio, television, and countless live concerts.<br />
              With over 1,000 shows globally, he is a household name among music lovers.<br />
              His journey is a testament to passion, dedication, and unmatched talent.<br />
              Whether it’s a soulful melody or a high-energy number, Neeraj leaves every stage on fire.<br />
              He has performed at weddings, corporate events, and festivals.<br />
              Fans admire his ability to connect with every audience.<br />
            </p>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="w-full py-16 px-4 bg-gray-950 text-white flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-8">Testimonials</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow max-w-md">
            <p className="italic mb-4">
              "Attended Neeraj's Hyderabad show and loved the Kesari song!
              <br />
              His stage presence is magnetic and connects with everyone.
              <br />
              Every song was full of passion and energy.
              <br />
              Can't wait for his next concert!"
            </p>
            <span className="font-semibold">Vasudha Upadhyay</span>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow max-w-md">
            <p className="italic mb-4">
              "Saw Neeraj perform in London, London Thumakda was outstanding!
              <br />
              The energy on stage was infectious.
              <br />
              He made us feel part of the show.
              <br />
              Highly recommend his concerts!"
            </p>
            <span className="font-semibold">Diptanshu Pandey</span>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow max-w-md">
            <p className="italic mb-4">
              "Attended Neeraj's Mumbai concert, loved all the Punjabi songs!
              <br />
              He switches genres with ease.
              <br />
              The audience engagement was unforgettable.
              <br />
              Neeraj truly rocks the stage!"
            </p>
            <span className="font-semibold">Aarti Wadhwa</span>
          </div>
        </div>
      </section>
      {/* Contact Info Section */}
      <section
        id="contact-info"
        className="w-full py-12 px-4 bg-gray-900 text-white flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
        <div className="mb-2">Delhi NCR, 201014</div>
        <div className="mb-2">Mira Road, Mumbai, 401107</div>
        <div className="mb-2">
          <a href="mailto:bakshi.neer@gmail.com" className="underline">
            bakshi.neer@gmail.com
          </a>
        </div>
        <div className="mb-2">
          <a href="tel:+917303055192" className="underline">
            +91 7303055192
          </a>{" "}
          /{" "}
          <a href="tel:+919650036003" className="underline">
            9650036003
          </a>
        </div>
        <div className="flex gap-4 mt-4">
          <a
            href="https://www.facebook.com/singeperformerrneerajbakshi"
            className="bg-blue-400 text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200"
            aria-label="Facebook Page"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faFacebook} size="lg" color="#fff" />
          </a>
          <a
            href="https://www.instagram.com/neerajbakshiofficial"
            className="bg-pink-400 text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200"
            aria-label="Instagram ID"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" color="#fff" />
          </a>
          <a
            href="https://youtube.com/@neerajbakshi?si=h7CJ-oHNp8xmsphB"
            className="bg-red-400 text-white text-2xl rounded-full p-2 shadow hover:scale-110 transition-transform duration-200"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faYoutube} size="lg" color="#fff" />
          </a>
        </div>
      </section>
      {/* Footer Banner */}
      <footer className="w-full py-8 px-4 text-center bg-black bg-opacity-60 text-gray-300 font-light relative z-10 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <span>© 2025 Neeraj Bakshi. All rights reserved.</span>
          <span>|</span>
          <span>
            Follow on{" "}
            <a href="https://www.instagram.com/neerajbakshiofficial" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            ,{" "}
            <a href="https://www.facebook.com/singeperformerrneerajbakshi" className="text-pink-400 hover:underline" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            ,{" "}
            <a href="https://youtube.com/@neerajbakshi?si=h7CJ-oHNp8xmsphB" className="text-red-400 hover:underline" target="_blank" rel="noopener noreferrer">
              YouTube
            </a>
          </span>
        </div>
      </footer>
      {/* Custom Font Style */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap");
        .font-gitar {
          font-family: "Montserrat", sans-serif;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s ease infinite;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  );
}
