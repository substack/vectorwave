var classList = require('class-list');
var scan = require('./scan.js');

var timeline = require('./timeline')(100).appendTo('#timeline');
var toolbox = require('./toolbox.js')();
toolbox.appendTo('#workspace');

toolbox.on('K', function () {
    scan(timeline.mark().element);
});
scan(document);
