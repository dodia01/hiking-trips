(function () {
  'use strict';

  const STORAGE_KEY_DATA = 'hiking-trips-data';
  const ACTIVITY_TYPES = ['hike', 'food', 'stay', 'visit', 'transfer', 'activity'];
  const TYPE_LABELS = {
    hike: 'Hike',
    food: 'Food',
    stay: 'Stay',
    visit: 'Visit',
    transfer: 'Transfer',
    activity: 'Activity',
  };

  let editorData = null;
  let selectedTripId = null;
  let selectedActivityRef = null; // { dayIndex, itemIndex, optionIndex? }
  let savedSnapshot = null;

  /** Returns a minimal trip object without depending on ensureDays/getSelectedTrip (safe to call before editorData is set). */
  function minimalDefaultTrip() {
    return {
      id: 'trip-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
      label: 'New trip',
      tripTitle: 'New trip',
      tripSubtitle: '',
      footerNote: 'Click any activity above to jump to its full details.',
      days: [
        {
          id: 'day-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9),
          label: 'Day 1',
          date: '',
          activities: [],
        },
      ],
    };
  }

  function getData() {
    if (!window.appConfig) return null;
    try {
      const cloned = JSON.parse(JSON.stringify(window.appConfig));
      if (!cloned.trips || !Array.isArray(cloned.trips)) cloned.trips = [];
      return cloned;
    } catch (e) {
      return null;
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(
        STORAGE_KEY_DATA,
        JSON.stringify({ appTitle: editorData.appTitle, trips: editorData.trips })
      );
    } catch (e) {}
  }

  function getSelectedTrip() {
    if (!editorData || !editorData.trips || !editorData.trips.length) return null;
    return editorData.trips.find((t) => t.id === selectedTripId) || editorData.trips[0];
  }

  function ensureDays() {
    let trip = getSelectedTrip();
    if (!trip) {
      // Fallback if data is missing or corrupted: create a fresh trip
      trip = defaultTrip();
      if (!editorData) {
        editorData = { appTitle: 'Hiking Trips', trips: [trip] };
      } else {
        if (!Array.isArray(editorData.trips)) editorData.trips = [];
        editorData.trips.push(trip);
      }
      selectedTripId = trip.id;
    }
    if (!trip.days) trip.days = [];
    return trip;
  }

  function newId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
  }

  function defaultActivity(type) {
    const primaryType = type || 'visit';
    return {
      id: newId('act'),
      type: primaryType,
      title: 'New activity',
      shortMeta: '',
      description: 'Describe this activity in more detail here.',
      thumbUrl: null,
      photos: [],
      locationUrls: [],
      stravaUrl: null,
      stravaEmbedHtml: null,
      mapsEmbedHtml: null,
    };
  }

  function defaultDay(dayNumber) {
    const n = dayNumber != null ? dayNumber : (ensureDays().days ? ensureDays().days.length + 1 : 1);
    return {
      id: newId('day'),
      label: 'Day ' + n,
      date: '',
      activities: [],
    };
  }

  function defaultTrip() {
    return {
      id: newId('trip'),
      label: 'New trip',
      tripTitle: 'New trip',
      tripSubtitle: '',
      footerNote: 'Click any activity above to jump to its full details.',
      days: [defaultDay(1)],
    };
  }

  function getActivityAt(ref) {
    const trip = getSelectedTrip();
    const day = trip.days[ref.dayIndex];
    if (!day || !day.activities[ref.itemIndex]) return null;
    const item = day.activities[ref.itemIndex];
    if (item.options != null) {
      return item.options[ref.optionIndex] || null;
    }
    return item;
  }

  function setActivityAt(ref, patch) {
    const activity = getActivityAt(ref);
    if (!activity) return;
    Object.assign(activity, patch);
  }

  function renderTripPills() {
    const container = document.getElementById('editor-trip-pills');
    if (!container) return;
    container.innerHTML = '';
    editorData.trips.forEach((trip) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'editor-trip-pill' + (trip.id === selectedTripId ? ' editor-trip-pill--active' : '');
      btn.textContent = trip.label;
      btn.dataset.tripId = trip.id;
      btn.addEventListener('click', () => {
        selectedTripId = trip.id;
        renderTripPills();
        renderDaysPanel();
        closeDetailPanel();
      });
      container.appendChild(btn);
    });
  }

  function renderDaysPanel() {
    const listEl = document.getElementById('editor-days-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    const trip = ensureDays();
    trip.days.forEach((day, dayIndex) => {
      const bucket = document.createElement('div');
      bucket.className = 'editor-day-bucket';
      bucket.dataset.dayIndex = String(dayIndex);
      bucket.draggable = true;
      bucket.innerHTML = '';

      const head = document.createElement('div');
      head.className = 'editor-day-bucket__head';
      const label = document.createElement('span');
      label.className = 'editor-day-bucket__label';
      label.contentEditable = 'true';
      label.textContent = day.label || '';
      label.dataset.dayIndex = String(dayIndex);
      label.addEventListener('blur', () => {
        const d = getSelectedTrip().days[dayIndex];
        if (d) d.label = label.textContent.trim() || d.label;
      });
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'editor-day-bucket__remove';
      removeBtn.textContent = '×';
      removeBtn.setAttribute('aria-label', 'Remove day');
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        getSelectedTrip().days.splice(dayIndex, 1);
        renderDaysPanel();
      });
      head.appendChild(label);
      head.appendChild(removeBtn);
      bucket.appendChild(head);

      const body = document.createElement('div');
      body.className = 'editor-day-bucket__body';

      const addRow = document.createElement('div');
      addRow.className = 'editor-add-activity-row';
      ACTIVITY_TYPES.forEach((type) => {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'editor-add-activity-btn';
        addBtn.textContent = '+ ' + TYPE_LABELS[type];
        addBtn.addEventListener('click', () => {
          getSelectedTrip().days[dayIndex].activities.push(defaultActivity(type));
          renderDaysPanel();
        });
        addRow.appendChild(addBtn);
      });
      body.appendChild(addRow);

      const addGroupRow = document.createElement('div');
      addGroupRow.className = 'editor-day-bucket__group-actions';
      const addGroupBtn = document.createElement('button');
      addGroupBtn.type = 'button';
      addGroupBtn.className = 'editor-btn editor-btn--dashed';
      addGroupBtn.textContent = 'Add group';
      addGroupBtn.addEventListener('click', () => {
        getSelectedTrip().days[dayIndex].activities.push({ options: [] });
        renderDaysPanel();
      });
      addGroupRow.appendChild(addGroupBtn);
      body.appendChild(addGroupRow);

      (day.activities || []).forEach((item, itemIndex) => {
        if (!item || typeof item !== 'object') return;
        if (item.options != null) {
          body.appendChild(
            makeGroupWrapper(dayIndex, itemIndex, item)
          );
        } else {
          body.appendChild(makeActivityCard(dayIndex, itemIndex, item, null));
        }
      });

      bucket.appendChild(body);

      bucket.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'day:' + dayIndex);
        e.dataTransfer.effectAllowed = 'move';
      });
      bucket.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      bucket.addEventListener('drop', (e) => {
        e.preventDefault();
        const raw = e.dataTransfer.getData('text/plain');
        if (!raw.startsWith('day:')) return;
        const from = parseInt(raw.slice(4), 10);
        if (from === dayIndex) return;
        const days = getSelectedTrip().days;
        const [d] = days.splice(from, 1);
        let to = dayIndex;
        if (from < to) to -= 1;
        days.splice(to, 0, d);
        renderDaysPanel();
      });

      listEl.appendChild(bucket);
    });
  }

  function makeGroupWrapper(dayIndex, itemIndex, item) {
    const options = item.options || [];
    const wrap = document.createElement('div');
    wrap.className = 'editor-activity-options editor-group';
    wrap.dataset.dayIndex = String(dayIndex);
    wrap.dataset.itemIndex = String(itemIndex);

    // Allow dragging the whole group to reorder within the day
    wrap.draggable = true;
    wrap.addEventListener('dragstart', (e) => {
      e.stopPropagation();
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({ kind: 'group', dayIndex, itemIndex })
      );
      e.dataTransfer.effectAllowed = 'move';
    });

    const header = document.createElement('div');
    header.className = 'editor-group__header';
    const dissolveBtn = document.createElement('button');
    dissolveBtn.type = 'button';
    dissolveBtn.className = 'editor-group__dissolve';
    dissolveBtn.textContent = '×';
    dissolveBtn.setAttribute('aria-label', 'Dissolve group');
    dissolveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trip = getSelectedTrip();
      const day = trip.days[dayIndex];
      const activities = day.activities;
      const groupItem = activities[itemIndex];
      if (!groupItem || !groupItem.options) return;
      const opts = groupItem.options.slice();
      activities.splice(itemIndex, 1, ...opts);
      renderDaysPanel();
      closeDetailPanel();
    });
    header.appendChild(dissolveBtn);
    wrap.appendChild(header);

    const body = document.createElement('div');
    body.className = 'editor-group__body';
    if (options.length === 0) {
      body.classList.add('editor-group__body--empty');
      body.textContent = 'Drop activities here';
    } else {
      options.forEach((opt, optIndex) => {
        body.appendChild(
          makeActivityCard(dayIndex, itemIndex, opt, optIndex)
        );
      });
    }

    wrap.appendChild(body);

    wrap.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      wrap.classList.add('editor-group--drag-over');
    });
    wrap.addEventListener('dragleave', (e) => {
      if (!wrap.contains(e.relatedTarget)) {
        wrap.classList.remove('editor-group--drag-over');
      }
    });
    wrap.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wrap.classList.remove('editor-group--drag-over');
      const raw = e.dataTransfer.getData('text/plain');
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (_) {
        return;
      }
      if (payload.dayIndex === undefined || payload.itemIndex === undefined) return;

      // If we're dragging a whole group, reorder groups/items in the day
      if (payload.kind === 'group') {
        const trip = getSelectedTrip();
        const day = trip.days[dayIndex];
        const fromDay = trip.days[payload.dayIndex];
        if (!fromDay || !day) return;
        if (!fromDay.activities[payload.itemIndex]) return;
        // No-op if dropping group on itself
        if (payload.dayIndex === dayIndex && payload.itemIndex === itemIndex) return;
        const [moved] = fromDay.activities.splice(payload.itemIndex, 1);
        let targetIndex = itemIndex;
        if (payload.dayIndex === dayIndex && payload.itemIndex < itemIndex) {
          targetIndex = itemIndex - 1;
        }
        if (targetIndex < 0) targetIndex = 0;
        day.activities.splice(targetIndex, 0, moved);
        renderDaysPanel();
        return;
      }

      // Otherwise we are dragging a single activity into this group
      const trip = getSelectedTrip();
      const day = trip.days[dayIndex];
      const fromDay = trip.days[payload.dayIndex];
      if (!fromDay || !day) return;
      const fromItem = fromDay.activities[payload.itemIndex];
      if (!fromItem) return;
      const groupItem = day.activities[itemIndex];
      if (!groupItem || !groupItem.options) return;
      let toInsert;
      if (fromItem.options != null) {
        const oi = payload.optionIndex != null ? payload.optionIndex : 0;
        toInsert = fromItem.options[oi];
        fromItem.options.splice(oi, 1);
        if (fromItem.options.length === 0) {
          fromDay.activities.splice(payload.itemIndex, 1);
        } else if (fromItem.options.length === 1) {
          fromDay.activities[payload.itemIndex] = fromItem.options[0];
        }
      } else {
        toInsert = fromItem;
        fromDay.activities.splice(payload.itemIndex, 1);
      }
      groupItem.options.push(toInsert);
      renderDaysPanel();
    });

    return wrap;
  }

  function makeActivityCard(dayIndex, itemIndex, activity, optionIndex) {
    if (!activity || typeof activity !== 'object') {
      const placeholder = document.createElement('div');
      placeholder.className = 'editor-activity-card';
      placeholder.textContent = 'Invalid activity';
      return placeholder;
    }
    const card = document.createElement('div');
    card.className = 'editor-activity-card';
    card.dataset.dayIndex = String(dayIndex);
    card.dataset.itemIndex = String(itemIndex);
    if (optionIndex != null) card.dataset.optionIndex = String(optionIndex);
    card.draggable = true;
    card.innerHTML = '';

    const title = document.createElement('span');
    title.className = 'editor-activity-card__title';
    title.textContent = activity.title || 'Untitled';
    const typeSpan = document.createElement('span');
    typeSpan.className = 'editor-activity-card__type';
    typeSpan.textContent = TYPE_LABELS[activity.type] || activity.type || '—';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'editor-activity-card__remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', 'Remove');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trip = getSelectedTrip();
      const day = trip.days[dayIndex];
      const item = day.activities[itemIndex];
      if (item.options) {
        item.options.splice(optionIndex, 1);
        if (item.options.length === 0) day.activities.splice(itemIndex, 1);
        else if (item.options.length === 1) {
          day.activities[itemIndex] = item.options[0];
        }
      } else {
        day.activities.splice(itemIndex, 1);
      }
      renderDaysPanel();
      closeDetailPanel();
    });

    card.appendChild(title);
    card.appendChild(typeSpan);
    card.appendChild(removeBtn);

    card.addEventListener('click', (e) => {
      if (e.target === removeBtn) return;
      selectedActivityRef = { dayIndex, itemIndex, optionIndex: optionIndex ?? undefined };
      document.querySelectorAll('.editor-activity-card').forEach((c) => c.classList.remove('editor-activity-card--selected'));
      card.classList.add('editor-activity-card--selected');
      openDetailPanel();
    });

    card.addEventListener('dragstart', (e) => {
      e.stopPropagation();
      e.dataTransfer.setData(
        'text/plain',
        JSON.stringify({ kind: 'activity', dayIndex, itemIndex, optionIndex })
      );
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
    });
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const raw = e.dataTransfer.getData('text/plain');
      let payload;
      try {
        payload = JSON.parse(raw);
      } catch (_) {
        return;
      }
      if (payload.dayIndex === undefined || payload.itemIndex === undefined) return;

      const trip = getSelectedTrip();
      const day = trip.days[dayIndex];
      const fromDay = trip.days[payload.dayIndex];
      if (!fromDay || !day) return;

      // Reorder whole groups/items when a group is dragged onto a card
      if (payload.kind === 'group') {
        if (!fromDay.activities[payload.itemIndex]) return;
        const [moved] = fromDay.activities.splice(payload.itemIndex, 1);
        let insertAt = itemIndex;
        if (payload.dayIndex === dayIndex && payload.itemIndex < itemIndex) {
          insertAt = itemIndex - 1;
        }
        if (insertAt < 0) insertAt = 0;
        day.activities.splice(insertAt, 0, moved);
        renderDaysPanel();
        return;
      }

      // Default: move a single activity (possibly from inside a group)
      const fromItem = fromDay.activities[payload.itemIndex];
      if (!fromItem) return;
      let toInsert;
      if (fromItem.options) {
        const oi = payload.optionIndex != null ? payload.optionIndex : 0;
        toInsert = fromItem.options[oi];
        fromItem.options.splice(oi, 1);
        if (fromItem.options.length === 0) fromDay.activities.splice(payload.itemIndex, 1);
        else if (fromItem.options.length === 1) fromDay.activities[payload.itemIndex] = fromItem.options[0];
      } else {
        toInsert = fromItem;
        fromDay.activities.splice(payload.itemIndex, 1);
      }
      let insertAt = itemIndex;
      if (payload.dayIndex === dayIndex && payload.itemIndex < itemIndex) insertAt = itemIndex - 1;
      if (insertAt < 0) insertAt = 0;
      day.activities.splice(insertAt, 0, toInsert);
      renderDaysPanel();
    });

    return card;
  }

  function openDetailPanel() {
    const panel = document.getElementById('editor-detail-panel');
    if (!panel) return;
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    renderDetailForm();
  }

  function closeDetailPanel() {
    const panel = document.getElementById('editor-detail-panel');
    if (panel) {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
    }
    selectedActivityRef = null;
    document.querySelectorAll('.editor-activity-card').forEach((c) => c.classList.remove('editor-activity-card--selected'));
  }

  function renderDetailForm() {
    const formEl = document.getElementById('editor-detail-form');
    if (!formEl || !selectedActivityRef) return;
    const activity = getActivityAt(selectedActivityRef);
    if (!activity) return;

    // Ensure richer fields exist for older data
    if (!Array.isArray(activity.photos)) {
      activity.photos = [];
    }
    if (!Array.isArray(activity.locationUrls)) {
      activity.locationUrls = [];
    }
    if (activity.stravaUrl === undefined) {
      activity.stravaUrl = null;
    }

    formEl.innerHTML = '';

    function addSection(title) {
      const section = document.createElement('div');
      section.className = 'editor-form-section';
      const heading = document.createElement('div');
      heading.className = 'editor-form-section-title';
      heading.textContent = title;
      section.appendChild(heading);
      return section;
    }

    function addFieldToSection(section, labelText, inputEl) {
      const wrap = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = labelText;
      wrap.appendChild(label);
      wrap.appendChild(inputEl);
      section.appendChild(wrap);
      formEl.appendChild(section);
    }

    // —— Basics ——
    const basicsSection = addSection('Basics');
    const fields = [
      { key: 'title', label: 'Name', tag: 'input', type: 'text' },
      { key: 'shortMeta', label: 'Short description (timeline)', tag: 'input', type: 'text' },
      { key: 'description', label: 'Long description', tag: 'textarea' },
    ];
    fields.forEach((f) => {
      const input = document.createElement(f.tag);
      if (f.tag === 'input') input.type = f.type || 'text';
      let val = activity[f.key];
      input.value = val != null ? val : '';
      if (f.key === 'description') input.placeholder = 'Add a longer description for the details section…';
      input.name = f.key;
      input.addEventListener('change', () => applyDetailForm());
      input.addEventListener('input', () => applyDetailForm());
      const wrap = document.createElement('div');
      const label = document.createElement('label');
      label.textContent = f.label;
      wrap.appendChild(label);
      wrap.appendChild(input);
      basicsSection.appendChild(wrap);
    });
    formEl.appendChild(basicsSection);

    // —— Tag (single-select, pill style like day tabs) ——
    const tagsSection = addSection('Tag');
    const tagsRow = document.createElement('div');
    tagsRow.className = 'editor-tag-pills';
    const currentType = activity.type || 'visit';
    ACTIVITY_TYPES.forEach((t) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'editor-tag-pill' + (currentType === t ? ' editor-tag-pill--active' : '');
      btn.textContent = TYPE_LABELS[t];
      btn.dataset.tag = t;
      btn.addEventListener('click', () => {
        activity.type = t;
        if (t !== 'hike') activity.stravaUrl = null;
        renderDetailForm();
      });
      tagsRow.appendChild(btn);
    });
    tagsSection.appendChild(tagsRow);
    formEl.appendChild(tagsSection);

    // —— Photos ——
    const photosSection = addSection('Photos');
    photosSection.appendChild(document.createElement('label')).textContent = 'Photo URLs (first one is used in timeline)';
    const photosBody = document.createElement('div');
    photosBody.className = 'editor-photos';
    photosSection.appendChild(photosBody);
    renderPhotosSection(photosBody, activity);
    formEl.appendChild(photosSection);

    // —— Location ——
    const locationSection = addSection('Location');
    const locLabel = document.createElement('label');
    locLabel.textContent = 'Google Maps embed URLs (one per line)';
    locationSection.appendChild(locLabel);
    const locHint = document.createElement('p');
    locHint.className = 'editor-field-hint';
    locHint.textContent =
      'In Google Maps: Share → Embed a map → copy the iframe src (starts with https://www.google.com/maps/embed?pb=…). Share links cannot be embedded.';
    locationSection.appendChild(locHint);
    const locTextarea = document.createElement('textarea');
    locTextarea.name = 'locationUrls';
    locTextarea.placeholder = 'https://www.google.com/maps/embed?pb=...';
    locTextarea.value = (activity.locationUrls || []).join('\n');
    locTextarea.addEventListener('input', () => {
      activity.locationUrls = locTextarea.value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    });
    locationSection.appendChild(locTextarea);
    formEl.appendChild(locationSection);

    // —— Strava route ——
    const stravaSection = addSection('Strava route');
    const stravaLabel = document.createElement('label');
    stravaLabel.textContent = 'Strava URL (for hikes)';
    stravaSection.appendChild(stravaLabel);
    const stravaInput = document.createElement('input');
    stravaInput.type = 'url';
    stravaInput.name = 'stravaUrl';
    stravaInput.value = activity.stravaUrl || '';
    stravaInput.placeholder = 'https://www.strava.com/activities/...';
    stravaInput.addEventListener('input', () => {
      activity.stravaUrl = stravaInput.value || null;
    });
    stravaSection.appendChild(stravaInput);
    formEl.appendChild(stravaSection);
  }

  function applyDetailForm() {
    if (!selectedActivityRef) return;
    const formEl = document.getElementById('editor-detail-form');
    if (!formEl) return;
    const activity = getActivityAt(selectedActivityRef);
    if (!activity) return;
    const get = (name) => {
      const el = formEl.querySelector('[name="' + name + '"]');
      return el ? el.value : '';
    };
    activity.title = get('title');
    activity.shortMeta = get('shortMeta');
    activity.description = get('description');
    document.querySelectorAll('.editor-activity-card--selected .editor-activity-card__title').forEach((el) => {
      el.textContent = activity.title || 'Untitled';
    });
  }

  // Helper to render and manage the photos list for an activity
  function renderPhotosSection(container, activity) {
    const syncPrimaryPhoto = () => {
      if (!Array.isArray(activity.photos) || !activity.photos.length) {
        activity.thumbUrl = null;
      } else {
        activity.thumbUrl = activity.photos[0] || null;
      }
    };

    container.innerHTML = '';
    const list = document.createElement('div');
    list.className = 'editor-photos-list';
    (activity.photos || []).forEach((url, index) => {
      const row = document.createElement('div');
      row.className = 'editor-photos-row';
      const input = document.createElement('input');
      input.type = 'url';
      input.value = url || '';
      input.placeholder = 'Photo URL';
      input.addEventListener('input', () => {
        activity.photos[index] = input.value;
        syncPrimaryPhoto();
      });

      const controls = document.createElement('div');
      controls.className = 'editor-photos-controls';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'editor-btn editor-btn--icon';
      upBtn.setAttribute('aria-label', 'Move photo up');
      upBtn.textContent = '↑';
      upBtn.addEventListener('click', () => {
        if (index === 0) return;
        const arr = activity.photos;
        const tmp = arr[index - 1];
        arr[index - 1] = arr[index];
        arr[index] = tmp;
        syncPrimaryPhoto();
        renderPhotosSection(container, activity);
      });

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'editor-btn editor-btn--icon';
      downBtn.setAttribute('aria-label', 'Move photo down');
      downBtn.textContent = '↓';
      downBtn.addEventListener('click', () => {
        const arr = activity.photos;
        if (index >= arr.length - 1) return;
        const tmp = arr[index + 1];
        arr[index + 1] = arr[index];
        arr[index] = tmp;
        syncPrimaryPhoto();
        renderPhotosSection(container, activity);
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'editor-btn editor-btn--icon';
      removeBtn.setAttribute('aria-label', 'Remove photo');
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', () => {
        activity.photos.splice(index, 1);
        syncPrimaryPhoto();
        renderPhotosSection(container, activity);
      });

      controls.appendChild(upBtn);
      controls.appendChild(downBtn);
      controls.appendChild(removeBtn);

      row.appendChild(input);
      row.appendChild(controls);
      list.appendChild(row);
    });

    const addWrap = document.createElement('div');
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'editor-btn editor-btn--dashed';
    addBtn.textContent = '+ Add photo';
    addBtn.addEventListener('click', () => {
      if (!Array.isArray(activity.photos)) activity.photos = [];
      activity.photos.push('');
      syncPrimaryPhoto();
      renderPhotosSection(container, activity);
    });
    addWrap.appendChild(addBtn);

    container.appendChild(list);
    container.appendChild(addWrap);
  }

  function wireDetailPanel() {
    const panel = document.getElementById('editor-detail-panel');
    const backdrop = document.getElementById('editor-detail-backdrop');
    const closeBtn = document.getElementById('editor-detail-close');
    if (backdrop) backdrop.addEventListener('click', closeDetailPanel);
    if (closeBtn) closeBtn.addEventListener('click', closeDetailPanel);
  }

  function addTrip() {
    const trip = defaultTrip();
    editorData.trips.push(trip);
    selectedTripId = trip.id;
    renderTripPills();
    renderDaysPanel();
  }

  function removeTrip() {
    if (editorData.trips.length <= 1) return;
    const idx = editorData.trips.findIndex((t) => t.id === selectedTripId);
    if (idx < 0) return;
    editorData.trips.splice(idx, 1);
    selectedTripId = editorData.trips[0].id;
    renderTripPills();
    renderDaysPanel();
  }

  function renameTrip() {
    const trip = getSelectedTrip();
    const newName = window.prompt('Rename trip', trip.label);
    if (newName != null && newName.trim()) {
      const name = newName.trim();
      trip.label = name;
      trip.tripTitle = name;
      renderTripPills();
    }
  }

  function addDay() {
    ensureDays().days.push(defaultDay());
    renderDaysPanel();
  }

  function save() {
    savedSnapshot = JSON.stringify({ appTitle: editorData.appTitle, trips: editorData.trips });
    saveToStorage();
    if (window.appConfig) {
      window.appConfig.appTitle = editorData.appTitle;
      window.appConfig.trips = editorData.trips;
    }
    if (typeof window.saveConfigToFirebase === 'function') {
      window.saveConfigToFirebase({ appTitle: editorData.appTitle, trips: editorData.trips });
    }
  }

  function discard() {
    if (!savedSnapshot) return;
    try {
      const restored = JSON.parse(savedSnapshot);
      editorData.appTitle = restored.appTitle;
      editorData.trips = restored.trips;
      if (editorData.trips.length && !editorData.trips.find((t) => t.id === selectedTripId))
        selectedTripId = editorData.trips[0].id;
      renderTripPills();
      renderDaysPanel();
      closeDetailPanel();
    } catch (_) {}
  }

  function init() {
    function showInitError(msg) {
      const el = document.getElementById('editor-trip-pills');
      if (el) {
        el.innerHTML = '<p style="color:#b91c1c; padding:12px; margin:0;">Editor failed to load: ' + String(msg) + '</p>';
      }
      console.error('Editor init error:', msg);
    }

    try {
      // Bootstrap with a safe default first so we never have empty trips
      const loaded = getData();
      if (loaded && loaded.trips && Array.isArray(loaded.trips) && loaded.trips.length > 0) {
        editorData = loaded;
      } else {
        editorData = {
          appTitle: loaded && loaded.appTitle ? loaded.appTitle : 'Hiking Trips',
          trips: [minimalDefaultTrip()],
        };
      }
      if (!editorData.trips || !editorData.trips.length) {
        editorData.trips = [minimalDefaultTrip()];
      }
      if (!editorData.appTitle) editorData.appTitle = 'Hiking Trips';
      selectedTripId = editorData.trips[0].id;
      savedSnapshot = localStorage.getItem(STORAGE_KEY_DATA);

      // Bind buttons first so they work even if render fails
      const addTripBtn = document.getElementById('editor-add-trip');
      if (addTripBtn) addTripBtn.addEventListener('click', addTrip);
      document.getElementById('editor-remove-trip')?.addEventListener('click', removeTrip);
      document.getElementById('editor-rename-trip')?.addEventListener('click', renameTrip);
      document.getElementById('editor-add-day')?.addEventListener('click', addDay);
      document.getElementById('editor-save')?.addEventListener('click', save);
      document.getElementById('editor-discard')?.addEventListener('click', discard);

      renderTripPills();
      renderDaysPanel();
      wireDetailPanel();
    } catch (err) {
      showInitError(err.message || err);
      // Ensure editorData exists so Add trip can work
      if (!editorData || !editorData.trips) {
        editorData = { appTitle: 'Hiking Trips', trips: [minimalDefaultTrip()] };
        selectedTripId = editorData.trips[0].id;
      }
      document.getElementById('editor-add-trip')?.addEventListener('click', addTrip);
      document.getElementById('editor-add-day')?.addEventListener('click', addDay);
    }
  }

  function onReady() {
    function runInit() {
      init();
    }
    if (document.readyState === 'loading') {
      document.addEventListener('appConfigReady', function handler() {
        document.removeEventListener('appConfigReady', handler);
        runInit();
      });
    } else {
      document.addEventListener('appConfigReady', function handler() {
        document.removeEventListener('appConfigReady', handler);
        runInit();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
