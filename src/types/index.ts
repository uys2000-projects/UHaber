interface UCategory {
  name: string;
  url: string;
}
interface USource {
  name: string;
  categories: UCategory[];
  timesamp: number;
  utimesamp: number;
}

interface UNews {
  site: string;
  category: string;
  url: string;
  title: string;
  summary: string;
  timestamp: number;
}
