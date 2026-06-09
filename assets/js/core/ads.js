(function () {
  const rawConfig = window.WOW_ADSENSE || {};
  const config = {
    client: typeof rawConfig.client === "string" ? rawConfig.client.trim() : "",
    slots: rawConfig.slots || {}
  };

  const clientOk = /^ca-pub-\d{10,}$/.test(config.client);
  let adsenseReady = false;
  let adsensePromise = null;
  let refreshQueued = false;

  function getSlotValue(key) {
    const value = config.slots && typeof config.slots[key] === "string" ? config.slots[key].trim() : "";
    return /^\d{6,}$/.test(value) ? value : "";
  }

  function ensureAdSenseScript() {
    if (!clientOk) return Promise.resolve(false);
    if (adsensePromise) return adsensePromise;

    adsensePromise = new Promise((resolve) => {
      let resolved = false;
      const finish = (ok) => {
        if (resolved) return;
        resolved = true;
        adsenseReady = !!ok;
        resolve(!!ok);
      };

      const existing = document.querySelector(
        'script[data-wow-adsense="1"], script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'
      );
      if (existing) {
        existing.dataset.wowAdsense = "1";
        if (window.adsbygoogle || existing.dataset.wowAdsenseLoaded === "1") {
          finish(true);
          return;
        }
        existing.addEventListener("load", function () {
          existing.dataset.wowAdsenseLoaded = "1";
          finish(true);
        }, { once: true });
        existing.addEventListener("error", function () {
          console.log("AdSense script failed to load.");
          finish(false);
        }, { once: true });
        setTimeout(function () {
          finish(!!window.adsbygoogle);
        }, 3000);
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(config.client);
      script.crossOrigin = "anonymous";
      script.dataset.wowAdsense = "1";
      script.onload = function () {
        script.dataset.wowAdsenseLoaded = "1";
        finish(true);
      };
      script.onerror = function () {
        console.log("AdSense script failed to load.");
        finish(false);
      };
      document.head.appendChild(script);
    });

    return adsensePromise;
  }

  function getSurfaceNode(container) {
    return container.closest("#main-menu, #result, #speed-result, .ov-panel");
  }

  function isSurfaceActive(surface) {
    if (!surface) return true;
    if (surface.id === "main-menu") return surface.classList.contains("show");
    if (surface.id === "result") return surface.classList.contains("show");
    if (surface.id === "speed-result") return surface.classList.contains("show");
    if (surface.classList.contains("ov-panel")) return surface.classList.contains("show");
    return true;
  }

  function buildAdElement(slotId) {
    const ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.style.display = "block";
    ins.setAttribute("data-ad-client", config.client);
    ins.setAttribute("data-ad-slot", slotId);
    ins.setAttribute("data-ad-format", "auto");
    ins.setAttribute("data-full-width-responsive", "true");
    return ins;
  }

  function renderSlot(container) {
    const slotKey = container.dataset.adSlotKey;
    const slotId = getSlotValue(slotKey);
    if (!slotId) return;
    if (container.dataset.adRendered === "1") {
      container.hidden = false;
      return;
    }

    const host = container.querySelector(".ad-slot");
    if (!host) return;

    host.innerHTML = "";
    host.appendChild(buildAdElement(slotId));
    container.hidden = false;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      container.dataset.adRendered = "1";
    } catch (err) {
      host.innerHTML = "";
      container.hidden = true;
      console.log("AdSense slot render failed:", err && err.message ? err.message : err);
    }
  }

  async function refreshAds() {
    refreshQueued = false;
    if (!clientOk) return;

    const loaded = await ensureAdSenseScript();
    if (!loaded || !adsenseReady) return;

    document.querySelectorAll(".ad-shell[data-ad-slot-key]").forEach((container) => {
      const slotId = getSlotValue(container.dataset.adSlotKey);
      if (!slotId) return;
      if (!isSurfaceActive(getSurfaceNode(container))) return;
      renderSlot(container);
    });
  }

  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    setTimeout(refreshAds, 60);
  }

  function initAds() {
    const shells = document.querySelectorAll(".ad-shell[data-ad-slot-key]");
    if (!clientOk) {
      shells.forEach((shell) => {
        shell.hidden = true;
      });
      return;
    }

    queueRefresh();
    const observer = new MutationObserver(queueRefresh);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"]
    });

    window.WOWAds = {
      config,
      refresh: queueRefresh
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds, { once: true });
  } else {
    initAds();
  }
})();
