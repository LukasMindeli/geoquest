window.lang='ru';
window.t = function(ru,en){return lang==='ru'?ru:en;}
window.cName = function(id){return lang==='ru'?(COUNTRIES[id]?.n||String(id)):(EN[id]||COUNTRIES[id]?.n||String(id));}
window.capName = function(id){if(!CAPITALS[id])return'?';return lang==='ru'?CAPITALS[id][0]:CAPITALS[id][1];}
// Big countries get bigger labels
window.BIG_C=new Set([643,840,36,76,124,156,356]);
window.SMALL_C=new Set([56,196,442,705,703,191,372,376,51,196,470,492,438]);

// Centroids (lat, lng) per country — computed from data, here hardcoded for key ones
// will be computed dynamically from GeoJSON

// ═══════════════════════════════════════════════════════════════
//  THREE.JS
// ═══════════════════════════════════════════════════════════════
