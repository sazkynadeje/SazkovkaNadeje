// js/notifications.js - VERZE S AUTOMATICKOU DETEKCÍ CESTY (Pro GitHub Pages)
(function() {
    console.log("🚀 NOTIF-DEBUG: Skript notifications.js se načetl.");

    // 1. KONTROLA PAMĚTI (v7 pro vynucení resetu)
    const notifStatus = localStorage.getItem('sazka_notif_v7');
    if (notifStatus === 'ano' || notifStatus === 'skip') {
        console.log("ℹ️ NOTIF-DEBUG: Již dříve vyřízeno (v7), končím.");
        return; 
    }

    // 2. CSS STYLY
    const style = document.createElement('style');
    style.innerHTML = `
        #n_box_root { 
            display: none; 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.95); z-index: 60000; 
            align-items: center; justify-content: center; font-family: -apple-system, sans-serif; 
        }
        .n_content { 
            background: #1e293b; padding: 35px; border-radius: 35px; 
            border: 2px solid #00f2ff; max-width: 290px; text-align: center; 
            color: white; box-shadow: 0 0 30px rgba(0,242,255,0.3);
        }
        .n_btn { 
            width: 100%; padding: 18px; margin-top: 15px; border-radius: 18px; 
            border: none; font-weight: 900; cursor: pointer; text-transform: uppercase; 
            font-size: 0.9em; letter-spacing: 1px;
        }
        .n_yes { background: #00f2ff; color: #000; }
        .n_no { background: rgba(255,255,255,0.1); color: white; margin-top: 10px; }
        #n_neon_trigger { 
            display: none; margin: 20px auto; padding: 15px; 
            background: transparent; border: 2px solid #00f2ff; 
            color: #00f2ff; border-radius: 100px; font-weight: bold; 
            width: 90%; cursor: pointer; box-shadow: 0 0 10px rgba(0,242,255,0.2);
        }
    `;
    document.head.appendChild(style);

    // 3. HTML ELEMENTY
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="n_neon_trigger">🔔 ZAPNOUT OZNÁMENÍ</button>
        <div id="n_box_root">
            <div class="n_content">
                <h2 style="color:#00f2ff; margin:0 0 15px 0; font-size: 1.5em;">NOTIFIKACE</h2>
                <p style="line-height: 1.5; opacity: 0.9;">Chceš dostávat upozornění na výsledky a góly přímo na displej?</p>
                <button id="n_btn_yes" class="n_btn n_yes">ANO, CHCI</button>
                <button id="n_btn_no" class="n_btn n_no">MOŽNÁ POZDĚJI</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 4. WEBPUSHR SDK INIT
    (function(w,d, s, id) {
        if(typeof(w.webpushr)!=='undefined') return;
        w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.id = id;js.async=1;
        js.src = "https://cdn.webpushr.com/app.min.js";
        fjs.parentNode.appendChild(js);
    }(window,document, 'script', 'webpushr-jssdk-alternative'));

    // --- MAGICKÁ ČÁST PRO GITHUB PAGES ---
    // Zjistíme cestu ke složce (např. /SazkovkaNadeje/)
    var currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    
    // Inicializace s relativní cestou bez domény
    webpushr('init', 
        'BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w', 
        currentPath + 'webpushr-sw.js', 
        currentPath
    );
    
    webpushr('setup', { 'in_app_notification': false, 'onsite_messaging': false });
    console.log("✅ NOTIF-DEBUG: WebPushr init volán pro cestu: " + currentPath);

    // 5. FUNKCE OVLÁDÁNÍ
    function vyrizeno(stav) {
        localStorage.setItem('sazka_notif_v7', stav);
        document.getElementById('n_box_root').style.display = 'none';
        document.getElementById('n_neon_trigger').style.display = 'none';
        if (stav === 'ano') {
            webpushr('fetch_subscription', function(r) {
                if(r.status === 'success') alert("Nastaveno! ✅");
                else alert("Chyba: " + r.description);
            });
        }
    }

    // 6. ZOBRAZENÍ MODÁLU (Zpoždění 2.5s)
    setTimeout(() => {
        if (typeof webpushr === 'undefined') {
            console.error("❌ NOTIF-DEBUG: SDK nenalezeno ani po 2.5s.");
            return;
        }

        webpushr('notification_status', function(status) {
            console.log("📊 NOTIF-DEBUG: Aktuální status v prohlížeči: " + status);
            
            if (status === 'granted') {
                localStorage.setItem('sazka_notif_v7', 'ano');
                return;
            }
            
            // Zobrazení prvků
            document.getElementById('n_box_root').style.display = 'flex';
            document.getElementById('n_neon_trigger').style.display = 'block';
        });

        // Eventy
        document.getElementById('n_btn_yes').onclick = () => vyrizeno('ano');
        document.getElementById('n_btn_no').onclick = () => vyrizeno('skip');
        document.getElementById('n_neon_trigger').onclick = () => vyrizeno('ano');
    }, 2500);

})();
