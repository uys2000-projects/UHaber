import Parser from "rss-parser";

export const parser = new Parser();
export const parse = (url: string) => {
  return parser.parseURL(url);
};
