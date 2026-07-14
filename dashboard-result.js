/**
 * dashboard-result.js ΓÇö NCN Academy Result Redesign v1.0
 * Intercept report-container khi hiß╗ân thß╗ï, render lß║íi 8 sections mß╗¢i.
 * KH├öNG ─æß╗Ñng v├áo script.js gß╗æc.
 */
(function () {
  'use strict';

  const CAMPAIGN_START = new Date('2026-07-15T00:00:00+07:00');
  const CAMPAIGN_END   = new Date('2026-07-28T23:59:59+07:00');
  const now = new Date();
  const IS_CAMPAIGN = now >= CAMPAIGN_START && now <= CAMPAIGN_END;
  const PRICE = IS_CAMPAIGN ? 399000 : 568000;
  const PRICE_DISPLAY = IS_CAMPAIGN ? '399.000đ' : '568.000đ';
  const PRICE_ORIGINAL_DISPLAY = IS_CAMPAIGN ? '568.000đ' : '1.358.000đ';
  const BANK_BIN   = '970422';
  const BANK_ACCT  = '768688678';
  const BANK_OWNER = 'HO KINH DOANH NGHE CHON NGUOI';
  const API_BASE = 'https://nghechonnguoi.com/api';
  const COUNTDOWN_KEY = 'ncn_result_countdown';
  let countdownInterval = null;

  function startCountdown() {
    let startTs = localStorage.getItem(COUNTDOWN_KEY);
    if (!startTs) { startTs = String(Date.now()); localStorage.setItem(COUNTDOWN_KEY, startTs); }
    const endTs = parseInt(startTs) + 24 * 60 * 60 * 1000;
    function tick() {
      const remaining = Math.max(0, endTs - Date.now());
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      const el = document.getElementById('ncn-countdown');
      if (el) el.textContent = remaining === 0 ? '╞»U ─É├âI ─É├â Hß║╛T Hß║áN' : `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (remaining === 0) clearInterval(countdownInterval);
    }
    tick(); countdownInterval = setInterval(tick, 1000);
  }

  function calcMatchScore(p) {
    if (!p) return 78;
    const scores = [p.R_PCT, p.I_PCT, p.A_PCT, p.S_PCT, p.E_PCT, p.C_PCT].map(x => parseFloat(x || 0));
    const sorted = [...scores].sort((a,b) => b-a);
    const spread = (sorted[0] - sorted[sorted.length-1]) / 100;
    return Math.min(100, Math.round(spread * 50) + 40 + Math.min(20, 10 + parseInt(p.LIFEPATH || 0)));
  }

  function svgRing(score) {
    const r = 54, circ = 2 * Math.PI * r, offset = circ - (score / 100) * circ;
    const color = score >= 76 ? '#2BA88C' : score >= 50 ? '#E8A838' : '#ef4444';
    return `<div style="position:relative;width:144px;height:144px;margin:0 auto 16px;"><svg width="144" height="144" style="transform:rotate(-90deg);position:absolute;inset:0;"><circle cx="72" cy="72" r="${r}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="10"/><circle cx="72" cy="72" r="${r}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${offset}" style="transition:stroke-dashoffset 1.2s ease"/></svg><div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;"><span style="font-size:32px;font-weight:900;color:#fff;line-height:1;">${score}</span><span style="font-size:11px;font-weight:700;color:${color};">/100</span></div></div>`;
  }

  async function fetchAiData(p) {
    try {
      const res = await fetch(`${API_BASE}/dashboard-ai`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ mbti: p.MBTI || 'ENFP', holland: p.HOLLAND || 'AIE', lifePath: p.LIFEPATH, assessmentId: null }) });
      return await res.json();
    } catch { return null; }
  }

  function openCheckout(payload) {
    const existing = document.getElementById('ncn-checkout-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'ncn-checkout-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px)';
    let finalAmount = PRICE;
    let orderCodeNum = parseInt((payload.MA_SO_HO_SO || '').replace(/[^0-9]/g, '').slice(-8)) || (Math.floor(Math.random() * 900000) + 100000);
    modal.innerHTML = `<div style="background:#1e293b;color:#fff;border-radius:20px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;"><div style="display:flex;align-items:center;justify-content:space-between;padding:20px;border-bottom:1px solid rgba(255,255,255,0.1);position:sticky;top:0;background:#1e293b;z-index:1;"><div><p style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#E8A838;margin:0 0 4px;">Mß╗₧ KH├ôA B├üO C├üO ─Éß║ªY ─Éß╗ª</p><p style="font-size:15px;font-weight:900;color:#fff;margin:0;">Bß║ún ─æß╗ô sß╗▒ nghiß╗çp c├í nh├ón h├│a</p></div><button id="ncn-modal-close" style="background:rgba(255,255,255,0.08);border:none;color:#fff;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;">Γ£ò</button></div><div id="ncn-modal-body" style="padding:20px;"><div style="background:rgba(255,255,255,0.06);border-radius:12px;padding:16px;margin-bottom:16px;"><p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin:0 0 12px;">≡ƒôä B├üO C├üO BAO Gß╗ÆM</p>${['5 nghß╗ü ph├╣ hß╗úp nhß║Ñt ΓÇö ph├ón t├¡ch chi tiß║┐t','3 nghß╗ü n├¬n tr├ính ΓÇö v├á l├╜ do cß╗Ñ thß╗â','M├┤i tr╞░ß╗¥ng l├ám viß╗çc tß╗æi ╞░u','Lß╗Ö tr├¼nh ng├ánh hß╗ìc ΓåÆ nghß╗ü nghiß╗çp ΓåÆ thu nhß║¡p','Chiß║┐n l╞░ß╗úc ph├ít triß╗ân sß╗▒ nghiß╗çp 5 n─âm'].map(t=>`<div style="display:flex;gap:8px;margin-bottom:8px;"><span style="color:#2BA88C;">Γ£ô</span><span style="font-size:13px;color:rgba(255,255,255,0.8);">${t}</span></div>`).join('')}</div><div style="text-align:center;margin-bottom:16px;"><span style="text-decoration:line-through;color:rgba(255,255,255,0.4);font-size:14px;margin-right:10px;">1.358.000─æ</span><span id="ncn-price-display" style="font-size:32px;font-weight:900;color:#E8A838;">568.000─æ</span></div><div style="display:flex;gap:8px;margin-bottom:8px;"><input id="ncn-coupon" type="text" placeholder="Nhß║¡p m├ú ╞░u ─æ├úi (nß║┐u c├│)" style="flex:1;padding:10px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.1);background:#0f172a;color:#fff;font-size:13px;outline:none;"><button id="ncn-coupon-btn" style="background:#3b82f6;color:#fff;border:none;padding:10px 16px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;">├üp dß╗Ñng</button></div><p id="ncn-coupon-msg" style="font-size:12px;margin:0 0 12px;min-height:16px;"></p><p id="ncn-modal-error" style="color:#f87171;font-size:13px;background:rgba(248,113,113,0.1);border-radius:8px;padding:8px 12px;display:none;margin-bottom:12px;"></p><button id="ncn-pay-btn" style="width:100%;padding:18px;border-radius:14px;border:none;background:linear-gradient(135deg,#E8A838,#f0c060);color:#1B2A4A;font-size:16px;font-weight:900;cursor:pointer;">≡ƒöô THANH TO├üN QUA M├â QR</button><p style="text-align:center;font-size:11px;color:rgba(255,255,255,0.3);margin-top:10px;">Nhß║¡n file PDF trong 30 gi├óy ┬╖ Thanh to├ín bß║úo mß║¡t</p></div></div>`;
    document.body.appendChild(modal);
    document.getElementById('ncn-modal-close').onclick = () => modal.remove();
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
    document.getElementById('ncn-coupon-btn').onclick = async () => {
      const code = (document.getElementById('ncn-coupon').value || '').trim().toUpperCase();
      const msgEl = document.getElementById('ncn-coupon-msg');
      if (!code) { msgEl.textContent = 'Vui l├▓ng nhß║¡p m├ú'; msgEl.style.color = '#f87171'; return; }
      try {
        const res = await fetch(`${API_BASE}/apply-coupon`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ coupon: code, orderCode: String(orderCodeNum) }) });
        const d = await res.json();
        if (d.success) { finalAmount = 0; document.getElementById('ncn-price-display').textContent = 'MIß╗äN PH├ì'; document.getElementById('ncn-pay-btn').textContent = '≡ƒöô NHß║¼N B├üO C├üO MIß╗äN PH├ì'; msgEl.textContent = 'Γ£à M├ú hß╗úp lß╗ç! Miß╗àn ph├¡ 100%'; msgEl.style.color = '#34d399'; }
        else { msgEl.textContent = 'Γ¥î ' + (d.message || 'M├ú kh├┤ng hß╗úp lß╗ç'); msgEl.style.color = '#f87171'; }
      } catch { msgEl.textContent = 'Γ¥î Lß╗ùi kiß╗âm tra m├ú'; msgEl.style.color = '#f87171'; }
    };
    document.getElementById('ncn-pay-btn').onclick = async () => {
      const btn = document.getElementById('ncn-pay-btn'); const errEl = document.getElementById('ncn-modal-error');
      btn.disabled = true; btn.textContent = 'ΓÅ│ ─Éang xß╗¡ l├╜...'; errEl.style.display = 'none';
      try {
        await fetch(`${API_BASE}/create-order`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ orderCode: orderCodeNum, orderId: `NCN-${orderCodeNum}`, amount: finalAmount, customerName: payload.HOTEN || '', customerEmail: payload.EMAIL || '', customerPhone: payload.DIEN_THOAI || '', payload }) });
        if (finalAmount === 0) {
          document.getElementById('ncn-modal-body').innerHTML = '<div style="text-align:center;padding:32px 16px;"><div style="font-size:48px;margin-bottom:16px;">ΓÅ│</div><p style="font-weight:800;font-size:18px;color:#fff;">─Éang tß║ío b├ío c├ío...</p></div>';
          const pdfRes = await fetch(`${API_BASE}/generate-pdf`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
          if (!pdfRes.ok) throw new Error('Lß╗ùi tß║ío PDF');
          showDone(URL.createObjectURL(await pdfRes.blob()), payload.HOTEN || 'BaoCao'); return;
        }
        // Tao QR VietQR truc tiep - MB Bank, khong can PayOS
        const desc = `NCN ${orderCodeNum}`;
        const qrUrl = `https://img.vietqr.io/image/${BANK_BIN}-${BANK_ACCT}-compact2.png?amount=${finalAmount}&addInfo=${encodeURIComponent(desc)}&accountName=${encodeURIComponent(BANK_OWNER)}`;
        showQR(qrUrl, desc, finalAmount, orderCodeNum, payload);
      } catch (err) { btn.disabled = false; btn.textContent = '≡ƒöô THANH TO├üN QUA M├â QR'; errEl.textContent = err.message || 'C├│ lß╗ùi, vui l├▓ng thß╗¡ lß║íi'; errEl.style.display = 'block'; }
    };
  }

  function showQR(qrUrl, desc, amt, oc, payload) {
    const body = document.getElementById('ncn-modal-body'); if (!body) return;
    body.innerHTML = `<div style="text-align:center;"><p style="font-weight:800;font-size:18px;color:#fff;margin-bottom:4px;">Qu├⌐t m├ú QR ─æß╗â thanh to├ín</p><p style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:16px;">Sß╗æ tiß╗ün: <strong style="color:#fff;">${Number(amt).toLocaleString('vi-VN')} VN─É</strong></p><div style="display:inline-block;border:4px solid #fff;border-radius:12px;overflow:hidden;margin-bottom:16px;"><img src="${qrUrl}" alt="QR" style="width:220px;height:220px;display:block;"></div><div style="background:rgba(255,255,255,0.06);border-radius:10px;padding:12px;margin-bottom:16px;"><p style="color:#94a3b8;font-size:12px;margin:0 0 4px;">Nß╗Öi dung chuyß╗ân khoß║ún:</p><p style="font-weight:800;color:#fff;font-size:16px;margin:0;">${desc}</p></div><div style="display:flex;align-items:center;justify-content:center;gap:8px;color:#E8A838;font-weight:700;font-size:14px;"><div style="width:16px;height:16px;border:2px solid #E8A838;border-top-color:transparent;border-radius:50%;animation:ncnspin 1s linear infinite;"></div>─Éang chß╗¥ thanh to├ín...</div></div><style>@keyframes ncnspin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>`;
    const poll = setInterval(async () => {
      try {
        const r = await fetch(`${API_BASE}/order-status?orderCode=${oc}`); const d = await r.json();
        if (d.pdfDone && d.pdfBase64) { clearInterval(poll); const bytes = Uint8Array.from(atob(d.pdfBase64), c => c.charCodeAt(0)); showDone(URL.createObjectURL(new Blob([bytes], {type:'application/pdf'})), payload.HOTEN || 'BaoCao'); }
      } catch {}
    }, 3000);
  }

  function showDone(url, name) {
    const body = document.getElementById('ncn-modal-body'); if (!body) return;
    const safe = (name||'BaoCao').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9\s]/g,'').trim().replace(/\s+/g,'-');
    body.innerHTML = `<div style="text-align:center;padding:32px 0;"><div style="width:64px;height:64px;background:rgba(43,168,140,0.15);border:2px solid #2BA88C;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;">Γ£ô</div><p style="font-weight:900;font-size:20px;color:#fff;margin-bottom:8px;">B├ío c├ío ─æ├ú sß║╡n s├áng! ≡ƒÄë</p><p style="color:rgba(255,255,255,0.6);font-size:14px;margin-bottom:24px;">B├ío c├ío ─æ├ú ─æ╞░ß╗úc gß╗¡i vß╗ü email cß╗ºa bß║ín.</p>${url?`<a href="${url}" download="Bao-Cao-NCN-${safe}.pdf" style="display:inline-block;padding:16px 32px;border-radius:14px;background:linear-gradient(135deg,#2BA88C,#1e8a72);color:#fff;text-decoration:none;font-weight:900;font-size:16px;">≡ƒôÑ L╞»U B├üO C├üO Vß╗Ç M├üY</a>`:''}</div>`;
  }

  function renderResultPage(payload) {
    const container = document.getElementById('report-container'); if (!container) return;
    const score = calcMatchScore(payload);
    const firstName = (payload.HOTEN || 'bß║ín').split(' ').pop();
    container.style.cssText = 'background:#f8fafc;padding:0;border:none;box-shadow:none;border-radius:0;max-width:none;margin:0;';
    container.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
#report-container *{box-sizing:border-box;font-family:'Inter',sans-serif;}
.ncn-section{padding:52px 20px;}
.ncn-cont{max-width:640px;margin:0 auto;}
.ncn-badge{display:inline-block;padding:4px 14px;border-radius:999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;}
.ncn-h2{font-size:clamp(20px,4vw,28px);font-weight:900;margin:0 0 24px;}
.ncn-career{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:16px;border:1px solid #e2e8f0;background:#fff;margin-bottom:10px;}
.ncn-star{display:inline-block;width:32px;height:32px;border-radius:10px;font-size:13px;font-weight:900;color:#fff;text-align:center;line-height:32px;flex-shrink:0;}
.ncn-cta-btn{display:block;width:100%;padding:22px 16px;border:none;border-radius:18px;background:linear-gradient(135deg,#E8A838,#f0c060);color:#1B2A4A;font-size:16px;font-weight:900;cursor:pointer;text-align:center;transition:all .2s;box-shadow:0 8px 32px rgba(232,168,56,0.35);}
.ncn-cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(232,168,56,0.45);}
@keyframes ncnspin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
@keyframes ncnpulse{0%,100%{opacity:1}50%{opacity:0.5}}
</style>

<!-- HERO -->
<div style="background:#243049;padding-bottom:48px;">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.08);">
    <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);">ΓùÇ Kß║┐t quß║ú cß╗ºa bß║ín</span>
    <span style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#E8A838;">NCN ACADEMY</span>
    <span style="width:80px;"></span>
  </div>
  <div class="ncn-cont" style="text-align:center;padding-top:36px;">
    <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.5);margin:0 0 8px;">Kß║╛T QUß║ó Cß╗ªA Bß║áN</p>
    <h1 style="font-size:clamp(22px,4vw,30px);font-weight:900;color:#fff;margin:0 0 28px;">Xin ch├áo, <span style="color:#E8A838;">${firstName}</span>!</h1>
    ${svgRing(score)}
    <p style="font-size:15px;font-weight:700;color:#fff;margin:0 0 6px;">Chß╗ë sß╗æ ph├╣ hß╗úp nghß╗ü nghiß╗çp</p>
    <p style="font-size:12px;color:rgba(255,255,255,0.5);max-width:300px;margin:0 auto 20px;">Con sß╗æ n├áy cho biß║┐t c├óu trß║ú lß╗¥i cß╗ºa bß║ín r├╡ r├áng ─æß║┐n ─æ├óu trong viß╗çc chß╗ë ra nh├│m nghß╗ü ph├╣ hß╗úp.</p>
    <div style="display:flex;border-radius:14px;overflow:hidden;background:rgba(255,255,255,0.07);max-width:360px;margin:0 auto;">
      <div style="flex:1;padding:12px 6px;text-align:center;${score<50?'background:rgba(255,255,255,0.07);':'opacity:0.4;'}border-right:1px solid rgba(255,255,255,0.1);"><div style="font-size:10px;font-weight:700;color:${score<50?'#ef4444':'#fff'};">D╞░ß╗¢i 50</div><div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px;">Ch╞░a r├╡ h╞░ß╗¢ng</div></div>
      <div style="flex:1;padding:12px 6px;text-align:center;${score>=50&&score<76?'background:rgba(255,255,255,0.07);':'opacity:0.4;'}border-right:1px solid rgba(255,255,255,0.1);"><div style="font-size:10px;font-weight:700;color:${score>=50&&score<76?'#E8A838':'#fff'};">50ΓÇô75</div><div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px;">C├│ xu h╞░ß╗¢ng</div></div>
      <div style="flex:1;padding:12px 6px;text-align:center;${score>=76?'background:rgba(255,255,255,0.07);':'opacity:0.4;'}"><div style="font-size:10px;font-weight:700;color:${score>=76?'#2BA88C':'#fff'};">76ΓÇô100</div><div style="font-size:10px;color:rgba(255,255,255,0.5);margin-top:2px;">R├╡ r├áng Γ£ô</div></div>
    </div>
  </div>
</div>

<!-- INSIGHTS -->
<div class="ncn-section" style="background:#fff;">
  <div class="ncn-cont">
    <div style="text-align:center;"><span class="ncn-badge" style="background:rgba(232,168,56,0.1);color:#E8A838;border:1px solid rgba(232,168,56,0.3);">CH├éN DUNG Cß╗ªA Bß║áN</span><h2 class="ncn-h2" style="color:#0f172a;">Nhß╗»ng ─æiß╗üu c├│ thß╗â bß║ín ch╞░a tß╗½ng nghe ai n├│i</h2></div>
    <div id="ncn-insights-area"><div style="text-align:center;padding:24px;"><div style="width:36px;height:36px;border:3px solid #E8A838;border-top-color:transparent;border-radius:50%;animation:ncnspin 1s linear infinite;margin:0 auto 12px;"></div><p style="color:#94a3b8;font-size:13px;">─Éang ph├ón t├¡ch c├í nh├ón h├│a...</p></div></div>
    <p style="text-align:center;font-size:11px;color:#94a3b8;margin:16px 0 0;">* Ph├ón t├¡ch C├ü NH├éN H├ôA ΓÇö kh├┤ng phß║úi m├┤ tß║ú chung ├íp dß╗Ñng cho bß║Ñt kß╗│ ai.</p>
  </div>
</div>

<!-- TOP 5 CAREERS -->
<div class="ncn-section" style="background:#f8fafc;">
  <div class="ncn-cont">
    <div style="text-align:center;"><span class="ncn-badge" style="background:rgba(43,168,140,0.1);color:#2BA88C;border:1px solid rgba(43,168,140,0.3);">Gß╗óI ├¥ NGHß╗Ç NGHIß╗åP</span><h2 class="ncn-h2" style="color:#0f172a;">5 nghß╗ü ph├╣ hß╗úp nhß║Ñt vß╗¢i bß║ín</h2></div>
    <div id="ncn-careers-area">${[1,2,3,4,5].map(i=>`<div style="height:58px;background:#e2e8f0;border-radius:16px;margin-bottom:10px;animation:ncnpulse 1.5s ease-in-out infinite;"></div>`).join('')}</div>
    <div style="display:flex;align-items:center;gap:12px;padding:16px;border-radius:16px;background:#fef2f2;border:1px solid #fecaca;margin-top:4px;">
      <span style="font-size:24px;flex-shrink:0;">≡ƒÜ½</span>
      <div style="flex:1;"><p style="font-weight:700;font-size:14px;color:#0f172a;margin:0 0 4px;">3 nghß╗ü bß║ín n├¬n tr├ính</p><p style="font-size:12px;color:#6b7280;margin:0;">Nhß╗»ng ng├ánh tr├┤ng hß║Ñp dß║½n nh╞░ng sß║╜ khiß║┐n bß║ín ch├ín sau 1ΓÇô2 n─âm ΓÇö c├│ trong b├ío c├ío ─æß║ºy ─æß╗º</p></div>
      <span style="color:#fca5a5;flex-shrink:0;">≡ƒöÆ</span>
    </div>
  </div>
</div>

<!-- RISK -->
<div class="ncn-section" style="background:#243049;">
  <div class="ncn-cont">
    <div style="text-align:center;margin-bottom:24px;"><span class="ncn-badge" style="background:rgba(232,168,56,0.15);color:#E8A838;border:1px solid rgba(232,168,56,0.4);">ΓÜá∩╕Å Cß║óNH B├üO</span><h2 class="ncn-h2" style="color:#fff;">Rß╗ºi ro lß╗¢n nhß║Ñt nß║┐u bß║ín chß╗ìn sai ng├ánh</h2></div>
    <div id="ncn-risk-area" style="text-align:center;margin-bottom:32px;"><div style="width:36px;height:36px;border:3px solid #E8A838;border-top-color:transparent;border-radius:50%;animation:ncnspin 1s linear infinite;margin:0 auto 12px;"></div><p style="color:rgba(255,255,255,0.5);font-size:13px;">─Éang tß║úi...</p></div>
    ${[['ΓÅ│','Mß║Ñt 4 n─âm thanh xu├ón','Hß╗ìc ng├ánh kh├┤ng ph├╣ hß╗úp, mß╗ùi ng├áy ─æß║┐n tr╞░ß╗¥ng ─æß╗üu mß╗çt mß╗Åi'],['≡ƒÆ╕','Mß║Ñt h├áng tr─âm triß╗çu ─æß╗ông','Hß╗ìc ph├¡ + sinh hoß║ít ph├¡ + chi ph├¡ c╞í hß╗Öi nß║┐u phß║úi hß╗ìc lß║íi'],['≡ƒÿ₧','Ra tr╞░ß╗¥ng l├ám tr├íi nghß╗ü','Kh├┤ng c├│ ─æß╗Öng lß╗▒c, thu nhß║¡p thß║Ñp, muß╗æn chuyß╗ân ng├ánh nh╞░ng ─æ├ú muß╗Ön']].map(([icon,title,desc])=>`<div style="display:flex;gap:12px;padding:14px 16px;border-radius:12px;background:rgba(255,255,255,0.06);border-left:3px solid #E8A838;margin-bottom:10px;"><span style="font-size:20px;flex-shrink:0;">${icon}</span><div><p style="font-weight:700;font-size:14px;color:#fff;margin:0 0 3px;">${title}</p><p style="font-size:12px;color:rgba(255,255,255,0.55);margin:0;">${desc}</p></div></div>`).join('')}
  </div>
</div>

<!-- OPPORTUNITY -->
<div class="ncn-section" style="background:#fff;">
  <div class="ncn-cont">
    <div style="text-align:center;"><span class="ncn-badge" style="background:rgba(43,168,140,0.1);color:#2BA88C;border:1px solid rgba(43,168,140,0.3);">C╞á Hß╗ÿI</span><h2 class="ncn-h2" style="color:#0f172a;">Nß║┐u chß╗ìn ─æ├║ng ng├ánh, bß║ín c├│ thß╗â...</h2></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;">${[['≡ƒÄ»','Tß╗▒ tin suß╗æt 4 n─âm ─ÉH','Biß║┐t m├¼nh ─æang ─æi ─æ├║ng h╞░ß╗¢ng, kh├┤ng hoang mang giß╗»a chß╗½ng'],['≡ƒÆ░','Thu nhß║¡p cao h╞ín 30ΓÇô50%','So vß╗¢i ng╞░ß╗¥i l├ám tr├íi ng├ánh (thß╗æng k├¬ VietnamWorks 2024)'],['≡ƒÜÇ','Ph├ít triß╗ân nhanh h╞ín','V├¼ bß║ín ─æang ch╞íi tr├¬n s├ón mß║ính nhß║Ñt cß╗ºa m├¼nh']].map(([icon,title,desc])=>`<div style="padding:20px 16px;border-radius:18px;background:#f0fdf9;border:1px solid #d1fae5;"><div style="font-size:28px;margin-bottom:12px;">${icon}</div><p style="font-weight:700;font-size:14px;color:#0f172a;margin:0 0 6px;">${title}</p><p style="font-size:12px;color:#6b7280;margin:0;">${desc}</p></div>`).join('')}</div>
  </div>
</div>

<!-- SOCIAL PROOF -->
<div class="ncn-section" style="background:#f8fafc;">
  <div class="ncn-cont">
    <div style="text-align:center;"><span class="ncn-badge" style="background:rgba(232,168,56,0.1);color:#E8A838;border:1px solid rgba(232,168,56,0.3);">Bß║░NG CHß╗¿NG</span><h2 class="ncn-h2" style="color:#0f172a;">H├áng ng├án hß╗ìc sinh ─æ├ú h├ánh ─æß╗Öng</h2></div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;">${[['2.840+','b├ái test ─æ├ú ho├án th├ánh'],['94%','tß╗▒ tin h╞ín khi chß╗ìn ng├ánh'],['4.8/5 Γ¡É','─æ├ính gi├í tß╗½ phß╗Ñ huynh']].map(([num,label])=>`<div style="text-align:center;"><div style="font-size:clamp(18px,4vw,24px);font-weight:900;color:#0f172a;">${num}</div><div style="font-size:11px;color:#6b7280;margin-top:4px;">${label}</div></div>`).join('')}</div>
    ${[['Phß╗Ñ huynh em Thanh H├á','H├á Nß╗Öi','Con ─æß╗ìc xong bß╗Å ngay ├╜ ─æß╗ïnh thi Kinh tß║┐ v├¼ biß║┐t m├¼nh thuß╗Öc nh├│m s├íng tß║ío. Giß╗¥ con ─æang hß╗ìc Truyß╗ün th├┤ng v├á rß║Ñt hß║ính ph├║c.'],['Em ─Éß╗⌐c Minh','Lß╗¢p 11, TP.HCM','Em cß╗⌐ ngh─⌐ m├¼nh phß║úi thi Y v├¼ ba mß║╣ muß╗æn. B├ío c├ío chß╗ë ra em thuß╗Öc nh├│m Nghi├¬n cß╗⌐u-Nghß╗ç thuß║¡t. Em ─æ├ú n├│i chuyß╗çn lß║íi vß╗¢i ba mß║╣.'],['Phß╗Ñ huynh em Kh├ính Linh','H├á Giang','Chß╗ë h╞ín 500k m├á tr├ính ─æ╞░ß╗úc 4 n─âm hß╗ìc sai ng├ánh. ─É├íng lß║»m. Ch├║ng t├┤i ─æ├ú mua cho cß║ú 2 con.']].map(([name,loc,text])=>`<div style="padding:18px;border-radius:16px;background:#fff;border:1px solid #e2e8f0;margin-bottom:12px;"><div style="display:flex;gap:2px;margin-bottom:10px;">${'Γ¡É'.repeat(5)}</div><p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:12px;">"${text}"</p><p style="font-size:12px;font-weight:700;color:#0f172a;margin:0;">${name}</p><p style="font-size:11px;color:#9ca3af;margin:2px 0 0;">${loc}</p></div>`).join('')}
  </div>
</div>

<!-- REPORT CONTENTS -->
<div class="ncn-section" style="background:#fff;">
  <div class="ncn-cont">
    <div style="text-align:center;"><span class="ncn-badge" style="background:rgba(232,168,56,0.1);color:#E8A838;border:1px solid rgba(232,168,56,0.3);">B├üO C├üO ─Éß║ªY ─Éß╗ª BAO Gß╗ÆM</span><h2 class="ncn-h2" style="color:#0f172a;">To├án bß╗Ö bß║ún ─æß╗ô sß╗▒ nghiß╗çp ΓÇö c├í nh├ón h├│a cho bß║ín</h2></div>
    <div style="border-radius:18px;overflow:hidden;border:1px solid #e2e8f0;">${['5 nghß╗ü ph├╣ hß╗úp nhß║Ñt ΓÇö ph├ón t├¡ch chi tiß║┐t tß╗½ng nghß╗ü','3 nghß╗ü n├¬n tr├ính ΓÇö v├á l├╜ do cß╗Ñ thß╗â','M├┤i tr╞░ß╗¥ng l├ám viß╗çc tß╗æi ╞░u cho t├¡nh c├ích cß╗ºa bß║ín','Lß╗Ö tr├¼nh: ng├ánh hß╗ìc ΓåÆ nghß╗ü nghiß╗çp ΓåÆ mß╗⌐c thu nhß║¡p','Chiß║┐n l╞░ß╗úc ph├ít triß╗ân sß╗▒ nghiß╗çp 5 n─âm tß╗¢i'].map((item,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:16px 20px;${i<4?'border-bottom:1px solid #f1f5f9;':''}"><span style="color:#2BA88C;font-size:16px;flex-shrink:0;">Γ£ô</span><span style="font-size:14px;color:#374151;">${item}</span></div>`).join('')}</div>
  </div>
</div>

<!-- CTA -->
<div style="background:linear-gradient(135deg,#1B2A4A 0%,#2d4a7a 100%);padding:56px 20px;">
  <div style="max-width:560px;margin:0 auto;text-align:center;">
    <div style="display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:12px;background:rgba(232,168,56,0.12);border:1px solid rgba(232,168,56,0.3);margin-bottom:24px;">
      <span style="font-size:11px;font-weight:700;color:#E8A838;text-transform:uppercase;">ΓÜí ╞»U ─É├âI Hß║╛T Hß║áN TRONG</span>
      <span id="ncn-countdown" style="font-family:monospace;font-size:18px;font-weight:900;color:#fff;">00:00:00</span>
    </div>
    <div style="margin-bottom:20px;">
      <div style="display:inline-block;padding:4px 14px;border-radius:999px;background:rgba(43,168,140,0.15);border:1px solid rgba(43,168,140,0.3);margin-bottom:12px;"><span style="font-size:12px;font-weight:700;color:#2BA88C;">Tiß║┐t kiß╗çm 790.000─æ</span></div>
      <div style="display:flex;align-items:baseline;justify-content:center;gap:12px;"><span style="text-decoration:line-through;color:rgba(255,255,255,0.4);font-size:16px;">1.358.000─æ</span><span style="font-size:clamp(32px,7vw,44px);font-weight:900;color:#E8A838;">568.000─æ</span></div>
      <p style="font-size:14px;color:rgba(255,255,255,0.6);max-width:400px;margin:12px auto 0;">Chß╗ë h╞ín 500k ─æß╗â tr├ính quyß║┐t ─æß╗ïnh sai c├│ thß╗â khiß║┐n bß║ín mß║Ñt 4 n─âm ─æß║íi hß╗ìc v├á h├áng tr─âm triß╗çu ─æß╗ông.</p>
    </div>
    <button class="ncn-cta-btn" id="ncn-main-cta">XEM NGAY 5 NGHß╗Ç PH├Ö Hß╗óP NHß║ñT Vß╗ÜI Bß║áN<br><span style="font-size:12px;font-weight:600;opacity:0.8;">& ─Éß╗èNH H╞»ß╗ÜNG PH├üT TRIß╗éN TRONG T╞»╞áNG LAI</span></button>
    <p style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:12px;">Nhß║¡n file PDF trong 30 gi├óy ┬╖ Thanh to├ín bß║úo mß║¡t</p>
    <p style="font-size:14px;font-weight:700;color:#E8A838;margin-top:16px;">ΓÜí ─Éß╗½ng bß╗Å lß╗í t╞░╞íng lai chß╗ë v├¼ sß╗▒ chß║ºn chß╗½ cß╗ºa h├┤m nay.</p>
  </div>
</div>
<div style="background:#1B2A4A;padding:20px;text-align:center;"><p style="color:rgba(255,255,255,0.25);font-size:12px;margin:0;">┬⌐ NCN Academy ΓÇö Nghß╗ü Chß╗ìn Ng╞░ß╗¥i</p></div>`;

    document.getElementById('ncn-main-cta').onclick = () => openCheckout(payload);
    window._ncnOpenCheckout = () => openCheckout(payload);
    startCountdown();
    fetchAiData(payload).then(ai => { renderInsights(ai); renderCareers(ai); renderRisk(ai); });
  }

  function renderInsights(ai) {
    const area = document.getElementById('ncn-insights-area'); if (!area) return;
    const ins = ai && ai.insights;
    area.innerHTML = [['≡ƒ¬₧', ins && ins.insight_1], ['≡ƒº¡', ins && ins.insight_2], ['≡ƒÆí', ins && ins.insight_3]].filter(([,t]) => t).map(([icon,text]) => `<div style="display:flex;gap:14px;padding:18px;border-radius:16px;background:#fffbf0;border:1px solid #f0e6d0;margin-bottom:12px;"><span style="font-size:24px;flex-shrink:0;">${icon}</span><p style="font-size:14px;line-height:1.6;color:#374151;margin:0;">${text}</p></div>`).join('') || '<p style="color:#94a3b8;text-align:center;font-size:13px;">─Éang ph├ón t├¡ch...</p>';
  }

  function renderCareers(ai) {
    const area = document.getElementById('ncn-careers-area'); if (!area) return;
    const careers = ai && ai.careers && ai.careers.top_careers;
    if (!careers || !careers.length) { area.innerHTML = '<p style="color:#94a3b8;font-size:13px;text-align:center;">─Éang tß║úi...</p>'; return; }
    area.innerHTML = careers.map(c => c.locked
      ? `<div class="ncn-career" style="opacity:.7;background:#f1f5f9;border-style:dashed;cursor:pointer;" onclick="window._ncnOpenCheckout&&window._ncnOpenCheckout()"><div class="ncn-star" style="background:#cbd5e1;">${c.rank}</div><div style="flex:1;"><div style="display:flex;align-items:center;gap:6px;"><span>≡ƒöÆ</span><span style="font-size:13px;font-weight:700;color:#94a3b8;">Nghß╗ü ph├╣ hß╗úp #${c.rank} ΓÇö ph├╣ hß╗úp h╞ín cß║ú 3 nghß╗ü b├¬n d╞░ß╗¢i</span></div><p style="font-size:11px;color:#94a3b8;margin:3px 0 0;">Mß╗ƒ kh├│a trong b├ío c├ío ─æß║ºy ─æß╗º</p></div><div style="text-align:right;flex-shrink:0;"><div style="font-weight:900;color:#94a3b8;">${c.match}%</div><div style="font-size:10px;color:#cbd5e1;">ph├╣ hß╗úp</div></div></div>`
      : `<div class="ncn-career"><div class="ncn-star" style="background:#2BA88C;">${c.rank}</div><div style="flex:1;"><p style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 3px;">${c.title}</p><p style="font-size:12px;color:#6b7280;margin:0;">${c.reason}</p></div><div style="text-align:right;flex-shrink:0;"><div style="font-size:14px;font-weight:900;color:#2BA88C;">${c.match}%</div><div style="font-size:11px;color:#9ca3af;">ph├╣ hß╗úp</div></div></div>`
    ).join('');
  }

  function renderRisk(ai) {
    const area = document.getElementById('ncn-risk-area'); if (!area) return;
    const risk = ai && ai.risk;
    area.innerHTML = `<div style="font-size:56px;font-weight:900;color:#E8A838;margin-bottom:12px;">${(risk && risk.risk_percent) || 73}%</div><p style="font-size:14px;color:rgba(255,255,255,0.65);max-width:380px;margin:0 auto;">${(risk && risk.risk_description) || 'Ng╞░ß╗¥i c├│ kß║┐t quß║ú giß╗æng bß║ín th╞░ß╗¥ng chß╗ìn sai ng├ánh v├¼ bß╗ï ß║únh h╞░ß╗ƒng bß╗ƒi ├íp lß╗▒c gia ─æ├¼nh thay v├¼ lß║»ng nghe bß║ún th├ón.'}</p>`;
  }

  function waitForResult() {
    const reportEl = document.getElementById('report-container');
    if (!reportEl) { setTimeout(waitForResult, 500); return; }
    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.attributeName === 'class' && !reportEl.classList.contains('hidden')) {
          observer.disconnect();
          setTimeout(() => { if (window.pdfPayload) renderResultPage(window.pdfPayload); }, 300);
          break;
        }
      }
    });
    observer.observe(reportEl, { attributes: true });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', waitForResult); }
  else { waitForResult(); }
})();
