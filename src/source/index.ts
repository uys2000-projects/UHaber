import { SOURCE } from "../constant";
import { db } from "../firebase";
import * as links from "./links.json";

export const clear = async () => {
  const snapshot = await db.collection(SOURCE).get();
  for (let index = 0; index < snapshot.docs.length; index++) {
    const doc = snapshot.docs[index];
    await db.collection(SOURCE).doc(doc.id).delete();
  }
};

export const set = async () => {
  const keys = Object.keys(links);
  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    const key = keys[keyIndex];
    if (key == "default") continue;
    await db
      .collection(SOURCE)
      .doc(key)
      .set({
        ...links[key],
        timesamp: Date.now(),
        utimesamp: Date.now(),
      });
  }
};

export default async () => {
  await clear();
  await set();
};
