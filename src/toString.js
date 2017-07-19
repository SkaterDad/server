function renderToString(vnode) {
  var tag = vnode.tag
  var children = vnode.children

  var attrNames = Object.keys(vnode.data)

  var attrs = ""
  for (var i = 0; i < attrNames.length; i++) {
    var currentAttrName = attrNames[i]
    var content =
      currentAttrName == "style"
        ? stringifyStyle(vnode.data[currentAttrName])
        : vnode.data[currentAttrName]

    attrs += " " + currentAttrName + '="' + content + '"'
  }

  // Get the child nodes of the current vnode
  var childHTML = ""
  for (var i = 0; i < children.length; i++) {
    var child = children[i]
    if (child.tag) childHTML += renderToString(child)
    if (typeof child == "string") childHTML += child
  }

  // Create opening and closing tags with the content sandwiched between
  return "<" + tag + attrs + ">" + childHTML + "</" + tag + ">"
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

export default renderToString
