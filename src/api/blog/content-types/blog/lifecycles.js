module.exports = {
  async beforeUpdate(event) {
    const { params, state } = event;
    const entryId = params.where.id;

    const previousData = await strapi.query("api::blog.blog").findOne({
      where: { id: entryId },
      populate: {
        related_blogs: true,
        tags: true,
        main_image: true,
        author: true,
        createdBy: true,
        updatedBy: true,
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
          model: "blog",
          updatedEntry: result,
          previousEntry: state.previousData,
        }),
      });
    } catch (error) {
      console.error("Error while executing webhook for blog update:", error);
    }
  },
  async beforeDelete(event) {
    const { params, state } = event;
    // Save the state of the blog before deletion
    const blogToDelete = await strapi.query("api::blog.blog").findOne({
      where: { id: params.where.id },
      populate: {
        related_blogs: true,
        tags: true,
        main_image: true,
        author: true,
        createdBy: true,
        updatedBy: true,
      },
    });
    state.blogToDelete = blogToDelete;
  },

  async afterDelete(event) {
    const { state } = event;
    try {
      if (state.blogToDelete) {
        await fetch(`${process.env.FRONTEND_URL}/api/strapi/webhook`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
          },
          body: JSON.stringify({
            model: "blog",
            deletedEntry: state.blogToDelete,
          }),
        });
      }
    } catch (error) {
      console.error("Error while executing webhook for blog deletion:", error);
    }
  },
};
