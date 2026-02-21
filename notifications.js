// notifications.js
(function(w,d, s, id) {
    if(typeof(w.webpushr)!=='undefined') return;
    w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
    var js, fjs = d.getElementsByTagName(s)[0];
    js = d.createElement(s); js.id = id;js.async=1;
    js.src = "https://cdn.webpushr.com/app.min.js";
    fjs.parentNode.appendChild(js);
}(window,document, 'script', 'webpushr-jssdk-alternative'));

// Inicializace Webpushru
webpushr('init','BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w','webpushr-sw.js','/SazkovkaNadeje/');
webpushr('setup', { 'in_app_notification': false, 'onsite_messaging': false });

// Hlavní funkce pro aktivaci
async function activatePush() {
    console.log("Aktivuji proces odběru...");
    try {
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('webpushr-sw.js');
        }
        webpushr('fetch_subscription', function(result) {
            if(result.status === 'success') {
                localStorage.setItem('notifHOTOVO', 'ano');
                if(document.getElementById('notifModal')) document.getElementById('notifModal').style.display = 'none';
                if(document.getElementById('enableNotifications')) document.getElementById('enableNotifications').style.display = 'none';
                alert("ÚSPĚCH! ✅ Notifikace jsou nastaveny.");
            } else {
                alert("CHYBA: " + result.description + "\n\nTip: Otevři web z PLOCHY iPhonu!");
            }
        });
    } catch (e) { console.error("SW fail:", e); }
}

// Kontrola při načtení
window.addEventListener('load', () => {
    setTimeout(() => {
        const status = localStorage.getItem('notifHOTOVO');
        const modal = document.getElementById('notifModal');
        const neonBtn = document.getElementById('enableNotifications');

        if(!status && modal) modal.style.display = 'flex';

        // Propojení tlačítek, pokud v indexu existují
        const yesBtn = document.getElementById('btnNotifYes');
        const noBtn = document.getElementById('btnNotifNo');

        if(yesBtn) {
            yesBtn.onclick = activatePush;
            yesBtn.ontouchend = activatePush;
        }
        if(neonBtn) {
            neonBtn.onclick = activatePush;
            neonBtn.ontouchend = activatePush;
        }
        if(noBtn) {
            noBtn.onclick = () => {
                localStorage.setItem('notifHOTOVO', 'ne');
                if(modal) modal.style.display = 'none';
            };
        }
    }, 3000);
});
