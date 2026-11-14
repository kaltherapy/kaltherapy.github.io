// Thank-you page logic, shared by thank-you.html (Hebrew) and en/thank-you.html.
// Visitors reach it from the "I've booked" link under the Google booking calendar.
// Google already emails a calendar invite, so the page greets them by name and
// reports "Schedule" to the Pixel. If a booking link ever adds event_start_time /
// event_end_time to the address, it also shows the time and "add to calendar" buttons.
(function () {
  var C = window.SITE_CONFIG;
  var he = window.SITE_LANG === 'he';
  var $ = function (id) { return document.getElementById(id); };
  var p = new URLSearchParams(location.search);

  var lead = {};
  try { lead = JSON.parse(sessionStorage.getItem('lead')) || {}; } catch (e) {}

  // If this person came from the English site, show the English thank-you page.
  if (he && lead.lang === 'en') { location.replace('en/thank-you.html' + location.search); return; }

  var T = he ? {
    title: function (first) { return 'התור נקבע, ' + first + '!'; },
    event: 'עיסוי הוליסטי - ' + (C.THERAPIST_NAME_HE || ''),
    details: 'נתראה! לשינוי מועד - הקישור במייל האישור.',
    alarm: 'עיסוי מחר', locale: 'he-IL', place: C.ADDRESS_HE || C.ADDRESS
  } : {
    title: function (first) { return "You're booked, " + first + '!'; },
    event: 'Holistic massage - ' + (C.THERAPIST_NAME || ''),
    details: 'See you soon. To reschedule, use the link in your confirmation email.',
    alarm: 'Massage tomorrow', locale: undefined, place: C.ADDRESS
  };

  var name = p.get('invitee_full_name') || lead.name || '';
  if (name) $('title').textContent = T.title(name.split(' ')[0]);

  // Count the booking in Facebook (only if the Pixel is set up).
  window.track('Schedule');
  window.track('Lead');   // the site form is gone: a finished booking is the lead

  // Only present if a booking tool adds them to the link.
  var start = p.get('event_start_time'), end = p.get('event_end_time');
  if (!start || isNaN(new Date(start))) { $('no-time').hidden = false; return; }
  start = new Date(start);
  end = end && !isNaN(new Date(end)) ? new Date(end) : new Date(start.getTime() + (C.SESSION_LENGTH_MINUTES || 75) * 60000);

  $('when').textContent = start.toLocaleString(T.locale, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  $('when').hidden = false;

  var place = T.place && T.place.indexOf('[') === -1 ? T.place : '';
  var fmt = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };

  $('gcal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(T.event) +
    '&dates=' + fmt(start) + '/' + fmt(end) +
    '&location=' + encodeURIComponent(place) +
    '&details=' + encodeURIComponent(T.details);

  var ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//massage//booking//EN', 'BEGIN:VEVENT',
    'UID:' + fmt(start) + '-' + Math.random().toString(36).slice(2) + '@massage',
    'DTSTAMP:' + fmt(new Date()), 'DTSTART:' + fmt(start), 'DTEND:' + fmt(end),
    'SUMMARY:' + T.event, 'LOCATION:' + place.replace(/,/g, '\\,'),
    'BEGIN:VALARM', 'TRIGGER:-PT24H', 'ACTION:DISPLAY', 'DESCRIPTION:' + T.alarm, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  $('ics').href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
  $('cal-buttons').hidden = false;
})();
