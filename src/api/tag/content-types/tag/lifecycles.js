module.exports = {
  async beforeUpdate(event) {
    const { params, state } = event;
    const entryId = params.where.id;

    const previousData = await strapi.query("api::tag.tag").findOne({
      where: { id: entryId },
      populate: {
        blogs: {
          populate: {
            author: true,
            related_blogs: true,
            tags: true,
          },
        },
      },
    });
    state.previousData = previousData;
  },

  async afterUpdate(event) {
    const { result, state } = event;
    try {
      const updatedEntryWithPopulatedFields = await strapi
        .query("api::tag.tag")
        .findOne({
          where: { id: result.id },
          populate: {
            blogs: {
              populate: {
                author: true,
                related_blogs: true,
                tags: true,
              },
            },
          },
        });

      await fetch(`${process.env.FRONTEND_URL}/api/strapi/webhook`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({
          model: "tag",
          updatedEntry: updatedEntryWithPopulatedFields,
          previousEntry: state.previousData,
        }),
      });
    } catch (error) {
      console.error("Error while executing webhook for tag update:", error);
    }
  },
  async beforeDelete(event) {
    const { params, state } = event;
    // Save the state of the tag before deletion
    const tagToDelete = await strapi.query("api::tag.tag").findOne({
      where: { id: params.where.id },
      populate: {
        blogs: {
          populate: {
            author: true,
            related_blogs: true,
            tags: true,
          },
        },
      },
    });
    state.tagToDelete = tagToDelete;
  },

  async afterDelete(event) {
    const { state } = event;
    try {
      if (state.tagToDelete) {
        await fetch(`${process.env.FRONTEND_URL}/api/strapi/webhook`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WEBHOOK_TOKEN}`,
          },
          body: JSON.stringify({
            model: "tag",
            deletedEntry: state.tagToDelete,
          }),
        });
      }
    } catch (error) {
      console.error("Error while executing webhook for tag deletion:", error);
    }
  },
};
