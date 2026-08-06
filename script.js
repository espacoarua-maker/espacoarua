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
    link.dataset.leadProfessional = 'cassio';
    link.dataset.leadPlacement = index === 0 ? 'hero' : 'contact';
    link.dataset.leadServiceMode = 'general';
  });

  document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
    // O rastreio de WhatsApp é centralizado neste arquivo para evitar
    // disparos duplicados pelos listeners genéricos de tracking.js.
    link.removeAttribute('data-track-event');
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

function isAnalyticsMeasurementActive() {
  if (getStoredAnalyticsConsent() === 'granted') {
    return true;
  }

  // Mantém o rastreio funcional quando o navegador aceita o consentimento,
  // mas bloqueia a leitura do localStorage. A tag só existe após a aceitação.
  return Boolean(
    document.querySelector('script[data-arua-source="google-tag"]')
  );
}

function getWhatsAppEventContext(link) {
  const href = link.href || '';
  const professional =
    link.dataset.leadProfessional ||
    (href.includes('5551999590970') ? 'paola' : 'cassio');

  let placement = link.dataset.leadPlacement || 'team';
  if (!link.dataset.leadPlacement) {
    const section = link.closest('section[id]');
    if (section?.id === 'hero') {
      placement = 'hero';
    } else if (section?.id === 'contato') {
      placement = 'contact';
    }
  }

  const serviceMode = link.dataset.leadServiceMode || 'general';
  let eventName = 'whatsapp_click';

  if (professional === 'paola') {
    eventName = 'whatsapp_paola';
  } else if (placement === 'hero') {
    eventName = 'whatsapp_cassio_hero';
  } else if (placement === 'contact') {
    eventName = 'whatsapp_cassio_contact';
  } else {
    eventName = 'whatsapp_cassio';
  }

  return { professional, placement, serviceMode, eventName };
}

function openWhatsAppAfterTracking(link, callback) {
  const destination = link.href;
  const openInNewTab = link.target === '_blank';
  let destinationWindow = null;

  if (openInNewTab) {
    try {
      destinationWindow = window.open('about:blank', '_blank');
      if (destinationWindow) {
        destinationWindow.opener = null;
        destinationWindow.document.title = 'Abrindo WhatsApp…';
        destinationWindow.document.body.textContent = 'Abrindo WhatsApp…';
      }
    } catch (error) {
      destinationWindow = null;
    }
  }

  let completed = false;
  let fallbackTimer = null;

  const navigate = () => {
    if (completed) {
      return;
    }
    completed = true;

    if (fallbackTimer) {
      window.clearTimeout(fallbackTimer);
    }

    if (destinationWindow && !destinationWindow.closed) {
      destinationWindow.location.replace(destination);
    } else {
      window.location.assign(destination);
    }
  };

  fallbackTimer = window.setTimeout(navigate, 1200);
  callback(navigate);
}

function bindReliableWhatsAppLeadTracking() {
  if (window.__ARUA_WHATSAPP_LEAD_TRACKING__) {
    return;
  }
  window.__ARUA_WHATSAPP_LEAD_TRACKING__ = true;

  let lastClickHref = '';
  let lastClickTime = 0;

  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest('a[href*="wa.me/"]');

      if (!link) {
        return;
      }

      if (
        !isAnalyticsMeasurementActive() ||
        typeof window.gtag !== 'function'
      ) {
        return;
      }

      const now = Date.now();
      if (link.href === lastClickHref && now - lastClickTime < 1500) {
        event.preventDefault();
        return;
      }
      lastClickHref = link.href;
      lastClickTime = now;

      event.preventDefault();

      const config = window.ARUA_TRACKING_CONFIG || {};
      const context = getWhatsAppEventContext(link);
      const commonParameters = {
        send_to: config.ga4MeasurementId,
        lead_source: 'whatsapp',
        contact_method: 'whatsapp',
        professional: context.professional,
        placement: context.placement,
        service_mode: context.serviceMode,
        link_url: link.href,
        link_text: link.textContent.trim(),
        page_location: window.location.href,
        transport_type: 'beacon'
      };

      openWhatsAppAfterTracking(link, (navigate) => {
        window.gtag('event', 'conversion_event_contact_1', {
          event_callback: navigate,
          event_timeout: 2000
        });
        window.gtag('event', context.eventName, commonParameters);
        window.gtag('event', 'generate_lead', {
          ...commonParameters,
          original_event_name: context.eventName,
          event_callback: navigate,
          event_timeout: 1000
        });
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
