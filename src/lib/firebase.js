import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBVBgkcGXZH2T8pr1yBYLoobvMeZCDHHDI",
    authDomain: "whatsapp-crm-10f38.firebaseapp.com",
    projectId: "whatsapp-crm-10f38",
    storageBucket: "whatsapp-crm-10f38.firebasestorage.app",
    messagingSenderId: "81073076011",
    appId: "1:81073076011:web:f5ac7841705a30964a776e",
    measurementId: "G-EP9GWT0C6D"
};

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
