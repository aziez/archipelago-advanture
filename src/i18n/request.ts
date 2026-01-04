import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // 1. Baca cookie
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  // 2. Load JSON sesuai locale
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
