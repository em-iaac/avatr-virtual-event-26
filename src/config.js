// AVATR Virtual Event 2026 — Site Configuration

export const EVENT = {
  name: 'AVATR Virtual Event 2026',
  tagline: 'Emotional Intelligence. Motion in Delight.',
  subtag: 'An invitation to the future.',
  date: new Date('2026-08-01T18:00:00+03:00'), // August 1, 2026, 6pm Kuwait (GMT+3)
  duration: 2 * 60 * 60 * 1000, // 2-hour live window
  videoId: 'dQw4w9WgXcQ', // Swap with real YouTube video ID before launch
}

export const BRAND = {
  company: 'AVATR Technology Co., Ltd.',
  region: 'Kuwait',
  year: 2026,
  social: {
    instagram: 'https://www.instagram.com/avatr.kw/',
    twitter: 'https://x.com/AVATR_Official',
    youtube: 'https://www.youtube.com/@AVATROfficialChannel',
  },
}

// Google Apps Script web app URL — set up before launch
export const API = {
  sheetsEndpoint: '', // e.g. 'https://script.google.com/macros/s/XXXXX/exec'
}

/**
 * Returns the current event phase:
 *  'pre'  — before the premiere (countdown)
 *  'live' — within the 2-hour live window
 *  'post' — after the event (replay mode)
 */
export function getEventPhase() {
  const now = Date.now()
  const start = EVENT.date.getTime()
  const end = start + EVENT.duration
  if (now < start) return 'pre'
  if (now <= end) return 'live'
  return 'post'
}
