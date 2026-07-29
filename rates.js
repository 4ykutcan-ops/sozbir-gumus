// ==========================
// SÖZ-BİR GÜMÜŞ VIP
// Premium Rates Engine v2.0
// ==========================

const els = {
    usd: document.getElementById("rateUSD"),
    eur: document.getElementById("rateEUR"),
    silver: document.getElementById("rateSILVER"),

    usdBox: document.getElementById("boxUSD"),
    eurBox: document.getElementById("boxEUR"),
    silverBox: document.getElementById("boxSILVER"),

    usdArrow: document.getElementById("arrowUSD"),
    eurArrow: document.getElementById("arrowEUR"),
    silverArrow: document.getElementById("arrowSILVER")
};

const CACHE_KEY = "sozbir_live_rates";

let last = {
    USD:0,
    EUR:0,
    SILVER:0
};

function flash(box,type){

    box.classList.remove("flash-up","flash-down");

    void box.offsetWidth;

    box.classList.add(type==="up" ? "flash-up":"flash-down");

}

function update(symbol,value){

    if(!value) return;

    let el,box,arrow;

    if(symbol==="USD"){

        el=els.usd;
        box=els.usdBox;
        arrow=els.usdArrow;

    }

    if(symbol==="EUR"){

        el=els.eur;
        box=els.eurBox;
        arrow=els.eurArrow;

    }

    if(symbol==="SILVER"){

        el=els.silver;
        box=els.silverBox;
        arrow=els.silverArrow;

    }

    el.innerHTML=value.toFixed(4)+" ₺";

    if(last[symbol]){

        if(value>last[symbol]){

            arrow.innerHTML="▲";

            arrow.style.color="#22c55e";

            flash(box,"up");

        }

        else if(value<last[symbol]){

            arrow.innerHTML="▼";

            arrow.style.color="#ef4444";

            flash(box,"down");

        }

    }

    last[symbol]=value;

}

async function loadRates(){

    try{

        const res=await fetch("https://open.er-api.com/v6/latest/USD");

        const data=await res.json();

        const usd=data.rates.TRY;

        const eur=usd/data.rates.EUR;

        const silver=(usd*39.20)/31.103;

        update("USD",usd);

        update("EUR",eur);

        update("SILVER",silver);

        localStorage.setItem(CACHE_KEY,JSON.stringify({

            USD:usd,
            EUR:eur,
            SILVER:silver

        }));

    }

    catch(e){

        console.log("offline");

        const cache=localStorage.getItem(CACHE_KEY);

        if(cache){

            const d=JSON.parse(cache);

            update("USD",d.USD);

            update("EUR",d.EUR);

            update("SILVER",d.SILVER);

        }

    }

}

loadRates();

setInterval(loadRates,10000);

window.fetchLiveRates=loadRates;
