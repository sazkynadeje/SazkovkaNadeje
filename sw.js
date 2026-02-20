// sw.js - Service Worker pro notifikace
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Tvůj Firebase Config (zkontroluj, zda sedí s tvým database.js)
const firebaseConfig = {
    apiKey: "AIzaSyCxV...", 
    authDomain: "nadeje-208bd.firebaseapp.com",
    databaseURL: "https://nadeje-208bd-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "nadeje-208bd",
    storageBucket: "nadeje-208bd.appspot.com",
    messagingSenderId: "305101689255",
    appId: "1:305101689255:web:c08343111f15598696ec06"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Tato část zachytí notifikaci, když je aplikace zavřená (na pozadí)
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Přijata zpráva na pozadí: ', payload);
  
  const notificationTitle = payload.notification.title || "Kancelář Naděje";
  const notificationOptions = {
    body: payload.notification.body || "Máš nový výsledek!",
    icon: 'IMG_8429.png', // Logo, které se zobrazí u notifikace
    badge: 'IMG_8429.png', // Malá ikonka v liště (Android)
    data: {
      url: './index.html' // Kam se má uživatel dostat po kliknutí
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Co se má stát, když uživatel na notifikaci klikne
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
