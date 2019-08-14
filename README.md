# PDF TESTING PLAYGROUND

Using this to test out styles and whatnot passed to our SSR template and the dynamic-html-pdf library. It's a bootstrapped Express app or a CRA app

### For the Express App

Users port 1234

```
$ npm start
$ npm run sass:watch
```

- Add handlebar props to `routes/index.js`
- Place SSR templates in `views/index.hbs`

### For React templates

Start it up how you'd expect to:

```
$ yarn start
```

Go ahead and build it, then copy the stylesheet from the build directory to the SSR template. I updated the browserlist to support the version of PhantomJS we use in-app:

```
$ yarn run build
```
