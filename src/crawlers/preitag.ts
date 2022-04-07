import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

let html: AxiosResponse;

async function getHTML(URL: string) {
  try {
    return await axios.get(URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
        'Accept-Language': 'en-gb',
        'Accept-Encoding': 'br, gzip, deflate',
        Accept:
          'test/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        Referer: 'http://www.google.com/',
      },
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getPreitag(URL: string) {
  if (!html) {
    html = await getHTML(URL);
  }

  const $ = cheerio.load(html.data);
  const preitag = {};
  preitag['h1'] = $('h1').text();
  return preitag;
}
