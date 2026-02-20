/**
 * DATABASE SERVICE - KANCELÁŘ NADĚJE v2.0
 * Správa Firebase a operací nad daty
 */

import { AuthService } from './auth.js';

// Tvůj Firebase Config (ponecháno z tvé verze)
const firebaseConfig = { 
    apiKey: "AIzaSyC-NCdmsgA42FxnopKm92m1y5gUGw_z_uE", 
    authDomain: "nadeje-208bd.firebaseapp.com", 
    databaseURL: "https://nadeje-208bd-default-rtdb.europe-west1.firebasedatabase.app", 
    projectId: "nadeje-208bd", 
    storageBucket: "nadeje-208bd.firebasestorage.app", 
    messagingSenderId: "688478977789", 
    appId: "1:688478977789:web:512d1520cf96c9e59cc894" 
};

// Inicializace Firebase (Compat verze pro zachování tvé logiky)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

export const DBService = {
    // Načtení všech zápasů
    getMatches: (callback) => {
        db.ref('sazkyData/zapasy').on('value', snap => callback(snap.val()));
    },

    // Načtení banku
    getBank: (callback) => {
        db.ref('sazkyData/prevedenyBank').on('value', snap => callback(snap.val() || 0));
    },

    // ODESLÁNÍ TIKETU (Nová verze s ID uživatele)
    sendTicket: async (cart) => {
        const user = AuthService.getUser();
        if (!user) throw new Error("Uživatel není přihlášen");

        const batch = {};
        const timestamp = Date.now();

        Object.entries(cart).forEach(([matchId, bet]) => {
            // Sázka se nyní ukládá pod ID uživatele, ne náhodným push klíčem
            // To zabrání duplicitním sázkám jednoho člověka na jeden zápas
            batch[`sazkyData/zapasy/${matchId}/sazky/${user.id}`] = {
                jmeno: user.name,
                userId: user.id,
                skore: bet.skore,
                strelec: bet.strelec,
                skryt: bet.skryt,
                stav: "⏳",
                casZapisu: timestamp
            };
        });

        return db.ref().update(batch);
    },

    // Načtení statistik
    getStats: (callback) => {
        db.ref('sazkyData/stats').on('value', snap => callback(snap.val() || {}));
    }
};
