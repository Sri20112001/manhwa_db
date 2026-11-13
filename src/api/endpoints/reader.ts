import { READER_BASE_URL } from '@/shared/constants/config';

export interface ReaderChapterPage {
  ordinal: number;
  url: string;
  width: number;
  height: number;
  placeholder?: string;
  kind?: string;
  lead?: {
    url: string;
    width: number;
    height: number;
  };
}

export interface ReaderChapterRef {
  id: string;
  title: string;
  number: number;
  edition?: string;
}

export interface ReaderSeriesRef {
  pornhwaId: number;
  slug: string;
  publicId: number;
  urlSlug: string;
  title: string;
  cover: string;
}

export interface ReaderChapterDetail {
  id: string;
  title: string;
  number: number;
  edition?: string;
  series: ReaderSeriesRef;
  pages: ReaderChapterPage[];
  next?: ReaderChapterRef | null;
  previous?: ReaderChapterRef | null;
  availableNext?: ReaderChapterRef[];
  availablePrevious?: ReaderChapterRef[];
}

export class ReaderError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly slug?: string,
    public readonly chapter?: number | string,
  ) {
    super(message);
    this.name = 'ReaderError';
  }
}

/**
 * Builds the canonical web reader URL for a series chapter.
 */
export function buildReaderChapterUrl(slug: string, chapter: number | string): string {
  const cleanSlug = slug.trim().toLowerCase();
  return `${READER_BASE_URL}/series/${encodeURIComponent(cleanSlug)}/chapter-${chapter}`;
}

/**
 * Normalizes next/previous chapter fields, which may be an array of editions
 * or a single object or null/undefined.
 */
function normalizeChapterRef(
  value: unknown,
): { primary: ReaderChapterRef | null; all: ReaderChapterRef[] } {
  if (!value) return { primary: null, all: [] };
  const items = Array.isArray(value) ? value : [value];
  const list: ReaderChapterRef[] = [];
  for (const item of items) {
    if (item && typeof item === 'object' && 'number' in item) {
      list.push({
        id: String((item as { id?: unknown }).id ?? ''),
        title: String((item as { title?: unknown }).title ?? `Chapter ${(item as { number: unknown }).number}`),
        number: Number((item as { number: unknown }).number),
        edition: (item as { edition?: unknown }).edition ? String((item as { edition?: unknown }).edition) : undefined,
      });
    }
  }
  // Prefer standard edition if available, else first
  const primary = list.find((it) => it.edition === 'standard') ?? list[0] ?? null;
  return { primary, all: list };
}

/**
 * Parses chapter page HTML (SSR/RSC payload) from pornhwareader.com
 * to extract chapter metadata and full-resolution page images.
 */
export function parseReaderHtml(html: string): ReaderChapterDetail {
  if (!html || typeof html !== 'string') {
    throw new ReaderError('Empty or invalid reader HTML received');
  }

  // Next.js RSC Flight chunks are pushed via self.__next_f.push([1, "..."])
  const flightRegex = /self\.__next_f\.push\(\[\s*1\s*,\s*("(?:\\[\s\S]|[^"\\])*")\s*\]\)/g;
  let match: RegExpExecArray | null;
  let combined = '';

  while ((match = flightRegex.exec(html)) !== null) {
    const rawChunk = match[1];
    if (!rawChunk) continue;
    try {
      combined += JSON.parse(rawChunk);
    } catch {
      // ignore chunk decode errors
    }
  }

  const searchTarget = combined.length > 0 ? combined : html;
  const pagesIdx = searchTarget.indexOf('"pages":[');

  if (pagesIdx === -1) {
    throw new ReaderError('Chapter pages payload not found in page content');
  }

  // Walk backwards from "pages":[" to locate the opening brace of the enclosing object
  let depth = 0;
  let startIdx = -1;
  for (let i = pagesIdx; i >= 0; i--) {
    if (searchTarget[i] === '}') {
      depth++;
    } else if (searchTarget[i] === '{') {
      if (depth === 0) {
        startIdx = i;
        break;
      }
      depth--;
    }
  }

  if (startIdx === -1) {
    throw new ReaderError('Failed to locate chapter metadata object');
  }

  // Walk forward to find the matching closing brace
  let d = 0;
  let inStr = false;
  let esc = false;
  let endIdx = -1;

  for (let i = startIdx; i < searchTarget.length; i++) {
    const c = searchTarget[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (c === '\\') {
      esc = true;
      continue;
    }
    if (c === '"') {
      inStr = !inStr;
      continue;
    }
    if (!inStr) {
      if (c === '{') {
        d++;
      } else if (c === '}') {
        d--;
        if (d === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
  }

  if (endIdx === -1) {
    throw new ReaderError('Malformed chapter JSON payload');
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(searchTarget.slice(startIdx, endIdx));
  } catch (err) {
    throw new ReaderError(
      `Failed to parse chapter JSON: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const rawPages = Array.isArray(parsed.pages) ? parsed.pages : [];
  if (rawPages.length === 0) {
    throw new ReaderError('No pages found for this chapter');
  }

  const pages: ReaderChapterPage[] = rawPages.map((p, idx) => {
    const item = (p && typeof p === 'object' ? p : {}) as Record<string, unknown>;
    const lead = item.lead && typeof item.lead === 'object' ? (item.lead as Record<string, unknown>) : undefined;
    return {
      ordinal: typeof item.ordinal === 'number' ? item.ordinal : idx + 1,
      url: String(item.url ?? ''),
      width: Number(item.width ?? 720),
      height: Number(item.height ?? 1200),
      placeholder: item.placeholder ? String(item.placeholder) : undefined,
      kind: item.kind ? String(item.kind) : undefined,
      lead: lead
        ? {
            url: String(lead.url ?? ''),
            width: Number(lead.width ?? 720),
            height: Number(lead.height ?? 1800),
          }
        : undefined,
    };
  });

  const rawSeries = (parsed.series && typeof parsed.series === 'object'
    ? parsed.series
    : {}) as Record<string, unknown>;

  const series: ReaderSeriesRef = {
    pornhwaId: Number(rawSeries.pornhwaId ?? 0),
    slug: String(rawSeries.slug ?? ''),
    publicId: Number(rawSeries.publicId ?? 0),
    urlSlug: String(rawSeries.urlSlug ?? ''),
    title: String(rawSeries.title ?? ''),
    cover: String(rawSeries.cover ?? ''),
  };

  const nextNav = normalizeChapterRef(parsed.next);
  const prevNav = normalizeChapterRef(parsed.previous);

  return {
    id: String(parsed.id ?? ''),
    title: String(parsed.title ?? `Chapter ${parsed.number ?? ''}`),
    number: Number(parsed.number ?? 0),
    edition: parsed.edition ? String(parsed.edition) : undefined,
    series,
    pages,
    next: nextNav.primary,
    previous: prevNav.primary,
    availableNext: nextNav.all,
    availablePrevious: prevNav.all,
  };
}

/**
 * Fetches and parses a chapter directly from PornhwaDB Reader.
 */
export async function fetchReaderChapter(
  slug: string,
  chapter: number | string,
  signal?: AbortSignal,
): Promise<ReaderChapterDetail> {
  const url = buildReaderChapterUrl(slug, chapter);

  let res: Response;
  try {
    res = await fetch(url, {
      signal,
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 PornhwaDBMobile/1.0',
      },
      redirect: 'follow',
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') throw err;
    throw new ReaderError(
      `Network request failed: ${err instanceof Error ? err.message : String(err)}`,
      undefined,
      slug,
      chapter,
    );
  }

  if (res.status === 404) {
    throw new ReaderError('Chapter not found on PornhwaDB Reader', 404, slug, chapter);
  }

  if (!res.ok) {
    throw new ReaderError(
      `Reader returned status ${res.status}`,
      res.status,
      slug,
      chapter,
    );
  }

  const html = await res.text();
  return parseReaderHtml(html);
}
