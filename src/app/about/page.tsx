
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-5xl font-extrabold mb-6">About Neeraj Bakshi</h1>
      <p className="text-xl max-w-2xl mb-8">Neeraj Bakshi is a renowned singer known for his energetic performances and soulful voice. With over a decade of experience, he has captivated audiences at festivals, concerts, and private events across the globe. His music blends emotion, artistry, and passion, making every show unforgettable.</p>
      <div className="flex gap-4 mt-6">
        <a href="/music" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow transition">Listen Now</a>
        <a href="/booking" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full shadow transition">Book Neeraj</a>
      </div>
    </main>
  );
}
