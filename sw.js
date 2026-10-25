/* TopoR Trip: funciona sin conexión */
const V='toportrip-v2';
const CORE=["./", "index.html", "topor-trip.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "fonts/noto-serif-latin-600-normal.woff2", "fonts/noto-serif-latin-700-normal.woff2", "fonts/outfit-latin-400-normal.woff2", "fonts/outfit-latin-500-normal.woff2", "fonts/outfit-latin-600-normal.woff2", "fonts/outfit-latin-700-normal.woff2", "images/beijing_south.jpg", "images/bund.jpg", "images/byd.jpg", "images/civic.jpg", "images/cufe.jpg", "images/embassy.jpg", "images/forbidden.jpg", "images/huaqiangbei.jpg", "images/iflytek.jpg", "images/lenovo.jpg", "images/mutianyu2.jpg", "images/pek2.jpg", "images/pvg.jpg", "images/shenzhen.jpg", "images/shenzhen_north.jpg", "images/shenzhenbay.jpg", "images/szu.jpg", "images/szx.jpg", "images/talent.jpg", "images/temple.jpg", "images/tiananmen.jpg", "images/uibe.jpg", "images/wall.jpg", "images/wangfujing.jpg", "images/yu.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='toportrip-ext').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // Archivos propios: responde con lo guardado y actualiza en segundo plano
    e.respondWith(caches.open(V).then(c=>c.match(r,{ignoreSearch:true}).then(hit=>{
      const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>hit||c.match('index.html'));
      return hit||net;})));
  }else if(/wikipedia\.org|wikimedia\.org|open-meteo\.com|er-api\.com/.test(u.hostname)){
    // Fotos, clima y tasas: primero internet, si no hay, lo último guardado
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open('toportrip-ext').then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r)));
  }
});
