// Shared helpers for every page (Hebrew and English): Meta Pixel, business
// details, contact buttons. You shouldn't need to edit this file - settings
// live in config.js.
(function () {
  var C = window.SITE_CONFIG || {};
  var html = document.documentElement;
  var isHe = (html.lang || '').indexOf('he') === 0;
  // Pages in a subfolder (en/) set data-root="../" so media paths still work.
  var ROOT = html.getAttribute('data-root') || '';
  var filled = function (v) { return v && String(v).indexOf('[') === -1; };

  window.SITE_LANG = isHe ? 'he' : 'en';
  // Read a setting, preferring the Hebrew one (KEY_HE) on Hebrew pages.
  var cfg = window.cfg = function (key) { return (isHe && C[key + '_HE']) || C[key]; };
  // Turn a config.js media path into one that works from this page's folder.
  window.asset = function (path) { return path && !/^(https?:|\/)/.test(path) ? ROOT + path : path; };

  // ---------------- Meta Pixel ----------------
  // Loads only when META_PIXEL_ID is set in config.js.
  window.track = function () {}; // no-op until the pixel loads
  if (C.META_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.META_PIXEL_ID);
    fbq('track', 'PageView');
    window.track = function (event, data) { fbq('track', event, data || {}); };
  }

  // ---------------- Contact links (built once from config.js) ----------------
  var q = encodeURIComponent(C.ADDRESS || '');
  var waText = cfg('WHATSAPP_TEXT');
  var links = window.SITE_LINKS = {
    call: C.PHONE_INTL ? 'tel:' + C.PHONE_INTL : '',
    whatsapp: C.WHATSAPP_NUMBER ? 'https://wa.me/' + C.WHATSAPP_NUMBER +
      (waText ? '?text=' + encodeURIComponent(waText) : '') : '',
    maps: filled(C.ADDRESS) ? 'https://www.google.com/maps/search/?api=1&query=' + q : '',
    waze: filled(C.ADDRESS) ? 'https://waze.com/ul?q=' + q + '&navigate=yes' : ''
  };
  var L = isHe
    ? { call: 'התקשרו', whatsapp: 'וואטסאפ', maps: 'Google Maps', waze: 'Waze' }
    : { call: 'Call', whatsapp: 'WhatsApp', maps: 'Google Maps', waze: 'Waze' };
  var phone = '<span dir="ltr">' + (C.PHONE_DISPLAY || '') + '</span>';

  function contactButtons(small) {
    var cls = small ? 'contact-link' : 'btn contact-btn';
    var out = [];
    if (links.call) out.push('<a class="' + cls + '" href="' + links.call + '" data-ev="Contact">' + L.call + ' ' + phone + '</a>');
    if (links.whatsapp) out.push('<a class="' + cls + (small ? '' : ' btn-wa') + '" href="' + links.whatsapp + '" target="_blank" rel="noopener" data-ev="Contact">' + L.whatsapp + '</a>');
    if (links.maps) out.push('<a class="' + cls + (small ? '' : ' btn-ghost') + '" href="' + links.maps + '" target="_blank" rel="noopener">' + L.maps + '</a>');
    if (links.waze) out.push('<a class="' + cls + (small ? '' : ' btn-ghost') + '" href="' + links.waze + '" target="_blank" rel="noopener">' + L.waze + '</a>');
    return out.join(small ? ' · ' : '');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Fill in business details wherever the page asks for them (data-config="KEY").
    document.querySelectorAll('[data-config]').forEach(function (el) {
      var v = cfg(el.getAttribute('data-config'));
      if (v) el.textContent = v;
    });
    if (!isHe && filled(C.PRACTICE_NAME)) {
      document.title = document.title.replace('Holistic Massage', C.PRACTICE_NAME);
    }

    // <div data-contact></div> → big buttons;  <span data-contact="small"></span> → text links
    document.querySelectorAll('[data-contact]').forEach(function (el) {
      el.innerHTML = contactButtons(el.getAttribute('data-contact') === 'small');
    });

    // Tell Facebook when someone taps Call / WhatsApp.
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-ev]');
      if (a) window.track(a.getAttribute('data-ev'));
    });

    // Floating WhatsApp button.
    if (links.whatsapp && !document.body.classList.contains('no-wa-float')) {
      var a = document.createElement('a');
      a.className = 'wa-float';
      a.href = links.whatsapp;
      a.target = '_blank';
      a.rel = 'noopener';
      a.setAttribute('data-ev', 'Contact');
      a.setAttribute('aria-label', isHe ? 'שליחת הודעה בוואטסאפ' : 'Message on WhatsApp');
      a.textContent = '' + L.whatsapp;
      document.body.appendChild(a);
    }
  });
})();
