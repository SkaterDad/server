// Register a fake document.getElementById to prevent errors on code that will never actually execute.
global.document = {
  getElementById: id => id
}

// Express
const server = require("express")()

// Load hyperapp config object (same as client app will use)
const appConfig = require("./appConfig")

// Define hyperapp/server configuration (defaults shown)
const serverConfig = {
  async: true,
  events: ["init", "loaded"]
}

// Define HTML template object
const template = {
  //Before serialized state
  head: `
      <!doctype html>
      <html>
      <head>
        <title>SSR App</title>
        <script src="dist/client.js" defer></script>
        <!-- css, whatever else you want to start preloading -->
        <!-- template.head would normally end right here, but I included the next 3 lines here so the H1 would get sent in the 1st chunk -->
      </head>
      <body>
        <h1>Hi, I'm in the 1st chunk so you can see streaming work in a browser :)</h1>`,
  //Between state & view
  neck: `
        <div id="app">`,
  //After view
  tail: `
        </div>
      </body>
    </html>`
}

// Import server-side app() function
const hyperapp = require("../src/app")

// Define route handlers
// Using async/await for readability
server.get("/string", async (req, res) => {
  const time = Date.now()

  const app = hyperapp(appConfig, serverConfig)
  const html = await app.renderToString(template)
  res.send(html)

  console.log("String request time = " + (Date.now() - time) + "ms")
})

server.get("/stream", async (req, res) => {
  const time = Date.now()

  //Tell browsers we'll be sending HTML chunks
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Transfer-Encoding", "chunked")
  const app = hyperapp(appConfig, serverConfig)
  await app.renderToStream(template, res, time)
  res.end()

  console.log("Stream request time = " + (Date.now() - time) + "ms")
})

const port = process.env.PORT || 8080
const host = process.env.IP || "localhost"

server.listen(port, host, () =>
  console.log(`Listening at http://${host}:${port}`)
)
