'use client';

import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { useEffect, useState } from 'react';

import en from '../../messages/en.json';
import id from '../../messages/id.json';

export default function ClientI18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLanguageStore((state) => state.locale);
  const [isMounted, setIsMounted] = useState(false);

  // Mencegah Hydration Mismatch (Server render EN, Client punya ID)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Logic ganti message object secara instan
  const messages: AbstractIntlMessages = locale === 'id' ? id : en;

  // Render dummy sampai client siap (biar ga kedip error)
  if (!isMounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
