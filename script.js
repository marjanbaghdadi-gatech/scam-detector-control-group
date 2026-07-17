const POST_SURVEY_URL = 'https://gatech.co1.qualtrics.com/jfe/form/SV_1YRlFkYcZXiWoS2';
const SHOW_VIDEO_STORIES = false;

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

const videos = [
  {
    id: 'v-medicare',
    title: 'Medicare Scams',
    source: 'FTC',
    embedUrl: 'https://player.vimeo.com/video/352056598',
    sourceUrl: 'https://consumer.ftc.gov/media/video-0132-fraud-affects-every-community-medicare-scams'
  },
  {
    id: 'v-family',
    title: 'Family Emergency Scams',
    source: 'FTC',
    embedUrl: 'https://player.vimeo.com/video/352058971',
    sourceUrl: 'https://consumer.ftc.gov/media/79939'
  },
  {
    id: 'v-elder',
    title: 'Beware of Elder Fraud Scams',
    source: 'FBI',
    embedUrl: 'https://www.youtube.com/embed/RfAquS5wuTc',
    sourceUrl: 'https://www.fbi.gov/video-repository/elder-fraud-psa-052123.mp4/view'
  },
  {
    id: 'v-webster',
    title: 'Former Director William Webster Offers Warning About Elder Fraud',
    source: 'FBI',
    embedUrl: 'https://www.youtube.com/embed/BNlPQvdRf1E',
    sourceUrl: 'https://www.fbi.gov/video-repository/webster-elder-fraud-psa-040722.mp4/view'
  }
];

const PID_STORAGE_KEY = 'studyPid';

const params = new URLSearchParams(window.location.search);
const urlPid = params.get('pid') || params.get('PID') || '';
let pid = urlPid;

if (pid) {
  sessionStorage.setItem(PID_STORAGE_KEY, pid);
} else {
  pid = sessionStorage.getItem(PID_STORAGE_KEY) || '';
}

const sectionContainer = document.getElementById('pdf-sections');
const videoContainer = document.getElementById('video-section');
const continueBtn = document.getElementById('continueBtn');
const pidWarning = document.getElementById('pidWarning');

function createToggleSection({ id, title, panelClass }) {
  const section = document.createElement('article');
  section.className = 'pdf-section';
  section.id = id;
  section.innerHTML = `
    <button class="toggle-button" type="button" aria-expanded="false" aria-controls="panel-${id}">
      <span class="toggle-title">${title}</span>
      <span class="toggle-icon" aria-hidden="true">+</span>
    </button>
    <div class="${panelClass}" id="panel-${id}" hidden></div>
  `;
  return section;
}

function setupToggle(id, onFirstOpen) {
  const section = document.getElementById(id);
  const button = section.querySelector('.toggle-button');
  const icon = section.querySelector('.toggle-icon');
  const panelNode = document.getElementById(`panel-${id}`);
  let opened = false;

  button.addEventListener('click', () => {
    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    panelNode.hidden = isOpen;
    icon.textContent = isOpen ? '+' : '−';

    if (!isOpen && !opened) {
      opened = true;
      onFirstOpen(panelNode);
    }
  });
}

async function renderGuide(guide, panelNode) {
  panelNode.innerHTML = '<p class="loading-note">Loading...</p>';
  try {
    const pdfjsLib = window.pdfjsLib;
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';

    const loadingTask = pdfjsLib.getDocument({ url: guide.url, withCredentials: false });
    const pdf = await loadingTask.promise;

    panelNode.innerHTML = '';
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
      panelNode.appendChild(shell);

      await page.render({ canvasContext: context, viewport }).promise;
    }
  } catch (error) {
    console.error(`Could not render ${guide.id}`, error);
    panelNode.innerHTML = '<p class="loading-note">This guide could not be loaded.</p>';
  }
}

function renderVideos(panelNode) {
  panelNode.innerHTML = '';
  for (const video of videos) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <p class="video-title">${video.source}: ${video.title}</p>
      <div class="video-frame">
        <iframe
          src="${video.embedUrl}"
          title="${video.source}: ${video.title}"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <a class="video-source-link" href="${video.sourceUrl}" target="_blank" rel="noopener">View on official ${video.source} website</a>
    `;
    panelNode.appendChild(card);
  }
}

function init() {
  for (const guide of guides) {
    sectionContainer.appendChild(createToggleSection({ id: guide.id, title: guide.title, panelClass: 'pages' }));
    setupToggle(guide.id, (panelNode) => renderGuide(guide, panelNode));
  }

  if (SHOW_VIDEO_STORIES) {
    videoContainer.appendChild(createToggleSection({ id: 'video-stories', title: 'Video Stories', panelClass: 'videos' }));
    setupToggle('video-stories', renderVideos);
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
