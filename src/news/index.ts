import {
  CATEGORY,
  JOURNAL,
  ORGANIZATION,
  RAWJOURNAL,
  SOURCE,
} from "../constant";
import { db } from "../firebase";
import { ask } from "../gemini";
import {
  UCategory,
  UDocument,
  UJournal,
  UOrganization,
  USource,
} from "../types";
import { parse } from "../parser";
import type Parser from "rss-parser";
import { get } from "../axios";

export const fakePromise = (t: number) =>
  new Promise((resolve) => setTimeout(() => resolve(true), t));

export const getOrganizations = async () => {
  const sources = await db.collection(ORGANIZATION).get();
  return sources.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as UDocument<UOrganization>)
  );
};

export const getCategories = async () => {
  const sources = await db.collection(CATEGORY).get();
  return sources.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as UDocument<UCategory>)
  );
};

export const getSources = async () => {
  const sources = await db.collection(SOURCE).get();
  return sources.docs.map(
    (doc) => ({ ...doc.data(), id: doc.id } as UDocument<USource>)
  );
};

export const getRawJournal = (
  rssItem: Parser.Item,
  sourceId: string,
  categoryId?: string,
  organizationId?: string
): UJournal | undefined => {
  if (
    !rssItem.pubDate ||
    !rssItem.link ||
    !rssItem.title ||
    !rssItem.content ||
    !categoryId ||
    !organizationId
  )
    return;
  return {
    rss: {
      url: rssItem.link,
      title: rssItem.title,
      content: rssItem.content,
      pubDate: rssItem.pubDate,
    },
    result: {
      title: "",
      summary: "",
      ptimestamp: Date.parse(rssItem.pubDate),
    },
    source: sourceId,
    category: categoryId,
    organization: organizationId,
  };
};

export const hasRawJournal = async (url: string) => {
  const snapshot = await db
    .collection(RAWJOURNAL)
    .where("data.rss.url", "==", url)
    .get();
  return snapshot.docs.length != 0;
};

export const hasJournal = async (url: string) => {
  const snapshot = await db
    .collection(JOURNAL)
    .where("data.rss.url", "==", url)
    .get();
  return snapshot.docs.length != 0;
};

export const addRawJournal = async (journal: UJournal) => {
  const id = Date.now().toString();
  const data: UDocument<UJournal> = {
    id: id,
    data: journal,
    timestamp: Date.now(),
    utimestamp: Date.now(),
  };
  db.collection(RAWJOURNAL).doc(id).set(data);
};

export const prepeareRawJournals = async () => {
  const [organizations, categories, sources] = await Promise.all([
    getOrganizations.uLog(),
    getCategories.uLog(),
    getSources.uLog(),
  ]);

  for (let sIndex = 0; sIndex < sources.length; sIndex++) {
    const source = sources[sIndex];
    const sourceCategory = categories.find((c) => c.id == source.data.category);
    const sourceOrganization = organizations.find(
      (o) => o.id == source.data.organization
    );
    const rssResult = await parse(source.data.url);
    for (let rIndex = 0; rIndex < rssResult.items.length; rIndex++) {
      await fakePromise(100);
      const rssItem = rssResult.items[rIndex];
      const rawJournal = getRawJournal(
        rssItem,
        source.id,
        sourceCategory?.id,
        sourceOrganization?.id
      );
      if (rawJournal) {
        const [journalExist, rawJournalExist] = await Promise.all([
          hasJournal(rawJournal.rss.url),
          hasRawJournal(rawJournal.rss.url),
        ]);
        if (!journalExist && !rawJournalExist)
          await addRawJournal.uLog(rawJournal);
      }
    }
  }
};

export const getFirstRawJournal = async () => {
  const query = db
    .collection(RAWJOURNAL)
    .orderBy("data.result.ptimestamp", "asc")
    .limit(1);
  const querySnapshot = await query.get();
  if (querySnapshot.empty) return;

  const journal = {
    ...querySnapshot.docs[0].data(),
    id: querySnapshot.docs[0].id,
  } as UDocument<UJournal>;
  return journal;
};
export const getJournalSummary = async (url: string) => {
  const data = (await get(url).catch(() => ({ data: undefined }))).data;
  if (!data) return undefined;
  const message = `Bu sayfayı özetliyebilir misin? Cevap dışında bır şey yazmadan ve şu json formatında {title: "", summary: ""}. Özetlemeni istediğim sayfa ise şu şekilde: ${data}`;
  const { response } = await ask(message).catch(() => ({
    response: undefined,
  }));
  if (!response?.text) return undefined;
  return response.text();
};

export const getParsedJournalSummary = async (journalSummary: string) => {
  const text = journalSummary.replace("```json", "").replace("```", "");
  return JSON.parse(text) as { title?: string; summary?: string };
};

export const removeRawJournal = async (id: string) => {
  await db.collection(RAWJOURNAL).doc(id).delete();
};
export const addJournal = async (journal: UDocument<UJournal>) => {
  journal.utimestamp = Date.now();
  await db.collection(JOURNAL).add(journal);
};

export const prepeareJournal = async () => {
  const journal = await getFirstRawJournal.uLog();
  if (!journal) return;

  const summary = await getJournalSummary.uLog(journal.data.rss.url);
  if (!summary) return;
  const parsedSummary = await getParsedJournalSummary
    .uLog(summary)
    .catch(() => ({ title: undefined, summary: undefined }));
  if (!parsedSummary?.title || !parsedSummary?.summary) return;

  journal.data.result.summary = parsedSummary.summary;
  journal.data.result.title = parsedSummary.title;
  await removeRawJournal.uLog(journal.id);
  await addJournal.uLog(journal);
};
/**
 *  for (let cIndex = 0; cIndex < site.categories.length; cIndex++) {
      const category = site.categories[cIndex];
      const urls = await getCategoryLinks.uLog(category.url).catch(() => []);
      for (let nIndex = 0; nIndex < urls.length; nIndex++) {
        const url = urls[nIndex];
        if (await urlExist.uLog(url)) continue;
        const summary = await getNewsSummary
          .uLog(url)
          .catch(() => undefined);
        if (!summary) continue;
        const news = await getNews.uLog(summary);
        const data = getData(site, category, url, news);
        await addNews.uLog(data);
        await post(process.env.TWITTER ?? "http://localhost:3000", {
          id: "uhaber",
          content: `${data.summary}\n\nKaynak: ${data.url}\n\nHaber Özetleri: https://uhaber.mehmetuysal.dev`,
        }).catch(() => undefined);
      }
    }
 */
