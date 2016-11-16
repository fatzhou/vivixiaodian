'use strict';
var gulp = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins')({
        scope : ['devDependencies', 'dependencies', 'peerDependencies'],
        rename : {
            'gulp-minify-css' : 'minifycss',//minify css
            'gulp-uglify' : 'uglify',//minify js
            'gulp-concat' : 'concat',//merge files
            'gulp-rename' : 'rename',//rename file
            'gulp-jshint' : 'jshint',//check javaScript
            'gulp-imagemin' : 'imgmin',//minify img
            'gulp-sass'   : 'sass',//compile sass
            'gulp-less'   : 'less',//compile less
            'gulp-clean'  : 'clean',//clean files
            'gulp-autoprefixer' : 'autoprefix',//css auto prefix
            'gulp-livereload' : 'livereload',
            'babelify' : 'jsbabel',
            'gulp-rev-collector' : 'revCollector',
            'gulp-rev' : 'rev',
            'gulp-connect' : 'connect',
            'gulp-cache' : 'cache',
            'gulp-htmlmin' : 'minifyHTML',
            'gulp-content-includer' : 'contentInclude',
            'gulp-browserfy' : 'browserfy',
            'gulp-upload' : 'upload',
            'minimist' : 'argv',
            'gulp-webserver' : 'webserver'// 本地服务器
        }
    });

require('./tasks/dev')(gulp, gulpLoadPlugins);
// require('./tasks/release')(gulp, gulpLoadPlugins);


