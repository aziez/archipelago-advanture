'use client';

import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
  <Card
    className={cn(
      'group relative overflow-hidden border-white/10 bg-black/40 transition-all duration-300',
      // Mobile: Border biasa | Desktop: Hover effect border biru
      'hover:border-blue-500/50',
      featured ? 'md:col-span-2' : 'col-span-1',
    )}
  >
    {/* --- 1. CLICKABLE AREA (UX Mobile Friendly) --- */}
    {/* Kita buat link 'invisible' yang menutupi seluruh kartu agar user di HP gampang klik */}
    <Link
      href={link}
      target="_blank"
      rel="noreferrer"
      className="absolute inset-0 z-10"
      aria-label={`View ${title}`}
    />

    {/* Image Container */}
    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
      <Image
        fill
        src={image}
        alt={title}
        className="object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
      />
      {/* Overlay Gradient: Agar text terbaca jelas di atas gambar */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
    </div>

    {/* Content Overlay */}
    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 pointer-events-none">
      <div className="space-y-2">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {tags.map((t) => (
            <Badge
              key={t}
              variant="secondary"
              className="bg-white/10 text-white border-white/10 text-[9px] md:text-[10px] uppercase tracking-wider font-mono backdrop-blur-sm"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>
    </div>

    {/* --- 2. ACTION BUTTON (Responsive Visibility) --- */}
    <div
      className={cn(
        'absolute top-4 right-4 z-20 transition-all duration-300',

        // MOBILE STYLES (Default):
        // Tombol selalu terlihat, posisi normal
        'opacity-100 translate-y-0',

        // DESKTOP STYLES (Breakpoint md):
        // Tombol sembunyi dulu, baru muncul pas hover, dan ada efek geser ke bawah
        'md:opacity-0 md:-translate-y-2 md:group-hover:translate-y-0 md:group-hover:opacity-100',
      )}
    >
      <Button
        asChild
        size="icon"
        className="rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 h-8 w-8 md:h-10 md:w-10"
      >
        <Link href={link} target="_blank" rel="noreferrer">
          <ExternalLink className="h-4 w-4 md:h-5 md:w-5" />
        </Link>
      </Button>
    </div>
  </Card>
);
