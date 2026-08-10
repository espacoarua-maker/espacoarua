/*
 * Configuração de mensuração do Espaço Aruã.
 *
 * A Google tag do GA4 é carregada no <head> desde o início da página.
 * O Consent Mode começa com os armazenamentos de analytics e publicidade
 * negados; o banner apenas atualiza esse consentimento quando a pessoa aceita
 * ou recusa as métricas opcionais.
 *
 * A mensuração principal utiliza diretamente o GA4. O Google Tag Manager não
 * é carregado pelo site.
 */
window.ARUA_TRACKING_CONFIG = Object.freeze({
  ga4MeasurementId: 'G-4XMJDFMNQX',
  googleAdsId: '',
  googleAdsConversionLabel: '',
  consentStorageKey: 'arua-analytics-consent-v1'
});
