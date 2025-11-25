// config/firebase.mjs
import admin from "firebase-admin";

// Sadece bir kere initialize olsun (çok önemli!)
if (!admin.apps.length) {
  try {
    // 1. Eğer SERVICE_ACCOUNT_JSON environment variable'ı varsa (Vercel, Railway, Render vs.)
    //    onu kullan. Yoksa localdeki json dosyasını kullan.
    const serviceAccount = process.env.SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.SERVICE_ACCOUNT_JSON)
      : await import(
          "./paymentmethod-a08b9-firebase-adminsdk-fbsvc-dc546d056f.json",
          { assert: { type: "json" } }
        ).then(module => module.default);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin SDK başarıyla başlatıldı.");
  } catch (error) {
    console.error("Firebase Admin başlatılamadı:", error.message);
    throw error;
  }
}

// Firestore instance'ı
const db = admin.firestore();

// Opsiyonel: Timestamp'leri daha okunabilir hale getir (tavsiye edilir)
db.settings({
  timestampsInSnapshots: true, // eski projelerde gerek yok ama zararsız
  ignoreUndefinedProperties: true,
});

export default db;
export { admin };