var
    options = require('./estrad.json'),
    gulp = require('gulp'),
    estrad = require('estrad')(gulp, options);


gulp.task('default', ['estrad']);

