const moreButtons = document.querySelectorAll('.more-link');

moreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const contentId = button.getAttribute('aria-controls');
    const content = document.getElementById(contentId);
    const label = button.querySelector('.more-label');

    if (!content || !label) {
      return;
    }

    const isExpanded =
      button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!isExpanded));
    content.hidden = isExpanded;

    label.textContent = isExpanded
      ? 'Saiba mais'
      : 'Mostrar menos';
  });
});


const gallery = document.querySelector('.partner-space-gallery');

if (gallery) {
  const images = gallery.querySelectorAll('.gallery-image');
  const dots = gallery.querySelectorAll('.gallery-dot');
  const previousButton = gallery.querySelector('.gallery-prev');
  const nextButton = gallery.querySelector('.gallery-next');

  let currentImage = 0;

  function showImage(index) {
    images[currentImage].classList.remove('is-active');
    dots[currentImage].classList.remove('is-active');

    currentImage = (index + images.length) % images.length;

    images[currentImage].classList.add('is-active');
    dots[currentImage].classList.add('is-active');
  }

  previousButton.addEventListener('click', () => {
    showImage(currentImage - 1);
  });

  nextButton.addEventListener('click', () => {
    showImage(currentImage + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showImage(index);
    });
  });
}


function loadAruaTrackingScript(source) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = source;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function restoreReferenceWhatsAppButtons() {
  const referenceWhatsAppUrl =
    'https://wa.me/5551982914845?text=Olá!%20Conheci%20o%20Espaço%20Aruã%20pelo%20site%20e%20gostaria%20de%20agendar%20um%20atendimento.';

  const genericButtons = Array.from(
    document.querySelectorAll('a.button')
  ).filter((link) => !link.classList.contains('team-button'));

  genericButtons.forEach((link, index) => {
    link.href = referenceWhatsAppUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Agendar atendimento';
    link.dataset.trackEvent =
      index === 0
        ? 'whatsapp_cassio_hero'
        : 'whatsapp_cassio_contact';
  });
}

loadAruaTrackingScript('tracking-config.js')
  .then(() => loadAruaTrackingScript('tracking.js'))
  .then(restoreReferenceWhatsAppButtons)
  .catch(() => {
    // Falhas de mensuração não impedem o funcionamento do site.
  });
