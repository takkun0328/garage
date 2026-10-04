(() => {
  const data = window.MAEDA_GALLERY_DATA;
  const media = document.getElementById('reelMedia');
  if (!data || !media) return;

  const allEntries = [
    ...data.photos.map(([id, date, title, comment, short, dateText]) => ({ id, date, title, comment, short, dateText, type: 'photo' })),
    ...data.videos.map(([id, date, title, comment, short, dateText]) => ({ id, date, title, comment, short, dateText, type: 'video' }))
  ];
  if (!allEntries.length) return;
  const compareDates = (a, b, newest = false) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return newest ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  };
  let entries = [...allEntries].sort(compareDates);

  const type = document.getElementById('reelType');
  const date = document.getElementById('reelDate');
  const title = document.getElementById('reelTitle');
  const comment = document.getElementById('reelComment');
  const counts = [...document.querySelectorAll('.reel-count')];
  const progressBars = [...document.querySelectorAll('.reel-progress-bar')];
  const toggles = [...document.querySelectorAll('.reel-toggle')];
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
    counts.forEach(count => { count.textContent = `${current + 1} / ${entries.length}`; });
    progressBars.forEach(progress => { progress.style.width = `${((current + 1) / entries.length) * 100}%`; });
    resetTimer();
  };

  document.querySelectorAll('.reel-prev').forEach(button => button.addEventListener('click', () => render(current - 1)));
  document.querySelectorAll('.reel-next').forEach(button => button.addEventListener('click', () => render(current + 1)));
  const orderButtons = [...document.querySelectorAll('.reel-order')];
  const orderDescription = document.getElementById('reelOrderDescription');
  orderButtons.forEach(button => button.addEventListener('click', () => {
    const order = button.dataset.order;
    entries = [...allEntries];
    if (order === 'random') {
      for (let i = entries.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [entries[i], entries[j]] = [entries[j], entries[i]];
      }
    } else {
      entries.sort((a, b) => compareDates(a, b, order === 'newest'));
    }
    orderButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    if (orderDescription) orderDescription.textContent = order === 'random'
      ? '写真と動画を、ランダムな順番で大きく映し出します。'
      : order === 'newest'
        ? '写真と動画を、新しい日付から大きく映し出します。'
        : '写真と動画を、古い日付から大きく映し出します。';
    render(0);
  }));
  toggles.forEach(toggle => toggle.addEventListener('click', () => {
    paused = !paused;
    toggles.forEach(button => { button.textContent = paused ? '再生' : '一時停止'; });
    resetTimer();
  }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(timer);
    else resetTimer();
  });

  render(0);
})();
