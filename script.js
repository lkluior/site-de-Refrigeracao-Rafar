/* ==============================================
   REFRIGERAÇÃO RAFAR — script.js
   • Flocos de neve interativos (Canvas)
   • Header scroll effect
   • Menu mobile
   • Scroll reveal animations
   • Contador de números animado
   • WhatsApp form
============================================== */

'use strict';

// ─────────────────────────────────────────────
// 1. FLOCOS DE NEVE INTERATIVOS — Canvas
// ─────────────────────────────────────────────
(function initSnow() {
  const canvas = document.getElementById('snowCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, flakes = [], mouse = { x: -9999, y: -9999 };
  const FLAKE_COUNT = 60;
  const MOUSE_RADIUS = 100;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Rastrear posição do mouse
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // ── Classe Floco ──
  class Snowflake {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x     = Math.random() * W;
      this.y     = initial ? Math.random() * H : -20;
      this.r     = 2 + Math.random() * 5;          // raio (tamanho)
      this.speed = 0.4 + Math.random() * 0.8;      // velocidade de queda
      this.wind  = (Math.random() - 0.5) * 0.4;    // deriva horizontal
      this.alpha = 0.3 + Math.random() * 0.5;
      this.angle = Math.random() * Math.PI * 2;    // ângulo inicial do floco
      this.spin  = (Math.random() - 0.5) * 0.02;  // velocidade de rotação
      this.vx    = 0;                              // velocidade extra X (interação)
      this.vy    = 0;                              // velocidade extra Y (interação)
    }

    update() {
      // Interação com o mouse — repulsão suave
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        const angle = Math.atan2(dy, dx);
        this.vx += Math.cos(angle) * force * 1.5;
        this.vy += Math.sin(angle) * force * 1.5;
      }

      // Amortecimento da velocidade de interação
      this.vx *= 0.92;
      this.vy *= 0.92;

      // Movimento principal
      this.x     += this.wind + this.vx;
      this.y     += this.speed + this.vy;
      this.angle += this.spin;

      // Reciclar floco ao sair da tela
      if (this.y > H + 20 || this.x < -30 || this.x > W + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = '#9ecfef';
      ctx.lineWidth   = this.r * 0.18;
      ctx.lineCap     = 'round';

      // Desenhar floco de 6 braços
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * i);

        // Braço principal
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.r);
        ctx.stroke();

        // Ramificações
        const arm = this.r * 0.55;
        ctx.beginPath();
        ctx.moveTo(0, -arm);
        ctx.lineTo(-this.r * 0.28, -arm - this.r * 0.28);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -arm);
        ctx.lineTo( this.r * 0.28, -arm - this.r * 0.28);
        ctx.stroke();

        ctx.restore();
      }

      // Ponto central
      ctx.beginPath();
      ctx.arc(0, 0, this.r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = '#9ecfef';
      ctx.fill();

      ctx.restore();
    }
  }

  // Criar flocos
  for (let i = 0; i < FLAKE_COUNT; i++) {
    flakes.push(new Snowflake());
  }

  // Loop de animação
  function animate() {
    ctx.clearRect(0, 0, W, H);
    flakes.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


// ─────────────────────────────────────────────
// 2. HEADER — efeito de scroll
// ─────────────────────────────────────────────
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ─────────────────────────────────────────────
// 3. MENU MOBILE — hamburger
// ─────────────────────────────────────────────
(function initMenu() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar ao clicar em link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


// ─────────────────────────────────────────────
// 4. SCROLL REVEAL — Intersection Observer
// ─────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();


// ─────────────────────────────────────────────
// 5. CONTADOR ANIMADO — seção de stats
// ─────────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 4);

  const animate = (el, target, duration = 1600) => {
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animate(el, parseInt(el.dataset.target, 10));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


// ─────────────────────────────────────────────
// 6. FORMULÁRIO — envio via WhatsApp
// ─────────────────────────────────────────────
function enviarWhats(event) {
  event.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const mensagem = document.getElementById('mensagem').value.trim();
  const numero   = '5579996778713';

  const texto =
`📋 *SOLICITAÇÃO DE ORÇAMENTO*

👤 *Cliente:* ${nome}
📞 *Telefone:* ${telefone}

🔧 *Serviço solicitado:*
${mensagem}

----------------------------
📍 Atendimento via site Rafar Ar`;

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}


// ─────────────────────────────────────────────
// 7. CURSOR PARALAX leve nos cards
// ─────────────────────────────────────────────
(function initCardTilt() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);  // -1 a 1
      const dy   = (e.clientY - cy) / (rect.height / 2);  // -1 a 1
      card.style.transform = `translateY(-8px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();