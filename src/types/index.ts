export interface UDocument<T> {
  id: string;
  data: T;
  timestamp: number;
  utimestamp: number;
}

export interface UOrganization {
  codeName: string;
  name: string;
  url: string;
}
export interface UCategory {
  codeName: string;
  name: string;
  url: string;
}
export interface USource {
  organization: string;
  category: string;
  url: string;
}

export interface UJournal {
  rss: {
    url: string;
    title: string;
    content: string;
    pubDate: string;
  };
  result: {
    title: string;
    summary: string;
    ptimestamp: number;
  };
  source: string;
  category: string;
  organization: string;
}
