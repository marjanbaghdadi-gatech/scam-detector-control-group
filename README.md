# Static Fraud-Awareness Guide - Study Control Page

This is the static-resource page for the scam-detection study control group.

## What it does

- Reads the participant ID from the URL parameter `pid` or `PID`.
- Renders selected instruction-only pages from three official FDIC/CFPB Money Smart for Older Adults resource-guide PDFs, in order, with no surrounding instructions or navigation.
- Excludes activity/self-check pages from the controlled viewer.
- Shows a single "Go to post survey" button at the bottom of the page. Clicking it sends the participant to the post-survey with the same PID and `condition=StaticGuide`. If no PID is present in the URL, the button instead reveals a warning instead of navigating.

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
