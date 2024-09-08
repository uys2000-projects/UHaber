interface UCategory {
  name: string;
  url: string;
}
interface USource {
  id: string;
  name: string;
  categories: UCategory[];
  timesamp: number;
  utimesamp: number;
}

interface UNews {
  siteCode: string;
  site: string;
  categoryCode: string;
  category: string;
  url: string;
  title: string;
  summary: string;
  timestamp: number;
}
