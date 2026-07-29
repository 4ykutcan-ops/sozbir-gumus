import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

export const DEFAULT_PRICES = {
    "Erkek Yüzük": 300,
    "İthal Erkek Zincir Künye": 350,
    "Erkek Zincir Künye": 300,
    "Alyans": 350,
    "Püskül": 350,
    "Bayan Yüzük": 450,
    "Bayan Bileklik": 450,
    "Bayan Halhal": 450,
    "Bayan Küpe": 450,
    "Bayan Set": 450,
    "Damla Kehribar": 400
};

const firebaseConfig = {
    apiKey: "AIzaSyD-SOZBIR_GUMUS_SHARED_DB",
    authDomain: "sozbir-gumus-live.firebaseapp.com",
    projectId: "sozbir-gumus-live",
    storageBucket: "sozbir-gumus-live.appspot.com",
    messagingSenderId: "10987654321",
    appId: "1:10987654321:web:sozbir001"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const APP_ID = 'sozbir-app-v1';
const PRICE_DOC = doc(db, 'artifacts', APP_ID, 'public', 'data', 'catalog', 'prices');

export async function initDatabase(onPriceUpdate) {
    try {
        await signInAnonymously(auth);
        onSnapshot(PRICE_DOC, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data && data.prices) {
                    const merged = { ...DEFAULT_PRICES, ...data.prices };
                    localStorage.setItem('gumus_prices', JSON.stringify(merged));
                    onPriceUpdate(merged);
                    return;
                }
            }
            onPriceUpdate(DEFAULT_PRICES);
        }, (error) => {
            const saved = localStorage.getItem('gumus_prices');
            if (saved) {
                try { onPriceUpdate(JSON.parse(saved)); } catch(e) { onPriceUpdate(DEFAULT_PRICES); }
            } else {
                onPriceUpdate(DEFAULT_PRICES);
            }
        });
    } catch (err) {
        console.log("DB Hatası:", err);
    }
}

export async function updateCloudPrices(newPrices) {
    try {
        await setDoc(PRICE_DOC, {
            prices: newPrices,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
    } catch (err) {
        return false;
    }
}

