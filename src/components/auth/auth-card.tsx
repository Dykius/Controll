import React from "react";

interface AuthCardProps {
  logo?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthCard({ logo, title, subtitle, children }: AuthCardProps) {
  return (
    <div className="w-[min(600px,92vw)] mx-auto rounded-[24px] p-8 sm:p-10 md:p-12 backdrop-blur-[12px] bg-[rgba(30,30,30,0.5)] border border-[rgba(255,255,255,0.08)] shadow-2xl shadow-black/40">
      {logo && <div className="mb-8">{logo}</div>}
      <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-md md:text-lg text-slate-300">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
