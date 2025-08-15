
export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-5xl font-extrabold mb-6">Gallery</h1>
      <p className="text-xl max-w-2xl mb-8">Photos and videos from performances and events.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        {/* Placeholder images, replace with actual media */}
        <div className="bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
          <img src="/placeholder1.jpg" alt="Performance 1" className="rounded mb-2 w-full h-48 object-cover" />
          <span>Performance 1</span>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
          <img src="/placeholder2.jpg" alt="Performance 2" className="rounded mb-2 w-full h-48 object-cover" />
          <span>Performance 2</span>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
          <a href="https://www.youtube.com/watch?v=Y-x0efG1seA" target="_blank" rel="noopener noreferrer" className="underline text-blue-400 mb-2">Watch on YouTube</a>
          <span>Live Concert</span>
        </div>
      </div>
    </main>
  );
}
