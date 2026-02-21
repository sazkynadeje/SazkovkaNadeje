// notifications.js
(function() {
    // 1. Vytvoření vzhledu (CSS)
    const style = document.createElement('style');
    style.innerHTML = `
        #enableNotifications { display: none; margin: 20px auto; padding: 18px; background: transparent; border: 2px solid #00f2ff; color: #00f2ff; border-radius: 100px; font-weight: bold; width: 100%; max-width: 300px; cursor: pointer; box-shadow: 0 0 15px rgba(0,242,255,0.3); }
        #notifModal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 10000; align-items: center; justify-content: center; }
        .modal-content { background: #1e293b; padding: 30px; border-radius: 30px; border: 2px solid #00f2ff; max-width: 280px; text-align: center; color: white; }
        .modal-btn { width: 100%; padding: 15px; margin-top: 10px; border-radius: 15px; border: none; font-weight: bold; cursor: pointer; }
        .btn-ano { background: #00f2ff; color: #000; }
    `;
    document.head.appendChild(style);

    // 2. Vytvoření HTML elementů (Modál a Tlačítko)
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="enableNotifications">🔔 ZAPNOUT OZNÁMENÍ</button>
        <div id="notifModal">
            <div class="modal-content">
                <h2 style="color:#00f2ff; margin-top:0;">NOTIFIKACE</h2>
                <p>Chceš dostávat upozornění na výsledky přímo na displej?</p>
                <button id="btnNotifYes" class="modal-btn btn-ano">ANO, CHCI</button>
                <button id="btnNotifNo" class="modal-btn" style="background:rgba(255,255,255,0.1); color:white;">MOŽNÁ POZDĚJI</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Načtení Webpushr SDK
    (function(w,d, s, id) {
        if(typeof(w.webpushr)!=='undefined') return;
        w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.id = id;js.async=1;
        js.src = "https://cdn.webpushr.com/app.min.js";
        fjs.parentNode.appendChild(js);
    }(window,document, 'script', 'webpushr-jssdk-alternative'));

    webpushr('init','BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w','webpushr-sw.js','/SazkovkaNadeje/');

    // 4. Funkce pro aktivaci (tvůj funkční test)
    async function spustitOdber() {
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('webpushr-sw.js');
        }
        webpushr('fetch_subscription', function(result) {
            if(result.status === 'success') {
                localStorage.setItem('notif_hotovo', '1');
                document.getElementById('notifModal').style.display = 'none';
                document.getElementById('enableNotifications').style.display = 'none';
                alert("ÚSPĚCH! ✅");
            } else {
                alert("Chyba: " + result.description);
            }
        });
    }

    // 5. Logika zobrazení
    setTimeout(() => {
        const btn = document.getElementById('enableNotifications');
        const modal = document.getElementById('notifModal');
        const done = localStorage.getItem('notif_hotovo');

        if(!done) modal.style.display = 'flex';

        webpushr('notification_status', function(status) {
            if(status !== 'granted' && done !== 'skip') btn.style.display = 'block';
        });

        document.getElementById('btnNotifYes').onclick = spustitOdber;
        document.getElementById('btnNotifYes').ontouchend = spustitOdber;
        btn.onclick = spustitOdber;
        btn.ontouchend = spustitOdber;
        document.getElementById('btnNotifNo').onclick = () => {
            localStorage.setItem('notif_hotovo', 'skip');
            modal.style.display = 'none';
        };
    }, 2500);
})();
