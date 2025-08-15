
export default function MusicPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-5xl font-extrabold mb-6">Music</h1>
      <p className="text-xl max-w-2xl mb-8">Explore music categories and listen to Neeraj Bakshi's songs.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="bg-gray-900 p-6 rounded-lg shadow flex flex-col items-center">
          <span className="text-xl font-bold mb-2">Bollywood Hits</span>
          <audio controls className="w-full mt-2">
            <source src="/sample1.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow flex flex-col items-center">
          <span className="text-xl font-bold mb-2">Classical Melodies</span>
          <audio controls className="w-full mt-2">
            <source src="/sample2.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow flex flex-col items-center">
          <span className="text-xl font-bold mb-2">Live Performances</span>
          <audio controls className="w-full mt-2">
            <source src="/sample3.mp3" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </main>
  );
}
