const moreButtons = document.querySelectorAll('.more-link');

moreButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const contentId = button.getAttribute('aria-controls');
    const content = document.getElementById(contentId);

    if (!content) {
      return;
    }

    const isExpanded = button.getAttribute('aria-expanded') === 'true';

    button.setAttribute('aria-expanded', String(!isExpanded));
    content.hidden = isExpanded;

    const label = button.childNodes[0];

    if (label) {
      label.textContent = isExpanded
        ? 'Saiba mais '
        : 'Mostrar menos ';
    }
  });
});
