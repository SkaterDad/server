// Register a fake document.getElementById to prevent errors on code that will never actually execute.
global.document = {
  getElementById: id => id
}

// Express
const server = require("express")()

// Load hyperapp config object creator (same as client app will use)
const appConfig = require("./appConfig")
const defaultH = require("hyperapp").h
const serverH = require("../src/h")

const defaultApp = appConfig(defaultH)
const serverApp = appConfig(serverH)

// Define hyperapp/server configuration (defaults shown)
const serverConfig = {
  async: false,
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
        <!-- css, whatever else you want to start preloading -->`,
  //Between state & view
  neck: `
      </head>
      <body>
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

  const app = hyperapp(defaultApp, serverConfig)
  const html = await app.renderToString(template)
  res.send(html)

  console.log("String request time = " + (Date.now() - time) + "ms")
})

server.get("/optstring", async (req, res) => {
  const time = Date.now()

  const app = hyperapp(serverApp, serverConfig)
  const html = await app.optimizedRender(template)
  res.send(html)

  console.log("Opt string request time = " + (Date.now() - time) + "ms")
})

server.get("/stream", async (req, res) => {
  const time = Date.now()

  //Tell browsers we'll be sending HTML chunks
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Transfer-Encoding", "chunked")
  const app = hyperapp(defaultApp, serverConfig)
  await app.renderToStream(template, res, time)
  res.end()

  console.log("Stream request time = " + (Date.now() - time) + "ms")
})

const port = process.env.PORT || 8080
const host = process.env.IP || "localhost"

server.listen(port, host, () =>
  console.log(`Listening at http://${host}:${port}`)
)
