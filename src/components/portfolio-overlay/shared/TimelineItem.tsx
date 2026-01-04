'use client';

interface TimelineItemProps {
  year: string;
  role: string;
  company: string;
  desc: string;
}

export const TimelineItem = ({
  year,
  role,
  company,
  desc,
}: TimelineItemProps) => (
  <div className="relative pl-8 md:pl-12 group">
    {/* Dot Indikator */}
    <div className="absolute -left-1.25 top-0 w-3 h-3 rounded-full bg-blue-500 border border-slate-900 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

    <div className="space-y-2">
      <span className="text-xs font-mono text-blue-400 px-2 py-1 bg-blue-500/10 rounded inline-block mb-1">
        {year}
      </span>
      <h3 className="text-xl font-bold text-white">{role}</h3>
      <div className="text-slate-400 text-sm font-medium mb-2 flex items-center gap-2">
        <span className="w-1 h-1 bg-slate-500 rounded-full" />
        {company}
      </div>
      <p className="text-slate-400 text-sm leading-relaxed max-w-2xl border-l-2 border-white/5 pl-4">
        {desc}
      </p>
    </div>
  </div>
);
