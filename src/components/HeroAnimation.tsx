"use client";

export default function HeroAnimation() {
  return (
    <div className="w-[420px] h-[420px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/puggy-happy.png"
        alt="StudyPug mascot"
        width={420}
        height={420}
        className="w-full h-full object-contain drop-shadow-md"
      />
    </div>
  );
}
