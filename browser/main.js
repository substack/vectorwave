var keycode = require('keycode');
var scan = require('./scan.js')();
var pencil = require('svg-pencil');

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
timeline.on('mark', function (m, elem) { scan(elem) });

function createMark () {
    var m = timeline.mark();
    m.on('click', function () {
        if (currentMark) canvas[currentMark.id].hide();
        canvas[m.id].show();
        currentMark = m;
    });
    
    if (currentMark) {
        canvas[m.id] = pencil.parse(canvas[currentMark.id].toSource());
        canvas[currentMark.id].hide();
    }
    else {
        canvas[m.id] = pencil();
    }
    canvas[m.id].appendTo('#canvas');
    currentMark = m;
}

var canvas = {}, currentMark;
createMark();

scan(document);
