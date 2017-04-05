
/**
 * 生成时间戳的gulp插件
 * @type {*|exports|module.exports}
 */
var through = require('through2');

const PLUGIN_NAME = 'gulp-htmlstamp';

function htmlstamp(options) {
	var _options = options || {};
	// const reg = /(<script[^>]*?src=["|'])([^"|^']*?)(["|'][^>]*?><\/script>)/g;
	const jsReg = /((<script[^>]+?src=)("([^"]*?[^\\])"|'([^']*?[^\\])')([^>]*?>[^<]*?<\/script>))/g;
	const cssReg = /((<link[^>]+?href=)("([^"]*?[^\\])"|'([^']*?[^\\])')([^>]*?>))/g;
	const imgReg = /((<(?:img|video)[^>]+src\s*=)("([^"]*?[^\\])"|'([^']*?[^\\])')([^>]*?>))/g;
	
	var stream = through.obj(function (file, enc, cb) {
		if (file.isBuffer()) {
			file.contents = new Buffer(
				file.contents.toString().replace(jsReg, function (str, arg2, prefix, arg4, filepath,arg6, suffix) {
					if (/\s*(http:|https:)?\/\//.test(filepath)) {
						return prefix + '"' + filepath + '"' + suffix;
					}
					return prefix + '"' + filepath + '?' + (new Date).getTime() + '"' + suffix;
				})
			)
			
			file.contents = new Buffer(
				file.contents.toString().replace(cssReg, function (str, arg2, prefix, arg4, filepath,arg6, suffix) {
					if (/\s*(http:|https:)?\/\//.test(filepath)) {
						return prefix + '"' + filepath + '"' + suffix;
					}
					return prefix + '"' + filepath + '?' + (new Date).getTime() + '"' + suffix;
				})
			)

			file.contents = new Buffer(
				file.contents.toString().replace(imgReg, function (str, arg2, prefix, arg4, filepath,arg6, suffix) {
					if (/\s*(http:|https:)?\/\//.test(filepath)) {
						return prefix + '"' + filepath + '"' + suffix;
					}
					return prefix + '"' + filepath + '?' + (new Date).getTime() + '"' + suffix;
				})
			)			
		}
		this.push(file);
		cb();
	});
	
	return stream;
}

module.exports = htmlstamp;