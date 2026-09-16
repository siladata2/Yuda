import * as cheerio from 'cheerio';

const BASE_URL = 'https://anichin.moe';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0'
];

const getRandomUA = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

function decodeBase64(str) {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch {
    return str;
  }
}

const fetchHtml = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': getRandomUA(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Cache-Control': 'max-age=0',
      'Referer': BASE_URL + '/',
      'DNT': '1'
    },
    redirect: 'follow',
    credentials: 'omit'
  });
  
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return cheerio.load(await res.text());
};

const extractSlug = (url) => {
  if (!url) return '';
  try {
    return new URL(url).pathname.replace(/^\/|\/$/g, '');
  } catch {
    return url.replace(/^\/|\/$/g, '');
  }
};

const parseItem = ($, el) => {
  const $el = $(el);
  const link = $el.find('.bsx a').attr('href') || $el.find('a').attr('href') || '';
  const rawTitle = $el.find('.tt h2, .tt').first().text().trim() || $el.find('.title').text().trim() || $el.find('img').attr('title') || '';
  const title = rawTitle.split('\n')[0].replace(/\t+/g, ' ').trim();
  const episode = $el.find('.bt .epx, .epx').text().trim() || null;
  const type = $el.find('.typez').text().trim() || null;
  const thumbnail = $el.find('img').attr('src') || $el.find('img').attr('data-src') || null;
  if (!title || !link) return null;
  return {
    title,
    slug: extractSlug(link),
    url: link.startsWith('http') ? link : `${BASE_URL}${link}`,
    episode,
    type,
    thumbnail,
  };
};

export class AnichinCare {
  async home() {
    const $ = await fetchHtml(`${BASE_URL}/`);
    const popular = [];
    $('.releases.hothome').parent().find('.bsx').each((_, el) => {
      const item = parseItem($, el);
      if (item) popular.push(item);
    });
    const latest = [];
    $('.releases.latesthome').closest('.bixbox').find('.bsx').each((_, el) => {
      const item = parseItem($, el);
      if (item) latest.push(item);
    });
    const slider = popular.slice(0, 3);
    return { slider, popular, latest };
  }

  async slider() {
    const data = await this.home();
    return data.slider;
  }

  async populer() {
    const $ = await fetchHtml(`${BASE_URL}/`);
    const popular = [];
    $('.releases.hothome').parent().find('.bsx').each((_, el) => {
      const item = parseItem($, el);
      if (item) popular.push(item);
    });
    return popular;
  }

  async terbaru(page = 1) {
    const url = page > 1 ? `${BASE_URL}/page/${page}/` : `${BASE_URL}/`;
    const $ = await fetchHtml(url);
    const results = [];
    $('.listupd .bsx').each((_, el) => {
      const item = parseItem($, el);
      if (item) results.push(item);
    });
    const hasNext = $('.pagination .next, .hpage .r').length > 0;
    return {
      results: results.slice(0, 10),
      pagination: {
        currentPage: Number(page),
        totalPages: page + (hasNext ? 1 : 0),
        hasNext,
        hasPrev: page > 1,
      },
    };
  }

  async search(query, page = 1) {
    const url = page > 1 ? `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}` : `${BASE_URL}/?s=${encodeURIComponent(query)}`;
    const $ = await fetchHtml(url);
    const results = [];
    $('.listupd .bsx, .animpost').each((_, el) => {
      const item = parseItem($, el);
      if (item) results.push(item);
    });
    const hasNext = $('.pagination .next, .hpage .r').length > 0;
    return {
      query,
      results: results.slice(0, 10),
      pagination: {
        currentPage: Number(page),
        totalPages: page + (hasNext ? 1 : 0),
        hasNext,
        hasPrev: page > 1,
      },
    };
  }

  async detail(slug) {
    const $ = await fetchHtml(`${BASE_URL}/${slug.replace(/^\/+|\/+$/g, '')}/`);
    const info = $('.infox');
    const title = info.find('.entry-title, h1').first().text().trim() || $('h1.entry-title').text().trim();
    const synopsis = $('.entry-content p').first().text().trim() || $('.desc').text().trim() || null;
    const genres = [];
    info.find('.genxed a, .spe span a[href*="/genres/"]').each((_, a) => {
      const g = $(a).text().trim();
      if (g) genres.push(g);
    });
    const speText = (label) => {
      let val = null;
      info.find('.spe span').each((_, sp) => {
        const txt = $(sp).text().trim();
        if (txt.toLowerCase().startsWith(label)) val = txt.replace(/^[^:]*:\s*/, '').trim();
      });
      return val;
    };
    const cover = $('.thumb img').attr('src') || $('.thumb img').attr('data-src') || $('meta[property="og:image"]').attr('content') || null;
    const episodes = [];
    $('.eplister li, .eplister ul li').each((_, el) => {
      const a = $(el).find('a').first();
      const link = a.attr('href') || '';
      const epTitle = $(el).find('.epl-title').text().trim() || $(el).find('.epl-num').text().trim() || link;
      const epNum = $(el).find('.epl-num').first().text().trim() || null;
      const date = $(el).find('.epl-date').text().trim() || null;
      if (link && epTitle) {
        episodes.push({
          title: epTitle,
          number: epNum,
          slug: extractSlug(link),
          url: link.startsWith('http') ? link : `${BASE_URL}${link}`,
          date,
        });
      }
    });
    return {
      title,
      japaneseTitle: info.find('.alter').text().trim() || info.find('.jtitle').text().trim() || null,
      synopsis,
      type: speText('tipe') || speText('type') || null,
      status: speText('status') || null,
      genres,
      episodes,
      cover,
    };
  }

  async episode(slug) {
    const $ = await fetchHtml(`${BASE_URL}/${slug.replace(/^\/+|\/+$/g, '')}/`);
    const title = $('h1.entry-title').text().trim() || $('h1').first().text().trim();
    const episodeNumber = $('[itemprop="episodeNumber"]').attr('content') || title.match(/Episode\s+(\d+)/i)?.[1] || null;
    const releasedDate = $('.updated').text().trim() || null;
    const cover = $('[itemprop="image"] img').attr('src') || $('.thumb img').attr('src') || null;
    const prevLink = $('.naveps .nvs a[rel="prev"], .naveps .nvs:first-child a').attr('href') || null;
    const nextLink = $('.naveps .nvs a[rel="next"]').attr('href') || null;
    const streams = [];
    $('.mirror option, select.mirror option').each((_, el) => {
      const name = $(el).text().trim();
      const value = $(el).attr('value') || '';
      if (value && name && !name.toLowerCase().includes('select')) {
        const decoded = decodeBase64(value);
        const iframeMatch = decoded.match(/src=["']([^"']+)["']/i) || (decoded.startsWith('http') ? { 1: decoded } : null);
        if (iframeMatch && iframeMatch[1]) {
          streams.push({ server: name, url: iframeMatch[1] });
        }
      }
    });
    return {
      title,
      episodeNumber,
      releasedDate,
      cover,
      prevEpisode: prevLink ? { slug: extractSlug(prevLink), url: prevLink.startsWith('http') ? prevLink : `${BASE_URL}${prevLink}` } : null,
      nextEpisode: nextLink ? { slug: extractSlug(nextLink), url: nextLink.startsWith('http') ? nextLink : `${BASE_URL}${nextLink}` } : null,
      streams,
    };
  }

  async genre(genreName, page = 1) {
    const url = page > 1 ? `${BASE_URL}/genres/${genreName}/page/${page}/` : `${BASE_URL}/genres/${genreName}/`;
    const $ = await fetchHtml(url);
    const results = [];
    $('.listupd .bsx').each((_, el) => {
      const item = parseItem($, el);
      if (item) results.push(item);
    });
    const hasNext = $('.pagination .next, .hpage .r').length > 0;
    return {
      genre: genreName,
      results: results.slice(0, 10),
      pagination: {
        currentPage: Number(page),
        totalPages: page + (hasNext ? 1 : 0),
        hasNext,
        hasPrev: page > 1,
      },
    };
  }

  async genres() {
    const $ = await fetchHtml(`${BASE_URL}/`);
    const data = [];
    const seen = new Set();
    $('a[href*="/genres/"]').each((_, a) => {
      const href = $(a).attr('href') || '';
      const m = href.match(/genres\/([^/]+)/);
      const label = $(a).text().trim();
      const slug = m?.[1];
      if (slug && label && !seen.has(slug)) {
        seen.add(slug);
        data.push({ name: label, slug, url: href.startsWith('http') ? href : `${BASE_URL}${href}` });
      }
    });
    return data;
  }

  async getStreamUrl(streamUrl) {
    try {
      const $ = await fetchHtml(streamUrl);
      const videoModule = $('[data-module="OKVideo"]').attr('data-options');
      const movieId = $('[data-module="OKVideo"]').attr('data-movie-id');
      const metadata = {};
      if (movieId) metadata.movieId = movieId;
      if (videoModule) {
        try {
          metadata.video = JSON.parse(videoModule);
        } catch {
          metadata.videoRaw = videoModule;
        }
      }
      return { url: streamUrl, metadata };
    } catch (e) {
      return { url: streamUrl, metadata: {}, error: e.message };
    }
  }
}

export const api = new AnichinCare();