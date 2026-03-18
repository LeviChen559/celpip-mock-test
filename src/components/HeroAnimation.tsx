"use client";

export default function HeroAnimation() {
  return (
    <div className="relative">
      <div className="hp-glow-orb" />
      <div
        className="w-[360px] h-[360px] md:w-[420px] md:h-[420px]"
        style={{ animation: "hp-float 5s ease-in-out infinite" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/puggy-happy.png"
          alt="StudyPug mascot"
          width={420}
          height={420}
          className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(199,139,60,0.2)]"
        />
      </div>
    </div>
  );
}
