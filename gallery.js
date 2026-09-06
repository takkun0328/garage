// 写真：ファイル名、撮影日（不明は空欄）、タイトル、コメント。
// 動画：YouTube ID、タイトルに記載された撮影日時、タイトル、コメント。
// 撮影日が不明な項目は最後に表示。アップロード日では並べません。
(() => {
  const photos = [
    ['ajno0304','2024-10-27T10:08:33','並んだ相棒たち','ツーリングの途中、バイクを並べてひと休み。'],
    ['img_2459','2024-01-01T13:54:43','元日のZRX400','新しい年も、緑の相棒とともに。'],
    ['img_2641','2024-04-28T12:03:18','天狗高原での一枚','霧に包まれた高原も、バイクと訪れた大切な景色。'],
    ['img_2799','2024-06-29T11:52:24','CB400SFとKAZUMA','家族で手をかけたCB400SFと、ガレージでの笑顔。'],
    ['img_3015','2025-04-06T10:56:44','桜と隼','春の光の中に佇む、白と青の一台。'],
    ['img_3065','2025-04-14T09:33:42','桜の下のCB400SF','季節の景色も、相棒と一緒に残していく。'],
    ['img_3078','2025-04-20T09:34:57','海を望む道で','TAKENOBUがレンタルのクロスカブで、香川県の小豆島を一周ツーリングしたときの一枚。海を望む道でひと休み。島を巡った時間も、大切なバイクの思い出。'],
    ['img_3118','2025-05-04T15:03:27','海辺の記念写真','バイクを停めて、青い海を背景に。'],
    ['img_3125','2025-05-05T17:00:59','旅先で笑顔の一枚','走る楽しさが、表情にも。'],
    ['img_3261','2025-08-17','修理中のZRX400','知り合いの方の手を借りて修理中。また走れる日を楽しみに。'],
    ['img_3293','2025-09-13T14:46:57','DAEGが家族に仲間入り','DAEGが前田家の一員になった日の記念写真。これから家族と一緒に、たくさんの思い出を重ねていく相棒です。'],
    ['img_3307','2025-09-14T14:44:52','CB400SFと過ごす休日','手をかけてきた一台と、思い出を重ねて。'],
    ['img_3330','2025-09-27T11:45:57','DAEGとひと休み','道の途中で残した、相棒との一枚。'],
    ['img_3332','2025-09-28T10:32:57','2台で並んだ日','一緒に走ると、休憩の時間も思い出になる。'],
    ['img_3344','2025-09-28T16:36:19','ガレージのCB400SF','身近なガレージにも、バイクと笑える時間がある。'],
    ['img_3360','2025-10-05T16:49:13','借りたNS250Rと','ZRX400の修理をお願いしている方から借りた一台。復活を待つ間にも、新しい思い出が増えていく。'],
    ['img_3526','2025-11-08T15:54:54','紅葉の下でひと休み','NS250RとDAEGを並べて、秋の道でのんびり。'],
    ['img_3619','2025-11-23T11:11:39','秋晴れのDAEG','UFOラインで、石鎚山を背景に撮影した一枚。澄んだ秋空の下、DAEGと一緒に眺めた大切な景色。'],
    ['img_3949','2026-04-06T10:28:22','桜とCB400SF','何度も修理を重ねてきた相棒と、また春の景色へ。'],
    ['img_4060','2026-05-17T15:05:21','家族で手をかけるAPE50','3年間放置されていた一台。家族で一緒に直してきた、大切な相棒。'],
    ['img_4078','2026-05-30T10:37:57','APE50の修理の記録','家族で力を合わせて、完成を目指した時間。'],
    ['img_4119','2026-06-30','NS250Rで走る道','三坂峠を走るRYUSEIを友達が撮影。懐かしい風合いに加工した一枚は、40年前のバイクと現代のRYUSEIが、一緒に過去へタイムスリップしたよう。時代を越えて走る姿に、どこか胸が熱くなる。'],
    ['img_e2451','1995','誌面に残るバイクの思い出','約31年前の冬、学生だったTAKENOBUがMJバイクの「写らん会」に参加したときの記事。当時はお金がなく、愛車はHONDA タクト50。ずっとバイクに憧れていました。あの頃の憧れとタクト50の思い出は、今、家族とバイクを楽しむ時間へとつながっています。',false,'1995年・冬（約31年前）'],
    ['img_e3258','2025-08-15T14:34:33','夏のCB400SF','青空の下、相棒と残した夏の一枚。'],
    ['irta7147','2024-10-27T11:56:56','ツーリング先で、また修理へ','転倒でエンジンカバーが割れ、自走不能に。楽しさだけではない、この日も家族とCB400SFの大切な記録。']
  ];
  const videos = [
    ['_lndrJSbTvE','2026-05-30T10:39:50','APE50を修理するRYOUYA','家族で一緒に直してきたAPE50。完成に向けて、RYOUYAも手を動かす。'],
    ['s1MViLMHtvk','2026-04-18T13:19:05','APE50とRYOUYA','譲り受けた一台が、RYOUYAの相棒になっていく。'],
    ['VE4bEwhigbo','2023-11-16T15:38:00','ZRX400で駆け抜けるRYUSEI','緑の相棒と走った道を、動画でも振り返る。'],
    ['0EiiX6ucxH0','2025-11-16T16:02:53','レンタルのスーパーカブ125で遊ぶTAKENOBU','いつもとは違う相棒で楽しむ、バイクの時間。'],
    ['vuOx5p6Ae1c','2026-05-31T13:11:39','修理完成のAPE50で旅立つRYOUYA','家族みんなで直したAPE50が、ついに完成。今ではRYOUYAが毎日楽しく乗っています。'],
    ['_R_BKrmnLuo','2025-09-28T16:20:06','ダエグとRYUSEI','DAEGと過ごすひとときを、音と動きでも。'],
    ['9qWUupa--Fs','2026-01-01T17:10:15','APE50とKAZUMAとRYOUYA','年の始まりにも、バイクを囲む家族の時間。'],
    ['gPZlNhZN6aI','2025-10-05T16:50:47','NS250RとRYUSEI','ZRX400の復活を待ちながら、借りたNS250Rで思い出を重ねる。'],
    ['c7NCP_uGF1I','2026-08-16T09:31:00','ZRX1200ダエグMAVERICKマフラー音','DAEGの音も、ガレージの思い出に。',true],
    ['Zxtvb7ymNLc','2024-06-29T11:54:00','CB400SFとKAZUMA','家族で手をかけてきたCB400SF。写真と一緒に、この日の姿を残して。']
  ];
  const grid = document.getElementById('photos');
  if (!grid) return;
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text) node.textContent = text;
    return node;
  };
  const entries = [...grid.querySelectorAll(':scope > article')].map(card => ({card, date: card.querySelector('time')?.dateTime || ''}));
  const make = (row, video) => {
    const [id,date,title,comment,short,dateText] = row;
    const card = el('article','memory-card');
    const media = el('div',video ? 'memory-video' + (short ? ' is-short' : '') : 'memory-photo');
    if (video) {
      const frame = el('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id;
      frame.title = title;
      frame.loading = 'lazy';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.allowFullscreen = true;
      media.append(frame);
    } else {
      const img = el('img');
      img.src = 'images/gallery/' + id + '.jpg';
      img.alt = title;
      img.loading = 'lazy';
      img.decoding = 'async';
      media.append(img);
    }
    const body = el('div','memory-body');
    const dateLabel = el(date ? 'time' : 'span','memory-date',dateText || (date ? date.slice(0,10).replaceAll('-','.') : '撮影日を確認中'));
    if (date) dateLabel.dateTime = date;
    body.append(dateLabel,el('h2','',title),el('p','',comment));
    if (video) {
      const link = el('a','','YouTubeで見る ↗');
      link.href = 'https://www.youtube.com/watch?v=' + id;
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      const p = el('p'); p.append(link); body.append(p);
    }
    card.append(media,body);
    return {card,date};
  };
  entries.push(...photos.map(r => make(r,false)), ...videos.map(r => make(r,true)));
  entries.sort((a,b) => (a.date || '9999').localeCompare(b.date || '9999'));
  const fragment = document.createDocumentFragment();
  let year;
  for (const entry of entries) {
    const group = entry.date ? entry.date.slice(0,4) : '撮影日を確認中';
    if (group !== year) { fragment.append(el('h2','memory-year',group)); year = group; }
    fragment.append(entry.card);
  }
  grid.replaceChildren(fragment);
})();
