![Travis CI](https://travis-ci.org/dstreet/bento-box-express.svg?branch=master)

Bento Box Express
=================

Express extension for the Bento Box application framework

## Install

```
npm install bento-box-express
```

## Usage

```javascript
var BentoBoxFactory = require('bento-box')
var BentoBoxExpress = require('bento-box-expresss')

var bentoEmitter = BentoBoxFactory.getInstance()

bentoEmitter.on('ready', function(bento) {
    var bentoExpress = bento.use(BentoBoxExpress)

    // Publish middleware to 'middleware' collection
    // Publish routes to 'routes' collection

    var server = bentoExpress.start()
})
```

## Config

By default, Bento Box Express loads the `express` config property from Bento
Box. It accepts the following config properties:

Bento Box Express can be configured in the application config using the
following properties:

- `port` [Number] - The listening port
- `settings` [Object] - Object of Express settings. These are passed directly to express.set()

By default, Bento Box Express loads the `express` config property from the
Bento Box application config object. This, however, can be changed by passing
an alternate config property to the `use` method:

```javascript
bento.use(BentoBoxExpress, 'otherConfig')
```

## Routes

Routes are registered with Bento Box Express through the `routes` collection.
The data passed to the collection should be an object containing the following
properties:

- `method` [String] - The HTTP method. (e.g. get, post)
- `path` [String] - The path of the route
- `callback` [Function] - The function to handle the request


## Middleware

Middleware is registed with Bento Box Express through the `middleware`
collection. The data passed to the collection can be one of two forms:

- **Function** - The function to handle the request
- **Object** - An object containing `path` and `callback` properties

---

[Copyright (c) 2015 David Street](LICENSE.md)
