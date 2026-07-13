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

    button.setAttribute(
      'aria-expanded',
      String(!isExpanded)
    );

    content.hidden = isExpanded;

    label.textContent = isExpanded
      ? 'Saiba mais'
      : 'Mostrar menos';
  });
});
