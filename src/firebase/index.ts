import admin, { ServiceAccount } from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import service from "./service.json";

admin.initializeApp({
  credential: admin.credential.cert(service as ServiceAccount),
});

export const db = getFirestore();
