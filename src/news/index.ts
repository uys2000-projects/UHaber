import { get } from "../axios";
import { NEWS, SOURCE } from "../constant";
import { db } from "../firebase";
import { ask } from "../gemini";
export const getSources = async () => {
  const sources = await db.collection(SOURCE).get();
  return sources.docs.map((doc) => ({ ...doc.data(), id: doc.id } as USource));
};

const getCategoryLinks = async (url: string) => {
  const data = (await get(url)).data;
  const message = `Bu sayfada ki haber linklerini satir satir sadece linkleri yazarak donebilir misin, baska bir sey yazmadan: ${data}`;
  const { response } = await ask(message);
  if (!response) return [];
  return response
    .text()
    .split("\n")
    .filter((i) => i);
};

const getNewsSummary = async (url: string) => {
  const data = (await get(url).catch(() => ({ data: undefined }))).data;
  if (!data) return undefined;
  const message = `Cevap disinda bir sey yazmadan, bu haber sayfasi icin baslik ve ozet yazabilir misin, cevabi {"title":"",summary:""} seklinde json formatinda yazabilir misin: ${data}`;
  const { response } = await ask(message);
  if (!response?.text) return undefined;
  return response.text();
};

const getNews = async (text: string) => {
  const parsed = text.replace("```json", "").replace("```", "").trim();
  return JSON.parse(parsed) as { title: string; summary: string };
};

const getData = (
  site: USource,
  category: UCategory,
  url: string,
  news: { title: string; summary: string }
): UNews => {
  return {
    siteCode: site.id,
    site: site.name,
    categoryCode: category.name.replace(/ /g, "-").toLocaleLowerCase(),
    category: category.name,
    url: url,
    title: news.title,
    summary: news.summary,
    timestamp: Date.now(),
  };
};

const urlExist = async (url: string) => {
  const snapshot = await db.collection(NEWS).where("url", "==", url).get();
  return snapshot.docs.length > 0;
};

const addNews = async (data: UNews) => {
  const snapshot = await db.collection(NEWS).where("url", "==", data.url).get();
  if (snapshot.docs.length == 0) {
    await db.collection(NEWS).add(data);
    return true;
  }
  return false;
};

export default async () => {
  const sites = await getSources();
  for (let sIndex = 0; sIndex < sites.length; sIndex++) {
    const site = sites[sIndex];
    for (let cIndex = 0; cIndex < site.categories.length; cIndex++) {
      const category = site.categories[cIndex];
      const urls = await getCategoryLinks.pLogger(category.url).catch(() => []);
      for (let nIndex = 0; nIndex < urls.length; nIndex++) {
        const url = urls[nIndex];
        if (await urlExist.pLogger(url)) continue;
        const summary = await getNewsSummary
          .pLogger(url)
          .catch(() => undefined);
        if (!summary) continue;
        const news = await getNews.pLogger(summary);
        const data = getData(site, category, url, news);
        await addNews.pLogger(data);
      }
    }
  }
};
