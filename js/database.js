// js/database.js - Verze 2.0 (Oddělená data)

const firebaseConfig = {
    apiKey: "AIzaSyCxV...", // Tvé API klíče tam nechej tak, jak jsou
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
    // Načtení banku z nové složky
    getBank: (callback) => {
        db.ref('sazkyData_v2/prevedenyBank').on('value', s => callback(s.val() || 0));
    },

    // Načtení zápasů z nové složky
    getMatches: (callback) => {
        db.ref('sazkyData_v2/zapasy').on('value', s => callback(s.val()));
    },

    // Načtení statistik z nové složky
    getStats: (callback) => {
        db.ref('sazkyData_v2/stats').on('value', s => callback(s.val() || {}));
    },

    // Odeslání tiketu (ukládá se pod userId do nové složky)
    sendTicket: async (cart) => {
        const userData = JSON.parse(localStorage.getItem('nadeje_user'));
        if (!userData) throw new Error("Nejsi přihlášen!");

        const updates = {};
        for (const [matchId, bet] of Object.entries(cart)) {
            const ticketId = db.ref().child(`sazkyData_v2/zapasy/${matchId}/sazky`).push().key;
            updates[`sazkyData_v2/zapasy/${matchId}/sazky/${ticketId}`] = {
                ...bet,
                userId: userData.id,
                jmeno: userData.name,
                timestamp: Date.now()
            };
        }
        return db.ref().update(updates);
    }
};
