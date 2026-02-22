// js/notifications.js - VERZE 11 (AKTUALIZOVANÉ KLÍČE)
(function() {
    console.log("🚀 NOTIF-DEBUG: Start V11 s novými klíči.");

    // 1. KONTROLA PAMĚTI (v11)
    const notifStatus = localStorage.getItem('sazka_notif_v11');
    if (notifStatus === 'ano' || notifStatus === 'skip') {
        console.log("ℹ️ NOTIF-DEBUG: Již dříve vyřízeno, končím.");
        return; 
    }

    // 2. CSS STYLY
    const style = document.createElement('style');
    style.innerHTML = `
        #n_box_root { 
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.95); z-index: 99999; 
            align-items: center; justify-content: center; font-family: -apple-system, sans-serif; 
        }
        .n_content { 
            background: #1e293b; padding: 35px; border-radius: 35px; 
            border: 2px solid #00f2ff; max-width: 290px; text-align: center; 
            color: white; box-shadow: 0 0 30px rgba(0,242,255,0.3);
        }
        .n_btn { width: 100%; padding: 18px; margin-top: 15px; border-radius: 18px; border: none; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        .n_yes { background: #00f2ff; color: #000; }
        .n_no { background: rgba(255,255,255,0.1); color: white; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // 3. HTML ELEMENTY
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="n_box_root">
            <div class="n_content">
                <h2 style="color:#00f2ff; margin:0 0 15px 0;">NOTIFIKACE</h2>
                <p>Chceš dostávat upozornění na výsledky přímo na displej?</p>
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
    }(window,document, 'script', 'webpushr-jssdk'));

    // POUŽITÍ NOVÉHO KLÍČE A CESTY PRO GITHUB PAGES
    webpushr('init', 'BNKxlbjAIXHY6C5JLpgEZhPJd_gdkLkdz_ebqjnCZXj37WJJsdU7Rowj_nw38R4rYR_qf4LCvr8uO_0Y1L0cAAU', '/SazkovkaNadeje/webpushr-sw.js', '/SazkovkaNadeje/');
    webpushr('setup', { 'in_app_notification': false, 'onsite_messaging': false });

    // 5. FUNKCE
    function vyrizeno(stav) {
        localStorage.setItem('sazka_notif_v11', stav);
        document.getElementById('n_box_root').style.display = 'none';
        if (stav === 'ano') {
            webpushr('fetch_subscription', function(r) {
                if(r.status === 'success') alert("Nastaveno! ✅");
                else console.log("Chyba odběru: " + r.description);
            });
        }
    }

    // 6. ZOBRAZENÍ MODÁLU
    setTimeout(() => {
        if (typeof webpushr === 'undefined') return;
        webpushr('notification_status', function(status) {
            console.log("📊 Status: " + status);
            if (status !== 'granted') {
                document.getElementById('n_box_root').style.display = 'flex';
            }
        });

        document.getElementById('n_btn_yes').onclick = () => vyrizeno('ano');
        document.getElementById('n_btn_no').onclick = () => vyrizeno('skip');
    }, 2500);

})();
