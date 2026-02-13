// Valentine.js - shared script for three separate pages
document.addEventListener('DOMContentLoaded', () => {
  // NO button behavior only applies on the proposition page
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const askSection = document.getElementById('page-2') || document.querySelector('.page-proposition');

  // Helper to compute center distance
  function centerDistance(aRect, bRect){
    const ax = aRect.left + aRect.width/2;
    const ay = aRect.top + aRect.height/2;
    const bx = bRect.left + bRect.width/2;
    const by = bRect.top + bRect.height/2;
    return Math.hypot(ax - bx, ay - by);
  }

  // Place No initially inside the choices area (static)
  function placeNoInitial(){
    if(!noBtn) return;
    const choices = document.getElementById('choices');
    if(!choices) return;
    noBtn.style.transition = 'left 220ms ease, top 220ms ease';
    noBtn.style.position = 'absolute';

    const cRect = choices.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const startLeft = Math.min(cRect.width - btnRect.width - 12, (cRect.width * 0.62));
    const startTop = Math.max(8, (cRect.height / 2) - (btnRect.height / 2));

    noBtn.style.left = startLeft + 'px';
    noBtn.style.top = startTop + 'px';
  }

  // Move No randomly inside the card but avoid being too close to Yes
  function moveNoRandomly(){
    if(!noBtn) return;
    const card = document.querySelector('.card-center') || document.querySelector('.card');
    const yes = document.getElementById('yesBtn');
    if(!card || !yes) return;

    const cardRect = card.getBoundingClientRect();
    const yesRect = yes.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();

    const padding = 12;
    const maxLeft = Math.max(0, cardRect.width - btnRect.width - padding*2);
    const maxTop = Math.max(0, cardRect.height - btnRect.height - padding*2);

    const minDistance = Math.max(120, Math.min(cardRect.width, cardRect.height) * 0.18);

    let attempts = 0;
    let left = 0, top = 0, candidateRect, dist;
    do {
      left = Math.floor(Math.random() * maxLeft) + padding;
      top = Math.floor(Math.random() * maxTop) + padding;
      candidateRect = { left: cardRect.left + left, top: cardRect.top + top, width: btnRect.width, height: btnRect.height };
      dist = centerDistance(candidateRect, yesRect);
      attempts++;
    } while (dist < minDistance && attempts < 20);

    noBtn.style.left = left + 'px';
    noBtn.style.top = top + 'px';
  }

  // Attach behavior only if the proposition page is present
  if(document.querySelector('.page-proposition') || document.getElementById('choices') ){
    // initial placement
    setTimeout(placeNoInitial, 80);

    if(noBtn){
      // normal hover
      noBtn.addEventListener('mouseenter', moveNoRandomly);
      noBtn.addEventListener('mouseover', (e) => {
        if(e.target === noBtn) moveNoRandomly();
      });

      // touch handling
      let lastTouch = 0;
      noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const now = Date.now();
        if(now - lastTouch > 300){
          moveNoRandomly();
          lastTouch = now;
        }
      }, {passive:false});

      // if clicked somehow, nudge away
      noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoRandomly();
      });

      // >>> NEW PROXIMITY HOVER <<<
      document.addEventListener("mousemove", (e) => {
        const rect = noBtn.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // how close before it runs (increase this number to increase range)
        const PROXIMITY = 300; 

        const dx = mouseX - (rect.left + rect.width/2);
        const dy = mouseY - (rect.top + rect.height/2);
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < PROXIMITY) {
          moveNoRandomly();
        }
      });
      // >>> END NEW PROXIMITY HOVER <<<
    }
  }

  // Floating hearts background
  (function createHearts(){
    const heartsBg = document.querySelector('.hearts-bg');
    if(!heartsBg) return;
    const isSmall = window.matchMedia('(max-width:420px)').matches;
    const HEART_COUNT = isSmall ? 10 : 28;
    for(let i=0;i<HEART_COUNT;i++){
      const h = document.createElement('div');
      h.className = 'heart';
      const size = (isSmall ? 8 : 12) + Math.floor(Math.random()*36);
      h.style.width = size + 'px';
      h.style.height = size + 'px';
      h.style.left = Math.floor(Math.random()*100) + 'vw';
      h.style.top = Math.floor(60 + Math.random()*40) + 'vh';
      h.style.background = `rgba(255,255,255,${0.04 + Math.random()*0.18})`;
      const dur = 8 + Math.random()*22;
      h.style.animationDuration = dur + 's';
      h.style.animationDelay = (-Math.random()*dur) + 's';
      heartsBg.appendChild(h);
    }
  })();

  // Reposition No on resize if proposition page is active
  window.addEventListener('resize', () => {
    if(document.getElementById('choices')) placeNoInitial();
  });
});
