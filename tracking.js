(() => {
  'use strict';

  if (window.__ARUA_TRACKING_INITIALIZED__) {
    return;
  }
  window.__ARUA_TRACKING_INITIALIZED__ = true;

  const config = window.ARUA_TRACKING_CONFIG || {};
  const storageKey =
    config.consentStorageKey || 'arua-analytics-consent-v1';
  const hasMeasurement = Boolean(
    config.ga4MeasurementId || config.gtmContainerId || config.googleAdsId
  );

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  if (!window.__ARUA_CONSENT_DEFAULT_SET__) {
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    window.__ARUA_CONSENT_DEFAULT_SET__ = true;
  }

  let measurementLoaded = Boolean(
    document.querySelector(
      'script[data-arua-source="google-tag"], ' +
      'script[data-arua-source="google-tag-manager"]'
    )
  );

  function addStylesheet() {
    if (document.querySelector('link[href="tracking.css"]')) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'tracking.css';
    document.head.appendChild(link);
  }

  function ensureMeta(selector, attributes) {
    let element = document.head.querySelector(selector);

    if (!element) {
      element = document.createElement('meta');
      document.head.appendChild(element);
    }

    Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  function ensureCanonical() {
    if (document.head.querySelector('link[rel="canonical"]')) {
      return;
    }

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://aruaespaco.com.br/';
    document.head.appendChild(canonical);
  }

  function enhanceMetadata() {
    if (window.location.pathname.endsWith('privacidade.html')) {
      return;
    }

    document.title = 'Psicoterapia em São Leopoldo | Espaço Aruã';
    ensureCanonical();

    ensureMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website'
    });
    ensureMeta('meta[property="og:locale"]', {
      property: 'og:locale',
      content: 'pt_BR'
    });
    ensureMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'Espaço Aruã'
    });
    ensureMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: 'Psicoterapia em São Leopoldo | Espaço Aruã'
    });
    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: 'Atendimento psicológico presencial e online em São Leopoldo/RS.'
    });
    ensureMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: 'https://aruaespaco.com.br/'
    });
    ensureMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: 'https://aruaespaco.com.br/assets/hero2.jpg'
    });
    ensureMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image'
    });
  }

  function configureLink(element, eventName) {
    if (element) {
      element.dataset.trackEvent = eventName;
    }
  }

  function enhancePage() {
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'conteudo';
    }

    if (main && !document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.className = 'skip-link';
      skipLink.href = '#conteudo';
      skipLink.textContent = 'Ir para o conteúdo';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    const genericButtons = Array.from(
      document.querySelectorAll('a.button[href*="wa.me/5551982914845"]')
    ).filter((link) => !link.classList.contains('team-button'));

    genericButtons.forEach((link, index) => {
      link.href = '#equipe';
      link.removeAttribute('target');
      link.removeAttribute('rel');
      link.textContent = 'Escolher profissional';
      configureLink(
        link,
        index === 0
          ? 'choose_professional_hero'
          : 'choose_professional_contact'
      );
    });

    configureLink(
      document.querySelector('a[href*="wa.me/5551999590970"]'),
      'whatsapp_paola'
    );
    configureLink(
      document.querySelector('a.team-button[href*="wa.me/5551982914845"]'),
      'whatsapp_cassio'
    );
    configureLink(
      document.querySelector('a[href="https://www.instagram.com/espacoarua/"]'),
      'instagram_arua'
    );
    configureLink(
      document.querySelector(
        'a[href="https://www.instagram.com/brunarossiespacodesaude"]'
      ),
      'instagram_partner_space'
    );

    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
      heroImage.fetchPriority = 'high';
      heroImage.decoding = 'async';
    }

    document.querySelectorAll('.team-photo, .gallery-image').forEach((image) => {
      image.loading = 'lazy';
      image.decoding = 'async';
    });

    const footer = document.querySelector('.site-footer');
    if (footer && !footer.querySelector('[data-privacy-links]')) {
      const privacyLine = document.createElement('p');
      privacyLine.dataset.privacyLinks = '';
      privacyLine.innerHTML =
        '<a href="privacidade.html">Privacidade</a>' +
        '<span aria-hidden="true"> • </span>' +
        '<button class="footer-button" type="button" data-privacy-settings>' +
        'Preferências de privacidade</button>';

      const copyright = Array.from(footer.querySelectorAll('p')).find((item) =>
        item.textContent.includes('©')
      );
      footer.insertBefore(privacyLine, copyright || null);
    }
  }

  function createBanner() {
    let banner = document.querySelector('[data-cookie-banner]');
    if (banner) {
      return banner;
    }

    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.dataset.cookieBanner = '';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Preferências de privacidade');
    banner.setAttribute('aria-live', 'polite');
    banner.hidden = true;
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <p>
          Podemos usar métricas para entender como as pessoas encontram e
          utilizam o site do Espaço Aruã. Isso nos ajuda a melhorar a página e
          avaliar nossa divulgação. Você pode aceitar ou recusar; o site
          funciona normalmente nos dois casos.
          <a href="privacidade.html">Saiba mais</a>.
        </p>
        <div class="cookie-banner-actions">
          <button
            class="cookie-button cookie-button-secondary"
            type="button"
            data-cookie-reject>
            Recusar
          </button>
          <button
            class="cookie-button cookie-button-primary"
            type="button"
            data-cookie-accept>
            Aceitar métricas
          </button>
        </div>
      </div>`;

    document.body.appendChild(banner);
    return banner;
  }

  function getStoredConsent() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function storeConsent(value) {
    try {
      localStorage.setItem(storageKey, value);
    } catch (error) {
      // O site continua funcional quando o armazenamento estiver bloqueado.
    }
  }

  function loadScript(src, marker) {
    if (document.querySelector(`script[data-arua-source="${marker}"]`)) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    script.dataset.aruaSource = marker;
    document.head.appendChild(script);
  }

  function loadMeasurement() {
    if (!hasMeasurement || measurementLoaded) {
      return;
    }
    measurementLoaded = true;

    if (config.ga4MeasurementId) {
      loadScript(
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          config.ga4MeasurementId
        )}`,
        'google-tag'
      );
      window.gtag('js', new Date());
      window.gtag('config', config.ga4MeasurementId, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    }

    if (config.googleAdsId && config.googleAdsId !== config.ga4MeasurementId) {
      window.gtag('config', config.googleAdsId, {
        allow_ad_personalization_signals: false
      });
    }

    if (config.gtmContainerId) {
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      loadScript(
        `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
          config.gtmContainerId
        )}`,
        'google-tag-manager'
      );
    }
  }

  function hideBanner() {
    const banner = document.querySelector('[data-cookie-banner]');
    if (banner) {
      banner.hidden = true;
    }
  }

  function showBanner() {
    const banner = createBanner();
    if (!hasMeasurement) {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    const acceptButton = banner.querySelector('[data-cookie-accept]');
    if (acceptButton) {
      acceptButton.focus();
    }
  }

  function grantConsent() {
    storeConsent('granted');
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    loadMeasurement();
    hideBanner();
  }

  function denyConsent() {
    storeConsent('denied');
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    hideBanner();
  }

  function sendTrackedEvent(eventName, element) {
    if (getStoredConsent() !== 'granted' || !measurementLoaded) {
      return;
    }

    const parameters = {
      link_url: element.href || undefined,
      link_text: element.textContent.trim() || undefined,
      page_location: window.location.href
    };

    window.dataLayer.push({
      event: eventName,
      ...parameters
    });
    window.gtag('event', eventName, parameters);

    if (
      eventName.startsWith('whatsapp_') &&
      config.googleAdsId &&
      config.googleAdsConversionLabel
    ) {
      window.gtag('event', 'conversion', {
        send_to:
          `${config.googleAdsId}/${config.googleAdsConversionLabel}`
      });
    }
  }

  function bindEvents() {
    document.addEventListener('click', (event) => {
      const trackedElement = event.target.closest('[data-track-event]');
      if (trackedElement) {
        sendTrackedEvent(trackedElement.dataset.trackEvent, trackedElement);
      }
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-cookie-accept]')) {
        grantConsent();
      }
      if (event.target.closest('[data-cookie-reject]')) {
        denyConsent();
      }
      if (event.target.closest('[data-privacy-settings]')) {
        showBanner();
      }
    });
  }

  function initializeConsent() {
    if (!hasMeasurement) {
      hideBanner();
      return;
    }

    const storedConsent = getStoredConsent();
    if (storedConsent === 'granted') {
      grantConsent();
    } else if (storedConsent === 'denied') {
      denyConsent();
    } else {
      showBanner();
    }
  }

  addStylesheet();
  enhanceMetadata();
  enhancePage();
  createBanner();
  bindEvents();
  initializeConsent();
})();