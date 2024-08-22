require("dotenv").config();

//TODO add different envrionments for dev and prod
/**
 * const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
 */

const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI,
  SECRET,
};
