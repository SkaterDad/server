# **hyperapp-server**

[![Travis CI](https://img.shields.io/travis/hyperapp/hyperapp-server/master.svg)](https://travis-ci.org/hyperapp/hyperapp-server)
[![Codecov](https://img.shields.io/codecov/c/github/hyperapp/hyperapp-server/master.svg)](https://codecov.io/gh/hyperapp/hyperapp-server)
[![npm](https://img.shields.io/npm/v/hyperapp-server.svg?colorB=09e5f9)](https://www.npmjs.org/package/hyperapp-server)
[![Slack](https://hyperappjs.herokuapp.com/badge.svg)](https://hyperappjs.herokuapp.com "Join us")

Your favorite hyperapp framework, now rendered server-side.
## Installation

```bash
# Using npm
npm install hyperapp-server hyperapp

# Using yarn
yarn add hyperapp-server
```

## Usage

_At the moment, hyperapp-server only supports static rendering. True server rendering coming soon!_

```javascript
import { h } from "hyperapp"
import { toString } from "hyperapp-server"

const vnode = h("div", null, "Hi.")

const html = toString(vnode)

// html = "<div>Hi.<div>"
```

## Issues

No software is free of bugs. If you're not sure if something is a bug or not, [file an issue](https://github.com/hyperapp/hyperapp/issues) anyway. Questions, feedback and feature requests are welcome too.

## Community

* [Slack](https://hyperappjs.herokuapp.com)
* [/r/hyperapp](https://www.reddit.com/r/hyperapp)
* [Twitter](https://twitter.com/hyperappjs)

## License

HyperApp is MIT licensed. See [LICENSE](LICENSE.md).
