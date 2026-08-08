/*
 * Configuração de mensuração do Espaço Aruã.
 *
 * A Google tag e o contêiner do Google Tag Manager são carregados no <head>
 * desde o início da página. O Consent Mode começa com os armazenamentos de
 * analytics e publicidade negados; o banner apenas atualiza esse consentimento
 * quando a pessoa aceita ou recusa as tecnologias opcionais.
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
