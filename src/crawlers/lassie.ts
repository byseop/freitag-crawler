import { url } from './constant.js';
import { getPreitag } from './preitag.js';

async function getLassie() {
  const $ = await getPreitag(url.lassie);
  console.log($);
}

export default getLassie;
