/* ============================================
   ななつ星調剤薬局 - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- 北斗七星の線を描画 ---
  const constellation = document.querySelector('.hero-constellation');
  if (constellation) {
    const stars = constellation.querySelectorAll('.constellation-star');
    if (stars.length >= 7) {
      const positions = [];
      stars.forEach(s => {
        positions.push({
          x: parseFloat(s.style.left || getComputedStyle(s).left),
          y: parseFloat(s.style.top || getComputedStyle(s).top)
        });
      });

      // 北斗七星: α→β→γ→δ→ε→ζ→η 一筆書き
      const pairs = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]];

      pairs.forEach(([a, b]) => {
        const sa = stars[a], sb = stars[b];
        const ax = sa.offsetLeft + sa.offsetWidth / 2;
        const ay = sa.offsetTop + sa.offsetHeight / 2;
        const bx = sb.offsetLeft + sb.offsetWidth / 2;
        const by = sb.offsetTop + sb.offsetHeight / 2;
        const dx = bx - ax, dy = by - ay;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        const line = document.createElement('div');
        line.className = 'constellation-line';
        line.style.width = len + 'px';
        line.style.left = ax + 'px';
        line.style.top = ay + 'px';
        line.style.transform = 'rotate(' + angle + 'deg)';
        constellation.appendChild(line);
      });
    }
  }

  // --- ページ全体の星パーティクル ---
  const globalStars = document.createElement('div');
  globalStars.className = 'global-stars';
  document.body.prepend(globalStars);

  const STAR_COUNT = 40;
  const starChars = ['★', '✦', '✧', '☆'];
  for (let i = 0; i < STAR_COUNT; i++) {
    const s = document.createElement('span');
    s.className = 'global-star';
    s.textContent = starChars[Math.floor(Math.random() * starChars.length)];
    const size = (Math.random() * 14 + 8).toFixed(0);
    // 中央のテキスト領域を避けて左右に配置
    const x = (Math.random() < 0.5
      ? Math.random() * 15          // 左端 0〜15%
      : 85 + Math.random() * 15     // 右端 85〜100%
    ).toFixed(1);
    const y = (Math.random() * 100).toFixed(1);
    const dur = (Math.random() * 6 + 5).toFixed(1);
    const delay = (Math.random() * 8).toFixed(1);
    const minOp = (Math.random() * 0.06 + 0.04).toFixed(3);
    const maxOp = (Math.random() * 0.15 + 0.1).toFixed(3);
    s.style.cssText = 'font-size:' + size + 'px;left:' + x + '%;top:' + y + '%;--dur:' + dur + 's;--delay:-' + delay + 's;--min-op:' + minOp + ';--max-op:' + maxOp;
    globalStars.appendChild(s);
  }

  // --- About スライドショー ---
  const slides = document.querySelectorAll('.about-slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 4000);
  }

  // --- ヘッダースクロール ---
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    if (scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // --- ハンバーガーメニュー ---
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) toggleMenu();
    });
  });

  // --- スクロールアニメーション ---
  const animateElements = document.querySelectorAll(
    '.about-content, .point-item, .info-card, .faq-list, .access-content, .contact-card'
  );

  animateElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animateElements.forEach(el => observer.observe(el));

  // --- スムーズスクロール（Safari対応） ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- 星バースト共通関数 ---
  const burstChars = ['★', '✦', '✧', '☆', '⭐'];
  function burstStar(star, e) {
    if (e.type === 'touchstart') e.preventDefault();
    const rect = star.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const burstCount = 6 + Math.floor(Math.random() * 4);
    for (let i = 0; i < burstCount; i++) {
      const p = document.createElement('span');
      p.className = 'star-burst-particle';
      p.textContent = burstChars[Math.floor(Math.random() * burstChars.length)];
      const angle = (Math.PI * 2 / burstCount) * i + (Math.random() - 0.5) * 0.5;
      const dist = 30 + Math.random() * 40;
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.fontSize = (6 + Math.random() * 8).toFixed(0) + 'px';
      p.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
    star.style.opacity = '0';
    star.style.transform = 'scale(0)';
    star.style.transition = 'opacity 0.15s, transform 0.15s';
    setTimeout(() => {
      star.style.transition = 'opacity 0.5s, transform 0.5s';
      star.style.opacity = '';
      star.style.transform = '';
    }, 600);
  }

  function addBurst(star) {
    star.style.pointerEvents = 'auto';
    star.style.cursor = 'pointer';
    star.addEventListener('click', (e) => burstStar(star, e));
    star.addEventListener('touchstart', (e) => burstStar(star, e), { passive: false });
  }

  // --- ヒーロー星のバーストエフェクト ---
  document.querySelectorAll('.hero-star').forEach(addBurst);

  // --- セクション両サイドの星デコレーション ---
  const decorSections = document.querySelectorAll('.services, .info, .faq, .access, .contact');
  const sideStarChars = ['★', '✦', '✧', '☆', '⭐'];

  decorSections.forEach(sec => {
    ['left', 'right'].forEach(side => {
      const wrap = document.createElement('div');
      wrap.className = 'section-stars section-stars--' + side;
      const count = 4 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.textContent = sideStarChars[Math.floor(Math.random() * sideStarChars.length)];
        const size = (Math.random() * 14 + 10).toFixed(0);
        const x = (Math.random() * 40 + 10).toFixed(0);
        const y = (Math.random() * 90 + 5).toFixed(0);
        const dur = (Math.random() * 5 + 5).toFixed(1);
        const delay = (Math.random() * 6).toFixed(1);
        const minOp = (Math.random() * 0.08 + 0.06).toFixed(3);
        const maxOp = (Math.random() * 0.2 + 0.15).toFixed(3);
        s.style.cssText = 'font-size:' + size + 'px;left:' + x + '%;top:' + y + '%;--dur:' + dur + 's;--delay:-' + delay + 's;--min-op:' + minOp + ';--max-op:' + maxOp;
        wrap.appendChild(s);
      }
      sec.appendChild(wrap);
    });
  });

  // --- グローバル星・セクション星のバースト ---
  globalStars.style.pointerEvents = 'auto';
  globalStars.querySelectorAll('.global-star').forEach(addBurst);
  document.querySelectorAll('.section-stars span').forEach(addBurst);

  // --- 電話リンク（PCでは確認ダイアログ） ---
  if (!/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (!confirm('電話番号をコピーしますか？\n' + link.textContent.trim())) {
          e.preventDefault();
        }
      });
    });
  }

});
