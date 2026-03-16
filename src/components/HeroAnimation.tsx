"use client";

export default function HeroAnimation() {
  return (
    <div className="w-[280px] h-[280px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/puggy-happy.png"
        alt="StudyPug mascot"
        width={280}
        height={280}
        className="w-full h-full object-contain drop-shadow-md"
      />
    </div>
  );
}
