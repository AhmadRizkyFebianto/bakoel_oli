"use client";
import Link from "next/link";

interface CtaBannerProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonTo?: string;
  onButtonClick?: () => void;
}

export default function CtaBanner({
  title = "Temukan Layanan perawatan motor terbaik di Bengkel Bakul Oli",
  description = "Temukan layanan perawatan motor profesional dan terpercaya di Bengkel Bakul Oli. Dari ganti oli hingga tune-up lengkap, motor Anda tetap prima dan aman dikendarai.",
  buttonLabel = "Lihat Layanan Kami",
  buttonTo = "/layanan",
}: CtaBannerProps) {
  return (
    <section className="py-36 bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-4">
            {title.split("Bakul Oli").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <span className="text-brand-yellow underline">Bakul Oli</span>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </h2>
          <p className="text-blue-100">{description}</p>
        </div>
        <Link
          href={buttonTo}
          className="bg-brand-yellow text-brand-dark px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shrink-0"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
