# Local website

This is a static HTML, CSS, and JavaScript website. There is no package installation, build, or lint command configured. Chess replay tests use Node's built-in test runner.

## Preview

From the project directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/.

## Routes

- `/`: Home, with the mountain hero, interactive terminal, and short previews.
- `/about/`: Background, education, experience, interests, and skills.
- `/projects/`: The complete project collection.
- `/projects/neatify/`, `/projects/colorbash/`, `/projects/go-search/`, `/projects/where-is-this-williams/`: Project details.
- `/writing/`: Publication list. No articles are published yet; planned titles remain visible under Currently exploring.
- `/contact/`: Verified contact information.
- `/chess/`: Online profiles and game replay.

Directory indexes provide direct navigation and refresh support on ordinary static hosts. Requests without a trailing slash redirect to the directory on Python's local server. Configure production hosting to serve directory index files rather than rewriting all routes to the homepage.

The previous `coding.html`, `profile.html`, `blog.html`, `chess.html`, and project `.html` URLs forward to their corresponding routes. Historical preview files remain unlinked from the live website.

## Shared design

`portfolio.css` defines the typography, colors, homepage hero, terminal, and navigation. `site-pages.css` defines the remaining page layouts. `projects.css` defines the cream project windows. `site-theme.js` shares the theme preference across pages; `portfolio.js` handles only the homepage terminal.

Headers and footers are static HTML so navigation works before JavaScript loads. Keep their links consistent when editing them.

## Responsive containers

The shared `.wrap` rule in `portfolio.css` uses fluid side gutters:
`clamp(20px, 4vw, 64px)`. A body layout class selects the desktop maximum for
navigation, content, and footer. The Projects listing shell uses the same rule.

| Layout class | Maximum width |
| --- | --- |
| `layout-home` | 1320px |
| `layout-projects` | 1480px |
| `layout-about` | 1200px |
| `layout-chess` | 1360px |
| `layout-writing` | 1200px |
| `layout-contact` | 1040px |
| `layout-project-detail` | 1200px |

Article reading content has its own 820px cap inside the wider Writing layout.
Long prose generally stays within 72 to 75 characters per line. Screenshots and
the chessboard use their available grid width; images retain their aspect ratios.
Do not restore separate viewport-specific widths on `.wrap` or narrower outer
shells that misalign a page's header and content.

## Publishing writing

Write Markdown in `writing/content/<slug>.md` and add metadata to `writing/articles.json`. Run `node writing/build.mjs` to generate the archive and published detail routes. Drafts stay out of the archive. Featured writing and category filters appear only when the real content warrants them. See `writing/README.md` for the publishing workflow, templates, metadata, and validation rules. Do not publish empty article routes or invented dates.

## Verification

Run the chess replay tests with a current Node.js version:

```sh
node --test tests/replay.test.mjs
```

The tests cover captures, castling, en passant, promotion, recorded FEN positions, orientation, missing PGNs, and validation of the existing game collection. Synthetic special-move fixtures exist only in the tests and are not published as games.

The Botvinnik/Tal and Nezhmetdinov/Chernikov recordings were corrected against sourced game scores. Source URLs are preserved in their PGN headers; regression tests check their dates, complete move counts, and final positions. Invalid input must still show validation errors rather than a partial replay.

Check routes and legacy forwarding, local assets, desktop and mobile widths, keyboard navigation, theme persistence, homepage terminal commands, and chess replay. Chess uses the existing local rules library in `lib/chess.js`; board rendering and piece artwork currently require access to jsDelivr. Fonts use Google Fonts with local fallbacks.

Replay starts paused. First/Previous/Next/Last and move-list selection jump to prevalidated positions. Restart begins playback again from the recorded starting position. Play/Pause is optional and the speed selector sets the number of moves advanced per second. There is no free-play move input.

Home features two projects. About uses native `details` elements for longer descriptions. Project previews remain brief; source instructions and example commands live on the individual project detail pages. The stack overview is expandable. Preserve both the summary and expanded content when updating these pages.
