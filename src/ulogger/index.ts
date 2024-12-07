import { setULogger } from "u-logger";
import { db } from "../firebase";
import { LOG } from "../constant";
import { UDocument } from "../types";

export const log = async (
  type: string,
  name: string,
  res: any,
  args: any[]
) => {
  const log: UDocument<object> = {
    id: "",
    data: {
      type: type,
      name: name,
      result: res ?? {},
      args: args ?? {},
    },
    timestamp: Date.now(),
    utimestamp: Date.now(),
  };
  if (type == "Err") await db.collection(LOG).add(log);
  console.log(type, name);
};

setULogger(
  true,
  (name, res, ...args) => log("Run", name, res, args),
  (name, res, ...args) => log("Res", name, res, args),
  (name, res, ...args) => log("Res", name, res, args),
  (name, res, ...args) => log("Err", name, res, args)
);
