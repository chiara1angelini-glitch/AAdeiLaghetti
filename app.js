/* App Azienda Agricola dei Laghetti
   - Senza configurazione Supabase gira in MODALITÀ PROVA (dati di esempio, solo su questo telefono).
   - Con Supabase configurato in config.js, prenotazioni e carnet sono condivisi e i gestori vedono tutto. */

const CFG = window.LAGHETTI_CONFIG || {};
const MAX = CFG.maxPerSlot || 4;
const ONLINE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase);
const LOGO = 'icons/logo.png';

/* ---------- icone ---------- */
const IC = {
  home:'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  cal:'M4 5h16v16H4zM4 9h16M8 3v4M16 3v4',
  shoe:'M6 4c-2.5 4.5-2.5 10 .5 14 2.5 3 8.5 3 11 0 3-4 3-9.5.5-14M6 4h3M15 4h3M9 4c-1.2 3.5-1 8 .8 10.8 1.2 1.6 3.2 1.6 4.4 0C16 12 16.2 7.5 15 4M6.4 9v.01M6.6 13v.01M17.6 9v.01M17.4 13v.01',
  helmet:'M4 16a8 8 0 0 1 16 0zM20 16h2.5M12 8V6.5M8 16v-3a4 4 0 0 1 4-4',
  boot:'M8 3h6v11l5 2.5c1.4.7 1.2 3.5-.4 3.5H8zM8 17.5h11.5M8 7h6M8 20v1.5h3V20',
  saddle:'M3 10c3 0 4.5-3 9-3s6 3 9 3c0 3.5-4 5.5-9 5.5S3 13.5 3 10zM12 15.5v2.5M9.5 21.5a2.5 2.5 0 0 1 5 0z',
  reins:'M3 4c2.5 6 5.5 10.5 9 12.5 3.5-2 6.5-6.5 9-12.5M12 16.5a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 1 0 0-4.6',
  rosette:'M12 3a5 5 0 1 1 0 10 5 5 0 1 1 0-10zM12 6a2 2 0 1 1 0 4 2 2 0 1 1 0-4M9.5 12.4L8 21l3-1.6M14.5 12.4L16 21l-3-1.6',
  family:'M9 7a3 3 0 1 0 0 .01M17 9a2 2 0 1 0 0 .01M3 20c0-4 3-6 6-6s6 2 6 6M15 20c0-3 2-5 4-5s2 1 2 1',
  farm:'M3 21V10l9-6 9 6v11M9 21v-6h6v6M3 21h18',
  gift:'M3 8h18v4H3zM5 12v9h14v-9M12 8v13M12 8c-2-4-6-4-6-1s6 1 6 1c2-4 6-4 6-1s-6 1-6 1',
  heart:'M12 20s-8-5-8-11a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 6-8 11-8 11z',
  cake:'M4 21h16v-8H4zM4 16c2 1 4 1 4-1 0 2 4 2 4 0 0 2 4 2 4 0 0 2 2 2 4 1M12 13V9M12 6v.01',
  basket:'M3 10h18l-2 10H5zM8 10l4-6 4 6M9 14v3M15 14v3',
  bed:'M3 19V7M3 12h18v7M21 14H3M7 12V9h5v3',
  bell:'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0',
  back:'M15 6l-6 6 6 6', chev:'M9 6l6 6-6 6', x:'M6 6l12 12M18 6L6 18',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 4-6 8-6s8 2 8 6',
  key:'M15 7a4 4 0 1 1-3.9 5H3v3h3v3h3v-3h2.1A4 4 0 0 1 15 7zM16 11v.01'
};
const svg = (d, size = 22, stroke = 'currentColor', w = 1.9, extra = '') =>
  `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}><path d="${d}"/></svg>`;
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const TINT = { yellow:['var(--t-yellow)','var(--i-yellow)'], green:['var(--t-green)','var(--i-green)'], orange:['var(--t-orange)','var(--i-orange)'], sky:['var(--t-sky)','var(--i-sky)'], pink:['var(--t-pink)','var(--i-pink)'] };

/* ---------- date e orari ---------- */
const WD = ['Dom','Lun','Mar','Mer','Gio','Ven','Sab'];
const WDL = ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
const MO = ['gen','feb','mar','apr','mag','giu','lug','ago','set','ott','nov','dic'];
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const todayIso = () => iso(new Date());
const fmtLong = (d) => `${WDL[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}`;
const fmtShort = (s) => { const d = fromIso(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// Lezioni di ora in ora: lunedì chiuso, mar-ven dalle 17, sabato dalle 15, domenica 9-12
const START = { 0:[9,10,11], 2:[17,18], 3:[17,18], 4:[17,18], 5:[17,18], 6:[15,16,17,18] };
const slotsFor = (d) => (START[d.getDay()] || []).map((h) => pad(h) + ':00');
const endOf = (t) => /^\d\d:\d\d$/.test(t) ? pad(Number(t.slice(0, 2)) + 1) + ':00' : '';
const isPast = (day, slot) => { const [h] = slot.split(':').map(Number); const d = fromIso(day); d.setHours(h || 0); return d < new Date(); };
const openDays = (from, count) => { const out = []; const base = new Date(); base.setHours(0, 0, 0, 0);
  for (let i = from; out.length < count && i < from + 60; i++) { const x = new Date(base); x.setDate(base.getDate() + i); if (START[x.getDay()]) out.push(x); } return out; };

/* ---------- logica carnet (uguale in prova e online) ---------- */
function carnetInfo(carnets, bookings) {
  const cs = carnets.slice().sort((a, b) => a.id - b.id).map((c) => ({ ...c,
    stamps: bookings.filter((b) => b.carnet_id === c.id && b.status === 'svolta').sort((a, b) => (a.day + a.slot).localeCompare(b.day + b.slot)) }));
  const active = cs.find((c) => c.stamps.length < c.size) || null;
  const remaining = cs.reduce((n, c) => n + Math.max(0, c.size - c.stamps.length), 0);
  const upcoming = bookings.filter((b) => b.status === 'prenotata' && b.day >= todayIso()).sort((a, b) => (a.day + a.slot).localeCompare(b.day + b.slot));
  return { carnets: cs, active, current: active || cs[cs.length - 1] || null, remaining, upcoming, free: remaining - upcoming.length };
}

/* ---------- archivio: MODALITÀ PROVA ---------- */
const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
function seedDemo() {
  const past = openDays(-60, 60).filter((d) => iso(d) < todayIso()).reverse(); // dal più recente
  const fut = openDays(0, 10).filter((d) => slotsFor(d).some((s) => !isPast(iso(d), s)));
  const users = [
    { id:'admin', name:'Umberto', email:'umberto@prova.it', pw:'prova', role:'admin' },
    { id:'u1', name:'Giulia (esempio)', email:'giulia@prova.it', pw:'prova', role:'cliente' },
    { id:'u2', name:'Marco (esempio)', email:'marco@prova.it', pw:'prova', role:'cliente' },
    { id:'u3', name:'Sofia (esempio)', email:'sofia@prova.it', pw:'prova', role:'cliente' },
    { id:'u4', name:'Luca (esempio)', email:'luca@prova.it', pw:'prova', role:'cliente' },
    { id:'u5', name:'Anna (esempio)', email:'anna@prova.it', pw:'prova', role:'cliente' }
  ];
  const carnets = []; const bookings = []; let cid = 1, bid = 1;
  const plan = { u1: 6, u2: 9, u3: 3, u4: 10, u5: 13 };
  Object.entries(plan).forEach(([uid, n], k) => {
    let c = { id: cid++, user_id: uid, size: 10, created_at: iso(past[Math.min(past.length - 1, n * 3)]) }; carnets.push(c);
    for (let i = n - 1, j = 0; i >= 0; i--, j++) {
      if (j === 10) { c = { id: cid++, user_id: uid, size: 10, created_at: iso(past[i * 3 + k]) }; carnets.push(c); }
      const d = past[i * 3 + k]; const s = slotsFor(d);
      bookings.push({ id: bid++, user_id: uid, day: iso(d), slot: s[k % s.length], status: 'svolta', carnet_id: c.id });
    }
  });
  const f0 = fut[0], f1 = fut[1] || fut[0];
  const s0 = slotsFor(f0).filter((s) => !isPast(iso(f0), s));
  [['u1', f0, s0[0]], ['u2', f0, s0[0]], ['u5', f0, s0[s0.length - 1]], ['u3', f1, slotsFor(f1)[0]], ['u1', f1, slotsFor(f1)[slotsFor(f1).length - 1]]]
    .forEach(([u, d, s]) => bookings.push({ id: bid++, user_id: u, day: iso(d), slot: s, status: 'prenotata', carnet_id: null }));
  return { users, carnets, bookings, next: { cid, bid } };
}
const DemoAPI = {
  db: null,
  load() { this.db = store.get('laghetti-demo-db') || seedDemo(); this.save(); },
  save() { store.set('laghetti-demo-db', this.db); },
  reset() { this.db = seedDemo(); this.save(); },
  async session() { const id = store.get('laghetti-demo-user'); return this.db.users.find((u) => u.id === id) ? id : null; },
  async signIn(email, pw) { const u = this.db.users.find((x) => x.email.toLowerCase() === email.toLowerCase().trim() && x.pw === pw); if (!u) throw new Error('Email o password non corretti'); store.set('laghetti-demo-user', u.id); },
  async signInAs(id) { store.set('laghetti-demo-user', id); },
  async signUp(name, email, pw) {
    if (this.db.users.some((x) => x.email.toLowerCase() === email.toLowerCase().trim())) throw new Error('Esiste già un account con questa email');
    const u = { id: 'u' + Date.now(), name, email: email.trim(), pw, role: 'cliente' }; this.db.users.push(u); this.save(); store.set('laghetti-demo-user', u.id); return { needsConfirm: false };
  },
  async signOut() { store.set('laghetti-demo-user', null); },
  async me() { const id = store.get('laghetti-demo-user'); const u = this.db.users.find((x) => x.id === id); return u ? { id: u.id, name: u.name, email: u.email, role: u.role } : null; },
  async myData(uid) { return { carnets: this.db.carnets.filter((c) => c.user_id === uid), bookings: this.db.bookings.filter((b) => b.user_id === uid && b.status !== 'annullata') }; },
  async counts(from, to) { const m = {}; this.db.bookings.filter((b) => b.status !== 'annullata' && b.day >= from && b.day <= to).forEach((b) => { m[b.day + ' ' + b.slot] = (m[b.day + ' ' + b.slot] || 0) + 1; }); return m; },
  async book(uid, day, slot) {
    const d = fromIso(day);
    if (!START[d.getDay()]) throw new Error('Il lunedì siamo chiusi');
    if (!slotsFor(d).includes(slot)) throw new Error('Orario non disponibile');
    if (isPast(day, slot)) throw new Error('Questo orario è già passato');
    if (this.db.bookings.some((b) => b.user_id === uid && b.day === day && b.slot === slot && b.status !== 'annullata')) throw new Error('Hai già prenotato questa lezione');
    if (this.db.bookings.filter((b) => b.day === day && b.slot === slot && b.status !== 'annullata').length >= MAX) throw new Error('Lezione al completo');
    const info = carnetInfo(this.db.carnets.filter((c) => c.user_id === uid), this.db.bookings.filter((b) => b.user_id === uid));
    if (info.free <= 0) throw new Error('Carnet esaurito: chiedi un nuovo carnet in segreteria');
    this.db.bookings.push({ id: this.db.next.bid++, user_id: uid, day, slot, status: 'prenotata', carnet_id: null }); this.save();
  },
  async cancel(uid, id) { const b = this.db.bookings.find((x) => x.id === id && x.user_id === uid && x.status === 'prenotata'); if (!b) throw new Error('Prenotazione non trovata'); b.status = 'annullata'; this.save(); },
  async adminAll() { return { profiles: this.db.users.map(({ pw, ...u }) => u), carnets: this.db.carnets, bookings: this.db.bookings.filter((b) => b.status !== 'annullata') }; },
  async stamp(id) {
    const b = this.db.bookings.find((x) => x.id === id); if (!b) throw new Error('Prenotazione non trovata');
    const info = carnetInfo(this.db.carnets.filter((c) => c.user_id === b.user_id), this.db.bookings.filter((x) => x.user_id === b.user_id));
    if (!info.active) throw new Error('NO_CARNET');
    b.status = 'svolta'; b.carnet_id = info.active.id; this.save();
  },
  async manualStamp(uid) {
    const info = carnetInfo(this.db.carnets.filter((c) => c.user_id === uid), this.db.bookings.filter((x) => x.user_id === uid));
    if (!info.active) throw new Error('NO_CARNET');
    this.db.bookings.push({ id: this.db.next.bid++, user_id: uid, day: todayIso(), slot: 'extra', status: 'svolta', carnet_id: info.active.id }); this.save();
  },
  async setStatus(id, status) { const b = this.db.bookings.find((x) => x.id === id); if (!b) return; b.status = status; if (status !== 'svolta') b.carnet_id = null; this.save(); },
  async newCarnet(uid, size = 10) { this.db.carnets.push({ id: this.db.next.cid++, user_id: uid, size, created_at: todayIso() }); this.save(); }
};

/* ---------- archivio: ONLINE (Supabase) ---------- */
const SupaAPI = {
  sb: null,
  load() { this.sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey); },
  ok({ data, error }) { if (error) throw new Error(error.message || 'Errore di connessione'); return data; },
  async session() { const { data } = await this.sb.auth.getSession(); return data.session ? data.session.user.id : null; },
  async signIn(email, pw) { this.ok(await this.sb.auth.signInWithPassword({ email: email.trim(), password: pw })); },
  async signUp(name, email, pw) { const r = this.ok(await this.sb.auth.signUp({ email: email.trim(), password: pw, options: { data: { name } } })); return { needsConfirm: !r.session }; },
  async signOut() { await this.sb.auth.signOut(); },
  async me() { const id = await this.session(); if (!id) return null; return this.ok(await this.sb.from('profiles').select('id,name,email,role').eq('id', id).single()); },
  async myData(uid) {
    const carnets = this.ok(await this.sb.from('carnets').select('*').eq('user_id', uid));
    const bookings = this.ok(await this.sb.from('bookings').select('*').eq('user_id', uid).neq('status', 'annullata'));
    return { carnets, bookings };
  },
  async counts(from, to) { const rows = this.ok(await this.sb.rpc('slot_counts', { d_from: from, d_to: to })); const m = {}; rows.forEach((r) => { m[r.day + ' ' + r.slot] = Number(r.n); }); return m; },
  async book(uid, day, slot) { this.ok(await this.sb.rpc('book_slot', { p_day: day, p_slot: slot })); },
  async cancel(uid, id) { this.ok(await this.sb.rpc('cancel_booking', { p_id: id })); },
  async adminAll() {
    const since = iso(new Date(Date.now() - 400 * 864e5));
    const [profiles, carnets, bookings] = await Promise.all([
      this.sb.from('profiles').select('id,name,email,role').then((r) => this.ok(r)),
      this.sb.from('carnets').select('*').then((r) => this.ok(r)),
      this.sb.from('bookings').select('*').neq('status', 'annullata').gte('day', since).then((r) => this.ok(r))
    ]);
    return { profiles, carnets, bookings };
  },
  async stamp(id) { const { error } = await this.sb.rpc('stamp_booking', { p_id: id }); if (error) throw new Error(/NO_CARNET/.test(error.message) ? 'NO_CARNET' : error.message); },
  async manualStamp(uid) { const { error } = await this.sb.rpc('manual_stamp', { p_user: uid }); if (error) throw new Error(/NO_CARNET/.test(error.message) ? 'NO_CARNET' : error.message); },
  async setStatus(id, status) { this.ok(await this.sb.from('bookings').update({ status, carnet_id: status === 'svolta' ? undefined : null }).eq('id', id)); },
  async newCarnet(uid, size = 10) { this.ok(await this.sb.from('carnets').insert({ user_id: uid, size })); }
};
const API = ONLINE ? SupaAPI : DemoAPI;

/* ---------- contenuti (da completare con i dati veri) ---------- */
const EVENTS = [
  { id:'cs1', cat:'Concorsi sociali', badge:'Concorso sociale', date:'2026-11-29', title:'Concorso sociale di salto ostacoli', info:'Categorie per tutti i livelli, dai pony ai più esperti. Premiazione con coccarde e merenda.', tint:'orange' },
  { id:'st1', cat:'Stage', badge:'Stage', date:'2026-12-05', title:'Stage di salto con istruttore ospite', info:'Una giornata di lavoro su ginnastica e percorsi.', tint:'sky' },
  { id:'fe1', cat:'Feste', badge:'Festa in azienda', date:'2026-12-13', title:'Natale in scuderia', info:'Carosello degli allievi, vin brulè e cioccolata calda per tutte le famiglie.', tint:'pink' },
  { id:'cs2', cat:'Concorsi sociali', badge:'Concorso sociale', date:'2027-01-24', title:'Concorso sociale di dressage', info:'Riprese facili e intermedie, giudice in campo. Ideale per la prima gara.', tint:'orange' },
  { id:'fe2', cat:'Feste', badge:'Per i più piccoli', date:'2027-02-14', title:'Gimkana di Carnevale sui pony', info:'Percorso a ostacoli giocoso, in maschera. Per bambini dai 4 anni.', tint:'yellow' }
];
const NEWS = [
  { id:'n1', date:'2026-11-17', cat:'Importante', tint:'orange', important:true, title:'Domenica 29 novembre lezioni sospese', text:'Quel giorno in azienda c’è il concorso sociale di salto ostacoli: le lezioni della domenica mattina sono sospese. Vi aspettiamo in campo a fare il tifo!' },
  { id:'n2', date:'2026-11-15', cat:'Campi estivi', tint:'green', title:'Aperte le pre-iscrizioni ai campi estivi 2027', text:'Puoi pre-iscrivere tuo figlio dalla sezione Famiglie. Ti ricontatteremo per date e dettagli.' },
  { id:'n3', date:'2026-11-10', cat:'Scuderia', tint:'sky', title:'Un nuovo amico in scuderia: [NOME CAVALLO]', text:'[Qualche riga sul nuovo arrivato.] Lo trovi nella sezione I nostri cavalli.' },
  { id:'n4', date:'2026-11-05', cat:'Promemoria', tint:'yellow', title:'Il casco è obbligatorio per tutti', text:'Si monta sempre con il casco allacciato, anche per un giro breve. Se non ce l’hai puoi noleggiarlo in selleria.' }
];
// birth: 'AAAA-MM-GG' oppure null; photo: percorso di un'immagine (es. 'foto/stella.jpg') oppure null
const HORSES = [
  { id:'c1', name:'[NOME CAVALLO]', birth:null, sex:'[Castrone / Fattrice]', breed:'[RAZZA]', coat:'[MANTELLO]', tint:'yellow', role:'[Per principianti / salto / dressage]', text:'[DESCRIZIONE: carattere, storia, cosa gli piace fare e il suo vizietto preferito.]', photo:null },
  { id:'c2', name:'[NOME CAVALLO]', birth:null, sex:'[Castrone / Fattrice]', breed:'[RAZZA]', coat:'[MANTELLO]', tint:'green', role:'[Per principianti / salto / dressage]', text:'[DESCRIZIONE]', photo:null },
  { id:'c3', name:'[NOME PONY]', birth:null, sex:'[Castrone / Fattrice]', breed:'[RAZZA]', coat:'[MANTELLO]', tint:'orange', role:'[Per i più piccoli]', text:'[DESCRIZIONE]', photo:null },
  { id:'c4', name:'[NOME CAVALLO]', birth:null, sex:'[Castrone / Fattrice]', breed:'[RAZZA]', coat:'[MANTELLO]', tint:'sky', role:'[Per principianti / salto / dressage]', text:'[DESCRIZIONE]', photo:null }
];
const FARM = [
  { id:'adotta', title:'Adotta un cavallo', sub:'Quota mensile, foto e una visita inclusa', d:IC.heart, tint:'pink', text:'Scegli un cavallo della scuola e seguilo da vicino: ricevi foto e aggiornamenti, e una visita in scuderia per conoscerlo.' },
  { id:'regalo', title:'Regala un’esperienza', sub:'Battesimo della sella, escursioni, soggiorni', d:IC.rosette, tint:'yellow', text:'Un buono regalo per il battesimo della sella, un’escursione nei boschi della Valtravaglia o un weekend nel nostro B&B.' },
  { id:'cassetta', title:'Cassetta della spesa', sub:'I nostri prodotti, da ritirare dopo la lezione', d:IC.basket, tint:'green', text:'Ogni settimana una cassetta con i prodotti dell’azienda, pronta da ritirare quando vieni a lezione.' },
  { id:'bottega', title:'La bottega', sub:'Ordina e ritira in azienda', d:IC.farm, tint:'orange', text:'I prodotti dell’azienda agricola, da prenotare e ritirare in azienda.' },
  { id:'bb', title:'Il B&B', sub:'Un soggiorno con escursione a cavallo', d:IC.bed, tint:'sky', text:'Dormi in azienda, sul Lago Maggiore, e aggiungi un’escursione a cavallo al tuo soggiorno.' },
  { id:'pensione', title:'Il mio cavallo in pensione', sub:'Paddock, ferrature, veterinario e foto', d:IC.reins, tint:'green', text:'Per chi ha il cavallo in pensione: il diario di paddock, ferrature e visite del veterinario, con le foto.' },
  { id:'mercatino', title:'Il mercatino del cavaliere', sub:'Stivali, caschi e selle usati tra allievi', d:IC.boot, tint:'pink', text:'Gli stivali sono diventati piccoli? Metti in vendita o scambia attrezzatura usata con gli altri allievi.' },
  { id:'selleria', title:'Selleria', sub:'Noleggio casco, cap e protezioni', d:IC.saddle, tint:'yellow', text:'Casco, protezioni e cap a noleggio per chi è alle prime lezioni.' }
];

/* ---------- stato dell'interfaccia (preferenze su questo telefono) ---------- */
const UKEY = 'laghetti-ui-v2';
const UDEF = { tab: 'home', sub: null, day: 0, aday: null, evf: 'Tutti', joined: {}, docs: {}, camp: false, interests: {}, read: {}, authMode: 'login' };
let S = { ...UDEF, ...(store.get(UKEY) || {}) };
const saveUI = () => store.set(UKEY, S);
const D = { me: null, my: null, counts: {}, admin: null, loading: true };
const set = (patch) => { S = { ...S, ...patch }; saveUI(); render(); };

/* ---------- caricamento dati ---------- */
async function refresh() {
  try {
    D.me = await API.me();
    if (D.me) {
      const days = openDays(-14, 30);
      const [mine, counts] = await Promise.all([API.myData(D.me.id), API.counts(iso(days[0]), iso(days[days.length - 1]))]);
      D.my = carnetInfo(mine.carnets, mine.bookings); D.my.all = mine.bookings; D.counts = counts;
      D.admin = D.me.role === 'admin' ? await API.adminAll() : null;
    }
  } catch (e) { toast(e.message); }
  D.loading = false; render();
}
const run = async (fn, okMsg) => { try { await fn(); if (okMsg) toast(okMsg); } catch (e) { toast(e.message === 'NO_CARNET' ? 'Carnet pieno: crea prima un nuovo carnet' : e.message); } await refresh(); };

/* ---------- utilità UI ---------- */
let toastT;
function toast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2800); }
function openSheet(html) { document.getElementById('sheet').innerHTML = html; document.getElementById('sheetbg').classList.add('open'); const f = document.querySelector('#sheet button, #sheet input'); if (f) f.focus(); }
function closeSheet() { document.getElementById('sheetbg').classList.remove('open'); }
document.getElementById('sheetbg').addEventListener('click', (e) => { if (e.target.id === 'sheetbg') closeSheet(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
const sec = (title, icon = IC.shoe) => `<h2 class="sec">${svg(icon, 20, 'var(--green)', 2.2)}${title}</h2>`;
const bubble = (d, tint) => `<div class="bubble" style="background:${TINT[tint][0]}">${svg(d, 22, TINT[tint][1])}</div>`;
const backBtn = () => `<button class="pill" style="align-self:flex-start;display:flex;align-items:center;gap:6px" onclick="set({sub:null})">${svg(IC.back, 18)}Indietro</button>`;
const unread = () => NEWS.filter((n) => !S.read[n.id]);

/* ---------- il carnet a timbri ---------- */
function carnetCard(c, owner, number) {
  if (!c) return `<div class="empty"><span class="serif" style="font-size:18px">Nessun carnet attivo</span><p class="muted">Il carnet da 10 lezioni si attiva in segreteria.</p></div>`;
  const used = c.stamps.length, left = c.size - used;
  const cells = Array.from({ length: c.size }, (_, i) => {
    const s = c.stamps[i];
    return s ? `<div class="cell on" aria-label="Lezione ${i + 1} timbrata il ${fmtShort(s.day)}"><div class="stamp" style="transform:rotate(${((i * 37) % 21) - 10}deg)">${svg(IC.shoe, 16, '#1E8E3E', 2.4)}${fmtShort(s.day)}</div></div>`
             : `<div class="cell" aria-label="Lezione ${i + 1} da fare">${i + 1}</div>`;
  }).join('');
  return `
  <div class="carnet">
    <div class="carnet-head"><img src="${LOGO}" alt=""><div class="t"><b>Carnet ${c.size} lezioni${number ? ' n. ' + number : ''}</b><span>${esc(owner)} · dal ${fmtShort(c.created_at.slice(0, 10))}</span></div></div>
    <div class="stamps">${cells}</div>
    <div class="carnet-foot"><span>${used} timbr${used === 1 ? 'o' : 'i'}</span><span style="color:${left <= 2 ? '#9C2A20' : 'var(--green-d)'}">${left === 0 ? 'Completato!' : 'Restano ' + left + ' lezion' + (left === 1 ? 'e' : 'i')}</span></div>
  </div>`;
}
const miniCarnet = (c) => c ? `<div class="mini" aria-hidden="true">${Array.from({ length: c.size }, (_, i) => `<i class="${i < c.stamps.length ? 'on' : ''}"></i>`).join('')}</div>` : '';

/* ---------- accesso ---------- */
function vLogin() {
  const signup = S.authMode === 'signup';
  return `
  <div class="welcome">
    <img src="${LOGO}" alt="Logo Azienda Agricola dei Laghetti">
    <h1 style="font-size:28px">Benvenuto ai Laghetti</h1>
    <p class="muted" style="font-size:16px">Scuola di equitazione e azienda agricola in Valtravaglia.</p>
    <form id="auth" onsubmit="event.preventDefault();doAuth(this)">
      ${signup ? `<div class="field"><label for="a-name">Nome e cognome</label><input id="a-name" name="name" type="text" autocomplete="name" required></div>` : ''}
      <div class="field"><label for="a-email">Email</label><input id="a-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="a-pw">Password</label><input id="a-pw" name="pw" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" minlength="6" required></div>
      <p class="err" id="a-err" role="alert"></p>
      <button class="btn wide" type="submit">${svg(IC.shoe, 20, '#fff')}${signup ? 'Crea il mio account' : 'Entra in scuderia'}</button>
      <button class="btn ghost wide" type="button" onclick="set({authMode:'${signup ? 'login' : 'signup'}'})">${signup ? 'Ho già un account' : 'Sono nuovo: crea un account'}</button>
    </form>
    ${ONLINE ? '' : `
    <div class="demo">
      <b>Modalità prova</b>
      <span style="font-size:14px">L'app non è ancora collegata all'archivio online: i dati sono di esempio e restano su questo telefono.</span>
      <button class="btn wide" onclick="demoAs('u1')">${svg(IC.helmet, 20, '#fff')}Prova come allievo</button>
      <button class="btn sun wide" onclick="demoAs('admin')">${svg(IC.key, 20)}Prova come gestore</button>
    </div>`}
  </div>`;
}
window.doAuth = async (f) => {
  const err = document.getElementById('a-err'); err.textContent = '';
  try {
    if (S.authMode === 'signup') { const r = await API.signUp(f.name.value.trim(), f.email.value, f.pw.value); if (r.needsConfirm) { err.textContent = 'Ti abbiamo mandato una mail: conferma l’indirizzo e poi accedi.'; set({ authMode: 'login' }); return; } }
    else await API.signIn(f.email.value, f.pw.value);
    S.tab = 'home'; S.sub = null; saveUI(); D.loading = true; render(); await refresh();
  } catch (e) { err.textContent = e.message; }
};
window.demoAs = async (id) => { await DemoAPI.signInAs(id); S.tab = id === 'admin' ? 'agenda' : 'home'; S.sub = null; saveUI(); await refresh(); };

/* ---------- area allievi ---------- */
function vHome() {
  const next = D.my.upcoming[0];
  const ev = EVENTS.find((e) => e.date >= todayIso()) || EVENTS[0];
  const imp = NEWS.find((n) => n.important && !S.read[n.id]);
  const first = D.me.name.split(' ')[0];
  const quick = [
    ['Prenota una lezione', IC.helmet, 'yellow', "set({tab:'prenota',sub:null})"],
    [`Il mio carnet<br><small style="font-weight:700;color:var(--muted)">${D.my.remaining} lezioni rimaste</small>`, IC.shoe, 'green', "set({sub:'carnet'})"],
    ['Gare ed eventi', IC.rosette, 'orange', "set({tab:'gare',sub:null})"],
    ['I nostri cavalli', IC.reins, 'sky', "set({sub:'cavalli'})"],
    ['Adotta un cavallo', IC.heart, 'pink', "farmSheet('adotta')"],
    ['Regala un’esperienza', IC.gift, 'yellow', "farmSheet('regalo')"]
  ];
  return `
  ${D.me.role === 'admin' ? `<button class="listbtn" style="background:var(--t-yellow);border-color:transparent" onclick="set({tab:'agenda',sub:null})">${bubble(IC.key, 'yellow')}<div style="flex:1"><b>Area riservata</b><span style="color:#5A4300">Agenda, allievi e carnet</span></div>${svg(IC.chev, 18)}</button>` : ''}
  ${imp ? `<button onclick="set({sub:'news'})" style="border:none;border-radius:22px;background:#E86A2C;color:#2B1D12;padding:14px 16px;display:flex;align-items:center;gap:12px;text-align:left">
    ${svg(IC.bell, 24, '#2B1D12', 2)}<span style="flex:1;display:flex;flex-direction:column"><span style="font-size:12px;font-weight:800">Avviso importante</span><span style="font-weight:800;font-size:15px">${imp.title}</span></span>${svg(IC.chev, 18, '#2B1D12')}</button>` : ''}
  <section class="hero">
    ${svg(IC.shoe, 48, '#8A5A00', 1.7, 'class="lucky"')}
    <span style="font-size:14px;font-weight:800;color:#6B4E00">Che bello rivederti in scuderia</span>
    <h1>Ciao ${esc(first)},<br>i cavalli ti aspettano</h1>
    <svg class="land" aria-hidden="true" viewBox="0 0 350 90">
      <circle cx="300" cy="28" r="15" fill="#FFF3C4"/>
      <path d="M0 52 C60 32 110 42 170 50 S280 40 350 48 V90 H0Z" fill="#7CCB5B"/>
      <path d="M0 66 C80 54 150 70 230 62 S320 58 350 64 V90 H0Z" fill="#2FA34B"/>
      <g stroke="#7A4424" stroke-width="3" stroke-linecap="round" fill="none"><path d="M14 66V42"/><path d="M60 60V36"/><path d="M106 58V35"/><path d="M152 59V37"/><path d="M10 46C60 40 110 38 156 41"/><path d="M10 56C60 50 110 48 156 51"/></g>
      <path d="M205 80C240 72 285 72 335 80" stroke="#7FD0F5" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M225 86C255 82 290 82 320 86" stroke="#B9E6FA" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  </section>
  ${next ? (() => { const d = fromIso(next.day); return `
  <div class="card" style="flex-direction:row;align-items:center;gap:14px">
    <div class="datebox" style="background:var(--green);color:#fff">${WD[d.getDay()].toUpperCase()}<span class="serif">${d.getDate()}</span>${MO[d.getMonth()].toUpperCase()}</div>
    <div style="display:flex;flex-direction:column;gap:2px">
      <span style="font-size:12px;font-weight:800;color:var(--muted)">La tua prossima lezione</span>
      <span class="serif" style="font-size:18px">Lezione · ${next.slot} – ${endOf(next.slot)}</span>
      <span class="muted" style="font-size:13px">Con Umberto</span>
    </div>
  </div>`; })() : `
  <div class="empty">
    <span class="serif" style="font-size:18px">Nessuna lezione in programma</span>
    <p class="muted">Stivali lucidati? Prenota la prossima uscita in sella.</p>
    <button class="btn" onclick="set({tab:'prenota',sub:null})">${svg(IC.helmet, 20, '#fff')}Prenota ora</button>
  </div>`}
  ${sec('Cosa ti va di fare?')}
  <div class="grid2">${quick.map(([l, d, t, on]) => `<button class="tile" onclick="${on}">${bubble(d, t)}<span>${l}</span></button>`).join('')}</div>
  ${sec('Dalla bacheca', IC.rosette)}
  <button class="listbtn" onclick="set({sub:'news'})">${bubble(IC.bell, 'orange')}<div style="flex:1"><b>News dalla scuderia</b><span>${unread().length ? unread().length + ' da leggere' : 'Sei in pari'}</span></div>${svg(IC.chev, 18, 'var(--muted)')}</button>
  <div class="card" style="background:var(--t-orange);border-color:transparent">
    <span class="tag" style="background:#fff;color:var(--i-orange)">Gara in azienda</span>
    <span class="serif" style="font-size:19px">${ev.title}</span>
    <p class="muted" style="color:#5A3415">${cap(fmtLong(fromIso(ev.date)))}, in azienda. Iscrizioni aperte!</p>
    <button class="btn" onclick="set({tab:'gare',sub:null})">Tutte le gare e gli eventi</button>
  </div>
  <div class="card" style="position:relative;padding-right:90px">
    <span class="tag" style="background:var(--t-green);color:var(--i-green)">Cavallo del mese</span>
    <span class="serif" style="font-size:18px">[NOME CAVALLO]</span>
    <p class="muted">Scelto dagli allievi: si merita la coccarda.</p>
    ${svg(IC.rosette, 58, '#1E8E3E', 1.6, 'style="position:absolute;right:16px;top:18px"')}
    <button class="btn ghost" onclick="set({sub:'cavalli'})">Conosci tutti i cavalli</button>
  </div>`;
}

function vPrenota() {
  const days = openDays(0, 8).filter((d) => slotsFor(d).some((s) => !isPast(iso(d), s))).slice(0, 7);
  const di = Math.min(S.day, days.length - 1);
  const day = days[di], dIso = iso(day);
  const mineAt = (s) => D.my.upcoming.find((b) => b.day === dIso && b.slot === s);
  return `
  <div><h1 style="font-size:28px">Prenota una lezione</h1><p class="muted">Stivali lucidati, casco in testa: scegli quando vieni.</p></div>
  <div class="card" style="flex-direction:row;align-items:center;gap:12px;background:var(--t-green);border-color:transparent;padding:12px 16px">
    ${svg(IC.shoe, 26, 'var(--green-d)', 2)}<span style="flex:1;font-weight:800;color:#15592A">${D.my.free > 0 ? `Puoi prenotare ancora ${D.my.free} lezion${D.my.free === 1 ? 'e' : 'i'} con il tuo carnet` : 'Carnet esaurito: chiedi un nuovo carnet in segreteria'}</span>
  </div>
  <div class="days" role="group" aria-label="Giorno">${days.map((d, i) => `<button class="day" aria-pressed="${i === di}" aria-label="${fmtLong(d)}" onclick="set({day:${i}})">${WD[d.getDay()]}<span class="serif">${d.getDate()}</span></button>`).join('')}</div>
  <p class="muted" style="font-weight:700">${cap(fmtLong(day))} · lezioni di un'ora</p>
  <div class="list">${slotsFor(day).map((t) => {
    const mine = mineAt(t); const n = D.counts[dIso + ' ' + t] || 0; const left = MAX - n; const past = isPast(dIso, t);
    const action = mine ? `<button class="btn ghost on" onclick="cancelBook(${JSON.stringify(mine.id).replace(/"/g, '&quot;')})">Prenotato</button>`
      : past ? `<span class="chip" style="background:#EEE6D8;color:var(--muted)">Passata</span>`
      : left <= 0 ? `<span class="chip" style="background:var(--t-orange);color:var(--i-orange)">Completa</span>`
      : `<button class="btn ghost" onclick="book('${dIso}','${t}')">Prenota</button>`;
    return `
    <div class="card" style="flex-direction:row;align-items:center;padding:14px 16px">
      <div style="flex:1;display:flex;flex-direction:column;gap:2px"><span class="serif" style="font-size:20px">${t} – ${endOf(t)}</span><span class="muted" style="font-size:13px">${mine ? 'Ci sei! Tocca per annullare' : left > 0 ? `${left} post${left === 1 ? 'o libero' : 'i liberi'} su ${MAX}` : 'Nessun posto libero'}</span></div>
      ${action}
    </div>`; }).join('')}</div>
  ${D.my.upcoming.length ? sec('Le mie lezioni', IC.helmet) + `<div class="list">${D.my.upcoming.map((b) => `
    <div class="card" style="flex-direction:row;align-items:center;padding:14px 16px">
      <div style="flex:1"><span class="serif" style="font-size:16px;display:block">${cap(fmtLong(fromIso(b.day)))}</span><span class="muted" style="font-size:13px">${b.slot} – ${endOf(b.slot)}</span></div>
      <button class="pill" onclick="cancelBook(${JSON.stringify(b.id).replace(/"/g, '&quot;')})">Annulla</button>
    </div>`).join('')}</div>` : ''}`;
}
window.book = (day, slot) => run(() => API.book(D.me.id, day, slot), 'In sella! Lezione prenotata');
window.cancelBook = (id) => run(() => API.cancel(D.me.id, id), 'Lezione annullata');

function vCarnet() {
  const cs = D.my.carnets;
  const older = cs.filter((c) => c !== D.my.current).reverse();
  return `
  ${backBtn()}
  <h1 style="font-size:28px">Il mio carnet</h1>
  <p class="muted">Ogni lezione fatta riceve un timbro. Il carnet da 10 si rinnova in segreteria.</p>
  ${carnetCard(D.my.current, D.me.name, cs.indexOf(D.my.current) + 1)}
  <div class="stats">
    <div class="stat"><b>${D.my.remaining}</b><span>lezioni rimaste</span></div>
    <div class="stat"><b>${D.my.upcoming.length}</b><span>già prenotate</span></div>
    <div class="stat"><b>${cs.reduce((n, c) => n + c.stamps.length, 0)}</b><span>timbri in tutto</span></div>
  </div>
  ${older.length ? sec('Carnet completati') + older.map((c) => `<div class="card" style="flex-direction:row;align-items:center;padding:14px 16px"><div style="flex:1"><b class="serif">Carnet n. ${cs.indexOf(c) + 1}</b><p class="muted" style="font-size:13px">Iniziato il ${fmtShort(c.created_at.slice(0, 10))} · ${c.stamps.length}/${c.size} timbri</p></div>${miniCarnet(c)}</div>`).join('') : ''}`;
}

function vGare() {
  const cats = ['Tutti','Concorsi sociali','Stage','Feste'];
  const list = EVENTS.filter((e) => S.evf === 'Tutti' || e.cat === S.evf);
  const podium = [['1°','#2B6CC4'],['2°','#C2362B'],['3°','#B08400']];
  return `
  <div><h1 style="font-size:28px">Gare ed eventi</h1><p class="muted">Concorsi sociali, stage e feste qui in azienda.</p></div>
  <div class="pills" role="group" aria-label="Filtra eventi">${cats.map((c) => `<button class="pill" aria-pressed="${S.evf === c}" onclick="set({evf:'${c}'})">${c}</button>`).join('')}</div>
  <div class="list">${list.map((e) => { const d = fromIso(e.date); const on = !!S.joined[e.id]; const [bg, ink] = TINT[e.tint]; return `
    <div class="card" style="flex-direction:row;gap:14px">
      <div class="datebox" style="background:${bg};color:${ink}">${WD[d.getDay()].toUpperCase()}<span class="serif">${d.getDate()}</span>${MO[d.getMonth()].toUpperCase()}</div>
      <div style="display:flex;flex-direction:column;gap:6px;flex:1;min-width:0">
        <span class="tag" style="background:${bg};color:${ink}">${e.badge}</span>
        <span class="serif" style="font-size:17px;line-height:1.2">${e.title}</span>
        <p class="muted" style="font-size:13px">${e.info}</p>
        ${D.me.role === 'admin' ? '' : `<button class="btn ghost ${on ? 'on' : ''}" onclick="joinEv('${e.id}')">${on ? 'Iscritto' : 'Iscriviti'}</button>`}
      </div>
    </div>`; }).join('')}</div>
  ${sec('Ultimo concorso sociale', IC.rosette)}
  <div class="card" style="padding:6px 16px">${podium.map(([p, c]) => `
    <div class="podium">${svg(IC.rosette, 32, c, 2.1)}<span class="serif" style="font-size:18px;width:30px">${p}</span><div style="display:flex;flex-direction:column"><span style="font-weight:800;font-size:14px">[NOME ALLIEVO]</span><span class="muted" style="font-size:13px">in sella a [CAVALLO]</span></div></div>`).join('')}
  </div>`;
}
window.joinEv = (id) => { const on = !S.joined[id]; set({ joined: { ...S.joined, [id]: on } }); toast(on ? 'Iscrizione segnata: ci vediamo in campo!' : 'Iscrizione tolta'); };

function vFamiglie() {
  const docs = ['Liberatoria attività equestre','Consenso foto','Scheda sanitaria e allergie'];
  return `
  <h1 style="font-size:28px">Per le famiglie</h1>
  <div class="card" style="background:var(--t-green);border-color:transparent;position:relative;overflow:hidden">
    ${svg(IC.boot, 86, '#1E8E3E', 1.3, 'style="position:absolute;right:10px;bottom:8px;opacity:.45"')}
    <span class="tag" style="background:#fff;color:var(--i-green)">Campi estivi 2027</span>
    <span class="serif" style="font-size:22px">Una settimana in fattoria</span>
    <p class="muted" style="color:#1F4D2A;max-width:230px">Cavalli, animali e giochi all’aria aperta, con Pamela.</p>
    <button class="btn" onclick="set({camp:!S.camp});toast(S.camp?'Pre-iscrizione segnata':'Pre-iscrizione tolta')">${S.camp ? 'Pre-iscritto ✓' : 'Pre-iscrivi tuo figlio'}</button>
  </div>
  <div class="card">
    <span class="serif" style="font-size:17px">Documenti da compilare</span>
    ${docs.map((d, i) => `<label class="check"><input type="checkbox" ${S.docs[i] ? 'checked' : ''} onchange="S.docs={...S.docs,[${i}]:this.checked};saveUI()">${d}</label>`).join('')}
  </div>
  <div class="card"><span class="serif" style="font-size:17px">Le foto di oggi</span><div class="photos"><div>Foto</div><div>Foto</div><div>Foto</div></div></div>
  <div class="card" style="background:var(--t-sky);border-color:transparent">
    <span class="serif" style="font-size:19px">Una festa di compleanno in fattoria</span>
    <p class="muted" style="color:#173F5C">Pony, animali e merenda per un pomeriggio speciale. [PREZZO]</p>
    <button class="btn sun" onclick="farmSheet('festa')">${svg(IC.cake, 20)}Scopri la festa</button>
  </div>`;
}

function vFattoria() {
  return `
  <div><h1 style="font-size:28px">La nostra fattoria</h1><p class="muted">Un pezzo di Valtravaglia, anche da casa.</p></div>
  <div class="card" style="background:var(--t-green);border-color:transparent">
    <span class="serif" style="font-size:19px">Orari e contatti</span>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:14px;font-weight:600">
      <span>Lunedì</span><span>Chiuso</span><span>Mar – Ven</span><span>14:00 – 19:30</span><span>Sabato</span><span>15:00 – 19:30</span><span>Domenica</span><span>9:00 – 13:00</span>
    </div>
    <p class="muted" style="color:#1F4D2A">Via Ticinallo 15, 21010 Porto Valtravaglia (VA)</p>
    <a class="btn" href="tel:+393336324168" style="text-decoration:none">Chiama 333 632 4168</a>
  </div>
  <button class="listbtn" style="background:var(--t-yellow);border-color:transparent" onclick="set({sub:'cavalli'})">${bubble(IC.reins, 'sky')}<div style="flex:1"><b>I nostri cavalli</b><span style="color:#5A4300">Nomi, età, carattere e foto</span></div>${svg(IC.chev, 18, 'var(--muted)')}</button>
  <div class="list">${FARM.map((f) => `<button class="listbtn" onclick="farmSheet('${f.id}')">${bubble(f.d, f.tint)}<div style="flex:1"><b>${f.title}</b><span>${f.sub}</span></div>${svg(IC.chev, 18, 'var(--muted)')}</button>`).join('')}</div>`;
}
window.farmSheet = (id) => {
  const f = id === 'festa' ? { id, title:'Festa di compleanno in fattoria', d:IC.cake, tint:'sky', text:'Un pomeriggio con pony, animali della fattoria e merenda per il compleanno di tuo figlio e dei suoi amici.' } : FARM.find((x) => x.id === id);
  const on = !!S.interests[id];
  openSheet(`
    <div style="display:flex;align-items:center;gap:12px">${bubble(f.d, f.tint)}<h2 style="flex:1;font-size:22px">${f.title}</h2><button class="iconbtn" aria-label="Chiudi" onclick="closeSheet()">${svg(IC.x, 20)}</button></div>
    <p style="font-size:16px;line-height:1.5;margin:0">${f.text}</p>
    <p class="muted">Prezzi e disponibilità: [DA DEFINIRE]. Per informazioni chiama il 333 632 4168.</p>
    <button class="btn wide" onclick="S.interests={...S.interests,'${id}':!${on}};saveUI();closeSheet();toast(${on} ? 'Tolto dai tuoi interessi' : 'Segnato tra i tuoi interessi')">${on ? 'Togli dai miei interessi' : 'Mi interessa'}</button>`);
};

/* ---------- cavalli ---------- */
const ageOf = (b) => { if (!b) return null; const d = fromIso(b), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; };
const birthTxt = (b) => b ? (() => { const d = fromIso(b); return `${d.getDate()} ${MO[d.getMonth()]} ${d.getFullYear()} · ${ageOf(b)} anni`; })() : 'Nato il [DATA DI NASCITA]';
const horsePic = (h, hgt) => h.photo
  ? `<img src="${h.photo}" alt="Foto di ${esc(h.name)}" style="width:100%;height:${hgt}px;object-fit:cover;display:block">`
  : `<div role="img" aria-label="Foto in arrivo" style="height:${hgt}px;background:${TINT[h.tint][0]};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:${TINT[h.tint][1]};font-weight:800;font-size:13px">${svg(IC.shoe, hgt > 200 ? 64 : 44, 'currentColor', 1.6)}Foto in arrivo</div>`;
function vCavalli() {
  return `
  ${backBtn()}
  <div><h1 style="font-size:28px">I nostri cavalli</h1><p class="muted">Conosci i compagni di ogni lezione.</p></div>
  <div class="grid2">${HORSES.map((h) => `
    <button onclick="horseSheet('${h.id}')" style="padding:0;border:1px solid var(--line);border-radius:24px;background:var(--card);overflow:hidden;text-align:left;display:flex;flex-direction:column">
      ${horsePic(h, 130)}
      <div style="padding:12px 14px 14px;display:flex;flex-direction:column;gap:2px">
        <span class="serif" style="font-size:16px;line-height:1.2">${esc(h.name)}</span>
        <span style="font-size:12px;font-weight:700;color:var(--muted)">${h.birth ? ageOf(h.birth) + ' anni' : '[ETÀ]'} · ${esc(h.breed)}</span>
      </div>
    </button>`).join('')}</div>`;
}
window.horseSheet = (id) => {
  const h = HORSES.find((x) => x.id === id); const [bg, ink] = TINT[h.tint];
  openSheet(`
    <div style="display:flex;align-items:center;gap:12px"><h2 style="flex:1;font-size:24px">${esc(h.name)}</h2><button class="iconbtn" aria-label="Chiudi" onclick="closeSheet()">${svg(IC.x, 20)}</button></div>
    <div style="border-radius:22px;overflow:hidden">${horsePic(h, 230)}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="tag" style="background:${bg};color:${ink}">${birthTxt(h.birth)}</span><span class="tag" style="background:${bg};color:${ink}">${esc(h.sex)}</span></div>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 14px;font-size:14px"><b>Razza</b><span>${esc(h.breed)}</span><b>Mantello</b><span>${esc(h.coat)}</span><b>Ideale per</b><span>${esc(h.role)}</span></div>
    <p style="font-size:16px;line-height:1.5;margin:0">${esc(h.text)}</p>
    <button class="btn wide" onclick="closeSheet();farmSheet('adotta')">${svg(IC.heart, 20, '#fff')}Adotta ${esc(h.name)}</button>`);
};

/* ---------- news ---------- */
function vNews() {
  return `
  ${backBtn()}
  <div style="display:flex;align-items:flex-end;gap:10px"><div style="flex:1"><h1 style="font-size:28px">News dalla scuderia</h1><p class="muted">Gli aggiornamenti importanti, tutti qui.</p></div>
  ${unread().length ? `<button class="pill" onclick="markAll()">Segna tutte lette</button>` : ''}</div>
  <div class="list">${NEWS.map((n) => { const d = fromIso(n.date); const [bg, ink] = TINT[n.tint]; const isNew = !S.read[n.id]; return `
    <article class="card" style="${n.important ? 'border:2px solid #E86A2C;' : ''}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="tag" style="background:${bg};color:${ink}">${n.cat}</span>
        ${isNew ? '<span class="tag" style="background:#E86A2C;color:#2B1D12">Nuovo</span>' : ''}
        <span style="margin-left:auto;font-size:12px;font-weight:800;color:var(--muted)">${d.getDate()} ${MO[d.getMonth()]}</span>
      </div>
      <h2 class="serif" style="font-size:18px;line-height:1.25">${n.title}</h2>
      <p class="muted" style="color:#4A382B;line-height:1.5">${n.text}</p>
      ${isNew ? `<button class="btn ghost" onclick="set({read:{...S.read,'${n.id}':true}})">Ho letto</button>` : ''}
    </article>`; }).join('')}</div>`;
}
window.markAll = () => { const r = { ...S.read }; NEWS.forEach((n) => (r[n.id] = true)); set({ read: r }); toast('Sei in pari con le news'); };

/* ---------- AREA RISERVATA (gestori) ---------- */
function adminModel() {
  const A = D.admin; const clients = A.profiles.filter((p) => p.role !== 'admin');
  const byUser = {};
  clients.forEach((p) => { byUser[p.id] = { ...p, info: carnetInfo(A.carnets.filter((c) => c.user_id === p.id), A.bookings.filter((b) => b.user_id === p.id)) }; });
  return { clients: Object.values(byUser).sort((a, b) => a.name.localeCompare(b.name)), byUser, nameOf: (id) => (byUser[id] || A.profiles.find((p) => p.id === id) || { name: '?' }).name };
}
function vAgenda() {
  const M = adminModel();
  const days = [...openDays(-7, 20)].filter((d, i, arr) => arr.findIndex((x) => iso(x) === iso(d)) === i);
  const tIso = todayIso();
  let sel = S.aday && days.some((d) => iso(d) === S.aday) ? S.aday : (days.find((d) => iso(d) >= tIso) ? iso(days.find((d) => iso(d) >= tIso)) : iso(days[0]));
  const day = fromIso(sel);
  const dayB = D.admin.bookings.filter((b) => b.day === sel);
  const slots = [...slotsFor(day), ...(dayB.some((b) => b.slot === 'extra') ? ['extra'] : [])];
  const todayCount = D.admin.bookings.filter((b) => b.day === tIso && b.status !== 'annullata').length;
  const toRenew = M.clients.filter((c) => c.info.remaining <= 2).length;
  const toStamp = D.admin.bookings.filter((b) => b.status === 'prenotata' && isPast(b.day, b.slot)).length;
  const statusChip = (s) => ({ prenotata: ['Prenotato', 'var(--t-sky)', 'var(--i-sky)'], svolta: ['Timbrato ✓', 'var(--t-green)', 'var(--i-green)'], assente: ['Assente', 'var(--t-pink)', 'var(--i-pink)'] }[s]);
  return `
  <div style="display:flex;align-items:center;gap:10px"><div style="flex:1"><span class="tag" style="background:var(--t-yellow);color:var(--i-yellow)">Area riservata</span><h1 style="font-size:28px;margin-top:6px">Agenda lezioni</h1></div></div>
  <div class="stats">
    <div class="stat"><b>${todayCount}</b><span>cavalieri oggi</span></div>
    <div class="stat" style="${toStamp ? 'border-color:#E86A2C' : ''}"><b>${toStamp}</b><span>lezioni da timbrare</span></div>
    <button class="stat" style="text-align:left;${toRenew ? 'border-color:#C2362B' : ''}" onclick="set({tab:'allievi',sub:null})"><b>${toRenew}</b><span>carnet da rinnovare</span></button>
  </div>
  <div class="days" role="group" aria-label="Giorno">${days.map((d) => `<button class="day" aria-pressed="${iso(d) === sel}" aria-label="${fmtLong(d)}" onclick="set({aday:'${iso(d)}'})" style="${iso(d) === tIso && iso(d) !== sel ? 'border:2px solid var(--green)' : ''}">${iso(d) === tIso ? 'Oggi' : WD[d.getDay()]}<span class="serif">${d.getDate()}</span></button>`).join('')}</div>
  <p class="muted" style="font-weight:700">${cap(fmtLong(day))}</p>
  ${slots.map((t) => { const rs = dayB.filter((b) => b.slot === t); return `
  <div class="card">
    <div style="display:flex;align-items:center;gap:10px"><span class="serif" style="font-size:20px;flex:1">${t === 'extra' ? 'Timbri fuori agenda' : t + ' – ' + endOf(t)}</span>${t === 'extra' ? '' : `<span class="chip" style="background:${rs.length >= MAX ? 'var(--t-orange)' : 'var(--t-green)'};color:${rs.length >= MAX ? 'var(--i-orange)' : 'var(--i-green)'}">${rs.length}/${MAX}</span>`}</div>
    ${rs.length ? rs.map((b) => { const [lab, bg, ink] = statusChip(b.status); const inf = M.byUser[b.user_id]; return `
      <div class="rider">
        <span class="nm">${esc(M.nameOf(b.user_id))}<br><small style="font-weight:700;color:${inf && inf.info.remaining <= 2 ? '#9C2A20' : 'var(--muted)'}">${inf ? 'Carnet: restano ' + inf.info.remaining : ''}</small></span>
        <span class="chip" style="background:${bg};color:${ink}">${lab}</span>
        ${b.status === 'svolta' ? `<button class="small warn" onclick="adm('unstamp',${b.id})">Togli timbro</button>`
          : `<button class="small fill" onclick="adm('stamp',${b.id})">Timbra</button>${b.status === 'prenotata' ? `<button class="small" onclick="adm('absent',${b.id})">Assente</button>` : ''}`}
      </div>`; }).join('') : `<p class="muted">Nessuna prenotazione</p>`}
  </div>`; }).join('')}`;
}
window.adm = (what, id) => {
  if (what === 'stamp') return run(() => API.stamp(id), 'Timbro messo sul carnet');
  if (what === 'unstamp') return run(() => API.setStatus(id, 'prenotata'), 'Timbro tolto');
  if (what === 'absent') return run(() => API.setStatus(id, 'assente'), 'Segnato assente');
};

function vAllievi() {
  const M = adminModel();
  const sorted = M.clients.slice().sort((a, b) => a.info.remaining - b.info.remaining || a.name.localeCompare(b.name));
  return `
  <div><span class="tag" style="background:var(--t-yellow);color:var(--i-yellow)">Area riservata</span><h1 style="font-size:28px;margin-top:6px">Allievi e carnet</h1><p class="muted">In alto chi ha il carnet quasi finito.</p></div>
  <input class="search" type="search" placeholder="Cerca un allievo" aria-label="Cerca un allievo" oninput="const q=this.value.toLowerCase();document.querySelectorAll('[data-nm]').forEach(e=>e.style.display=e.dataset.nm.includes(q)?'':'none')">
  <div class="list">${sorted.map((c) => { const r = c.info.remaining; const col = r === 0 ? '#9C2A20' : r <= 2 ? '#A2440F' : 'var(--green-d)'; return `
    <button class="listbtn" data-nm="${esc(c.name.toLowerCase())}" onclick="clientSheet('${c.id}')">
      <div style="flex:1;display:flex;flex-direction:column;gap:6px"><b>${esc(c.name)}</b>${miniCarnet(c.info.current)}<span style="color:${col};font-weight:800">${r === 0 ? 'Carnet finito: da rinnovare' : 'Restano ' + r + ' lezion' + (r === 1 ? 'e' : 'i')}${c.info.upcoming.length ? ' · ' + c.info.upcoming.length + ' prenotat' + (c.info.upcoming.length === 1 ? 'a' : 'e') : ''}</span></div>
      ${svg(IC.chev, 18, 'var(--muted)')}
    </button>`; }).join('') || '<p class="muted">Ancora nessun allievo registrato.</p>'}</div>`;
}
window.clientSheet = (id) => {
  const c = adminModel().byUser[id]; if (!c) return;
  const i = c.info;
  openSheet(`
    <div style="display:flex;align-items:center;gap:12px"><h2 style="flex:1;font-size:22px">${esc(c.name)}</h2><button class="iconbtn" aria-label="Chiudi" onclick="closeSheet()">${svg(IC.x, 20)}</button></div>
    ${c.email ? `<p class="muted">${esc(c.email)}</p>` : ''}
    ${carnetCard(i.current, c.name, i.carnets.indexOf(i.current) + 1)}
    <div class="stats"><div class="stat"><b>${i.remaining}</b><span>rimaste</span></div><div class="stat"><b>${i.upcoming.length}</b><span>prenotate</span></div><div class="stat"><b>${i.carnets.length}</b><span>carnet in tutto</span></div></div>
    ${i.upcoming.length ? `<b>Prossime lezioni</b>${i.upcoming.map((b) => `<span style="font-size:14px">${cap(fmtLong(fromIso(b.day)))} · ${b.slot}</span>`).join('')}` : ''}
    <button class="btn wide" onclick="closeSheet();run(()=>API.manualStamp('${id}'),'Timbro di oggi messo sul carnet')">${svg(IC.shoe, 20, '#fff')}Timbra una lezione di oggi</button>
    <button class="btn sun wide" onclick="closeSheet();run(()=>API.newCarnet('${id}',10),'Nuovo carnet da 10 attivato')">Nuovo carnet da 10 (pagato)</button>`);
};

function vProfile() {
  openSheet(`
    <div style="display:flex;align-items:center;gap:12px"><h2 style="flex:1;font-size:22px">${esc(D.me.name)}</h2><button class="iconbtn" aria-label="Chiudi" onclick="closeSheet()">${svg(IC.x, 20)}</button></div>
    <p class="muted">${esc(D.me.email || '')}${D.me.role === 'admin' ? ' · gestore' : ''}</p>
    <button class="btn ghost wide" onclick="closeSheet();logout()">Esci</button>
    ${ONLINE ? '' : `<button class="btn ghost wide" onclick="closeSheet();DemoAPI.reset();logout()">Azzera i dati di prova</button>`}`);
}
window.logout = async () => { await API.signOut(); D.me = null; S.sub = null; saveUI(); render(); };

/* ---------- disegno della pagina ---------- */
const TABS_CLIENT = [['home','Casa',IC.home],['prenota','Prenota',IC.helmet],['gare','Gare',IC.rosette],['famiglie','Famiglie',IC.family],['fattoria','Fattoria',IC.farm]];
const TABS_ADMIN = [['agenda','Agenda',IC.cal],['allievi','Allievi',IC.family],['home','Casa',IC.home],['gare','Gare',IC.rosette],['fattoria','Fattoria',IC.farm]];
function render() {
  const root = document.getElementById('root');
  if (D.loading) { root.innerHTML = '<div class="loading">Apro la scuderia…</div>'; return; }
  if (!D.me) { root.innerHTML = vLogin(); return; }
  const admin = D.me.role === 'admin';
  const tabs = admin ? TABS_ADMIN : TABS_CLIENT;
  if (!tabs.some(([id]) => id === S.tab)) S.tab = admin ? 'agenda' : 'home';
  const views = { home: vHome, prenota: vPrenota, gare: vGare, famiglie: vFamiglie, fattoria: vFattoria, agenda: vAgenda, allievi: vAllievi };
  const sub = { news: vNews, carnet: vCarnet, cavalli: vCavalli }[S.sub];
  const view = sub ? sub() : views[S.tab]();
  const n = unread().length;
  root.innerHTML = `
  <div class="app">
    <header class="top">
      <img src="${LOGO}" alt="Logo Azienda Agricola dei Laghetti">
      <div class="brand"><small>Azienda Agricola</small><b>dei Laghetti ${svg(IC.shoe, 18, 'var(--green)', 2.2)}</b></div>
      <button class="iconbtn" style="position:relative" aria-label="News${n ? ', ' + n + ' da leggere' : ''}" onclick="set({sub:'news'})">${svg(IC.bell, 20)}${n ? `<span aria-hidden="true" style="position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#E86A2C;color:#2B1D12;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;padding:0 5px">${n}</span>` : ''}</button>
      <button class="iconbtn" aria-label="Profilo" onclick="vProfile()">${svg(IC.user, 20)}</button>
    </header>
    <main>${view}</main>
    <nav class="tabs" aria-label="Navigazione principale">${tabs.map(([id, l, d]) => `<button aria-current="${S.tab === id && !S.sub ? 'page' : 'false'}" onclick="set({tab:'${id}',sub:null});scrollTo(0,0)">${svg(d, 22)}<span>${l}</span></button>`).join('')}</nav>
  </div>`;
}

/* ---------- avvio ---------- */
(async () => {
  try { API.load(); } catch (e) { toast('Archivio non raggiungibile'); }
  if (ONLINE) SupaAPI.sb.auth.onAuthStateChange(() => {});
  await refresh();
})();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
