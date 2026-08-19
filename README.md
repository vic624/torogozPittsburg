# Torogoz — Static Website

This is a plain HTML/CSS/JS rebuild of the Torogoz Contemporary Latin
Cookery website. It replaces the earlier Next.js + Postgres database
build with something that runs on **any basic web host** — no server,
database, or build step required to run it day to day.

All the real content from the old build was recovered and carried over:
the full menu (4 categories, 22 dishes), the 3 special events, the 6
Google reviews, hours, contact info, and all copy.

## What's in this folder

```
index.html      Home page (hero, about, menu preview, events, reviews, reservations, map)
menu.html        Full interactive menu (search, dietary filters, grid/list view)
admin.html        Password-gated dashboard to manage menu items, categories, events & reviews
css/style.css     Compiled stylesheet (do not hand-edit — see "Editing styles" below)
css/input.css     Source stylesheet (edit this, then rebuild — see below)
js/data.js        ALL editable content lives here: menu, events, reviews, contact info
js/store.js       Shared data-loading/saving helper used by every page
js/util.js        Navbar behavior + simple data-binding helper
js/dietary.js     Dietary-tag and star-rating rendering helpers
js/site.js        Renders the home page's dynamic sections from js/data.js
js/menu.js        Powers the full menu page (search, filters, modal, etc.)
js/admin.js       Powers the admin dashboard
```

## Hosting it

This is a fully static site. Upload the whole folder to any web host —
shared hosting, Netlify, Vercel (static mode), GitHub Pages, an S3
bucket, your GoDaddy file manager, whatever you already have — and it
works. There's nothing to install and no server process to keep running.

## How the admin page works

Open `admin.html` and sign in with the admin password (default:
`ember2024` — change this in `js/data.js` under `site.adminPassword`,
see the security note below).

From there you can add/edit/delete menu categories, menu items, special
events, and Google reviews, all with the same interface the old
database-backed admin had.

**Important — how changes are saved.** Because this site has no
database or server, the admin page saves your edits to *this browser's*
local storage. That means:

- Changes preview instantly — open `index.html` or `menu.html` in the
  same browser and you'll see them right away.
- They are **not live for your customers** until you publish them.
- Editing from a different computer or browser won't show your other
  edits, and clearing your browser data will lose unpublished edits.

**To publish changes**, click **"Download Updated Data File"** in the
admin page. It downloads a new `data.js`. Upload that file to your web
host, replacing the existing `js/data.js`. That's the entire publish
step — refresh the live site and your changes are there for everyone.

Two more buttons in the same panel:
- **Import Data File** — loads a `data.js` file back into the admin
  editor. Useful if you're starting on a new computer and want to load
  what's currently live, or to restore a backup.
- **Discard Local Edits** — throws away anything saved in this
  browser and goes back to what's currently published.

## Security note on the admin password

Because this is a static site with no server, the admin password is
checked entirely in the browser (in `js/data.js` and `js/admin.js`).
That's enough to keep casual visitors from poking around, but it is
**not real security** — anyone who views the page source can find the
password, and a technical visitor could bypass the check entirely.
Don't put anything truly sensitive behind it.

If you'd like real server-side protection later, the cleanest upgrade
path is to add a small PHP (or similar) endpoint on your host that
checks the password and serves/saves `data.js` — ask whoever maintains
the site next, or reach back out, and that can be built on top of this
same structure without redoing the design.

## Editing content directly (no admin page)

`js/data.js` is plain, readable JavaScript. If you're comfortable
editing text files, you can open it directly and change menu items,
prices, events, reviews, hours, phone number, social links, etc. by
hand, then upload the file — same publish step as above.

## Editing styles

The look of the site (colors, fonts, spacing utilities) is built with
[Tailwind CSS](https://tailwindcss.com) v4, compiled ahead of time into
`css/style.css` so the live site doesn't depend on any build tooling.

If you want to change the color palette or fonts, edit the `@theme`
block at the top of `css/input.css`, then rebuild with:

```
npm install -D tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i css/input.css -o css/style.css --minify
```

This step is only needed if you're changing the *design*. Editing menu
items, events, reviews, or text content never requires a rebuild.

## Images

Dish and event photos currently link to the restaurant's existing Wix
media library (the same images the previous site used). This works
fine as-is, but if the Wix account is ever cancelled these images could
disappear. For long-term independence, consider downloading them and
hosting them alongside this site (e.g. in an `images/` folder) and
updating the URLs in `js/data.js`.

## Browser support

Built with plain, modern JavaScript (no framework, no build step to
run). Works in all current versions of Chrome, Safari, Firefox, and Edge.
