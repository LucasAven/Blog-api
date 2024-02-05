module.exports = {
  async afterUpdate(event) {
    const { result } = event;
    try {
      await fetch(`${process.env.FRONTEND_URL}/api/strapi/webhook`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({
          model: "page-shared-data",
          updatedEntry: result,
          previousEntry: null,
        }),
      });
    } catch (error) {
      console.error(
        "Error while executing webhook for page-shared-data update:",
        error
      );
    }
  },
};
