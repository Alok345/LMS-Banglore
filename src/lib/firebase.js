import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
    isSupported().then(yes => {
        if (yes) analytics = getAnalytics(app);
    });
}

export { app, auth, db, analytics };
