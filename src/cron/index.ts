import cron from "node-cron";

const prepeareRawJournals = async () =>
  (await import("../news")).prepeareRawJournals();

const prepeareJournal = async () => (await import("../news")).prepeareJournal();

export const prepeareRawJournalsScheduler = async (now: boolean = false) => {
  const options = { scheduled: true, timezone: "Europe/Istanbul" };
  const task = cron.schedule("0 */6 * * *", prepeareRawJournals, options);
  task.start();
  if (now) task.now();
};

export const prepeareJournalScheduler = async (now: boolean = false) => {
  const options = { scheduled: true, timezone: "Europe/Istanbul" };
  const task = cron.schedule("*/10 * * * *", prepeareJournal, options);
  task.start();
  if (now) task.now();
};
