module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  url: env("URL"),
  proxy: true,
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", true),
    defaultHeaders: {
      Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
    },
  },
});
