// =====================================================================
//  SITE SETTINGS - the only file you need to edit to go live.
//  Used by both the Hebrew site (index.html) and English site (en/).
//  Change the text between the quotes, save, and re-upload.
//  Settings ending in _HE are the Hebrew version of the setting above them.
// =====================================================================
window.SITE_CONFIG = {
  // Google Calendar appointment schedule (booking page). See SETUP.md step 1.
  //   BOOKING_URL  = the full ".../appointments/schedules/..." link + "?gv=true"
  //                  (the version that can be shown inside the page)
  //   BOOKING_LINK = the short calendar.app.google link (opens in a new window)
  BOOKING_URL: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3nxgQSp6cRX1TVp7uZAtSZUdvROJUd9ihIQWt8GWodwRTHKtcLhX1RyDwLOn_ErqrqNaijx8Ns?gv=true",
  BOOKING_LINK: "https://calendar.app.google/AjBpTiq83HcScdmi9",

  // Session start times per day, used for the "next available slot" line on the page.
  // Keep in sync with the hours in the Google appointment schedule.
  // 0 = Sunday ... 5 = Friday, 6 = Saturday (night).
  // Note: this shows the next opening by these hours, not live availability.
  OPENING_SLOTS: {
    0: ["17:00", "18:15", "19:30"],
    5: ["09:00", "10:15", "11:30", "12:45", "14:00"],
    6: ["17:00", "18:15", "19:30", "20:45"],
  },
  // Don't offer a slot that starts sooner than this many hours from now
  // (match "Minimum time before booking" in the Google schedule).
  MIN_NOTICE_HOURS: 12,

  // Meta (Facebook) Pixel ID - a long number from Events Manager.
  // Leave "" until you have one. Example: "1234567890123456"
  META_PIXEL_ID: "1099556829737706",

  // IMPORTANT: where the form's name / phone / email go. Google's booking page
  // can't receive them, so without this you only see what people retype there.
  // Paste the Google Sheet web-app link from SETUP.md step 2 here.
  // Example: "https://script.google.com/macros/s/AKfy.../exec"
  LEAD_WEBHOOK_URL: "",

  // The booking form (index.html) and the landing page /lp/ send each lead
  // (name, phone, utm_*) here as JSON. It's the engine's /api/lead, which saves
  // it to the CRM. From the booking form it also answers with the person's
  // payment link (once Morning is connected), for the "pay" button.
  LEAD_ENDPOINT: "https://clinic-engine-seven.vercel.app/api/lead",
  LEAD_FORM_ID: "amit-massage",   // מזהה טופס in system/engine/client.json

  // ---------- Business details ----------
  PRACTICE_NAME: "[Practice Name]",
  THERAPIST_NAME: "Amit Kaliskar",
  THERAPIST_NAME_HE: "עמית קליסקר",
  SESSION_LENGTH_MINUTES: 75,
  ADDRESS: "Derech HaArava 48, Geva Carmel",
  ADDRESS_HE: "דרך הערבה 48, גבע כרמל",
  // Where to park, one short line (used by /lp/). Leave "" to hide it.
  PARKING: "",
  PARKING_HE: "",

  // Phone as people read it, and in international format for links.
  PHONE_DISPLAY: "053-208-3010",
  PHONE_INTL: "+972532083010",
  // WhatsApp: international format, digits only (no +, no spaces).
  WHATSAPP_NUMBER: "972532083010",
  // The message that's already typed when someone taps the WhatsApp button.
  WHATSAPP_TEXT: "Hi Amit, I'd like to ask about a massage session",
  WHATSAPP_TEXT_HE: "היי עמית, אשמח לשאול על טיפול",

  // ---------- Media ----------
  // Paths are from the main folder. Leave a slot "" to show a placeholder box.
  // Photos: use the web-sized copies in photos/web-massage/ (see photos/PHOTO-PICKS.md).
  HERO_VIDEO: "",            // e.g. "videos/hero.mp4" (short, silent, 10-20s loop)
  HERO_IMAGE: "photos/web-massage/massage-160.jpg",          // wide screens (also the video's poster)
  HERO_IMAGE_MOBILE: "photos/web-massage/massage-197-mobile.jpg",   // phones (vertical)
  ABOUT_PHOTO: "photos/web-massage/massage-031.jpg",
  SESSION_VIDEO: "videos/web/session-loop-720.mp4",          // vertical loop next to "How a session works" (poster only if the visitor prefers reduced motion)
  SESSION_VIDEO_POSTER: "videos/web/session-loop-poster.jpg",
  WHO_PHOTO: "",             // optional photo in "Who it's for", e.g. "photos/web-massage/massage-113.jpg"
  SESSION_PHOTOS: [          // the 3 "How a session works" steps
    "photos/web-massage/massage-103.jpg",   // 1. talk (Amit + client)
    "photos/web-massage/massage-057.jpg",   // 2. hands-on
    "photos/web-massage/massage-175.jpg",   // 3. neck & head
  ],
  TESTIMONIALS: [
    // Vertical 9:16 videos. poster = a still image shown before play (optional).
    // name / quote show under the video on the English site, name_he / quote_he on the Hebrew site.
    { video: "", poster: "", name: "[Client name]", quote: "[One line from their video]", name_he: "[שם, עיר]", quote_he: "[ציטוט קצר ממטופל/ת]" },
    { video: "", poster: "", name: "[Client name]", quote: "[One line from their video]", name_he: "[שם, עיר]", quote_he: "[ציטוט קצר ממטופל/ת]" },
    { video: "", poster: "", name: "[Client name]", quote: "[One line from their video]", name_he: "[שם, עיר]", quote_he: "[ציטוט קצר ממטופל/ת]" },
  ],
};
