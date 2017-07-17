const { h } = require("hyperapp")

// Basic example mixin that uses some of the features.
var mixin = function(emit) {
  return {
    state: {
      mix: 100
    },
    actions: {
      mix: {
        add: state => ({ mix: state.mix + 1 }),
        sub: state => ({ mix: state.mix - 1 })
      }
    },
    events: {
      init: (state, actions) => actions.mix.add(),
      loaded: (state, actions) => actions.mix.sub(),
      action: (state, actions, data) => data,
      update: (state, actions, data) => data,
      render: (state, actions, view) => (state, actions) =>
        h("div", null, [
          h("h1", null, "A mixin hijacked your view"),
          view(state, actions)
        ])
    }
  }
}

// Hyperapp Config Object
var config = {
  state: { count: 1, remoteData: [] },
  actions: {
    add: state => ({ count: state.count + 1 }),
    sub: state => ({ count: state.count - 1 }),
    setRemote: (state, actions, data) => {
      return { remoteData: data }
    },
    getData: (state, actions) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(["one", "two", "three", "four"])
        }, 100)
      }).then(data => actions.setRemote(data))
    }
  },
  events: {
    init: (state, actions) => actions.add(),
    loaded: (state, actions) => {
      actions.add()
      return actions.getData()
    }
  },
  mixins: [mixin],
  root: document.getElementById("#app"),
  view: (state, actions) =>
    h("div", { class: "container" }, [
      h("h1", null, "Headline"),
      h("p", null, `The current count is ${state.count}`),
      h("p", null, `The current mixin state is ${state.mix}`),
      h("section", { class: "root buttons" }, [
        h("span", null, "App Root Buttons"),
        h("button", { onclick: actions.add }, "Add"),
        h("button", { onclick: actions.sub }, "Sub")
      ]),
      h("section", { class: "mixin buttons" }, [
        h("span", null, "Mixin Buttons"),
        h("button", { onclick: actions.mix.add }, "Add"),
        h("button", { onclick: actions.mix.sub }, "Sub")
      ]),
      h("pre", { class: "remote-data" }, JSON.stringify(state.remoteData)),
      h("div", null, new Array(2000).fill(0).map((x,i) => i).map(x => h('div', {key: x}, `Element ${x}`)))
    ])
}

module.exports = config
