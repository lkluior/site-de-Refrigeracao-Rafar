const track = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const dotsContainer = document.querySelector('.dots');

let index = 0;
let interval;

/* criar bolinhas */
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dotsContainer.appendChild(dot);

  dot.addEventListener('click', () => {
    index = i;
    updateCarousel();
  });
});

const dots = document.querySelectorAll('.dots span');

/* atualizar */
function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;

  dots.forEach(d => d.classList.remove('active'));
  dots[index].classList.add('active');
}

/* botões */
nextBtn.onclick = () => {
  index = (index + 1) % slides.length;
  updateCarousel();
};

prevBtn.onclick = () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
};

/* autoplay */
function startAuto() {
  interval = setInterval(() => {
    index = (index + 1) % slides.length;
    updateCarousel();
  }, 4000);
}

function stopAuto() {
  clearInterval(interval);
}

document.querySelector('.carousel').addEventListener('mouseenter', stopAuto);
document.querySelector('.carousel').addEventListener('mouseleave', startAuto);

startAuto();

//whatsapp
function enviarWhats(event) {
  event.preventDefault();

  const nome = document.querySelector('input[name="nome"]').value;
  const telefone = document.querySelector('input[name="telefone"]').value;
  const mensagem = document.querySelector('textarea[name="mensagem"]').value;

  const numero = "5579996778713"; // 🔴 seu número

  const texto =
`📋 *SOLICITAÇÃO DE ORÇAMENTO*

👤 *Cliente:* ${nome}
📞 *Telefone:* ${telefone}

🔧 *Serviço solicitado:*
${mensagem}

----------------------------

📍 Atendimento via site
💼 Refrigeração Pro

Aguardo retorno 👍`;

  const textoFormatado = encodeURIComponent(texto);

  window.open(`https://wa.me/${numero}?text=${textoFormatado}`, '_blank');
}



const elementos = document.querySelectorAll('.animar');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('ativo');
      observer.unobserve(entry.target); // anima só uma vez
    }
  });
}, {
  threshold: 0.2
});

elementos.forEach(el => observer.observe(el));