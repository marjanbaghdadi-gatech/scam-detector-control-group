const POST_SURVEY_URL = 'https://gatech.co1.qualtrics.com/jfe/form/SV_1YRlFkYcZXiWoS2';

const guides = [
  {
    id: 'telephone',
    title: 'Avoiding Telephone and Internet Scams',
    url: 'pdfs/telephone-internet-scams.pdf',
    showPages: [1, 2, 3, 4, 5, 6, 9, 10, 11]
  },
  {
    id: 'computer',
    title: 'Computer/Internet Scams',
    url: 'pdfs/computer-internet-scams.pdf',
    showPages: [1, 2, 3, 4, 5]
  },
  {
    id: 'identity',
    title: 'Identity Theft and Medical Identity Theft',
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
  section.innerHTML = `
    <button class="toggle-button" type="button" aria-expanded="false" aria-controls="pages-${guide.id}">
      <span class="toggle-title">${guide.title}</span>
      <span class="toggle-icon" aria-hidden="true">+</span>
    </button>
    <div class="pages" id="pages-${guide.id}" hidden></div>
  `;
  return section;
}

async function renderGuide(guide) {
  const pagesNode = document.getElementById(`pages-${guide.id}`);
  pagesNode.innerHTML = '<p class="loading-note">Loading...</p>';
  try {
    const pdfjsLib = window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

    const loadingTask = pdfjsLib.getDocument({ url: guide.url, withCredentials: false });
    const pdf = await loadingTask.promise;

    pagesNode.innerHTML = '';
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
    pagesNode.innerHTML = '<p class="loading-note">This guide could not be loaded.</p>';
  }
}

function setupToggle(guide) {
  const section = document.getElementById(guide.id);
  const button = section.querySelector('.toggle-button');
  const icon = section.querySelector('.toggle-icon');
  const pagesNode = document.getElementById(`pages-${guide.id}`);
  let rendered = false;

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    pagesNode.hidden = isOpen;
    icon.textContent = isOpen ? '+' : '−';

    if (!isOpen && !rendered) {
      rendered = true;
      renderGuide(guide);
    }
  });
}

function init() {
  for (const guide of guides) {
    sectionContainer.appendChild(createGuideSection(guide));
    setupToggle(guide);
  }

  if (!pid) {
    pidWarning.hidden = false;
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
