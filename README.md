# Trip Itinerary Website

This is a small, reusable static website for visualising a trip itinerary (for example, a hiking trip in Mallorca).

## How it works

- The site is plain **HTML + CSS + JavaScript**, no build step or backend required.
- The **top section** shows a linear plan: a timeline of days, each with several activity boxes.
- The **bottom section** shows detailed descriptions for every activity (text + optional embeds).
- Every box in the top timeline links to its corresponding detailed section on the same page.

You can open `index.html` directly in a browser, or use a simple static server if you prefer.

## Files

- `index.html` – page structure and containers.
- `styles.css` – layout and visuals (timeline, cards, colours).
- `app.js` – itinerary configuration + DOM rendering logic.

## Customising for your own trips

All of the sample data for the Mallorca trip lives in `app.js` in the `itineraryConfig` object:

- Change `tripTitle`, `tripSubtitle`, and `footerNote` for the overall trip.
- The `days` array holds each **day** of the trip.
- Each `day` has an `activities` array with individual **activities**.

Each activity supports:

- `id` – a short unique identifier (used in URL anchors).
- `type` – one of `hike`, `food`, `stay`, `visit`, `transfer` (used for colour + label).
- `title` – short title for the box and details section.
- `shortMeta` – one‑line extra info for the timeline box.
- `description` – longer description in the details section.
- `thumbUrl` – thumbnail image URL for the timeline box.
- `extraMeta` – array of small meta strings shown under the description.
- `stravaEmbedHtml` – optional Strava embed HTML (see below).
- `mapsEmbedHtml` – optional Google Maps embed HTML.

## Adding Strava and Google Maps embeds

1. **Strava route**
   - In Strava, open your route or activity.
   - Look for the **Share** / **Embed** option and copy the `<iframe ...>` embed code.
   - In `app.js`, find the activity you want and paste the iframe into `stravaEmbedHtml`, for example:

   ```js
   stravaEmbedHtml: '<iframe src="https://www.strava.com/..." ...></iframe>',
   ```

2. **Google Maps place or route**
   - In Google Maps, open the place or route.
   - Click **Share** → **Embed a map** and copy the `<iframe ...>` embed code.
   - Paste it into `mapsEmbedHtml` for the relevant activity.

You can leave `stravaEmbedHtml` or `mapsEmbedHtml` as `null` if you do not want an embed for that activity.

## Reusing the site for other trips

- Duplicate or edit the `days` array in `app.js` for a new trip.
- Optionally keep multiple trips as different config objects and switch which one you pass to `renderItinerary`.

Because everything is data‑driven, you only have to change `app.js` to repurpose the site for another destination.

