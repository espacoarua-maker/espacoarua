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


const initialPagePosition = {
  x: window.scrollX,
  y: window.scrollY,
  hasHash: Boolean(window.location.hash)
};

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

function restoreInitialViewport() {
  const activeElement = document.activeElement;

  if (
    activeElement &&
    activeElement.matches('[data-cookie-accept], [data-cookie-reject]')
  ) {
    activeElement.blur();
  }

  if (initialPagePosition.hasHash) {
    return;
  }

  window.requestAnimationFrame(() => {
    window.scrollTo({
      left: initialPagePosition.x,
      top: initialPagePosition.y,
      behavior: 'auto'
    });
  });
}

function getStoredAnalyticsConsent() {
  const config = window.ARUA_TRACKING_CONFIG || {};
  const storageKey =
    config.consentStorageKey || 'arua-analytics-consent-v1';

  try {
    return localStorage.getItem(storageKey);
  } catch (error) {
    return null;
  }
}

function getWhatsAppEventContext(eventName) {
  const professional = eventName.includes('paola') ? 'paola' : 'cassio';

  let placement = 'team';
  if (eventName.includes('hero')) {
    placement = 'hero';
  } else if (eventName.includes('contact')) {
    placement = 'contact';
  }

  return { professional, placement };
}

function bindReliableWhatsAppLeadTracking() {
  if (window.__ARUA_WHATSAPP_LEAD_TRACKING__) {
    return;
  }
  window.__ARUA_WHATSAPP_LEAD_TRACKING__ = true;

  document.addEventListener(
    'click',
    (event) => {
      const link = event.target.closest(
        'a[href*="wa.me/"][data-track-event]'
      );

      if (!link || getStoredAnalyticsConsent() !== 'granted') {
        return;
      }

      const config = window.ARUA_TRACKING_CONFIG || {};
      if (!config.ga4MeasurementId || typeof window.gtag !== 'function') {
        return;
      }

      const originalEventName = link.dataset.trackEvent || 'whatsapp_click';
      const context = getWhatsAppEventContext(originalEventName);

      window.gtag('event', 'generate_lead', {
        send_to: config.ga4MeasurementId,
        lead_source: 'whatsapp',
        contact_method: 'whatsapp',
        professional: context.professional,
        placement: context.placement,
        original_event_name: originalEventName,
        link_url: link.href,
        link_text: link.textContent.trim(),
        page_location: window.location.href,
        transport_type: 'beacon',
        event_timeout: 1000
      });
    },
    true
  );
}

loadAruaTrackingScript('tracking-config.js')
  .then(() => loadAruaTrackingScript('tracking.js'))
  .then(() => {
    restoreReferenceWhatsAppButtons();
    restoreInitialViewport();
    bindReliableWhatsAppLeadTracking();
  })
  .catch(() => {
    // Falhas de mensuração não impedem o funcionamento do site.
  });