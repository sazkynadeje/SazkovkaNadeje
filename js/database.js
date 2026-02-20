// Na začátek souboru přidej tento import:
import { AuthService } from './auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCxV...", // Tvé API klíče tam máš správně
    authDomain: "nadeje-208bd.firebaseapp.com",
    databaseURL: "https://nadeje-208bd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nadeje-208bd",
    storageBucket: "nadeje-208bd.appspot.com",
    messagingSenderId: "305101689255",
    appId: "1:305101689255:web:c08343111f15598696ec06"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

export const DBService = {
    getBank: (callback) => {
        db.ref('sazkyData_v2/prevedenyBank').on('value', s => callback(s.val() || 0));
    },

    getMatches: (callback) => {
        db.ref('sazkyData_v2/zapasy').on('value', s => callback(s.val()));
    },

    getStats: (callback) => {
        db.ref('sazkyData_v2/stats').on('value', s => callback(s.val() || {}));
    },

    // OPRAVENÁ FUNKCE ODESLÁNÍ
    sendTicket: async (cart) => {
        // Místo localStorage použijeme přímo naši službu
        const userData = AuthService.getUser(); 
        
        if (!userData || !userData.name) {
            throw new Error("Nejsi přihlášen! Zkus znovu zadat jméno.");
        }

        const updates = {};
        for (const [matchId, bet] of Object.entries(cart)) {
            const ticketId = db.ref().child(`sazkyData_v2/zapasy/${matchId}/sazky`).push().key;
            updates[`sazkyData_v2/zapasy/${matchId}/sazky/${ticketId}`] = {
                ...bet,
                userId: userData.id || userData.name, // Pojistka pro ID
                jmeno: userData.name,
                timestamp: Date.now()
            };
        }
        return db.ref().update(updates);
    }
};
