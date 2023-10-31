// import Fastify from "fastify";
// const fastify = Fastify({
//   logger: true,
// });
// // CommonJs
// const fastify = require("fastify")({
//   logger: false,
// });

const cache = new Map();
console.log(
  "env =================== ",
  process.env.NODE_ENV,
  process.env.APP_ENV
);
// // Declare a route
// fastify.get("/", function (request, reply) {
//   reply.send([...cache]);
// });

// // Run the server!
// fastify.listen({ port: 4300 }, function (err, address) {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
//   // Server is now listening on ${address}
// });

module.exports = class CacheHandler {
  constructor(options) {
    console.log("CacheHandler options");
    this.options = options;
    this.cache = {};
  }

  async get(key) {
    console.log("read from cache", key);
    return cache.get(key);
  }

  async set(key, data) {
    console.log("write to cache", key);
    cache.set(key, {
      value: data,
      lastModified: Date.now(),
    });
  }
};
