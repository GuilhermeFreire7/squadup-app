/**
 * Completa o app.json com o arquivo do Firebase, que o Android exige para receber push (FCM).
 * O google-services.json fica fora do Git: localmente, na raiz do projeto; no EAS, numa
 * variável de ambiente do tipo arquivo (GOOGLE_SERVICES_JSON) que aponta para uma cópia dele.
 */
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
});
