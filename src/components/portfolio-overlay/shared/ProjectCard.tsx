'use client';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ProjectCardProps {
  title: string;
  desc: string;
  tags: string[];
  image: string;
  featured?: boolean;
  link?: string;
}

export const ProjectCard = ({
  title,
  desc,
  tags,
  image,
  featured,
  link = '#',
}: ProjectCardProps) => (
  <div
    className={`group relative bg-black/40 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all ${
      featured ? 'md:col-span-2' : ''
    }`}
  >
    <div className="aspect-video w-full overflow-hidden bg-slate-800">
      <Image
        priority
        fill
        src={image}
        alt={title}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
      />
    </div>
    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-slate-300 mb-3 line-clamp-2">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="text-[10px] px-2 py-1 bg-white/10 backdrop-blur-sm rounded border border-white/10 text-white uppercase tracking-wider"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
    {/* Hover Action */}
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500"
    >
      <ExternalLink size={20} />
    </a>
  </div>
);
