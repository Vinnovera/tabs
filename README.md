# tabs
Arkiv Digital tabs

Estrad
======

Estrad is a collection of Gulp tasks, and a tool to make building modular HTML/CSS/JS websites easier.

The goal is to have a build process fast enough that you do not have to wait whenever a file is saved. Because of the possible complexity of HTML templates Estrad will not compile them on file save. Instead a server is included that compiles HTML pages on request.

## Install

Estrad requires node.js and [Gulp][0], install them if you have not already.

Install gulp:

```bash
$ npm install gulp -g
```

To install Estrad in your project run:

```bash
$ npm install estrad --save-dev
```

Include Estrad in your `Gulpfile.js` and pass it gulp:

```js
var
	gulp = require('gulp'),
	estrad = require('estrad')(gulp, options);

gulp.task('default', ['estrad']);
```

## Watching files

```bash
$ gulp estrad
```

## Build files

To build the project files type:

```bash
$ gulp estrad-build
```

This will build any `css`, `js` and `html` files.

Read more on https://github.com/Vinnovera/estrad