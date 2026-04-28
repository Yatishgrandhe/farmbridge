import { createBrowserClient as createClient } from '@supabase/ssr'
import { parse, serialize } from 'cookie'

export function createBrowserClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return Object.entries(parse(document.cookie)).map(([name, value]) => ({
          name,
          value: value ?? '',
        }))
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const base: Parameters<typeof serialize>[2] = {
            path: options?.path ?? '/',
          }
          if (options?.maxAge !== undefined) base.maxAge = options.maxAge
          if (options?.domain !== undefined) base.domain = options.domain
          if (options?.sameSite !== undefined) base.sameSite = options.sameSite
          if (options?.secure !== undefined) base.secure = options.secure
          document.cookie = serialize(name, value, base)
        })
      },
    },
  })
}
