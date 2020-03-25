module.exports = {
  apps : [
      {
        name: "Kino statistics rest api",
        script: "npm run build && node dist/index.js",
        watch: true,
        env: {
          "PORT":4242,
          "NODE_ENV": "development",
          "CONNECTION_STRING":"mongodb://localhost:27017/kinoResults"
        },
        env_production:{
          "PORT":4242,
          "NODE_ENV": "production",
          "CONNECTION_STRING":"mongodb://localhost:27017/kinoResults"
        }
      }
  ]
}