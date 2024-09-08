import { TwitterApi } from "twitter-api-v2";

const key = "8rZikzZV5Gc96cv2NHgwd6tyXiWYN0mgizpQUz7FuGWAa";
const twitterClient = new TwitterApi(key);

const readOnlyClient = twitterClient.readOnly;

const user = await readOnlyClient.v2.userByUsername("plhery");
await twitterClient.v2.tweet("Hello, this is a test.");
