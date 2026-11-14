// Landing page logic, shared by the Hebrew (index.html) and English (en/index.html)
// pages: photos/videos from config.js, "next available slot", the details form,
// the booking step (Google Calendar appointment schedule) and the payment step.
(function () {
  var C = window.SITE_CONFIG;
  var he = window.SITE_LANG === 'he';
  var $ = function (id) { return document.getElementById(id); };

  var T = he ? {
    errName: 'נא למלא שם מלא.',
    errPhone: 'נא למלא מספר טלפון שאפשר לחזור אליו.',
    errEmail: 'נא לבדוק את כתובת האימייל.',
    hello: function (first) { return 'תודה, ' + first + ' - עכשיו בוחרים מועד'; },
    payBtn: 'קבעתי - לתשלום <span class="arr">←</span>',
    calendarTitle: 'יומן קביעת תורים',
    heroAlt: 'עמית מעסה את גב המטופלת', aboutAlt: 'עמית קליסקר', photoAlt: 'טיפול בקליניקה',
    days: ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'מוצ"ש']
  } : {
    errName: 'Please enter your full name.',
    errPhone: 'Please enter a phone number we can reach you on.',
    errEmail: 'Please check your email address.',
    hello: function (first) { return 'Thanks, ' + first + ', now choose a time'; },
    payBtn: 'I\'ve booked - pay now <span class="arr">→</span>',
    calendarTitle: 'Booking calendar',
    heroAlt: 'Amit massaging a client\'s back', aboutAlt: 'Amit Kaliskar', photoAlt: 'Treatment at the clinic',
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday night']
  };

  // ---------- Media from config.js ----------
  var A = window.asset;
  var img = function (src, alt) { return '<img src="' + A(src) + '" alt="' + alt + '" loading="lazy">'; };
  if (C.HERO_VIDEO) {
    $('hero-media').innerHTML = '<video autoplay muted loop playsinline preload="metadata"' +
      (C.HERO_IMAGE ? ' poster="' + A(C.HERO_IMAGE) + '"' : '') + '><source src="' + A(C.HERO_VIDEO) + '" type="video/mp4"></video>';
  } else if (C.HERO_IMAGE) {
    // Vertical photo on phones, wide photo on bigger screens.
    $('hero-media').innerHTML = '<picture>' +
      (C.HERO_IMAGE_MOBILE ? '<source media="(max-width: 700px)" srcset="' + A(C.HERO_IMAGE_MOBILE) + '">' : '') +
      '<img src="' + A(C.HERO_IMAGE) + '" alt="' + T.heroAlt + '" fetchpriority="high"></picture>';
  }
  if (C.ABOUT_PHOTO && $('about-photo')) $('about-photo').innerHTML = img(C.ABOUT_PHOTO, T.aboutAlt);
  // Session video: plays muted on a loop, with a pause/play button.
  // Visitors who turned on "reduce motion" on their device only see the poster image.
  if ($('session-video')) {
    var v = $('session-video'), btn = $('video-toggle');
    var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!C.SESSION_VIDEO && !C.SESSION_VIDEO_POSTER) {
      $('video-wrap').remove();
    } else {
      if (C.SESSION_VIDEO_POSTER) v.poster = A(C.SESSION_VIDEO_POSTER);
      if (C.SESSION_VIDEO && !calm) {
        v.src = A(C.SESSION_VIDEO);
        var L = he ? { pause: 'השהיית הסרטון', play: 'הפעלת הסרטון' } : { pause: 'Pause video', play: 'Play video' };
        var ICON_PAUSE = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" fill="currentColor"/><rect x="9.5" y="2" width="3.5" height="12" fill="currentColor"/></svg>';
        var ICON_PLAY = '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2l10 6-10 6z" fill="currentColor"/></svg>';
        var show = function () {
          btn.innerHTML = v.paused ? ICON_PLAY : ICON_PAUSE;
          btn.setAttribute('aria-label', v.paused ? L.play : L.pause);
        };
        v.addEventListener('play', show);
        v.addEventListener('pause', show);
        btn.addEventListener('click', function () { if (v.paused) v.play(); else v.pause(); });
        btn.hidden = false;
        var p = v.play();
        if (p && p.catch) p.catch(show); // autoplay blocked: show the play button
        show();
      }
    }
  }
  document.querySelectorAll('[data-session-photo]').forEach(function (el) {
    var src = (C.SESSION_PHOTOS || [])[+el.getAttribute('data-session-photo')];
    if (src) el.innerHTML = img(src, T.photoAlt); else el.remove();
  });

  // Video testimonials: any config.js TESTIMONIALS entry with a video is added
  // to the testimonials row, replacing the "video coming soon" placeholder.
  var vids = (C.TESTIMONIALS || []).filter(function (t) { return t.video; });
  if (vids.length && $('testis')) {
    var ph = $('testis').querySelector('.ph-video');
    if (ph) ph.remove();
    vids.forEach(function (t) {
      var quote = he ? t.quote_he : t.quote, name = he ? t.name_he : t.name;
      var card = document.createElement('div');
      card.className = 't';
      card.innerHTML = '<video controls playsinline preload="metadata"' + (t.poster ? ' poster="' + A(t.poster) + '"' : '') +
        '><source src="' + A(t.video) + '#t=0.5" type="video/mp4"></video>' +
        (quote && quote.indexOf('[') === -1 ? '<p>"' + quote + '"</p><span>- ' + (name || '') + '</span>' : '');
      $('testis').appendChild(card);
    });
  }

  // ---------- "Next available slot" (from OPENING_SLOTS in config.js) ----------
  (function () {
    var slots = C.OPENING_SLOTS || {};
    var earliest = Date.now() + (C.MIN_NOTICE_HOURS || 0) * 3600000;
    for (var i = 0; i < 21; i++) {
      var d = new Date(); d.setDate(d.getDate() + i);
      var times = slots[d.getDay()] || [];
      for (var j = 0; j < times.length; j++) {
        var hm = times[j].split(':');
        var at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), +hm[0], +hm[1]);
        if (at.getTime() < earliest) continue;
        var text = T.days[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1) + ', ' + times[j];
        document.querySelectorAll('.js-next').forEach(function (e) { e.textContent = text; });
        return;
      }
    }
    // No hours set: hide the line.
    document.querySelectorAll('.next-slot').forEach(function (e) { e.remove(); });
  })();

  // ---------- Sticky mobile bar: WhatsApp link, hide while the booking form is on screen ----------
  if (window.SITE_LINKS && window.SITE_LINKS.whatsapp) {
    // WhatsApp links in the page (sticky bar, FAQ) use the number + message from config.js
    document.querySelectorAll('#sticky-wa, .js-wa').forEach(function (a) { a.href = window.SITE_LINKS.whatsapp; });
  }
  if ($('sticky') && 'IntersectionObserver' in window) {
    var seen = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen.set(e.target, e.isIntersecting); });
      var anyOn = false; seen.forEach(function (v) { if (v) anyOn = true; });
      $('sticky').classList.toggle('hide', anyOn);
    });
    var heroCta = document.querySelector('.hero .cta');
    if (heroCta) io.observe(heroCta);
    io.observe($('book'));
  }

  // "Prefer a female therapist?" link opens that FAQ answer
  document.querySelectorAll('.js-open-male').forEach(function (a) {
    a.addEventListener('click', function () { var d = $('faq-male'); if (d) d.open = true; });
  });

  // ---------- Focus cards: "Book" on a card remembers the chosen focus ----------
  document.querySelectorAll('[data-focus]').forEach(function (a) {
    a.addEventListener('click', function () {
      var f = a.getAttribute('data-focus');
      if (!$('focus-input')) return;
      $('focus-input').value = f;
      $('focus-name').textContent = f;
      $('focus-pick').hidden = false;
      window.track('ViewContent', { content_name: f });
    });
  });

  // ---------- Step 1: the details form ----------
  // Name and phone go to the clinic's engine (C.LEAD_ENDPOINT, the CRM). If nothing is booked within the
  // hour it writes on WhatsApp; once a booking shows up in the calendar it sends the payment link.
  // The details stay in this browser (localStorage) so the form is filled in on the next visit.
  // Google's booking form can't be filled in from here: it fills itself for people signed in to Google.
  var SAVED = 'kal_lead';
  var lead = {};
  try { lead = JSON.parse(localStorage.getItem(SAVED)) || {}; } catch (x) {}
  if ($('name') && lead.name) $('name').value = lead.name;
  if ($('phone') && lead.phone) $('phone').value = lead.phone;

  function setPay(url) {
    if (!url || !$('to-pay')) return;
    $('to-pay').href = url;
    $('to-pay').innerHTML = T.payBtn;
    $('to-pay').setAttribute('data-pay', '1');
    $('pay-note').hidden = false;
  }
  try { setPay(sessionStorage.getItem('payUrl')); } catch (x) {}

  if ($('lead-form')) $('lead-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('name').value.trim();
    var phone = $('phone').value.trim();
    var err = '';
    if (name.length < 2) err = T.errName;
    else if (phone.replace(/\D/g, '').length < 9) err = T.errPhone;
    $('form-error').textContent = err;
    if (err) return;

    var focus = $('focus-input') ? $('focus-input').value : '';
    lead = { name: name, phone: phone, focus: focus, lang: window.SITE_LANG, page: location.href, time: new Date().toISOString() };
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (q.get(k)) lead[k] = q.get(k); });
    try { localStorage.setItem(SAVED, JSON.stringify({ name: name, phone: phone })); } catch (x) {}
    try { sessionStorage.setItem('lead', JSON.stringify(lead)); } catch (x) {}

    window.track('Lead');

    if (C.LEAD_ENDPOINT) {
      var body = { client: C.LEAD_FORM_ID || 'amit-massage', flow: 'book', name: name, phone: phone, need: focus, website: $('website') ? $('website').value : '' };
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { if (lead[k]) body[k] = lead[k]; });
      try {
        fetch(C.LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            if (j && j.payUrl) { try { sessionStorage.setItem('payUrl', j.payUrl); } catch (x) {} setPay(j.payUrl); }
          })
          .catch(function () {});
      } catch (x) {}
    }
    if (C.LEAD_WEBHOOK_URL) {
      try { fetch(C.LEAD_WEBHOOK_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(lead) }); } catch (x) {}
    }
    showBooking();
  });

  if ($('back-btn')) $('back-btn').addEventListener('click', function () {
    $('booking-step').classList.remove('on');
    $('form-step').style.display = '';
    $('book-card').classList.remove('wide');
    if ($('bookwrap')) $('bookwrap').classList.remove('booking');
    $('p2').classList.remove('on');
    $('book').scrollIntoView({ behavior: 'smooth' });
  });

  // ---------- Step 2: the Google appointment calendar ----------
  if ($('booking-open') && C.BOOKING_LINK) $('booking-open').href = C.BOOKING_LINK;
  function loadCalendar() {
    if (!$('booking-embed') || $('booking-embed').querySelector('iframe') || !C.BOOKING_URL) return;
    var f = document.createElement('iframe');
    f.src = C.BOOKING_URL;
    f.title = T.calendarTitle;
    f.setAttribute('frameborder', '0');
    f.style.border = '0';
    f.width = '100%';
    f.height = '600';
    $('booking-embed').appendChild(f);
  }
  function showBooking() {
    $('form-step').style.display = 'none';
    $('booking-step').classList.add('on');
    $('book-card').classList.add('wide');
    if ($('bookwrap')) $('bookwrap').classList.add('booking'); // the calendar gets the full width
    $('p2').classList.add('on');
    $('booking-hello').textContent = T.hello(lead.name.split(' ')[0]);
    $('book').scrollIntoView({ behavior: 'smooth' });
    loadCalendar();
  }
  // Clicking any "book" button counts as starting a booking (for the ads)
  var started = false;
  document.querySelectorAll('a[href="#book"]').forEach(function (a) {
    a.addEventListener('click', function () { if (!started) { started = true; window.track('InitiateCheckout'); } });
  });

  // ---------- Step 3: pay ----------
  // With online payment set up, "I've booked" goes to this person's payment page; Morning then sends
  // them to paid.html. Without it, to thank-you.html as before.
  if ($('to-pay')) $('to-pay').addEventListener('click', function () {
    $('p3').classList.add('on');
    if ($('to-pay').getAttribute('data-pay')) window.track('AddPaymentInfo');
  });

  // Google doesn't tell this page when a booking is made: the engine sees it in the calendar
  // (every five minutes) and matches it to the details here by phone number.
})();
