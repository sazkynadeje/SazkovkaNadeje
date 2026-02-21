// notifications.js
(function() {
    // 1. OKAMŽITÁ KONTROLA - pokud je hotovo, skript dál nepokračuje
    const notifStatus = localStorage.getItem('sazka_notif_v3');
    if (notifStatus === 'ano' || notifStatus === 'skip') {
        console.log("Notifikace již vyřešeny, končím.");
        return; 
    }

    // 2. CSS Vzhled
    const style = document.createElement('style');
    style.innerHTML = `
        #n_box_root { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 20000; align-items: center; justify-content: center; font-family: sans-serif; }
        .n_content { background: #1e293b; padding: 30px; border-radius: 30px; border: 2px solid #00f2ff; max-width: 280px; text-align: center; color: white; }
        .n_btn { width: 100%; padding: 16px; margin-top: 12px; border-radius: 16px; border: none; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        .n_yes { background: #00f2ff; color: #000; }
        .n_no { background: rgba(255,255,255,0.1); color: white; }
        #n_neon_trigger { display: none; margin: 15px auto; padding: 15px; background: transparent; border: 2px solid #00f2ff; color: #00f2ff; border-radius: 100px; font-weight: bold; width: 90%; cursor: pointer; }
    `;
    document.head.appendChild(style);

    // 3. Vytvoření HTML
    const container = document.createElement('div');
    container.id = "n_wrapper";
    container.innerHTML = `
        <button id="n_neon_trigger">🔔 ZAPNOUT OZNÁMENÍ</button>
        <div id="n_box_root">
            <div class="n_content">
                <h2 style="color:#00f2ff; margin:0 0 15px 0;">NOTIFIKACE</h2>
                <p>Chceš dostávat upozornění na výsledky přímo na displej?</p>
                <button id="n_btn_yes" class="n_btn n_yes">ANO, CHCI</button>
                <button id="n_btn_no" class="n_btn n_no">POZDĚJI</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 4. Webpushr SDK
    (function(w,d, s, id) {
        if(typeof(w.webpushr)!=='undefined') return;
        w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.id = id;js.async=1;
        js.src = "https://cdn.webpushr.com/app.min.js";
        fjs.parentNode.appendChild(js);
    }(window,document, 'script', 'webpushr-jssdk-alternative'));

    webpushr('init','BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w','webpushr-sw.js','/SazkovkaNadeje/');

    const mainBox = document.getElementById('n_box_root');
    const neonBtn = document.getElementById('n_neon_trigger');

    async function vyreseno(stav) {
        localStorage.setItem('sazka_notif_v3', stav);
        mainBox.style.display = 'none';
        neonBtn.style.display = 'none';
        
        if (stav === 'ano') {
            if ('serviceWorker' in navigator) {
                await navigator.serviceWorker.register('webpushr-sw.js');
            }
            webpushr('fetch_subscription', function(r) {
                if(r.status === 'success') alert("Nastaveno! ✅");
            });
        }
    }

    // 5. Spuštění s mírným zpožděním pro stabilitu
    setTimeout(() => {
        // Kontrola stavu přímo od Webpushru
        webpushr('notification_status', function(status) {
            if(status === 'granted') {
                localStorage.setItem('sazka_notif_v3', 'ano');
                return;
            }
            // Pokud nemáme povoleno a ani jsme neklikli na skip, ukaž modál
            mainBox.style.display = 'flex';
            neonBtn.style.display = 'block';
        });

        document.getElementById('n_btn_yes').onclick = () => vyreseno('ano');
        document.getElementById('n_btn_yes').ontouchend = () => vyreseno('ano');
        
        document.getElementById('n_btn_no').onclick = () => vyreseno('skip');
        document.getElementById('n_btn_no').ontouchend = () => vyreseno('skip');

        neonBtn.onclick = () => vyreseno('ano');
    }, 2500);
})();
