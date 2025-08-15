
export default function TeamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white flex flex-col items-center py-20 px-4">
      <h1 className="text-5xl font-extrabold mb-6">Our Team</h1>
      <p className="text-xl max-w-2xl mb-8">Meet the talented professionals who make every performance and production possible.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
        <div className="bg-gray-900 p-6 rounded-lg shadow flex flex-col items-center">
          <span className="text-2xl font-bold mb-2">Sam Daniels</span>
          <span className="text-sm mb-2">CEO</span>
          <span className="italic text-gray-400">"Creativity and professionalism are unmatched."</span>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow flex flex-col items-center">
          <span className="text-2xl font-bold mb-2">Sarah Allen</span>
          <span className="text-sm mb-2">Manager</span>
          <span className="italic text-gray-400">"Latest album is a masterpiece."</span>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg shadow flex flex-col items-center">
          <span className="text-2xl font-bold mb-2">Liya Allen</span>
          <span className="text-sm mb-2">Manager</span>
          <span className="italic text-gray-400">"Book a private show and experience it yourself!"</span>
        </div>
      </div>
    </main>
  );
}
