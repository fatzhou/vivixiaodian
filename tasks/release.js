'use strict';
module.exports = function (gulp, Plugin) {
    var dist = './dist',
        src = './src',
        htmlSource = src + '/**/*.html',
        htmlSourceBase = src + '/html',
        jsSource = src + '/**/*.js',
        jsDist =  dist,
        jsIgnore = '!' + src + '/**/*.min.js',
        sassSource = src + '/**/*.sass',
        lessSource = src + '/**/*.less',
        cssDist = dist,
        cssSource = src + '/**/*.css',
        cssIgnore =  '!' + src + '/**/*.min.css',
        imgSource = src + '/**/*.@(png|jpg|jpeg|gif)',
        imgDist = dist,
        timestamp = dist + '/timestamp/**/*.json',
        otherSource = src + '/**/*.{mp4,mp3,ogg,swf}',
        timestampFolder = dist + '/timestamp',
        jsbabel = require('babelify');


    //move html file to /dist
    //clean all file of /dist
    gulp.task('clean_r', function () {
        return gulp.src(dist, {read: false})
            .pipe(Plugin.clean());
    });

    gulp.task('html_r', ['js_r', 'sass_r', 'less_r', 'css_r', 'img_r'], function () {

        return gulp.src([timestamp, htmlSource],{base: htmlSourceBase})
            .pipe(Plugin.revCollector({
                replaceReved: true
            }))
            .pipe(Plugin.contentInclude({
                includerReg:/<!\-\-include\s+"([^"]+)"\-\->/g
            }))
            .pipe(Plugin.minifyHTML({
                collapseWhitespace: true
            }))
            .pipe(gulp.dest(dist));
    });

    gulp.task('js_r_ignore', function () {
        return gulp.src(jsIgnore.replace('!', ''))
            .pipe(gulp.dest(jsDist));
    });

    //merge js and minify to /dist/js 

    gulp.task('js_r', ['js_r_ignore'], function () {
        return gulp.src([jsSource, jsIgnore])
            // .pipe(Plugin.babel({
            //     presets: ['es2015']
            // }
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
            .pipe(Plugin.uglify())
            .pipe(Plugin.rev())
            .pipe(gulp.dest(dist))
            .pipe(Plugin.rev.manifest())
            .pipe(gulp.dest(timestampFolder + '/js'));

    });

    //compile the sass file to css
    gulp.task('sass_r', function () {
        return gulp.src(sassSource)
            .pipe(Plugin.sass())
            .pipe(Plugin.autoprefix('last 2 versions'))
            .pipe(Plugin.minifycss())
            .pipe(Plugin.rev())
            .pipe(gulp.dest(cssDist))
            .pipe(Plugin.rev.manifest())
            .pipe(gulp.dest(timestampFolder + '/sass'));
    });

    //compile the less file to css
    gulp.task('less_r', function () {
        return gulp.src(lessSource)
            .pipe(Plugin.less())
            .pipe(Plugin.autoprefix('last 2 versions'))
            .pipe(Plugin.minifycss())
            .pipe(Plugin.rev())
            .pipe(gulp.dest(cssDist))
            .pipe(Plugin.rev.manifest())
            .pipe(gulp.dest(timestampFolder + '/less'));
    });

    gulp.task('css_r_ignore', function () {
        return gulp.src(cssIgnore.replace('!', ''))
            .pipe(gulp.dest(cssDist));
    });

    //move css file to /dist 
    gulp.task('css_r', ['css_r_ignore'], function () {
        return gulp.src([cssSource, cssIgnore])
            .pipe(Plugin.minifycss())
            .pipe(Plugin.rev())
            .pipe(gulp.dest(cssDist))
            .pipe(Plugin.rev.manifest())
            .pipe(gulp.dest(timestampFolder + '/css'));
    });

    //image minfy
    gulp.task('img_r', function () {
        return gulp.src(imgSource)
            .pipe(Plugin.cache(Plugin.imgmin({
                // optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
                // progressive: false, //类型：Boolean 默认：false 无损压缩jpg图片
                // interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
                // multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
            })))
            .pipe(Plugin.rev())
            .pipe(gulp.dest(imgDist))
            .pipe(Plugin.rev.manifest())
            .pipe(gulp.dest(timestampFolder + '/img'));
    });


    gulp.task('copy_r', function () {
        return gulp.src([otherSource])
            .pipe(Plugin.rev())
            .pipe(gulp.dest(dist))
            .pipe(Plugin.rev.manifest())
            .pipe(gulp.dest(timestampFolder + '/others'));
    });

    // 监听任务
    gulp.task('release', ['clean_r'], function () {
        gulp.start('html_r');
    });

};
