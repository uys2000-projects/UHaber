import "dotenv/config";
import "./src/ulogger";

const start = async (now: boolean = false) => {
  (await import("./src/cron")).prepeareRawJournalsScheduler(now);
  (await import("./src/cron")).prepeareJournalScheduler();
};
(async () => {
  if (process.argv[2] == "start") start();
  if (process.argv[2] == "start:now") start(true);
})();
