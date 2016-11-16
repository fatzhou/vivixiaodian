'use strict';
module.exports = function (gulp, Plugin) {
    var dist = './dist',
        src = './src',
        port = 7000,
        htmlSource = src + '/**/*.html',
        htmlSourceBase = src + '/html',
        jsSource = src + '/**/*.js',
        jsIgnore = '!' + src + '/**/*.min.js',
        sassSource = src + '/**/*.sass',
        lessSource = src + '/**/*.less',
        cssDist = dist,
        cssSource = src + '/**/*.css',
        imgSource = src + '/**/*.@(png|jpg|jpeg|gif)',
        imgDist = dist,
        otherSource = src + '/**/*.{mp4,mp3,ogg,swf}',
        htmlstamp = require('./gulp-plugins/htmlstamp'),
        minimist = require('minimist'),
        jsbabel = require('babelify');

    // 注册任务
    gulp.task('webserver', function () {
        gulp.src(dist) // 服务器目录（./代表根目录）
            .pipe(Plugin.webserver({ // 运行gulp-webserver
                livereload: true, // 启用LiveReload
                open: true // 服务器启动时自动打开网页
            }));
    });

    gulp.task('connect', function () {
        Plugin.connect.server({
            root: dist,
            port: port,
            livereload: true
        });
    });

    //move html file to /dist
    gulp.task('html', function () {
        // return gulp.src(htmlSource)
        return gulp.src(htmlSource, {base: htmlSourceBase})
            .pipe(Plugin.contentInclude({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
            .pipe(htmlstamp())
            .pipe(gulp.dest(dist));
    });

    //merge js and minify to /dist/js 
    gulp.task('js', ['jsIgnoreCopy'], function () {
        return gulp.src([jsSource, jsIgnore])
            // .pipe(Plugin.jsInclude())
            // .pipe(Plugin.babel({
            //     presets: ['es2015']
            // }))
            .pipe(Plugin.browserify({
                transform: [jsbabel.configure({
                    presets: ['es2015']
                })],
                debug: true,
                extensions: ['.js']
                // paths: [
                //     options.JSSourcePath,
                //     options.JSSourcePath + '/conf/test'
                // ]
            }))
            // .pipe(Plugin.jshint())
            // .pipe(Plugin.jshint.reporter('default'))
            .pipe(gulp.dest(dist));
    });

    gulp.task('jsIgnoreCopy', function() {
        return gulp.src(jsIgnore)
            .pipe(gulp.dest(dist));
    });

    // compile the scss file to css
    gulp.task('sass', function () {
        return gulp.src(sassSource)
            .pipe(Plugin.sass())
            .pipe(Plugin.autoprefix('last 2 versions'))
            .pipe(gulp.dest(cssDist));
    });

    //compile the less file to css
    gulp.task('less', function () {
        return gulp.src(lessSource)
            .pipe(Plugin.less())
            .pipe(Plugin.autoprefix('last 2 versions'))
            .pipe(gulp.dest(cssDist));
    });

    //move css file to /dist 
    gulp.task('css', function () {
        gulp.src([cssSource])
            .pipe(gulp.dest(cssDist));
    });

    //image minfy
    gulp.task('img', function () {
        return gulp.src(imgSource)
            // .pipe(Plugin.imgmin())
            .pipe(gulp.dest(imgDist));
    });

    gulp.task('copy', function () {
        return gulp.src(otherSource)
            .pipe(gulp.dest(dist));
    });

    //clean all file of /dist
    gulp.task('clean', function () {
        return gulp.src(dist, {read: false})
            .pipe(Plugin.clean());
    });

    gulp.task('deploy', function() {     
        var arg = minimist(process.argv.slice(2), {});

        if(arg.folder) {
            return gulp.src(arg.folder+'/**/*')
               .pipe(Plugin.upload({
                    server: 'http://192.168.0.77:99/publish/receiver',
                    data: {
                        to : function(file) {
                            var exp = new RegExp('^.*\/([^\/]+)\/frontend\/(.*)$')
                            var myPath = file.path.replace(/\\+/g, '/').replace(exp, '$2');
                            // console.log(file.path, myPath);
                            myPath = '/data/wwwroot/frontend/' + myPath;
                
                            console.log(myPath);
                            return myPath;
                        }
                    },
                    callback: function(err, data, res, path) {
                        // console.log(err, data, res)
                        if(res.statusCode == 200) {
                            if (err) {
                                console.log('error:' + err.toString());
                            } else {
                                console.log(path + '已成功发布');
                            }                            
                        } else {
                            console.log('服务器异常，返回码' + res.statusCode);
                        }
                    }

               }));  
        } else {
            return gulp.src(dist+'/**/*')
               .pipe(Plugin.upload({
                    server: 'http://192.168.0.77:99/publish/receiver',
                    data: {
                        to : function(file) {
                            var exp = new RegExp('^.*\/([^\/]+)\/dist\/(.*)$')
                            var myPath = file.path.replace(/\\+/g, '/').replace(exp, '$1/$2');
                            // console.log(file.path);
                            myPath = '/data/wwwroot/frontend/' + myPath;
                
                            // console.log(myPath);
                            return myPath;
                        }
                    },
                    callback: function(err, data, res, path) {
                        // console.log(err, data, res)
                        if(res.statusCode == 200) {
                            if (err) {
                                console.log('error:' + err.toString());
                            } else {
                                console.log(path + '已成功发布');
                            }                            
                        } else {
                            console.log('服务器异常，返回码' + res.statusCode);
                        }
                    }

               }));            
        }

    });

    // 监听任务
    gulp.task('watch', ['html', 'js', 'less', 'css', 'img', 'copy'], function () {
        gulp.start('webserver');

        // 监听根目录下所有.html文件
        gulp.watch(htmlSource, ['html']);

        //watch javaScript files
        gulp.watch(jsSource, ['js']);

        //watch sass files
        gulp.watch(sassSource, ['sass']);

        //watch less files
        gulp.watch(lessSource, ['less']);

        //watch css files
        gulp.watch(cssSource, ['css']);

        //watch img files
        gulp.watch(imgSource, ['img']);

        //watch other files
        gulp.watch(imgSource, ['copy']);
    });

    // default task easy for debug not minify(css)
    gulp.task('default', ['watch']);

};
