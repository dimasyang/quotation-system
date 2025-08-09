
// link-patch.js — unify navigation targets across RWD pages
(function(){
  const HOME_URL = "https://dimasyang.github.io/shrimp-sales-tool/";
  const CALC_URL = "https://dimasyang.github.io/shrimp-sales-tool/"; // 你要求前往這個連結

  function setHref(el, url){
    if (!el) return;
    el.setAttribute("href", url);
  }

  function fixById(){
    const idsToHome = ["btnHome","dockHome","homeLink","backHome","toHome"];
    idsToHome.forEach(id => { const a = document.getElementById(id); if (a && a.tagName === "A") setHref(a, HOME_URL); });

    const idsToCalc = ["btnToBonus","dockToBonus","goCalc","toCalc","calcLink","toBonus"];
    idsToCalc.forEach(id => { const a = document.getElementById(id); if (a && a.tagName === "A") setHref(a, CALC_URL); });
  }

  function fixByText(){
    const anchors = document.querySelectorAll("a");
    anchors.forEach(a => {
      const t = (a.textContent || "").trim();
      // 返回主頁 / 主頁 / 回首頁
      if (/返回主頁|主頁|回首頁/.test(t)) setHref(a, HOME_URL);
      // 前往計算獎金程式 / 前往獎金頁 / 計算獎金
      if (/計算獎金|前往獎金頁|前往計算獎金程式/.test(t)) setHref(a, CALC_URL);
    });
  }

  function fixByDataAttr(){
    document.querySelectorAll("[data-home-link]").forEach(a => setHref(a, HOME_URL));
    document.querySelectorAll("[data-calc-link]").forEach(a => setHref(a, CALC_URL));
  }

  function applyFix(){
    try{ fixById(); fixByText(); fixByDataAttr(); }catch(e){ console.warn("link-patch:", e); }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFix);
  } else {
    applyFix();
  }
})();
