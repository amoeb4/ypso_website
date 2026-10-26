export default function Booking() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="relative h-screen">
        <img
          src="/hero.webp"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center">
          <h1 className="text-6xl font-serif">
            Ypso Lehnsherr
          </h1>

          <p className="mt-6 max-w-xl text-center text-lg">
            Bienvenue dans mon univers.
          </p>

          <button className="mt-10 rounded border border-white px-8 py-3 hover:bg-white hover:text-black transition">
            Prendre rendez-vous
          </button>
        </div>
      </section>

      {/* autres sections */}
    </main>
  );
}