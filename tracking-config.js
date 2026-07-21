/*
 * Configuração de mensuração do Espaço Aruã.
 *
 * O Google Analytics é carregado diretamente pelo site somente depois do
 * consentimento. O contêiner do Google Tag Manager também é carregado após o
 * consentimento para receber eventos e permitir integrações futuras.
 *
 * Importante: enquanto o GA4 estiver sendo carregado diretamente aqui, não
 * publique no GTM uma segunda tag de visualização de página para o mesmo ID,
 * pois isso duplicaria as visitas.
 */
window.ARUA_TRACKING_CONFIG = Object.freeze({
  ga4MeasurementId: 'G-4XMJDFMNQX',
  gtmContainerId: 'GTM-KDGWC256',
  googleAdsId: '',
  googleAdsConversionLabel: '',
  consentStorageKey: 'arua-analytics-consent-v1'
});
