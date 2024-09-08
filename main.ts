import "dotenv/config";
import "./src/ulogger";

(async () => {
  if (process.argv[2] == "update") (await import("./src/source")).default();
  else if (process.argv[2] == "start") (await import("./src/cron")).default();
  else if (process.argv[2] == "addNews") (await import("./src/news")).default();
})();
