import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Phone, Star } from 'lucide-react';

const bannerUrl =
  'https://3d1da5272d71dd829c0b3d13a993b10a.eu.r2.cloudflarestorage.com/banners/2026/02/a8f56cd5-6082-4adf-96e2-7e7786b9cf09.png';

const highlights = [
  'Pizza fritta contemporanea',
  '3 volte campione del mondo',
  'Tradizione napoletana a Lissone',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-200">
            Raffaele di Stasio
          </Link>
          <nav className="flex items-center gap-2 text-sm text-white/80">
            <Link href="/menu" className="rounded-full px-3 py-2 hover:bg-white/10">
              Menu
            </Link>
            <Link href="/contatti" className="rounded-full px-3 py-2 hover:bg-white/10">
              Contatti
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative min-h-[92vh] overflow-hidden">
          <Image
            src={bannerUrl}
            alt="Raffaele di Stasio"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88),rgba(0,0,0,0.48),rgba(0,0,0,0.72))]" />
          <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 border border-primary-300/40 bg-black/35 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-100">
                <Star className="h-4 w-4" />
                Lissone, Brianza
              </div>
              <h1 className="text-5xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
                Raffaele di Stasio
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
                Pizza fritta contemporanea, cucina napoletana e impasti leggeri firmati da un maestro
                pizzaiolo tre volte campione del mondo.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/menu"
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-primary-300"
                >
                  Sfoglia il menu
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contatti"
                  className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  Prenota e contatta
                </Link>
              </div>
            </div>
            <div className="mt-14 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item} className="border border-white/12 bg-black/38 p-4 text-sm font-medium text-white/86 backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-primary-300/20 bg-[#120f0a]">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div className="flex gap-3">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-300" />
              <div>
                <p className="text-sm font-semibold text-white">Via S. Rocco, 46</p>
                <p className="text-sm text-white/62">20851 Lissone MB</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-primary-300" />
              <div>
                <p className="text-sm font-semibold text-white">039 677 8225</p>
                <p className="text-sm text-white/62">Ritiro in negozio disponibile</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-primary-300" />
              <div>
                <p className="text-sm font-semibold text-white">Aperto tutti i giorni</p>
                <p className="text-sm text-white/62">Fino alle 22:00, venerdi e sabato fino alle 23:00</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-300">La cucina</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Tradizione napoletana, tecnica contemporanea.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-white/70">
            <p>
              A Lissone, Raffaele propone una pizza che e esperienza ed emozione:
              impasti digeribili, ingredienti selezionati e una carta che attraversa fritti,
              montanarine, pizze special, primi, dolci e prodotti artigianali.
            </p>
            <p>
              Il menu online permette di consultare le categorie, cercare i piatti e ordinare
              per il ritiro mantenendo il tono elegante di un ristorante di alto livello.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
