var fs = require('fs'),
	express = require('express'),
	path = require('path');

module.exports.init = function (app) {
	var routeDeclarators = getFilePaths(path.resolve(__dirname, '../controllers'));
	for (var i = 0; i < routeDeclarators.length; i++){
		var declarator = routeDeclarators[i];
		var router = express.Router();
		console.log('using router exported from:' + declarator);
		require(declarator)(router);
		app.use(router);
	}
};

function getFilePaths(dirpath) {
	var results = [];
	var tree = fs.readdirSync(dirpath);
	for (var i = 0; i < tree.length; i++) {
		var blob = tree[i];
		var stats = fs.statSync(dirpath + '/' + blob);
		if (stats.isFile(blob) && blob != 'index.js' && !blob.startsWith('_')) {
			results.push(dirpath + '/' + blob);
		} else if (stats.isDirectory(blob) && !blob.startsWith('_')) {
			results = results.concat(getFilePaths(dirpath + '/' + blob));
		}
	}
	return results;
}
