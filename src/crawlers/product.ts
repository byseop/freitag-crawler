import { url as urls } from './constant.js';
import { getFreitag } from './freitag.js';
import firestore from '../firestore/init.js';
import { format, add } from 'date-fns';
import firebase from 'firebase/compat';
import {
  sendDiscordMessage,
  // replyDiscordMessage,
} from '../sender/discord/init.js';
import addCart from './addCart.js';
import { Product } from './types.js';

async function getProduct({
  name,
  url,
  scriptIndex,
}: {
  name: string;
  url: string;
  scriptIndex: number;
}) {
  const $ = await getFreitag(url);
  const script = $(
    $('.layout__region.layout__region--main')[scriptIndex],
  ).children('script');

  if (!script || !script.html()) {
    await sendDiscordMessage(
      `Blocked: ${name}, Current time: ${format(
        add(new Date(), { hours: 9 }),
        'yyyy-MM-dd HH:mm:ss',
      )}`,
    );
    return;
  }

  const json = JSON.parse(script.html().split('window.variations = ')[1]);

  const doc = firestore.collection('freitag').doc(name);
  let db: firebase.firestore.DocumentData;
  await doc.get().then((doc) => {
    db = doc.data();
  });

  await doc.update({
    collectDate: format(add(new Date(), { hours: 9 }), 'yyyy-MM-dd HH:mm'),
    price: json.price,
  });

  if (db) {
    const adds: Product[] = [];
    let removes = [...db.data];
    await json.variations.forEach(async (pdt) => {
      if (!db.data.find((p) => p.id === pdt.id)) {
        // 등록
        adds.push({
          id: pdt.id,
          name: pdt.title,
          cover: `${urls.coverImage}/${pdt.cover[0]}.jpg`,
          url: `https://www.freitag.ch${pdt.url}`,
          // message: message.id,
        });

        // 디스코드 메세지 알람
        await sendDiscordMessage(
          `**[신규 상품 입고알림!]**\n모델: **${name.toUpperCase()}**\n이름: **${
            pdt.title
          }**\n가격: **${json.price}**\n구매링크: https://www.freitag.ch${
            pdt.url
          } \n이미지: ${urls.coverImage}/${pdt.cover[0]}.jpg`,
          'mention',
        );
      }

      removes = removes.filter((p) => p.id !== pdt.id);
    });

    if (adds.length > 0 || removes.length > 0) {
      await doc.update({
        data: removes.reduce(
          (prev, cur) =>
            prev.find((pdt) => pdt.id === cur.id)
              ? prev.filter((pdt) => pdt.id !== cur.id)
              : prev,
          [...db.data, ...adds],
        ),
      });
    }

    if (adds.length > 0) {
      let blacklist: firebase.firestore.DocumentData;
      const doc = firestore.collection('freitag').doc('blacklist');
      await doc.get().then((doc) => {
        blacklist = doc.data();
      });
      if (blacklist) {
        // console.log('blacklist:', blacklist);
        const realAdd = adds.filter((product) => blacklist.data[product.id]);
        if (realAdd.length > 0) {
          console.log(
            'realadd',
            realAdd.map((pdt) => pdt.id),
          );
          await addCart(realAdd);
        }
      }
    }

    console.log(`[${name}] add`, adds);
    console.log(`[${name}] remove`, removes);
  }
}

export default getProduct;
