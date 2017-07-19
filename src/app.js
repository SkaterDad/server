const toString = require("./toString")

// This function was largely copied from hyperapp core
// I renamed some variables for readability since bytes don't matter.
// Comments are mixed in explaining other changes.
function app(appConfig, serverConfig) {
  var state = {}
  var actions = {}
  var events = {}
  var mixins = []
  var view = appConfig.view

  const defaultServerConfig = {
    async: true,
    events: ["init", "loaded"]
  }

  // Mix defaults with injected config
  const config = Object.assign(defaultServerConfig, serverConfig)

  // Mixin merging
  // Copied from hyperapp core.
  // Only change is optionally passing async emit function to mixins
  for (var i = -1; i < mixins.length; i++) {
    var mixin = mixins[i]
      ? mixins[i](config.async ? asyncEmit : emit) //optional async emit
      : appConfig

    Object.keys(mixin.events || []).map(function(key) {
      events[key] = (events[key] || []).concat(mixin.events[key])
    })

    if (mixin.state != null) {
      state = merge(state, mixin.state)
    }

    mixins = mixins.concat(mixin.mixins || [])

    initialize(actions, mixin.actions)
  }

  // Instead of initializing then returning "emit",
  // we return new functions
  return {
    renderToString,
    renderToStream,
    optimizedRender,
  }

  // New - Runs events, then sends back HTML string.
  async function renderToString(template) {
    var result
    var promises = []
    // Call the user-specified events (replaces "emit")
    // If a promise is found, add it to an array
    for (var i = 0; i < config.events.length; i++) {
      const handlers = events[config.events[i]] || []
      for (var j = 0; j < handlers.length; j++) {
        result = handlers[j](state, actions)
        if (result != null && result.then && typeof result.then === "function") promises.push(result)
      }
    }

    // If any promises were registered, wait for them all.
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    //Calculate state -> view -> string
    const vdom = emit("render", view)(state, actions)

    // Root node needs 'data-ssr' attribute for client lib to rehydrate
    vdom.data["data-ssr"] = true

    return (
      template.head +
      '<script id="__INITIAL_STATE__" type="application/json">' +
      JSON.stringify(state) +
      "</script>" +
      template.neck +
      toString(vdom) +
      template.tail
    )
  }

  // Optimized code.
  async function optimizedRender(template) {
    var result
    var promises = []
    // Call the user-specified events (replaces "emit")
    // If a promise is found, add it to an array
    for (var i = 0; i < config.events.length; i++) {
      const handlers = events[config.events[i]] || []
      for (var j = 0; j < handlers.length; j++) {
        result = handlers[j](state, actions)
        if (result != null && result.then && typeof result.then === "function") promises.push(result)
      }
    }

    // If any promises were registered, wait for them all.
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    //Calculate state -> view -> string
    const html = emit("render", view)(state, actions)

    return (
      template.head +
      '<script id="__INITIAL_STATE__" type="application/json">' +
      JSON.stringify(state) +
      "</script>" +
      template.neck +
      html +
      template.tail
    )
  }

  // DISCLAIMER: I don't like this function yet since it's not a simple input -> output
  //    Would prefer to return a Readable or Transform Stream, but I'm still learning.
  // Params:
  //  template = template object { head, neck, tail }
  //  stream = a Writable Stream - ex: Node Http Response Stream
  async function renderToStream(template, stream, reqStartTime) {
    // emit 1st part of template
    stream.write(template.head)
    //console.log(`Stream 1st bytes sent in ${Date.now() - reqStartTime}ms`)

    var result
    var promises = []
    // Call the user-specified events (replaces "emit")
    // If a promise is found, add it to an array
    for (var i = 0; i < config.events.length; i++) {
      const handlers = events[config.events[i]] || []
      for (var j = 0; j < handlers.length; j++) {
        result = handlers[j](state, actions)
        if (result != null && result.then && typeof result.then === "function") promises.push(result)
      }
    }

    // If any promises were registered, wait for them all.
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    // emit serialized state
    stream.write(`
      <script id="__INITIAL_STATE__" type="application/json">
        ${JSON.stringify(state)}
      </script>`)

    // Calculate state -> view -> string
    const vdom = emit("render", view)(state, actions)

    // Root node needs 'data-ssr' attribute for client lib to rehydrate
    vdom.data["data-ssr"] = true

    // emit html between state & view
    stream.write(template.neck)

    // emit hyperapp view html
    stream.write(toString(vdom))

    // emit end of html
    stream.write(template.tail)
  }

  // Copied from hyperapp core
  // Only change was removing "repaint" function call
  function initialize(namespace, children, lastName) {
    Object.keys(children || []).map(function(key) {
      var action = children[key]
      var name = lastName ? lastName + "." + key : key

      if (typeof action === "function") {
        namespace[key] = function(data) {
          var result = action(
            state,
            actions,
            emit("action", {
              name: name,
              data: data
            }).data
          )

          if (result != null && result.then == null) {
            //repaint((state = merge(state, emit("update", result))))
            state = merge(state, emit("update", result))
          }

          return result
        }
      } else {
        initialize(namespace[key] || (namespace[key] = {}), action, name)
      }
    })
  }

  // Treat all event handlers as if they are async
  async function asyncEmit(name, data) {
    const handlers = events[name] || []
    for (var i = 0; i < handlers.length; i++) {
      var result = await handlers[i](state, actions, data)
      if (result != null) {
        data = result
      }
    }
    return data
  }

  // Sync version - converted to normal "for" loop for perf
  function emit(name, data) {
    const handlers = events[name] || []
    for (var i = 0; i < handlers.length; i++) {
      var result = handlers[i](state, actions, data)
      if (result != null) {
        data = result
      }
    }
    return data
  }
}

// Copied from hyperapp core
function merge(a, b) {
  if (typeof b !== "object") {
    return b
  }

  var obj = {}

  for (var i in a) {
    obj[i] = a[i]
  }

  for (var i in b) {
    obj[i] = b[i]
  }

  return obj
}

module.exports = app
