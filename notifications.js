// notifications.js - Kompletní správa notifikací pro iPhony
(function() {
    // 1. OKAMŽITÁ KONTROLA PAMĚTI
    // Pokud uživatel už klikl na "ANO" nebo "POZDĚJI", skript se okamžitě ukončí
    const notifStatus = localStorage.getItem('sazka_notif_v3');
    if (notifStatus === 'ano' || notifStatus === 'skip') {
        console.log("Notifikace již vyřešeny, skript končí.");
        return; 
    }

    // 2. CSS STYLY (Vše schované v JS, aby index zůstal čistý)
    const style = document.createElement('style');
    style.innerHTML = `
        #n_box_root { 
            display: none; 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.95); z-index: 30000; 
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

    // 4. WEBPUSHR SDK INIT
    (function(w,d, s, id) {
        if(typeof(w.webpushr)!=='undefined') return;
        w.webpushr=w.webpushr||function(){(w.webpushr.q=w.webpushr.q||[]).push(arguments)};
        var js, fjs = d.getElementsByTagName(s)[0];
        js = d.createElement(s); js.id = id;js.async=1;
        js.src = "https://cdn.webpushr.com/app.min.js";
        fjs.parentNode.appendChild(js);
    }(window,document, 'script', 'webpushr-jssdk-alternative'));

    webpushr('init','BJLqlsfhPhmUGRT1vU8Ob_iUP0ZGtgh2-jGjhFTc8u_rCYpSIBMjasZ1HPA0EJSUDjRfpB59-lv7i1B3zObvF5w','webpushr-sw.js','/SazkovkaNadeje/');
    webpushr('setup', { 'in_app_notification': false, 'onsite_messaging': false });

    // 5. HLAVNÍ FUNKCE PRO ZAVŘENÍ A ULOŽENÍ
    async function vyrizeno(stav) {
        localStorage.setItem('sazka_notif_v3', stav);
        document.getElementById('n_box_root').style.display = 'none';
        document.getElementById('n_neon_trigger').style.display = 'none';

        if (stav === 'ano') {
            console.log("Uživatel potvrdil odběr.");
            if ('serviceWorker' in navigator) {
                try {
                    await navigator.serviceWorker.register('webpushr-sw.js');
                } catch(e) { console.error("SW fail:", e); }
            }
            webpushr('fetch_subscription', function(r) {
                if(r.status === 'success') {
                    alert("Nastaveno! ✅ Brzy ti přijde první zpráva.");
                }
            });
        }
    }

    // 6. ZOBRAZENÍ MODÁLU (S časovou pojistkou)
    setTimeout(() => {
        const modal = document.getElementById('n_box_root');
        const trigger = document.getElementById('n_neon_trigger');

        webpushr('notification_status', function(status) {
            if (status === 'granted') {
                localStorage.setItem('sazka_notif_v3', 'ano');
                return; // Pokud už odběr je, nic neukazuj
            }
            
            // Pokud odběr není a uživatel neklikl na skip, ukaž modál
            if (modal) modal.style.display = 'flex';
            if (trigger) trigger.style.display = 'block';
        });

        // Eventy pro tlačítka (včetně touchend pro iPhone)
        const btnYes = document.getElementById('n_btn_yes');
        const btnNo = document.getElementById('n_btn_no');

        btnYes.onclick = () => vyrizeno('ano');
        btnYes.ontouchend = (e) => { e.preventDefault(); vyrizeno('ano'); };

        btnNo.onclick = () => vyrizeno('skip');
        btnNo.ontouchend = (e) => { e.preventDefault(); vyrizeno('skip'); };

        trigger.onclick = () => vyrizeno('ano');
    }, 2500);

})();
