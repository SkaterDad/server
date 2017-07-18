function h(tag, data) {
  var node
  var stack = []
  var children = []

  for (var i = arguments.length; i-- > 2; ) {
    stack[stack.length] = arguments[i]
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (var i = node.length; i--; ) {
        stack[stack.length] = node[i]
      }
    } else if (node != null && node !== true && node !== false) {
      if (typeof node === "number") {
        node = node + ""
      }
      children[children.length] = node
    }
  }

  var vnode =
    typeof tag === "string"
      ? {
          tag: tag,
          data: data || {},
          children: children
        }
      : tag(data, children)

  return renderToString(vnode)
}

function renderToString(vnode) {
  var tag = vnode.tag
  var children = ""

  var attrNames = Object.keys(vnode.data)

  var attrs = ""
  for (var i = 0; i < attrNames.length; i++) {
    var currentAttrName = attrNames[i]
    if (typeof vnode.data[currentAttrName] !== "function") {
      var content =
        currentAttrName == "style"
          ? stringifyStyle(vnode.data[currentAttrName])
          : vnode.data[currentAttrName]

      attrs += " " + currentAttrName + '="' + content + '"'
    }
  }

  // Get the child nodes of the current vnode
  for (var i = 0; i < vnode.children.length; i++) {
    children += vnode.children[i]
  }

  // Create opening and closing tags with the content sandwiched between
  return "<" + tag + attrs + ">" + children + "</" + tag + ">"
}

function stringifyStyle(style) {
  var properties = Object.keys(style)
  var inlineStyle = ""

  for (var i = 0; i < properties.length; i++) {
    var curProp = properties[i]
    inlineStyle +=
      curProp.replace(/[A-Z]/g, "-$&").toLowerCase() +
      ":" +
      style[curProp] +
      ";"
  }

  return inlineStyle
}

module.exports = h
