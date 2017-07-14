### How to try this

Installation:

```
git clone (whatever github says the url is)

npm install

node ./example/server.js
```

In terminal or browser:

```
curl http://localhost:8080/string

curl http://localhost:8080/stream

```

To see the benefit of streaming, open `example/appConfig.js` and change the `getData` action to have a longer delay.  You should see the `<h1>` rendered before the app view.

```js
    getData: (state, actions) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(["one", "two", "three", "four"])
        }, 1000)
      }).then(data => actions.setRemote(data))
```

### Note on perf:
I did some benchmarking using `autocannon` with 20 concurrent requests on a free Cloud9 IDE instance.

When passing `{async: true}` as an option, I've found perf to be similar between the renderToStream & renderToString versions.  It's a whole different story with `{async: false}`, though, where renderToString is several times faster.