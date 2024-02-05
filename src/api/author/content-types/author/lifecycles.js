module.exports = {
  async beforeUpdate(event) {
    const { params, state } = event;
    const entryId = params.where.id;

    const previousData = await strapi.query("api::author.author").findOne({
      where: { id: entryId },
      populate: {
        blogs: true,
      },
    });
    state.previousData = previousData;
  },
  async afterUpdate(event) {
    const { result, state } = event;
    try {
      await fetch(`${process.env.FRONTEND_URL}/api/strapi/webhook`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({
          model: "author",
          updatedEntry: result,
          previousEntry: state.previousData,
        }),
      });
    } catch (error) {
      console.error("Error while executing webhook for author update:", error);
    }
  },
  async beforeDelete(event) {
    const { params, state } = event;
    // Save the state of the blog before deletion
    const authorToDelete = await strapi.query("api::author.author").findOne({
      where: { id: params.where.id },
      populate: {
        blogs: true,
      },
    });
    state.authorToDelete = authorToDelete;
  },

  async afterDelete(event) {
    const { state } = event;
    try {
      if (state.authorToDelete) {
        await fetch(`${process.env.FRONTEND_URL}/api/strapi/webhook`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
          },
          body: JSON.stringify({
            model: "author",
            deletedEntry: state.authorToDelete,
          }),
        });
      }
    } catch (error) {
      console.error(
        "Error while executing webhook for author deletion:",
        error
      );
    }
  },
};
