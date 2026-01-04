'use client';

import Link from 'next/link';

export const SocialBtn = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
}) => (
  <Link
    href={href || '#'}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors text-sm font-medium cursor-pointer"
  >
    {icon} {label}
  </Link>
);
