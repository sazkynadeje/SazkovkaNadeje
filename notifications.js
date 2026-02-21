// notifications.js
(function(w,d, s, id) {
    if(typeof(w.webpushr)!=='undefined') return;
    w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
    var js, fjs = d.getElementsByTagName(s)[0];
    js = d.createElement(s); js.id = id;js.async=1;
    js.src = "https://cdn.webpushr.com/app.min.js";
    fjs.parentNode.appendChild(js);
}(window,document, 'script', 'webpushr-jssdk-alternative'));

// Inicializace s tvým funkčním klíčem
webpushr('init','BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w','webpushr-sw.js','/SazkovkaNadeje/');
webpushr('setup', { 'in_app_notification': false, 'onsite_messaging': false });

// Funkce, která vyvolá dotaz na povolení (přesně jako v testu)
async function spustitOdber() {
    console.log("Spouštím odběr...");
    try {
        // iPhone potřebuje nejdřív probudit Service Worker
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('webpushr-sw.js');
        }
        
        webpushr('fetch_subscription', function(result) {
            if(result.status === 'success') {
                localStorage.setItem('notif_hotovo', 'ano');
                document.getElementById('notifModal').style.display = 'none';
                document.getElementById('enableNotifications').style.display = 'none';
                alert("ÚSPĚCH! ✅ Notifikace aktivovány.");
            } else {
                alert("CHYBA: " + result.description);
            }
        });
    } catch (e) { console.error(e); }
}

// Kontrola stavu při načtení
window.addEventListener('load', () => {
    setTimeout(() => {
        const status = localStorage.getItem('notif_hotovo');
        if(!status) {
            document.getElementById('notifModal').style.display = 'flex';
        }

        webpushr('notification_status', function(s) {
            if(s !== 'granted' && status !== 'ne') {
                document.getElementById('enableNotifications').style.display = 'inline-block';
            }
        });

        // Připojení na tlačítka v indexu
        const btnYes = document.getElementById('btnNotifYes');
        const btnNeon = document.getElementById('enableNotifications');
        const btnNo = document.getElementById('btnNotifNo');

        if(btnYes) { btnYes.onclick = spustitOdber; btnYes.addEventListener('touchend', spustitOdber); }
        if(btnNeon) { btnNeon.onclick = spustitOdber; btnNeon.addEventListener('touchend', spustitOdber); }
        if(btnNo) {
            btnNo.onclick = () => {
                localStorage.setItem('notif_hotovo', 'ne');
                document.getElementById('notifModal').style.display = 'none';
            };
        }
    }, 3000);
});
