import { toString } from '../src'

const RenderTest = trees =>
  trees.forEach(tree => expect(toString(tree.vnode)).toBe(tree.html))

const createVNode = vnode => Object.assign({ tag: "div", data: {}, children: [] }, vnode)

test("empty element", () => {
   RenderTest([
     {
       vnode: createVNode(),
       html: `<div></div>`
     },
     {
       vnode: createVNode({ tag: "h1" }),
       html: `<h1></h1>`
     }
   ])
})

test("attributes", () => {
  RenderTest([
    {
      vnode: createVNode({ data: { id: "a" } }),
      html: `<div id="a"></div>`
    },
    {
      vnode: createVNode({ data: { class: "a" } }),
      html: `<div class="a"></div>`
    },
    {
      vnode: createVNode({ data: { class: "a", id: "a" }}),
      html: `<div class="a" id="a"></div>`
    }
  ])
})

test("handler functions", () => {
  function handler() { return "y" }

  RenderTest([
    {
      vnode: createVNode({ data: { id: "a", oncreate: () => "x" } }),
      html: `<div id="a"></div>`
    },
    {
      vnode: createVNode({ data: { id: "a", onclick: handler } }),
      html: `<div id="a"></div>`
    }
  ])
})

test("style", () => {
  RenderTest([
    {
      vnode: createVNode({ data: { style: { margin: 0 } } }),
      html: `<div style="margin:0;"></div>`
    },
    {
      vnode: createVNode({ data: { style: { backgroundColor: "papayawhip" } } }),
      html: `<div style="background-color:papayawhip;"></div>`
    },
    {
      vnode: createVNode({ data: { style: { backgroundColor: "papayawhip", borderTopLeftRadius: "10px" } } }),
      html: `<div style="background-color:papayawhip;border-top-left-radius:10px;"></div>`
    }
  ])
})

test("primitive children", () => {
  RenderTest([
    {
      vnode: createVNode({ children: ["foo", "bar"] }),
      html: `<div>foobar</div>`
    }
  ])
})

test("vnode children", () => {
  RenderTest([
    {
      vnode: createVNode({
        children: [
          createVNode({ tag: "h1" })
        ]
      }),
      html: `<div><h1></h1></div>`
    }
  ])
})

test("void tags", () => {
  RenderTest([
    {
      vnode: createVNode({
        tag: "input",
        data: { type: "text" }
      }),
      html: `<input type="text">`
    },
    {
      vnode: createVNode({
        tag: "img",
        data: { src: "http://example.com/img.jpg" }
      }),
      html: `<img src="http://example.com/img.jpg">`
    },
    {
      vnode: createVNode({
        tag: "input",
        data: { type: "text" },
        children: [createVNode()]
      }),
      html: `<input type="text">`
    },
  ])
})
