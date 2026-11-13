import './setup';
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildReaderChapterUrl,
  parseReaderHtml,
  ReaderError,
} from '@/api/endpoints/reader';

test('Reader - buildReaderChapterUrl normalizes slug and chapter', () => {
  assert.equal(
    buildReaderChapterUrl('Secret-Class', 1),
    'https://pornhwareader.com/series/secret-class/chapter-1',
  );
  assert.equal(
    buildReaderChapterUrl('bad-thinking-diary', '1.5'),
    'https://pornhwareader.com/series/bad-thinking-diary/chapter-1.5',
  );
});

test('Reader parser - parses RSC Flight payload into chapter detail', () => {
  const chapterData = {
    id: 'ch-uuid-1',
    title: 'Chapter 1',
    number: 1,
    edition: 'standard',
    series: {
      pornhwaId: 191,
      slug: 'secret-class',
      publicId: 16,
      urlSlug: 'secret-class',
      title: 'Secret Class',
      cover: 'https://media.pornhwareader.com/covers/cover.webp',
    },
    pages: [
      {
        ordinal: 1,
        url: 'https://media.pornhwareader.com/pages/1.webp',
        width: 720,
        height: 2400,
        placeholder: 'data:image/webp;base64,sample',
        lead: {
          url: 'https://media.pornhwareader.com/pages/1-lead.webp',
          width: 720,
          height: 1800,
        },
      },
      {
        ordinal: 2,
        url: 'https://media.pornhwareader.com/pages/2.webp',
        width: 720,
        height: 2500,
      },
    ],
    next: [
      {
        id: 'ch-uuid-2-uncensored',
        title: 'Chapter 2',
        number: 2,
        edition: 'uncensored',
      },
      {
        id: 'ch-uuid-2-standard',
        title: 'Chapter 2',
        number: 2,
        edition: 'standard',
      },
    ],
    previous: null,
  };

  const jsonStr = JSON.stringify(chapterData);
  const part1 = jsonStr.slice(0, 50);
  const part2 = jsonStr.slice(50);

  // Emulate Next.js self.__next_f.push calls
  const mockHtml = `
    <!DOCTYPE html><html><head></head><body>
      <script>self.__next_f.push([1, ${JSON.stringify(`1:["$","$L1",null,${part1}`)}])</script>
      <script>self.__next_f.push([1, ${JSON.stringify(`${part2}]`)}])</script>
    </body></html>
  `;

  const parsed = parseReaderHtml(mockHtml);

  assert.equal(parsed.id, 'ch-uuid-1');
  assert.equal(parsed.title, 'Chapter 1');
  assert.equal(parsed.number, 1);
  assert.equal(parsed.series.title, 'Secret Class');
  assert.equal(parsed.series.pornhwaId, 191);
  assert.equal(parsed.pages.length, 2);
  const firstPage = parsed.pages[0];
  assert.ok(firstPage);
  assert.equal(firstPage.ordinal, 1);
  assert.equal(firstPage.url, 'https://media.pornhwareader.com/pages/1.webp');
  assert.equal(firstPage.height, 2400);
  assert.equal(firstPage.placeholder, 'data:image/webp;base64,sample');
  assert.equal(firstPage.lead?.url, 'https://media.pornhwareader.com/pages/1-lead.webp');

  // Should prefer standard edition for next
  assert.equal(parsed.next?.id, 'ch-uuid-2-standard');
  assert.equal(parsed.next?.number, 2);
  assert.equal(parsed.previous, null);
  assert.equal(parsed.availableNext?.length, 2);
});

test('Reader parser - throws ReaderError when pages payload is missing', () => {
  const badHtml = `<html><body><script>self.__next_f.push([1, "{\\"other\\":123}"]);</script></body></html>`;
  assert.throws(
    () => parseReaderHtml(badHtml),
    (err: unknown) => err instanceof ReaderError && err.message.includes('not found'),
  );
});

test('Reader parser - throws ReaderError on empty or invalid input', () => {
  assert.throws(
    () => parseReaderHtml(''),
    (err: unknown) => err instanceof ReaderError,
  );
});
