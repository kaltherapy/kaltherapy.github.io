/* Accessibility menu: text size, contrast, links, readable font, stop motion.
   Settings are kept per visitor in this browser (localStorage) when allowed. */
(function () {
  var he = (document.documentElement.lang || "he").indexOf("he") === 0;
  var root = document.documentElement;
  var KEY = "a11y-prefs";
  var T = he ? {
    open: "תפריט נגישות", close: "סגירת תפריט הנגישות", title: "נגישות",
    bigger: "הגדלת טקסט", smaller: "הקטנת טקסט", contrast: "ניגודיות גבוהה",
    links: "הדגשת קישורים", font: "גופן קריא", still: "עצירת אנימציות",
    reset: "איפוס הגדרות", statement: "הצהרת נגישות", href: statementHref("accessibility.html")
  } : {
    open: "Accessibility menu", close: "Close accessibility menu", title: "Accessibility",
    bigger: "Larger text", smaller: "Smaller text", contrast: "High contrast",
    links: "Highlight links", font: "Readable font", still: "Stop animations",
    reset: "Reset settings", statement: "Accessibility statement", href: statementHref("accessibility.html")
  };

  function statementHref(file) {
    var s = document.currentScript && document.currentScript.getAttribute("src") || "";
    return s.replace(/a11y\.js.*$/, "") + (he ? "" : "en/") + file;
  }

  var prefs = { size: 0, contrast: false, links: false, font: false, still: false };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }

  function apply() {
    root.style.fontSize = prefs.size ? (100 + prefs.size * 12.5) + "%" : "";
    root.classList.toggle("a11y-contrast", prefs.contrast);
    root.classList.toggle("a11y-links", prefs.links);
    root.classList.toggle("a11y-font", prefs.font);
    root.classList.toggle("a11y-still", prefs.still);
    document.querySelectorAll("video").forEach(function (v) {
      if (prefs.still) { v.pause(); v.removeAttribute("autoplay"); }
    });
    document.querySelectorAll(".a11y-panel [aria-pressed]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(!!prefs[b.dataset.k]));
    });
  }
  apply();

  function build() {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "a11y-btn";
    btn.setAttribute("aria-label", T.open);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "a11y-panel");
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false"><circle cx="12" cy="4" r="2" fill="currentColor"/><path d="M4 8.5l8 1.5 8-1.5M12 10v5m0 0l-3.5 6.5M12 15l3.5 6.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var panel = document.createElement("div");
    panel.className = "a11y-panel";
    panel.id = "a11y-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", T.title);
    panel.hidden = true;
    panel.innerHTML =
      '<div class="a11y-head"><strong>' + T.title + '</strong><button type="button" class="a11y-x" aria-label="' + T.close + '">×</button></div>' +
      '<div class="a11y-row"><button type="button" data-act="bigger">A+ ' + T.bigger + '</button><button type="button" data-act="smaller">A− ' + T.smaller + '</button></div>' +
      '<button type="button" data-k="contrast" aria-pressed="false">' + T.contrast + '</button>' +
      '<button type="button" data-k="links" aria-pressed="false">' + T.links + '</button>' +
      '<button type="button" data-k="font" aria-pressed="false">' + T.font + '</button>' +
      '<button type="button" data-k="still" aria-pressed="false">' + T.still + '</button>' +
      '<button type="button" data-act="reset" class="a11y-reset">' + T.reset + '</button>' +
      '<a href="' + T.href + '">' + T.statement + '</a>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    var opener = btn;
    function toggle(open) {
      panel.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      if (open) panel.querySelector("button").focus(); else (opener.offsetParent ? opener : btn).focus();
      if (!open) opener = btn;
    }
    btn.addEventListener("click", function () { opener = btn; toggle(panel.hidden); });
    // Extra openers placed in the page (top bar and sticky bar on phones)
    document.querySelectorAll(".a11y-open").forEach(function (b) {
      b.setAttribute("aria-controls", "a11y-panel");
      b.addEventListener("click", function () { opener = b; toggle(panel.hidden); });
    });
    panel.querySelector(".a11y-x").addEventListener("click", function () { toggle(false); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
    panel.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b || b.classList.contains("a11y-x")) return;
      var act = b.dataset.act, k = b.dataset.k;
      if (act === "bigger") prefs.size = Math.min(prefs.size + 1, 4);
      else if (act === "smaller") prefs.size = Math.max(prefs.size - 1, 0);
      else if (act === "reset") prefs = { size: 0, contrast: false, links: false, font: false, still: false };
      else if (k) prefs[k] = !prefs[k];
      apply(); save();
    });
    apply();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
