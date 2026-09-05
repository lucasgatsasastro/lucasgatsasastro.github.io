/* lucasgatsas.com — footer year + lightbox gallery (same as lucasgatsas.ch)
   Any <figure class="lb"> with <button class="lb-btn"><img></button> joins the lightbox.
   In addition, every image inside .post-body (post content) is clickable too. */
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  var items = [], triggers = [];

  document.querySelectorAll('figure.lb').forEach(function (f) {
    var im = f.querySelector('img'), fc = f.querySelector('figcaption'), b = f.querySelector('.lb-btn');
    if (!im) return;
    items.push({ src: im.getAttribute('data-full') || im.getAttribute('src'), alt: im.alt || '', caption: fc ? fc.textContent.trim() : (im.alt || '') });
    triggers.push(b || im);
  });

  document.querySelectorAll('.post-body img').forEach(function (im) {
    if (im.closest('figure.lb') || im.closest('a')) return;
    var box = im.closest('.gallery-box'), em = box ? box.querySelector('em') : null;
    items.push({ src: im.getAttribute('data-full') || im.getAttribute('src'), alt: im.alt || '', caption: em ? em.textContent.trim() : (im.alt || '') });
    triggers.push(im);
  });

  if (!items.length) return;

  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Image view');
  box.innerHTML =
    '<button type="button" class="close" aria-label="Close">×</button>' +
    '<button type="button" class="nav-btn prev" aria-label="Previous image">‹</button>' +
    '<button type="button" class="nav-btn next" aria-label="Next image">›</button>' +
    '<img src="" alt="">' +
    '<figcaption></figcaption>' +
    '<div class="counter"></div>';
  document.body.appendChild(box);

  var img = box.querySelector('img'), cap = box.querySelector('figcaption'), counter = box.querySelector('.counter');
  var closeBtn = box.querySelector('.close'), prevBtn = box.querySelector('.prev'), nextBtn = box.querySelector('.next');
  var current = 0, lastTrigger = null;

  if (items.length < 2) { prevBtn.hidden = true; nextBtn.hidden = true; }

  function show(i) {
    current = (i + items.length) % items.length;
    var it = items[current];
    img.src = it.src; img.alt = it.alt;
    cap.textContent = it.caption;
    counter.textContent = items.length > 1 ? (current + 1) + ' / ' + items.length : '';
  }
  function open(i, trigger) {
    lastTrigger = trigger || null;
    show(i);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  triggers.forEach(function (t, i) {
    t.addEventListener('click', function (e) { e.preventDefault(); open(i, t); });
  });
  closeBtn.addEventListener('click', function (e) { e.stopPropagation(); close(); });
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
  box.addEventListener('click', close);
  img.addEventListener('click', function (e) { e.stopPropagation(); });
  cap.addEventListener('click', function (e) { e.stopPropagation(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && items.length > 1) show(current - 1);
    else if (e.key === 'ArrowRight' && items.length > 1) show(current + 1);
  });

  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null || items.length < 2) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) show(dx < 0 ? current + 1 : current - 1);
  }, { passive: true });
})();
