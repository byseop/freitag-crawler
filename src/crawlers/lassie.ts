import { url } from './constant.js';
import { getFreitag } from './freitag.js';
import firestore from '../firestore/init.js';
import { format } from 'date-fns';
import firebase from 'firebase/compat';

async function getLassie() {
  const $ = await getFreitag(url.lassie);
  const script = $($('.layout__region.layout__region--main')[1]).children(
    'script',
  );
  const json = JSON.parse(script.html().split('window.variations = ')[1]);

  const lassie = firestore.collection('freitag').doc('lassie');
  let db: firebase.firestore.DocumentData;
  await lassie.get().then((doc) => {
    db = doc.data();
  });

  lassie.update({
    collectDate: format(new Date(), 'yyyy-MM-dd: hh-mm'),
    price: json.price,
  });

  if (db) {
    const adds = [];
    let removes = [...db.data];
    json.variations.forEach((pdt) => {
      if (!db.data.find((p) => p.id === pdt.id)) {
        // 등록
        adds.push({
          id: pdt.id,
          name: pdt.title,
          cover: `${url.coverImage}/${pdt.cover[0]}.jpg`,
          url: `https://www.freitag.ch${pdt.url}`,
        });
      }

      removes = removes.filter((p) => p.id !== pdt.id);
    });

    if (adds.length > 0 || removes.length > 0) {
      lassie.update({
        data: removes.reduce(
          (prev, cur) =>
            prev.find((pdt) => pdt.id === cur.id)
              ? prev.filter((pdt) => pdt.id !== cur.id)
              : prev,
          [...db.data, ...adds],
        ),
      });
    }

    console.log('add', adds);
    console.log('remove', removes);
  }
}

export default getLassie;
