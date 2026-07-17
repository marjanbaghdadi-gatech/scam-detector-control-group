const POST_SURVEY_URL = 'https://gatech.co1.qualtrics.com/jfe/form/SV_1YRlFkYcZXiWoS2';

const guides = [
  {
    id: 'telephone',
    url: 'pdfs/telephone-internet-scams.pdf',
    showPages: [1, 2, 3, 4, 5, 6, 9, 10, 11]
  },
  {
    id: 'computer',
    url: 'pdfs/computer-internet-scams.pdf',
    showPages: [1, 2, 3, 4, 5]
  },
  {
    id: 'identity',
    url: 'pdfs/identity-theft.pdf',
    showPages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }
];

const params = new URLSearchParams(window.location.search);
const pid = params.get('pid') || params.get('PID') || '';
const sectionContainer = document.getElementById('pdf-sections');
const continueBtn = document.getElementById('continueBtn');
const pidWarning = document.getElementById('pidWarning');

function createGuideSection(guide) {
  const section = document.createElement('article');
  section.className = 'pdf-section';
  section.id = guide.id;
  section.innerHTML = `<div class="pages" id="pages-${guide.id}"></div>`;
  return section;
}

async function renderGuide(guide) {
  const pagesNode = document.getElementById(`pages-${guide.id}`);
  try {
    const pdfjsLib = window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

    const loadingTask = pdfjsLib.getDocument({ url: guide.url, withCredentials: false });
    const pdf = await loadingTask.promise;

    for (const pageNum of guide.showPages) {
      if (pageNum > pdf.numPages) continue;
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.25 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      const shell = document.createElement('div');
      shell.className = 'page-shell';
      shell.appendChild(canvas);
      pagesNode.appendChild(shell);

      await page.render({ canvasContext: context, viewport }).promise;
    }
  } catch (error) {
    console.error(`Could not render ${guide.id}`, error);
  }
}

async function init() {
  for (const guide of guides) {
    sectionContainer.appendChild(createGuideSection(guide));
  }

  if (!pid) {
    pidWarning.hidden = false;
  }

  for (const guide of guides) {
    await renderGuide(guide);
  }
}

continueBtn.addEventListener('click', () => {
  if (!pid) {
    pidWarning.hidden = false;
    pidWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const target = new URL(POST_SURVEY_URL);
  target.searchParams.set('PID', pid);
  target.searchParams.set('condition', 'StaticGuide');
  window.location.href = target.toString();
});

init();
