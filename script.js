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
