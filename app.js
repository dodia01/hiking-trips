// Firebase – Realtime Database (trip data + comments structure for Plan C)
const firebaseConfig = {
  apiKey: 'AIzaSyAB3WqrRz1_-eyfauRGjSRFx5JktSB5wmg',
  authDomain: 'hiking-trips-697b7.firebaseapp.com',
  databaseURL: 'https://hiking-trips-697b7-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'hiking-trips-697b7',
  storageBucket: 'hiking-trips-697b7.firebasestorage.app',
  messagingSenderId: '768486377693',
  appId: '1:768486377693:web:770340507994a994fef334',
};

const FIREBASE_DATA_PATH = 'data';
const FIREBASE_CONFIG_KEY = 'config';
const FIREBASE_COMMENTS_KEY = 'comments';

let firebaseDb = null;
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    firebaseDb = firebase.database();
  } catch (e) {}
}

const appConfig = {
  appTitle: 'Hiking Trips',
  trips: [
    {
      id: 'mallorca-2025',
      label: 'Mallorca Hiking Trip',
      tripTitle: 'Mallorca Hiking Trip',
      tripSubtitle: 'Overview of our days, hikes, and places on the island.',
      footerNote: 'Click any activity above to jump to its full details.',
      days: [
    {
      id: 'day-1',
      label: 'Day 1',
      date: 'Arrival & Warm‑up',
      activities: [
        {
          id: 'welcome-walk-palma',
          type: 'hike',
          title: 'Palma coastal sunset walk',
          shortMeta: 'Easy 5–7 km along the promenade',
          description:
            'Gentle evening walk along the Palma waterfront to stretch our legs after travel. Easy terrain, cafés and viewpoints along the way.',
          thumbUrl:
            'https://images.pexels.com/photos/2404370/pexels-photo-2404370.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['Distance ~5–7 km', 'Mostly flat', 'Start ~18:00'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
        {
          id: 'check-in-hotel',
          type: 'stay',
          title: 'Check‑in & groceries',
          shortMeta: 'Drop bags, settle in, grab snacks',
          description:
            'Check into our accommodation, quick unpack, and a short walk to the closest supermarket to stock up on breakfast and hiking snacks.',
          thumbUrl:
            'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['Hotel check‑in', 'Grocery stop nearby'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
      ],
    },
    {
      id: 'day-2',
      label: 'Day 2',
      date: 'Tramuntana Ridge',
      activities: [
        {
          options: [
            {
              id: 'tramuntana-hike-a',
              type: 'hike',
              title: 'Puig de Galatzó loop',
              shortMeta: '~14 km, +900 m',
              description:
                'Classic loop from Galilea with steady climb and great views. Shaded sections in the middle.',
              thumbUrl:
                'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=800',
              extraMeta: ['~5–6 h', 'Moderate'],
              stravaEmbedHtml: null,
              mapsEmbedHtml: null,
            },
            {
              id: 'tramuntana-hike-b',
              type: 'hike',
              title: 'Sa Coma to S’Esclop',
              shortMeta: '~12 km, +750 m',
              description:
                'Ridge walk with sea views. Slightly shorter, good if we want an easier day.',
              thumbUrl:
                'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
              extraMeta: ['~4–5 h', 'Moderate'],
              stravaEmbedHtml: null,
              mapsEmbedHtml: null,
            },
          ],
        },
        {
          id: 'lunch-mountain-village',
          type: 'food',
          title: 'Lunch in mountain village',
          shortMeta: 'Tapas & coffee in a small square',
          description:
            'Post‑hike late lunch or early dinner in a small Tramuntana village. Relaxed pace, time for a short walk through the narrow streets.',
          thumbUrl:
            'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['Local tapas', 'Scenic streets'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
        {
          id: 'return-hotel-day2',
          type: 'transfer',
          title: 'Drive back to hotel',
          shortMeta: 'Scenic coastal drive',
          description: 'Return drive to our accommodation.',
          thumbUrl:
            'https://images.pexels.com/photos/210307/pexels-photo-210307.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['~45–60 min drive'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
      ],
    },
    {
      id: 'day-3',
      label: 'Day 3',
      date: 'Coast & Coves',
      activities: [
        {
          id: 'coastal-hike',
          type: 'hike',
          title: 'Coastal path to Cala Deià',
          shortMeta: '~8 km, sea views',
          description:
            'Scenic path along the coast with optional swim at Cala Deià. Easier day after the big ridge.',
          thumbUrl:
            'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['~3–4 h', 'Easy–moderate'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
        {
          options: [
            {
              id: 'dinner-deia',
              type: 'food',
              title: 'Dinner in Deià',
              shortMeta: 'Restaurant with terrace',
              description: 'Evening in Deià: one of the village restaurants with terrace views.',
              thumbUrl:
                'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800',
              extraMeta: ['Book ahead in season'],
              stravaEmbedHtml: null,
              mapsEmbedHtml: null,
            },
            {
              id: 'dinner-soller',
              type: 'food',
              title: 'Dinner in Sóller',
              shortMeta: 'Port or town',
              description: 'Head to Sóller or Port de Sóller for dinner and a stroll.',
              thumbUrl:
                'https://images.pexels.com/photos/2609220/pexels-photo-2609220.jpeg?auto=compress&cs=tinysrgb&w=800',
              extraMeta: ['More options, livelier'],
              stravaEmbedHtml: null,
              mapsEmbedHtml: null,
            },
          ],
        },
        {
          id: 'return-hotel-day3',
          type: 'transfer',
          title: 'Back to hotel',
          shortMeta: 'Short drive',
          description: 'Return to accommodation.',
          thumbUrl: null,
          extraMeta: [],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
      ],
    },
    {
      id: 'day-4',
      label: 'Day 4',
      date: 'Peak Day',
      activities: [
        {
          id: 'puig-major-area',
          type: 'hike',
          title: 'Hike near Puig Major',
          shortMeta: 'TBD – highest area',
          description:
            'Full-day hike in the highest part of the Tramuntana. Exact route TBD based on weather and legs.',
          thumbUrl:
            'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['Full day', 'Bring layers'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
        {
          id: 'rest-evening-day4',
          type: 'stay',
          title: 'Rest & dinner nearby',
          shortMeta: 'Low key evening',
          description: 'Recover at the hotel or a nearby spot.',
          thumbUrl: null,
          extraMeta: [],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
      ],
    },
    {
      id: 'day-5',
      label: 'Day 5',
      date: 'Beach & Chill',
      activities: [
        {
          options: [
            {
              id: 'beach-es-trenc',
              type: 'visit',
              title: 'Es Trenc beach',
              shortMeta: 'Long sandy beach',
              description: 'Classic Mallorca beach day: long sandy stretch, clear water.',
              thumbUrl:
                'https://images.pexels.com/photos/1028225/pexels-photo-1028225.jpeg?auto=compress&cs=tinysrgb&w=800',
              extraMeta: ['South coast', 'Parking early'],
              stravaEmbedHtml: null,
              mapsEmbedHtml: null,
            },
            {
              id: 'beach-cala-pi',
              type: 'visit',
              title: 'Cala Pi & coves',
              shortMeta: 'Small coves',
              description: 'Quieter option: Cala Pi and nearby small coves.',
              thumbUrl:
                'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
              extraMeta: ['Less crowded'],
              stravaEmbedHtml: null,
              mapsEmbedHtml: null,
            },
          ],
        },
        {
          id: 'lunch-beach-day5',
          type: 'food',
          title: 'Lunch by the sea',
          shortMeta: 'Beach bar or picnic',
          description: 'Lunch at a chiringuito or picnic depending on where we land.',
          thumbUrl:
            'https://images.pexels.com/photos/2609220/pexels-photo-2609220.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: [],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
        {
          id: 'return-hotel-day5',
          type: 'transfer',
          title: 'Back to hotel',
          shortMeta: '',
          description: 'Return and pack for tomorrow.',
          thumbUrl: null,
          extraMeta: [],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
      ],
    },
    {
      id: 'day-6',
      label: 'Day 6',
      date: 'Departure',
      activities: [
        {
          id: 'breakfast-checkout',
          type: 'stay',
          title: 'Breakfast & check‑out',
          shortMeta: 'Morning at leisure',
          description: 'Last breakfast, check out, head to airport or next stop.',
          thumbUrl:
            'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
          extraMeta: ['Check-out time TBD'],
          stravaEmbedHtml: null,
          mapsEmbedHtml: null,
        },
      ],
    },
  ],
    },
  ],
};

const STORAGE_KEY_DATA = 'hiking-trips-data';
const STORAGE_KEY_SELECTED_TRIP = 'hiking-trips-selected-trip';

(function () {
  try {
    const s = localStorage.getItem(STORAGE_KEY_DATA);
    if (s) {
      const saved = JSON.parse(s);
      if (saved.appTitle != null) appConfig.appTitle = saved.appTitle;
      if (Array.isArray(saved.trips)) appConfig.trips = saved.trips;
    }
  } catch (e) {}
})();
if (typeof window !== 'undefined') window.appConfig = appConfig;

/** Load trip config from Firebase and merge into appConfig. Resolves when done (with or without data). */
function loadConfigFromFirebase() {
  return new Promise(function (resolve) {
    if (!firebaseDb) {
      resolve();
      return;
    }
    firebaseDb.ref(FIREBASE_DATA_PATH + '/' + FIREBASE_CONFIG_KEY).once('value').then(
      function (snapshot) {
        const val = snapshot.val();
        if (val && val.appTitle != null) appConfig.appTitle = val.appTitle;
        if (val && Array.isArray(val.trips) && val.trips.length > 0) appConfig.trips = val.trips;
        resolve();
      },
      function () {
        resolve();
      }
    );
  });
}

/**
 * Save trip config to Firebase. Preserves existing comments (Plan C). Call with { appTitle, trips }.
 */
function saveConfigToFirebase(payload) {
  if (!firebaseDb) return Promise.resolve();
  var dataRef = firebaseDb.ref(FIREBASE_DATA_PATH);
  return dataRef.once('value').then(function (snapshot) {
    var existing = snapshot.val() || {};
    var comments = existing[FIREBASE_COMMENTS_KEY];
    if (comments === undefined) comments = {};
    var update = {};
    update[FIREBASE_CONFIG_KEY] = { appTitle: payload.appTitle, trips: payload.trips };
    update[FIREBASE_COMMENTS_KEY] = comments;
    return dataRef.set(update);
  });
}

window.saveConfigToFirebase = saveConfigToFirebase;

function getSelectedTrip() {
  const id = localStorage.getItem(STORAGE_KEY_SELECTED_TRIP) || appConfig.trips[0]?.id;
  return appConfig.trips.find((t) => t.id === id) || appConfig.trips[0];
}

function renderTripSelector(trips, selectedTripId) {
  const container = document.getElementById('trip-selector');
  if (!container) return;
  container.innerHTML = '';
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'trip-selector__pills';
  trips.forEach((trip) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'trip-pill';
    if (trip.id === selectedTripId) btn.classList.add('trip-pill--active');
    btn.dataset.tripId = trip.id;
    btn.textContent = trip.label;
    btn.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY_SELECTED_TRIP, trip.id);
      const selected = getSelectedTrip();
      container.querySelectorAll('.trip-pill').forEach((p) => {
        p.classList.toggle('trip-pill--active', p.dataset.tripId === selected.id);
      });
      renderItinerary(selected);
    });
    pillsWrap.appendChild(btn);
  });
  container.appendChild(pillsWrap);
  // Editor link removed (Step B: editor URL kept private)
}

const TYPE_LABELS = {
  hike: 'Hike',
  food: 'Food',
  stay: 'Stay',
  visit: 'Visit',
  transfer: 'Transfer',
  activity: 'Activity',
};

const TYPE_COLORS = {
  hike: '#059669',
  food: '#d97706',
  stay: '#0284c7',
  visit: '#ca8a04',
  transfer: '#7c3aed',
  activity: '#1f2937', // neutral dark gray
};

function safeId(id) {
  return String(id).toLowerCase().replace(/[^a-z0-9\-]/g, '-');
}

function getActivityTags(activity) {
  if (activity.type) return [activity.type];
  if (Array.isArray(activity.tags) && activity.tags.length) return activity.tags;
  return [];
}

function getActivityPhotos(activity) {
  if (!activity) return [];
  if (Array.isArray(activity.photos) && activity.photos.length) return activity.photos;
  return [];
}

/** Y position (0–100) for the i-th item (0-based) in a row of n items (centers). */
function slotCenterY(n, i) {
  return n === 1 ? 50 : ((2 * i + 1) / (2 * n)) * 100;
}

/** Create connector SVG between two slots: horizontal line(s) from center(s) of left to center(s) of right, with inset. */
function createConnector(leftCount, rightCount) {
  const inset = 10;
  const xL = inset;
  const xR = 100 - inset;
  const paths = [];
  if (leftCount === 1 && rightCount === 1) {
    paths.push(`M ${xL} 50 L ${xR} 50`);
  } else if (leftCount === 1) {
    for (let j = 0; j < rightCount; j++) {
      const yR = slotCenterY(rightCount, j);
      paths.push(`M ${xL} 50 L ${xR} ${yR}`);
    }
  } else if (rightCount === 1) {
    for (let i = 0; i < leftCount; i++) {
      const yL = slotCenterY(leftCount, i);
      paths.push(`M ${xL} ${yL} L ${xR} 50`);
    }
  } else {
    const count = Math.max(leftCount, rightCount);
    for (let k = 0; k < count; k++) {
      const i = Math.min(k, leftCount - 1);
      const j = Math.min(k, rightCount - 1);
      const yL = slotCenterY(leftCount, i);
      const yR = slotCenterY(rightCount, j);
      paths.push(`M ${xL} ${yL} L ${xR} ${yR}`);
    }
  }
  const pathD = paths.join(' ');
  const div = document.createElement('div');
  div.className = 'timeline-connector';
  div.setAttribute('aria-hidden', 'true');
  div.innerHTML =
    '<svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="' +
    pathD +
    '" /></svg>';
  return div;
}

/** Get slot type: { count: 1 } for single, { count: n } for options. Single-activity groups are treated as non-group. */
function getSlotType(item) {
  if (isOptionsGroup(item)) {
    const n = item.options.length;
    return { count: n === 1 ? 1 : n };
  }
  return { count: 1 };
}

/** Returns true if the item is an "options" group with more than one activity (multiple choices). Single-activity groups render as non-group. */
function isOptionsGroup(item) {
  return item && Array.isArray(item.options) && item.options.length > 1;
}

/** Returns true if the item has options array (for details section: single-option still goes through options path but renders as one). */
function hasOptions(item) {
  return item && Array.isArray(item.options) && item.options.length > 0;
}

/** Get detail items for the details section: each item is either single or an options group. Single-activity groups render as single. */
function getDetailItems(config) {
  const out = [];
  config.days.forEach((day, dayIndex) => {
    day.activities.forEach((item) => {
      if (hasOptions(item)) {
        if (item.options.length === 1) {
          out.push({ type: 'single', activity: item.options[0], day, dayIndex });
        } else {
          out.push({ type: 'options', options: item.options, day, dayIndex });
        }
      } else {
        out.push({ type: 'single', activity: item, day, dayIndex });
      }
    });
  });
  return out;
}

function createTimelineActivity(activity, day, dayIndex) {
  const id = safeId(activity.id);
  const tags = getActivityTags(activity);
  const primaryTag = tags[0] || 'visit';
  const typeLabel = TYPE_LABELS[primaryTag] || primaryTag;
  const color = TYPE_COLORS[primaryTag] || '#64748b';
  const photos = getActivityPhotos(activity);

  const link = document.createElement('a');
  link.className = 'timeline-activity';
  link.href = `#${id}`;
  link.dataset.type = primaryTag;

  const typeChip = document.createElement('div');
  typeChip.className = 'timeline-activity-type';
  typeChip.style.color = color;
  const dot = document.createElement('span');
  dot.className = 'timeline-activity-type-dot';
  typeChip.appendChild(dot);
  typeChip.append(typeLabel);

  const title = document.createElement('div');
  title.className = 'timeline-activity-title';
  title.textContent = activity.title;

  const meta = document.createElement('div');
  meta.className = 'timeline-activity-meta';
  meta.textContent = activity.shortMeta || '';

  const thumb = document.createElement('div');
  thumb.className = 'timeline-activity-thumb';
  if (photos.length > 0) {
    const img = document.createElement('img');
    img.src = photos[0];
    img.alt = activity.title;
    thumb.appendChild(img);
  }

  link.appendChild(typeChip);
  link.appendChild(title);
  link.appendChild(meta);
  if (photos.length > 0) {
    link.appendChild(thumb);
  }

  return link;
}

function createDayTabs(days, timelineScrollEl) {
  const container = document.createElement('div');
  container.className = 'day-tabs';
  container.setAttribute('role', 'tablist');
  container.setAttribute('aria-label', 'Days');

  const dayBlocks = timelineScrollEl.querySelectorAll('.timeline-day-block');

  days.forEach((day, index) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'day-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.dataset.dayIndex = String(index);
    tab.textContent = day.label || `Day ${index + 1}`;

    tab.addEventListener('click', () => {
      const block = dayBlocks[index];
      if (block && timelineScrollEl) {
        block.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
      container.querySelectorAll('.day-tab').forEach((t, i) => {
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
        t.classList.toggle('day-tab--active', i === index);
      });
    });

    container.appendChild(tab);
  });

  return container;
}

function createTimeline(config) {
  const track = document.createElement('div');
  track.className = 'timeline-track';

  config.days.forEach((day, dayIndex) => {
    const dayBlock = document.createElement('div');
    dayBlock.className = 'timeline-day-block';
    dayBlock.dataset.dayIndex = String(dayIndex);

    const lineStrip = document.createElement('div');
    lineStrip.className = 'timeline-day-line-strip';
    lineStrip.dataset.dayIndex = String(dayIndex);
    const lineLabel = document.createElement('span');
    lineLabel.className = 'timeline-day-line-label';
    lineLabel.textContent = day.label || `Day ${dayIndex + 1}`;
    lineStrip.appendChild(lineLabel);
    dayBlock.appendChild(lineStrip);

    const slots = document.createElement('div');
    slots.className = 'timeline-day-slots';

    const slotTypes = day.activities.map((item) => getSlotType(item));

    day.activities.forEach((item, itemIndex) => {
      if (itemIndex > 0) {
        const prevType = slotTypes[itemIndex - 1];
        const nextType = slotTypes[itemIndex];
        const connector = createConnector(prevType.count, nextType.count);
        slots.appendChild(connector);
      }

      if (isOptionsGroup(item)) {
        const slot = document.createElement('div');
        slot.className = 'timeline-slot timeline-slot--options';
        item.options.forEach((act) => {
          slot.appendChild(createTimelineActivity(act, day, dayIndex));
        });
        slots.appendChild(slot);
      } else if (hasOptions(item) && item.options.length === 1) {
        const slot = document.createElement('div');
        slot.className = 'timeline-slot';
        slot.appendChild(createTimelineActivity(item.options[0], day, dayIndex));
        slots.appendChild(slot);
      } else {
        const slot = document.createElement('div');
        slot.className = 'timeline-slot';
        slot.appendChild(createTimelineActivity(item, day, dayIndex));
        slots.appendChild(slot);
      }
    });

    dayBlock.appendChild(slots);
    track.appendChild(dayBlock);

    if (dayIndex < config.days.length - 1) {
      const dayDivider = document.createElement('div');
      dayDivider.className = 'timeline-day-divider';
      dayDivider.setAttribute('aria-hidden', 'true');
      track.appendChild(dayDivider);
    }
  });

  return track;
}

function createDetailsActivity(activity, day, dayIndex) {
  const id = safeId(activity.id);
  const tags = getActivityTags(activity);
  const primaryTag = tags[0] || activity.type || 'visit';
  const primaryColor = TYPE_COLORS[primaryTag] || '#64748b';
  const photos = getActivityPhotos(activity);

  const wrapper = document.createElement('article');
  wrapper.className = 'details-activity';

  const anchor = document.createElement('div');
  anchor.className = 'details-anchor';
  anchor.id = id;
  wrapper.appendChild(anchor);

  const header = document.createElement('div');
  header.className = 'details-activity-header';

  const title = document.createElement('h3');
  title.className = 'details-activity-title';
  title.textContent = activity.title;

  const badges = document.createElement('div');
  badges.className = 'details-activity-badges';

  // Tag badges
  tags.forEach((tag, index) => {
    const label = TYPE_LABELS[tag] || tag;
    const color = TYPE_COLORS[tag] || primaryColor;
    const tagBadge = document.createElement('span');
    tagBadge.className = 'badge badge--type';
    tagBadge.textContent = label;
    tagBadge.style.borderColor = color;
    tagBadge.style.color = color;
    badges.appendChild(tagBadge);
  });

  const dayBadge = document.createElement('span');
  dayBadge.className = 'badge badge--day';
  dayBadge.textContent = day.label || `Day ${dayIndex + 1}`;

  badges.appendChild(dayBadge);

  header.appendChild(title);
  header.appendChild(badges);

  const short = document.createElement('p');
  short.className = 'details-activity-short';
  short.textContent = activity.shortMeta || '';

  const desc = document.createElement('p');
  desc.className = 'details-activity-description';
  desc.textContent = activity.description || '';

  wrapper.appendChild(header);
  if (activity.shortMeta) {
    wrapper.appendChild(short);
  }
  wrapper.appendChild(desc);

  // Photos gallery (only from activity.photos)
  if (photos.length > 0) {
    const photosWrap = document.createElement('div');
    photosWrap.className = 'details-activity-photos';
    photos.forEach((url, index) => {
      const photo = document.createElement('button');
      photo.type = 'button';
      photo.className = 'details-activity-photo';
      const img = document.createElement('img');
      img.src = url;
      img.alt = activity.title;
      photo.appendChild(img);
      photo.addEventListener('click', () => {
        openPhotoViewer(photos, index, activity.title);
      });
      photosWrap.appendChild(photo);
    });
    wrapper.appendChild(photosWrap);
  }

  const embeds = [];
  // Legacy Strava embed HTML
  if (activity.stravaEmbedHtml) {
    embeds.push({ label: 'Strava route', html: activity.stravaEmbedHtml });
  } else if (activity.stravaUrl) {
    embeds.push({
      label: 'Strava route',
      html:
        '<iframe src="' +
        activity.stravaUrl +
        '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>',
    });
  }

  // Legacy Maps embed HTML
  if (activity.mapsEmbedHtml) {
    embeds.push({ label: 'Map', html: activity.mapsEmbedHtml });
  } else if (Array.isArray(activity.locationUrls)) {
    activity.locationUrls.forEach((url, idx) => {
      const isEmbedUrl =
        url && (url.includes('google.com/maps/embed') || url.includes('maps/embed'));
      const label = activity.locationUrls.length > 1 ? `Map ${idx + 1}` : 'Map';
      if (isEmbedUrl) {
        embeds.push({
          label,
          html:
            '<iframe src="' +
            url.replace(/"/g, '&quot;') +
            '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>',
        });
      } else if (url && url.trim()) {
        embeds.push({
          label,
          html:
            '<div class="embed-map-fallback">' +
            '<p class="embed-map-fallback__text">This link cannot be embedded (Google blocks it). Use <strong>Share → Embed a map</strong> in Google Maps and paste the <strong>embed URL</strong> (starts with <code>https://www.google.com/maps/embed?pb=…</code>).</p>' +
            '<a class="embed-map-fallback__link" href="' +
            url.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
            '" target="_blank" rel="noopener">Open this location in a new tab</a>' +
            '</div>',
        });
      }
    });
  }

  if (embeds.length > 0) {
    const embedsContainer = document.createElement('div');
    embedsContainer.className = 'details-activity-embeds';
    embeds.forEach((embed) => {
      const card = document.createElement('div');
      card.className = 'embed-card';
      const headerEl = document.createElement('div');
      headerEl.className = 'embed-card-header';
      headerEl.textContent = embed.label;
      const bodyEl = document.createElement('div');
      bodyEl.className = 'embed-card-body';
      const frameWrapper = document.createElement('div');
      frameWrapper.className = 'embed-frame-wrapper';
      frameWrapper.innerHTML = embed.html;
      bodyEl.appendChild(frameWrapper);
      card.appendChild(headerEl);
      card.appendChild(bodyEl);
      embedsContainer.appendChild(card);
    });
    wrapper.appendChild(embedsContainer);
  }

  return wrapper;
}

// -------- Photo viewer (lightbox) for activity photos --------
let photoViewerRoot = null;
let photoViewerPhotos = [];
let photoViewerIndex = 0;
let photoViewerTitle = '';
let photoViewerKeyListener = null;

function ensurePhotoViewerRoot() {
  if (photoViewerRoot) return photoViewerRoot;

  const root = document.createElement('div');
  root.id = 'photo-viewer';
  root.className = 'photo-viewer';
  root.setAttribute('aria-hidden', 'true');

  root.innerHTML =
    '<div class="photo-viewer__backdrop"></div>' +
    '<div class="photo-viewer__content" role="dialog" aria-modal="true" aria-label="Activity photos">' +
    '  <button type="button" class="photo-viewer__close" aria-label="Close photos">×</button>' +
    '  <div class="photo-viewer__body">' +
    '    <button type="button" class="photo-viewer__nav photo-viewer__nav--prev" aria-label="Previous photo">‹</button>' +
    '    <div class="photo-viewer__image-wrap">' +
    '      <img class="photo-viewer__image" alt="" />' +
    '      <div class="photo-viewer__caption"></div>' +
    '      <div class="photo-viewer__counter"></div>' +
    '    </div>' +
    '    <button type="button" class="photo-viewer__nav photo-viewer__nav--next" aria-label="Next photo">›</button>' +
    '  </div>' +
    '</div>';

  document.body.appendChild(root);

  const backdrop = root.querySelector('.photo-viewer__backdrop');
  const closeBtn = root.querySelector('.photo-viewer__close');
  const prevBtn = root.querySelector('.photo-viewer__nav--prev');
  const nextBtn = root.querySelector('.photo-viewer__nav--next');

  if (backdrop) backdrop.addEventListener('click', closePhotoViewer);
  if (closeBtn) closeBtn.addEventListener('click', closePhotoViewer);
  if (prevBtn) prevBtn.addEventListener('click', () => stepPhotoViewer(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => stepPhotoViewer(1));

  photoViewerRoot = root;
  return root;
}

function openPhotoViewer(photos, startIndex, title) {
  if (!photos || !photos.length) return;
  const root = ensurePhotoViewerRoot();

  photoViewerPhotos = photos.slice();
  photoViewerIndex = Math.max(0, Math.min(startIndex || 0, photoViewerPhotos.length - 1));
  photoViewerTitle = title || '';

  root.classList.add('is-open');
  root.setAttribute('aria-hidden', 'false');

  updatePhotoViewer();

  if (!photoViewerKeyListener) {
    photoViewerKeyListener = (event) => {
      if (event.key === 'Escape') {
        closePhotoViewer();
      } else if (event.key === 'ArrowRight') {
        stepPhotoViewer(1);
      } else if (event.key === 'ArrowLeft') {
        stepPhotoViewer(-1);
      }
    };
  }
  document.addEventListener('keydown', photoViewerKeyListener);
}

function closePhotoViewer() {
  if (!photoViewerRoot) return;
  photoViewerRoot.classList.remove('is-open');
  photoViewerRoot.setAttribute('aria-hidden', 'true');
  photoViewerPhotos = [];
  photoViewerTitle = '';
  if (photoViewerKeyListener) {
    document.removeEventListener('keydown', photoViewerKeyListener);
  }
}

function stepPhotoViewer(delta) {
  if (!photoViewerPhotos.length) return;
  const count = photoViewerPhotos.length;
  photoViewerIndex = (photoViewerIndex + delta + count) % count;
  updatePhotoViewer();
}

function updatePhotoViewer() {
  if (!photoViewerRoot || !photoViewerPhotos.length) return;
  const imgEl = photoViewerRoot.querySelector('.photo-viewer__image');
  const captionEl = photoViewerRoot.querySelector('.photo-viewer__caption');
  const counterEl = photoViewerRoot.querySelector('.photo-viewer__counter');
  const url = photoViewerPhotos[photoViewerIndex];

  if (imgEl) {
    imgEl.src = url;
    imgEl.alt = photoViewerTitle || '';
  }
  if (captionEl) {
    captionEl.textContent = photoViewerTitle || '';
  }
  if (counterEl) {
    counterEl.textContent = (photoViewerIndex + 1) + ' / ' + photoViewerPhotos.length;
  }
}

function createDetailsOptionsGroup(options, day, dayIndex) {
  const wrap = document.createElement('div');
  wrap.className = 'details-options-group';
  const list = document.createElement('div');
  list.className = 'details-options-group-list';
  options.forEach((activity) => {
    list.appendChild(createDetailsActivity(activity, day, dayIndex));
  });
  wrap.appendChild(list);
  return wrap;
}

function scrollToDetailAndHighlight(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const article = el.closest('.details-activity');
  if (article) {
    article.classList.remove('highlight-landing');
    void article.offsetWidth;
    article.classList.add('highlight-landing');
    const duration = 1400;
    setTimeout(() => article.classList.remove('highlight-landing'), duration);
  }
}

function renderItinerary(config) {
  const subtitleEl = document.getElementById('trip-subtitle');
  const footerNoteEl = document.getElementById('trip-footer-note');
  const tabsContainer = document.getElementById('day-tabs');
  const timelineRoot = document.getElementById('timeline');
  const detailsRoot = document.getElementById('details');

  if (!timelineRoot || !detailsRoot) return;

  if (subtitleEl) subtitleEl.textContent = config.tripSubtitle || '';
  if (footerNoteEl) footerNoteEl.textContent = config.footerNote;

  timelineRoot.innerHTML = '';
  const track = createTimeline(config);
  timelineRoot.appendChild(track);

  if (tabsContainer) {
    tabsContainer.innerHTML = '';
    const tabs = createDayTabs(config.days, timelineRoot);
    tabsContainer.appendChild(tabs);
    const firstTab = tabsContainer.querySelector('.day-tab');
    if (firstTab) firstTab.classList.add('day-tab--active');
  }

  detailsRoot.innerHTML = '';
  const detailItems = getDetailItems(config);
  config.days.forEach((day, dayIndex) => {
    const items = detailItems.filter((it) => it.dayIndex === dayIndex);
    if (items.length === 0) return;
    const dayGroup = document.createElement('div');
    dayGroup.className = 'details-day-group';
    const side = document.createElement('div');
    side.className = 'details-day-side';
    side.dataset.dayIndex = String(dayIndex);
    const barLabel = document.createElement('div');
    barLabel.className = 'details-day-bar-label';
    barLabel.textContent = day.label || `Day ${dayIndex + 1}`;
    const bar = document.createElement('div');
    bar.className = 'details-day-bar';
    side.appendChild(barLabel);
    side.appendChild(bar);
    const content = document.createElement('div');
    content.className = 'details-day-content';
    items.forEach((item) => {
      if (item.type === 'single') {
        content.appendChild(createDetailsActivity(item.activity, item.day, item.dayIndex));
      } else {
        content.appendChild(
          createDetailsOptionsGroup(item.options, item.day, item.dayIndex)
        );
      }
    });
    dayGroup.appendChild(side);
    dayGroup.appendChild(content);
    detailsRoot.appendChild(dayGroup);
  });

  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    setTimeout(() => scrollToDetailAndHighlight(id), 100);
  }
}

function init() {
  const appTitleEl = document.getElementById('app-title');
  if (appTitleEl) appTitleEl.textContent = appConfig.appTitle;
  const selected = getSelectedTrip();
  renderTripSelector(appConfig.trips, selected.id);
  renderItinerary(selected);
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (id) scrollToDetailAndHighlight(id);
  });
}

/** Proceed after Firebase load or after a timeout (so editor works locally / when Firebase is slow or blocked). */
var FIREBASE_LOAD_TIMEOUT_MS = 5000;

function whenConfigReady() {
  var timeoutPromise = new Promise(function (resolve) {
    setTimeout(resolve, FIREBASE_LOAD_TIMEOUT_MS);
  });
  Promise.race([loadConfigFromFirebase(), timeoutPromise]).then(function () {
    if (document.getElementById('trip-selector')) {
      init();
    } else if (document.getElementById('editor-trip-pills')) {
      window.dispatchEvent(new CustomEvent('appConfigReady'));
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  whenConfigReady();
});
