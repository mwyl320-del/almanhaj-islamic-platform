const state = {
  data: null,
  activeSection: 'home'
};

const sectionMap = {
  home: document.getElementById('home'),
  quran: document.getElementById('quran'),
  hadith: document.getElementById('hadith'),
  fiqh: document.getElementById('fiqh'),
  stories: document.getElementById('stories'),
  lectures: document.getElementById('lectures'),
  library: document.getElementById('library')
};

const featureIcons = {
  quran: '☪',
  hadith: '📖',
  fiqh: '⚖️',
  stories: '📚',
  lectures: '🎧',
  education: '🎓',
  family: '👨‍👩‍👧‍👦',
  economy: '💰',
  humanitarian: '🤲',
  ai: '🤖',
  library: '🗂️'
};

const featureLabels = {
  quran: 'القرآن الكريم',
  hadith: 'الحديث الشريف',
  fiqh: 'الفقه',
  stories: 'قصص الأنبياء',
  lectures: 'المحاضرات',
  education: 'التعليم',
  family: 'الأسرة',
  economy: 'الاقتصاد الإسلامي',
  humanitarian: 'العمل الإنساني',
  ai: 'الذكاء الاصطناعي',
  library: 'المكتبة'
};

async function init() {
  await loadData();
  renderHomeCards();
  bindNavigation();
  bindSearch();
  renderStats();
  registerServiceWorker();
}

async function loadData() {
  try {
    const response = await fetch('./data/content.json');
    if (!response.ok) throw new Error('فشل في تحميل البيانات');
    state.data = await response.json();
    renderAll();
  } catch (error) {
    console.error(error);
    showToast('تعذر تحميل البيانات. تحقق من ملف content.json');
  }
}

function bindNavigation() {
  document.querySelectorAll('.nav-btn, .primary-btn, .secondary-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (!target) return;
      showSection(target);
    });
  });
}

function bindSearch() {
  const quranInput = document.getElementById('quran-search');
  if (quranInput) {
    quranInput.addEventListener('input', (event) => {
      const query = event.target.value.trim().toLowerCase();
      const quran = state.data?.quran || [];
      const filtered = quran.filter((item) => item.name.toLowerCase().includes(query));
      renderQuran(filtered);
    });
  }
}

function renderAll() {
  renderQuran(state.data.quran || []);
  renderHadith(state.data.hadith || []);
  renderFiqh(state.data.fiqh || []);
  renderStories(state.data.stories || []);
  renderLectures(state.data.lectures || []);
  renderLibrary(state.data.library || []);
}

function renderStats() {
  const quranCount = state.data?.quran?.length || 114;
  const hadithCount = state.data?.hadith?.length || 0;
  const modules = 10;

  document.getElementById('stat-quran').textContent = quranCount;
  document.getElementById('stat-hadith').textContent = hadithCount;
  document.getElementById('stat-modules').textContent = `${modules}+`;
  document.getElementById('stat-sources').textContent = '100%';
}

function renderHomeCards() {
  const homeGrid = document.getElementById('home-grid');
  if (!homeGrid) return;

  const cards = [
    {
      key: 'quran',
      title: 'القرآن الكريم',
      text: 'سور، آيات، وتلاوات صوتية مع توثيق المصدر والترجمة.',
      icon: '☪'
    },
    {
      key: 'hadith',
      title: 'الحديث الشريف',
      text: 'أحاديث مع التخريج، المصدر، ومراجع التوثيق.',
      icon: '📖'
    },
    {
      key: 'fiqh',
      title: 'الفقه والعلم الشرعي',
      text: 'عرض المذاهب والأقوال مع بيان الخلاف والمرجعية.',
      icon: '⚖️'
    },
    {
      key: 'stories',
      title: 'قصص الأنبياء',
      text: 'قصص تربوية، ومرتكزة على السيرة والكتب الموثوقة.',
      icon: '📚'
    },
    {
      key: 'lectures',
      title: 'المحاضرات',
      text: 'محاضرات وأشرطة وملفات صوتية من مصادر موثقة.',
      icon: '🎧'
    },
    {
      key: 'library',
      title: 'المكتبة',
      text: 'المحتوى التعليمي، الاستشارات، والمواد المؤسسية.',
      icon: '🗂️'
    }
  ];

  homeGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="feature-card">
          <div class="icon">${card.icon}</div>
          <h3>${card.title}</h3>
          <p>${card.text}</p>
          <button class="inline-btn" data-target="${card.key}">فتح القسم</button>
        </article>
      `
    )
    .join('');

  homeGrid.querySelectorAll('.inline-btn').forEach((button) => {
    button.addEventListener('click', () => showSection(button.dataset.target));
  });
}

function renderQuran(items) {
  const container = document.getElementById('quran-list');
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-meta">
            <span class="title-badge">${item.id}</span>
            <span class="source-tag">${item.type || 'مكية/مدنية'}</span>
          </div>
          <h4>${item.name}</h4>
          <p>الآيات: ${item.verses || 0} • الجزء: ${item.juz || 1}</p>
          <div class="content-footer">
            <span>مصدر: ${item.source || 'المصادر الموثوقة'}</span>
            <button class="inline-btn" data-copy="${escapeHtml(item.name)}">نسخ الاسم</button>
          </div>
        </article>
      `
    )
    .join('');

  attachCopyButtons();
}

function renderHadith(items) {
  const container = document.getElementById('hadith-list');
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-meta">
            <span class="title-badge">${item.category || 'حديث'}</span>
            <span class="source-tag">${item.source || 'مصدر موثوق'}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.text}</p>
          <div class="content-footer">
            <span>المؤلف: ${item.author || 'مؤسسة توثيق'}</span>
            <button class="inline-btn" data-copy="${escapeHtml(item.text)}">نسخ النص</button>
          </div>
        </article>
      `
    )
    .join('');

  attachCopyButtons();
}

function renderFiqh(items) {
  const container = document.getElementById('fiqh-list');
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-meta">
            <span class="title-badge">${item.topic || 'فقه'}</span>
            <span class="source-tag">${item.source || 'توثيق'}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.summary}</p>
          <div class="content-footer">
            <span>المرجع: ${item.reference || 'مؤسسة علمية'}</span>
            <button class="inline-btn" data-copy="${escapeHtml(item.summary)}">نسخ الملخص</button>
          </div>
        </article>
      `
    )
    .join('');

  attachCopyButtons();
}

function renderStories(items) {
  const container = document.getElementById('stories-list');
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-meta">
            <span class="title-badge">${item.type || 'قصة'}</span>
            <span class="source-tag">${item.source || 'مصدر موثوق'}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.summary}</p>
          <div class="content-footer">
            <span>الرسول/النبـي: ${item.person || 'إسلامي'}</span>
            <button class="inline-btn" data-copy="${escapeHtml(item.summary)}">نسخ</button>
          </div>
        </article>
      `
    )
    .join('');

  attachCopyButtons();
}

function renderLectures(items) {
  const container = document.getElementById('lectures-list');
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-meta">
            <span class="title-badge">${item.type || 'محاضرة'}</span>
            <span class="source-tag">${item.source || 'مؤسسة'}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="content-footer">
            <span>المتحدث: ${item.speaker || 'عالِم'}</span>
            <button class="inline-btn" data-copy="${escapeHtml(item.title)}">نسخ العنوان</button>
          </div>
        </article>
      `
    )
    .join('');

  attachCopyButtons();
}

function renderLibrary(items) {
  const container = document.getElementById('library-list');
  if (!container) return;

  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-meta">
            <span class="title-badge">${item.category || 'مكتبة'}</span>
            <span class="source-tag">${item.source || 'موثوق'}</span>
          </div>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
          <div class="content-footer">
            <span>نوع الملف: ${item.format || 'محتوى'}</span>
            <button class="inline-btn" data-copy="${escapeHtml(item.title)}">نسخ</button>
          </div>
        </article>
      `
    )
    .join('');

  attachCopyButtons();
}

function attachCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const text = button.getAttribute('data-copy') || '';
      const decodedText = decodeHtml(text);
      try {
        await navigator.clipboard.writeText(decodedText);
        showToast('تم نسخ المحتوى بنجاح');
      } catch (error) {
        showToast('تمت العملية');
      }
    });
  });
}

function showSection(target) {
  Object.entries(sectionMap).forEach(([key, section]) => {
    if (!section) return;
    section.classList.toggle('hidden', key !== target);
    section.classList.toggle('active', key === target);
  });

  document.querySelectorAll('.nav-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.target === target);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function decodeHtml(value) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = value;
  return textArea.value;
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (error) {
      console.warn('تعذر تسجيل service worker:', error);
    }
  }
}

init();
