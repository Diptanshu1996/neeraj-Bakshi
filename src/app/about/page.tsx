export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col pt-24 items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/IMG_4603.JPG"
            alt="Neeraj Bakshi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-8 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent leading-tight">
            Meet Neeraj
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-8 sm:mb-12 leading-relaxed px-2">
            Neeraj Bakshi – Indian Idol Fame &amp; Powerhouse Performer
          </p>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-[#0a0a0a] to-black">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                The Journey
              </h2>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Neeraj Bakshi is known for his versatile voice and electrifying stage presence. He blends emotion and energy, captivating audiences worldwide. His Punjabi hits &quot;Supna&quot;, &quot;Fail Kare Garmi&quot;, and &quot;Peg Mukni Ni&quot; have won many hearts.
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Neeraj's voice has graced radio, television, and countless live concerts. With over 1,000 shows globally, he is a household name among music lovers. His journey is a testament to passion, dedication, and unmatched talent.
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-4">
                Whether it's a soulful melody or a high-energy number, Neeraj leaves every stage on fire. He has performed at weddings, corporate events, and festivals. Fans admire his ability to connect with every audience.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                A true product of hard work and heart, Neeraj honed his craft over years of relentless practice and live performances before earning national recognition on Indian Idol. That platform amplified a voice the world was already falling in love with. Today, he carries that legacy into every stage he steps on — performing with the same fire whether it's an intimate gathering of fifty or a grand arena of thousands.
              </p>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                What Makes Him Special
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/50 flex items-center justify-center">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Versatility</h3>
                    <p className="text-white/60">Seamlessly performs across multiple genres – from soulful Sufi to energetic Garba, Bollywood to Punjabi</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/50 flex items-center justify-center">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Crowd Connection</h3>
                    <p className="text-white/60">Exceptional ability to read the room and engage audiences with authentic emotion and energy</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/50 flex items-center justify-center">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Professionalism</h3>
                    <p className="text-white/60">Reliable, punctual, and dedicated to creating perfect moments for every client</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 border border-amber-500/50 flex items-center justify-center">
                    <span className="text-amber-400">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">Experience</h3>
                    <p className="text-white/60">Over 500 performances across corporate events, weddings, festivals, and private celebrations</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Event Expertise
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">Luxury Weddings & Sangeet</h3>
                  <p className="text-white/60">Create magical moments with personalized song selections and intimate performances</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">Corporate Galas</h3>
                  <p className="text-white/60">Elevate your corporate event with sophisticated entertainment and professional crowd management</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">Dandiya & Garba Nights</h3>
                  <p className="text-white/60">Bring authentic cultural celebration with high-energy performances that keep everyone dancing</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
                  <h3 className="text-lg font-semibold text-amber-400 mb-2">Private Performances</h3>
                  <p className="text-white/60">Intimate acoustic sessions or exclusive entertainment for special occasions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            Ready to Experience the Magic?
          </h2>
          <p className="text-xl text-white/60 mb-12">
            Let's discuss your vision and create an unforgettable event
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-2xl shadow-orange-500/40 text-lg font-semibold">
            Book Neeraj
          </button>
        </div>
      </section>
    </main>
  );
}
