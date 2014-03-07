var keycode = require('keycode');
var scan = require('./scan.js')();
var pencil = require('svg-pencil');

var timeline = require('./timeline')(200);
timeline.appendTo('#timeline');

var toolbox = require('./toolbox.js')();
toolbox.appendTo('#workspace');

var shift = false, inputtingText;
window.addEventListener('click', function (ev) {
    var tag = String(ev.target.tagName).toLowerCase();
    inputtingText = /^(input|textarea)$/.test(tag);
});
window.addEventListener('blur', function (ev) {
    inputtingText = false;
});
window.addEventListener('keydown', function (ev) {
    shift = ev.shiftKey;
    if (inputtingText) return;
    var chr = keycode(ev);
    if (chr === 'k') createMark();
    if (chr === 'delete') timeline.removeMark('_active');
    if (chr === 'home') timeline.setTime(0);
    if (chr === 'space') timeline.toggle();
    if (chr === 'left') {
        ev.stopPropagation();
        ev.preventDefault();
        timeline.select('prev');
    }
    if (chr === 'right') {
        ev.stopPropagation();
        ev.preventDefault();
        timeline.select('next');
    }
});
window.addEventListener('keyup', function (ev) {
    shift = ev.shiftKey;
});
toolbox.on('K', createMark);
toolbox.on('back', function () { timeline.setTime(0) });
toolbox.on('play', function () { timeline.toggle() });

timeline.on('start', function () {
    toolbox.buttons.play.textContent = '||';
});
timeline.on('stop', function () {
    toolbox.buttons.play.textContent = '>';
});

timeline.on('show', function (mark) {
    if (currentMark) canvas[currentMark.id].hide();
    canvas[mark.id].show();
    currentMark = mark;
});

timeline.on('mark', function (m, elem) { scan(elem) });
window.timeline = timeline;

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
    timeline.select(m.id);
}

var canvas = {}, currentMark;
createMark();

scan(document);
