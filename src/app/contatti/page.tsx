import Link from 'next/link';
import { ArrowLeft, Clock, Mail, MapPin, Phone } from 'lucide-react';

const openingHours = [
  ['Lunedi - Giovedi', '09:00 - 22:00'],
  ['Venerdi', '09:00 - 23:00'],
  ['Sabato', '10:00 - 23:00'],
  ['Domenica', '10:00 - 21:00'],
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary-200 hover:text-primary-100">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <section className="grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-18">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-300">Contatti</p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-6xl">Raffaele di Stasio</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
              Vieni a Lissone per assaggiare la pizza fritta contemporanea di Raffaele di Stasio
              o contatta il locale per informazioni su ordini, disponibilita e ritiro.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+390396778225"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-primary-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-black hover:bg-primary-300"
              >
                <Phone className="h-4 w-4" />
                Chiama
              </a>
              <a
                href="https://maps.google.com/maps?q=Via%20S.%20Rocco,%2046,%2020851%20Lissone%20MB,%20Italy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/18 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white hover:bg-white/10"
              >
                <MapPin className="h-4 w-4" />
                Indicazioni
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-primary-300/18 bg-[#15110b] p-6">
              <MapPin className="mb-4 h-6 w-6 text-primary-300" />
              <h2 className="text-lg font-semibold text-white">Indirizzo</h2>
              <p className="mt-2 text-sm leading-6 text-white/62">Via S. Rocco, 46<br />20851 Lissone MB, Italia</p>
            </div>
            <div className="border border-primary-300/18 bg-[#15110b] p-6">
              <Phone className="mb-4 h-6 w-6 text-primary-300" />
              <h2 className="text-lg font-semibold text-white">Telefono</h2>
              <p className="mt-2 text-sm leading-6 text-white/62">+39 039 677 8225</p>
            </div>
            <div className="border border-primary-300/18 bg-[#15110b] p-6">
              <Mail className="mb-4 h-6 w-6 text-primary-300" />
              <h2 className="text-lg font-semibold text-white">Email</h2>
              <p className="mt-2 break-words text-sm leading-6 text-white/62">
                raffaele.distasio.consulting@gmail.com
              </p>
            </div>
            <div className="border border-primary-300/18 bg-[#15110b] p-6">
              <Clock className="mb-4 h-6 w-6 text-primary-300" />
              <h2 className="text-lg font-semibold text-white">Orari</h2>
              <div className="mt-3 space-y-2">
                {openingHours.map(([day, hours]) => (
                  <div key={day} className="flex justify-between gap-4 text-sm text-white/62">
                    <span>{day}</span>
                    <span className="text-white/82">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden border border-primary-300/18 bg-[#15110b]">
          <iframe
            title="Mappa Raffaele di Stasio"
            src="https://maps.google.com/maps?q=Via%20S.%20Rocco,%2046,%2020851%20Lissone%20MB,%20Italy&z=15&output=embed"
            className="h-[360px] w-full border-0"
            loading="lazy"
          />
        </section>
      </div>
    </main>
  );
}
