/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
var gulp = require('gulp');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var through = require('through2');

var path = require('path');
var File = require('vinyl');

gulp.task('generate-svgsprite', function() {
  return gulp.src('icons/combined/*.svg')
    .pipe(rename(function(filePath) {
      filePath.basename = 'spectrum-css-icon-' + filePath.basename;
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('spectrum-css-icons.svg'))
    .pipe(gulp.dest('dist/icons/'));
});

gulp.task('generate-svgmodule', function() {
  return gulp.src('icons/combined/*.svg')
    .pipe( SVGModuleConcat('icons.js'))
    .pipe(gulp.dest('dist/icons'))
    .pipe(gulp.dest('webcomponents/'));
});

function getSVGSpriteTask(size) {
  return function() {
    return gulp.src(`icons/${size}/*.svg`)
      .pipe(rename(function(filePath) {
        filePath.basename = 'spectrum-css-icon-' + filePath.basename.replace(/S_UI(.*?)_.*/, '$1');
      }))
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename(`spectrum-css-icons-${size}.svg`))
      .pipe(gulp.dest('dist/icons/'));
  };
}

gulp.task('generate-svgsprite-medium', getSVGSpriteTask('medium'));
gulp.task('generate-svgsprite-large', getSVGSpriteTask('large'));

gulp.task('icons', gulp.parallel(
  'generate-svgsprite-medium',
  'generate-svgsprite-large',
  gulp.series(
    'generate-svgsprite',
    'generate-svgmodule'
  )
));

// Modified and copied Gulp-concat to create an ES6 module with icons
var SVGModuleConcat = function(file, opt) {
  if (!file) {
    throw new Error('gulp-concat: Missing file option');
  }
  opt = opt || {};

  // to preserve existing |undefined| behaviour and to introduce |newLine: ""| for binaries
  if (typeof opt.newLine !== 'string') {
    opt.newLine = '\n';
  }

  var latestFile;
  var latestMod;
  var concat;

  function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    // construct concat instance
    if (!concat) {
      concat = '';
    }

    // add file to concat instance
    concat += '\tget ' + file.basename.split('.svg')[0] + '() { return `' + file.contents.toString('utf8') + '`; }, \n';
    cb();
  }

  function endStream(cb) {
    // no files passed in, no file goes out
    if (!latestFile || !concat) {
      cb();
      return;
    }

    var joinedFile;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof file === 'string') {
      joinedFile = latestFile.clone({contents: false});
      joinedFile.path = path.join(latestFile.base, file);
    }
    else {
      joinedFile = new File(file);
    }

    concat = 'export default {\n' +
      '    populateSVG(scope) {\n' +
      '        const icons = scope.querySelectorAll(\'svg[class^="spectrum-Icon"]\');\n' +
      '        icons.forEach( icon => {\n' +
      '           const id = icon.children[0].getAttribute(\'xlink:href\');\n' +
      '           if (id) { // otherwise does not need replacing\n' +
      '             const iconname = id.split(\'-\')[id.split(\'-\').length-1];\n' +
      '             icon.innerHTML = this[iconname];\n' +
      '           }\n' +
      '        });\n' +
      '    },\n' +
      concat +
      '}\n';

    joinedFile.contents = Buffer.from(concat, 'utf8');

    this.push(joinedFile);
    cb();
  }

  return through.obj(bufferContents, endStream);
};
