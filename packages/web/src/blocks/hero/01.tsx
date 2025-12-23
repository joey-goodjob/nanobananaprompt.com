"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

function Hero({ onGetStarted }: HeroSectionProps) {
  const router = useRouter();
  const t = useTranslations("hero");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const heroImages = [
    {
      id: 1,
      src: "https://pub-525a4b752d954f90b8dd3ec531df9c71.r2.dev/demo1.mp4",
      alt: "宇航员在向日葵田中",
    },
    {
      id: 2,
      src: "https://pub-525a4b752d954f90b8dd3ec531df9c71.r2.dev/demo2.mp4",
      alt: "3D卡通女孩在厨房",
    },
    {
      id: 3,
      src: "https://pub-525a4b752d954f90b8dd3ec531df9c71.r2.dev/demo3.mp4",
      alt: "白色小狗特写",
    },
    {
      id: 4,
      src: "https://pub-525a4b752d954f90b8dd3ec531df9c71.r2.dev/demo6.mp4",
      alt: "复古汽车在城市街道",
    },
    {
      id: 5,
      src: "https://pub-525a4b752d954f90b8dd3ec531df9c71.r2.dev/demo5.mp4",
      alt: "火烈鸟在水中",
    },
    {
      id: 6,
      src: "https://pub-525a4b752d954f90b8dd3ec531df9c71.r2.dev/demo6.mp4",
      alt: "戴蓝色护目镜游泳的狗",
    },
  ];

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    }
    router.push("/ai-video-generator");
  };

  return (
    <section className="hero min-h-screen relative flex items-center justify-center">
      {/* Background 2x2 Grid (no gaps, full bleed) */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 w-full h-full" style={{ backgroundColor: 'var(--bg-inverse)' }}>
        {heroImages.slice(0, 4).map((item) => (
          <div key={item.id} className="relative w-full h-full overflow-hidden">
            {isClient ? (
              <video
                src={item.src}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: 'var(--bg-inverse)' }} />
            )}
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }} />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="hero-content text-center mb-[360px] z-10" style={{ color: 'var(--text-inverse)' }}>
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            {t("subtitle")}
          </p>
          <button
            className="btn btn-lg rounded-2xl border text-lg px-12 py-4 font-semibold shadow-2xl transition-all duration-300 transform hover:scale-105"
            onClick={handleGetStarted}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: 'var(--text-primary)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            {t("cta")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
