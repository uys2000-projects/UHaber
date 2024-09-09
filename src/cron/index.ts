import cron from "node-cron";

export default async () => {
  const task = cron.schedule("0 0 * * *", async () => {
    (await import("../news")).default();
  });
  task.start();
};
