// js/notifications.js - Kompletní správa notifikací s logováním pro debugging
(function() {
    console.log("🚀 NOTIF-DEBUG: Skript notifications.js se začal načítat.");

    // 1. KONTROLA PAMĚTI (v4 pro vynucení resetu při testování)
    const notifStatus = localStorage.getItem('sazka_notif_v4');
    if (notifStatus === 'ano' || notifStatus === 'skip') {
        console.log("ℹ️ NOTIF-DEBUG: Uživatel již dříve zvolil '" + notifStatus + "'. Skript končí.");
        return; 
    }

    // 2. CSS STYLY (Z-index 50000 pro přebití přihlašovacího okna)
    const style = document.createElement('style');
    style.innerHTML = `
        #n_box_root { 
            display: none; 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.95); z-index: 50000; 
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
    console.log("✅ NOTIF-DEBUG: Styly vloženy.");

    // 3. VYTVOŘENÍ HTML ELEMENTŮ
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
    console.log("✅ NOTIF-DEBUG: HTML elementy vloženy do body.");

    // 4. WEBPUSHR SDK INIT
    (function(w,d, s, id) {
        if(typeof(w.webpushr)!=='undefined') return;
        w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.id = id;js.async=1;
        js.src = "https://cdn.webpushr.com/app.min.js";
        fjs.parentNode.appendChild(js);
    }(window,document, 'script', 'webpushr-jssdk-alternative'));

    // DŮLEŽITÉ: Pokud máš web na adrese sazkynadeje.github.io/SazkovkaNadeje/, 
    // poslední parametr musí být '/SazkovkaNadeje/'. Pokud je to v rootu, jen '/'.
    webpushr('init','BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w','webpushr-sw.js','/SazkovkaNadeje/');
    webpushr('setup', { 'in_app_notification': false, 'onsite_messaging': false });
    console.log("✅ NOTIF-DEBUG: WebPushr inicializován.");

    // 5. HLAVNÍ FUNKCE
    function vyrizeno(stav) {
        console.log("🔘 NOTIF-DEBUG: Uživatel klikl na: " + stav);
        localStorage.setItem('sazka_notif_v4', stav);
        document.getElementById('n_box_root').style.display = 'none';
        document.getElementById('n_neon_trigger').style.display = 'none';

        if (stav === 'ano') {
            console.log("📡 NOTIF-DEBUG: Volám webpushr('fetch_subscription')...");
            webpushr('fetch_subscription', function(r) {
                console.log("📩 NOTIF-DEBUG: Odpověď fetch_subscription: ", r);
                if(r.status === 'success') {
                    alert("Nastaveno! ✅ Brzy ti přijde první zpráva.");
                } else {
                    alert("Chyba: " + r.description);
                }
            });
        }
    }

    // 6. ZOBRAZENÍ MODÁLU (Zpoždění 2,5s)
    setTimeout(() => {
        console.log("⏱️ NOTIF-DEBUG: Časovač vypršel, kontroluji status notifikací.");
        
        if (typeof webpushr === 'undefined') {
            console.error("❌ NOTIF-DEBUG: CHYBA! WebPushr SDK (webpushr objekt) nebyl nalezen!");
            return;
        }

        webpushr('notification_status', function(status) {
            console.log("📊 NOTIF-DEBUG: Aktuální status u WebPushr: " + status);
            
            if (status === 'granted') {
                console.log("ℹ️ NOTIF-DEBUG: Notifikace již jsou povoleny v prohlížeči. Končím.");
                localStorage.setItem('sazka_notif_v4', 'ano');
                return;
            }
            
            const modal = document.getElementById('n_box_root');
            const trigger = document.getElementById('n_neon_trigger');

            if (modal) {
                modal.style.display = 'flex';
                console.log("✨ NOTIF-DEBUG: Zobrazuji modální okno.");
            }
            if (trigger) trigger.style.display = 'block';
        });

        // Eventy
        document.getElementById('n_btn_yes').onclick = () => vyrizeno('ano');
        document.getElementById('n_btn_no').onclick = () => vyrizeno('skip');
        document.getElementById('n_neon_trigger').onclick = () => vyrizeno('ano');
        
    }, 2500);

})();
