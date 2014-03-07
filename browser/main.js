var keycode = require('keycode');
var scan = require('./scan.js')();
var pencil = require('svg-pencil');

var timeline = require('./timeline')(100).appendTo('#timeline');
var toolbox = require('./toolbox.js')();
toolbox.appendTo('#workspace');

var shift = false;
window.addEventListener('keydown', function (ev) {
    shift = ev.shiftKey;
    var chr = keycode(ev);
    if (chr === 'k') createMark();
    if (chr === 'delete') {
        timeline.removeMark('_active');
    }
});
window.addEventListener('keyup', function (ev) {
    shift = ev.shiftKey;
});
toolbox.on('K', createMark);

toolbox.on('back', function () {
    console.log('0!');
    timeline.active.setTime(0);
});

toolbox.on('foreward', function () {
});

toolbox.on('play', function () {
    timeline.toggle();
});

timeline.on('start', function () {
    toolbox.buttons.play.textContent = '||';
});
timeline.on('stop', function () {
    toolbox.buttons.play.textContent = '>';
});

timeline.on('mark', function (m, elem) { scan(elem) });

function createMark () {
    var m = timeline.mark();
    m.on('click', function () {
        if (currentMark) canvas[currentMark.id].hide();
        canvas[m.id].show();
        currentMark = m;
    });
    
    if (currentMark && shift) {
        canvas[m.id] = pencil.parse(canvas[currentMark.id].toSource());
    }
    else {
        canvas[m.id] = pencil();
    }
    if (currentMark) {
        canvas[currentMark.id].hide();
    }
    canvas[m.id].appendTo('#canvas');
    currentMark = m;
}

var canvas = {}, currentMark;
createMark();

scan(document);
