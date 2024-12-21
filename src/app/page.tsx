import Map from "./Map";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          FIS <span className="text-[hsl(0,100%,70%)]">Neu</span> Denken
        </h1>
        <Map />
      </div>
    </main>
  );
}
