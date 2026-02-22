// js/notifications.js - Ovládání neonového modálu (v13)
(function() {
    console.log("🚀 NOTIF-LOGIC: Načítám verzi V13.");

    // Kontrola paměti (v13)
    const notifStatus = localStorage.getItem('sazka_notif_v13');
    if (notifStatus === 'ano' || notifStatus === 'skip') {
        console.log("ℹ️ Uživatel již notifikace vyřešil.");
        return;
    }

    // 1. STYLY MODÁLU
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
        .n_btn { 
            width: 100%; padding: 18px; margin-top: 15px; border-radius: 18px; 
            border: none; font-weight: 900; cursor: pointer; text-transform: uppercase; 
        }
        .n_yes { background: #00f2ff; color: #000; }
        .n_no { background: rgba(255,255,255,0.1); color: white; margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // 2. HTML MODÁLU
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="n_box_root">
            <div class="n_content">
                <h2 style="color:#00f2ff; margin:0 0 15px 0;">OZNÁMENÍ 🏒</h2>
                <p style="line-height: 1.5; opacity: 0.9;">Chceš dostávat upozornění na výsledky a blížící se zápasy?</p>
                <button id="n_btn_yes" class="n_btn n_yes">ANO, CHCI</button>
                <button id="n_btn_no" class="n_btn n_no">MOŽNÁ POZDĚJI</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. FUNKCE TLAČÍTEK
    function vyrizeno(stav) {
        localStorage.setItem('sazka_notif_v13', stav);
        document.getElementById('n_box_root').style.display = 'none';
        
        if (stav === 'ano' && typeof webpushr !== 'undefined') {
            console.log("Spouštím manuální fetch_subscription...");
            webpushr('fetch_subscription', function(r) {
                if(r.status === 'success') {
                    alert("Odběr nastaven! ✅ Brzy ti přijde zpráva.");
                } else {
                    console.log("Webpushr Info: " + r.description);
                }
            });
        }
    }

    // 4. ZOBRAZENÍ S PRODLEVOU (3 vteřiny po načtení)
    setTimeout(() => {
        if (typeof webpushr === 'undefined') return;

        webpushr('notification_status', function(status) {
            console.log("📊 Aktuální status: " + status);
            // Pokud ještě nemáme povolení, ukaž náš modál
            if (status !== 'granted') {
                document.getElementById('n_box_root').style.display = 'flex';
            }
        });

        document.getElementById('n_btn_yes').onclick = () => vyrizeno('ano');
        document.getElementById('n_btn_no').onclick = () => vyrizeno('skip');
    }, 3000);
})();
