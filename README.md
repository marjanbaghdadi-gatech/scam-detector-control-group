# Static Fraud-Awareness Guide - Study Control Page

This is the static-resource page for the scam-detection study control group.

## What it does

- Reads the participant ID from the URL parameter `pid` or `PID`, and persists it in `sessionStorage` so it survives a refresh within the same browser session.
- Shows four collapsible buttons: three open selected instruction-only pages from official FDIC/CFPB Money Smart for Older Adults resource-guide PDFs, and a fourth ("Video Stories") opens four official FTC/FBI scam-awareness videos. Each panel is collapsed by default and only loads its content the first time it's opened, so the page stays uncluttered for older adults.
- Excludes activity/self-check pages from the PDF guides.
- Shows a single "Go to post survey" button at the bottom of the page. Clicking it sends the participant to the post-survey with the same PID and `condition=StaticGuide`. If no PID is present, the button instead reveals a warning instead of navigating.

## PDF hosting

The three PDFs are downloaded from the official FDIC catalog and committed to this repo under `pdfs/`, and are loaded from there (same-origin) rather than fetched live from `catalog.fdic.gov`. The FDIC server does not send CORS headers, so a live cross-origin fetch from GitHub Pages is blocked by the browser and pdf.js fails to render. Hosting local copies avoids that.

1. Avoiding Telephone and Internet Scams
   - Local file: `pdfs/telephone-internet-scams.pdf`
   - Original source: https://catalog.fdic.gov/catalog/sfc/servlet.shepherd/document/download/069t000000hasIcAAI
   - Displayed pages: 1-6 and 9-11
   - Excluded activity pages: 7-8 and 12

2. Computer/Internet Scams
   - Local file: `pdfs/computer-internet-scams.pdf`
   - Original source: https://catalog.fdic.gov/catalog/sfc/servlet.shepherd/document/download/069t000000hasKiAAI
   - Displayed pages: 1-5
   - No activity pages in this selected PDF

3. Identity Theft and Medical Identity Theft
   - Local file: `pdfs/identity-theft.pdf`
   - Original source: https://catalog.fdic.gov/catalog/sfc/servlet.shepherd/document/download/069t000000hase9AAA
   - Displayed pages: 1-11
   - Excluded activity/self-check pages: 12-13

## Video Stories

Four official, embedded videos (loaded via their official Vimeo/YouTube players, not re-hosted):

1. FTC — Fraud Affects Every Community: Medicare Scams
   - https://player.vimeo.com/video/352056598 (FTC's official Vimeo account)
   - Official page: https://consumer.ftc.gov/media/video-0132-fraud-affects-every-community-medicare-scams

2. FTC — Fraud Affects Every Community: Family Emergency Scams
   - https://player.vimeo.com/video/352058971 (FTC's official Vimeo account)
   - Official page: https://consumer.ftc.gov/media/79939

3. FBI — Beware of Elder Fraud Scams
   - https://www.youtube.com/embed/RfAquS5wuTc (official `@fbi` YouTube channel)
   - Official page: https://www.fbi.gov/video-repository/elder-fraud-psa-052123.mp4/view

4. FBI — Former Director William Webster Offers Warning About Elder Fraud
   - https://www.youtube.com/embed/BNlPQvdRf1E (official `@fbi` YouTube channel)
   - Official page: https://www.fbi.gov/video-repository/webster-elder-fraud-psa-040722.mp4/view

## Pre-survey link to this page

After publishing to GitHub Pages, link participants to this page from Qualtrics like this:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/?pid=${e://Field/PID}
```

## Post-survey link

The post-survey URL is set in `script.js`:

```js
const POST_SURVEY_URL = 'https://gatech.co1.qualtrics.com/jfe/form/SV_1YRlFkYcZXiWoS2';
```

When participants click the button, the page sends them to:

```text
https://gatech.co1.qualtrics.com/jfe/form/SV_1YRlFkYcZXiWoS2?PID=<pid>&condition=StaticGuide
```
