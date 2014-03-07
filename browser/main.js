var keycode = require('keycode');
var scan = require('./scan.js')();

var timeline = require('./timeline')(100).appendTo('#timeline');
var toolbox = require('./toolbox.js')();
toolbox.appendTo('#workspace');

window.addEventListener('keydown', function (ev) {
    var chr = keycode(ev);
    if (chr === 'k') createMark();
    if (chr === 'delete') {
        timeline.removeMark('_active');
    }
});
toolbox.on('K', createMark);

function createMark () {
    scan(timeline.mark().element);
}
scan(document);
