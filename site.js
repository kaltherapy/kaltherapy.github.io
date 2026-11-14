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
      a.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';
      document.body.appendChild(a);
    }
  });
})();
