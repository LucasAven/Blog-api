const path = require("path");

module.exports = ({ env }) => ({
  connection: {
    connection: {
      client: "sqlite",
      filename: path.join(
        __dirname,
        "../../..",
        env("DATABASE_FILENAME", ".tmp/data.db")
      ),
    },
    useNullAsDefault: true,
  },
});
