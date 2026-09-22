(() => {
  const data = window.MAEDA_GALLERY_DATA;
  const media = document.getElementById('reelMedia');
  if (!data || !media) return;

  const entries = [
    ...data.photos.map(([id, date, title, comment, short, dateText]) => ({ id, date, title, comment, short, dateText, type: 'photo' })),
    ...data.videos.map(([id, date, title, comment, short, dateText]) => ({ id, date, title, comment, short, dateText, type: 'video' }))
  ].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const type = document.getElementById('reelType');
  const date = document.getElementById('reelDate');
  const title = document.getElementById('reelTitle');
  const comment = document.getElementById('reelComment');
  const count = document.getElementById('reelCount');
  const progress = document.getElementById('reelProgress');
  const toggle = document.getElementById('reelToggle');
  const duration = 7000;
  let current = 0;
  let paused = false;
  let timer;
  let activeFrame;

  const formatDate = (entry) => {
    if (entry.dateText) return entry.dateText;
    if (!entry.date) return '撮影日を確認中';
    const value = new Date(entry.date);
    if (Number.isNaN(value.getTime())) return entry.date;
    return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(value).replaceAll('/', '.');
  };

  const resetTimer = () => {
    window.clearInterval(timer);
    if (!paused) timer = window.setInterval(() => render(current + 1), duration);
  };

  const render = (index) => {
    current = (index + entries.length) % entries.length;
    const entry = entries[current];
    const frame = document.createElement('div');
    frame.className = 'reel-frame';
    media.querySelectorAll('.reel-frame:not(.is-active)').forEach(node => node.remove());
    if (entry.type === 'photo') {
      const image = document.createElement('img');
      image.src = `images/gallery/${entry.id}.jpg`;
      image.alt = entry.title;
      frame.append(image);
    } else {
      const video = document.createElement('iframe');
      video.src = `https://www.youtube-nocookie.com/embed/${entry.id}`;
      video.title = entry.title;
      video.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      video.allowFullscreen = true;
      frame.append(video);
    }
    if (activeFrame) activeFrame.classList.remove('is-active');
    if (activeFrame) activeFrame.classList.add('is-leaving');
    media.append(frame);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => frame.classList.add('is-active')));
    const previousFrame = activeFrame;
    activeFrame = frame;
    if (previousFrame) window.setTimeout(() => previousFrame.remove(), 1150);
    type.textContent = entry.type === 'video' ? 'MOVIE' : 'PHOTO';
    date.textContent = formatDate(entry);
    title.textContent = entry.title;
    comment.textContent = entry.comment;
    count.textContent = `${current + 1} / ${entries.length}`;
    progress.style.width = `${((current + 1) / entries.length) * 100}%`;
    resetTimer();
  };

  document.getElementById('reelPrev').addEventListener('click', () => render(current - 1));
  document.getElementById('reelNext').addEventListener('click', () => render(current + 1));
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? '再生' : '一時停止';
    resetTimer();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(timer);
    else resetTimer();
  });

  render(0);
})();
