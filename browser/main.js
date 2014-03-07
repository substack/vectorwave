var keycode = require('keycode');
var scan = require('./scan.js')();
var pencil = require('svg-pencil');
var svgSelect = require('svg-select');

var timeline = require('editor-timeline')(200);
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
    if (chr === 's') toolbox.select('select');
    if (chr === 'p') toolbox.select('pencil');
    if (chr === 'delete') timeline.removeMark('_active');
    if (chr === 'home') { stop(); timeline.setTime(0) }
    if (chr === 'space') timeline.toggle();
    if (chr === 'left') { stop(); timeline.select('prev') }
    if (chr === 'right') { stop(); timeline.select('next') }
    
    function stop () {
        ev.stopPropagation();
        ev.preventDefault();
    }
});
window.addEventListener('keyup', function (ev) {
    shift = ev.shiftKey;
});
toolbox.on('K', createMark);
toolbox.on('back', function () { timeline.setTime(0) });
toolbox.on('play', function () { timeline.toggle() });

toolbox.on('click', function (button, name) {
    var keys = Object.keys(canvas);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (name === 'pencil') canvas[k].enable();
        else canvas[k].disable();
    }
});

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

timeline.on('remove', function (mark) {
    var e = canvas[mark.id].element;
    e.parentNode.removeChild(e);
    delete canvas[mark.id];
    if (currentMark === mark) currentMark = undefined;
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
    timeline.select(m.id);
    
    var sel = svgSelect(canvas[m.id].element);
    sel.disable();
    sel.on('select', function (p) {
        p.style.stroke = 'red';
    });
    sel.on('blur', function (p) {
        p.style.stroke = 'black';
    });
    var last;
    var c = canvas[m.id], down = false;
    window.addEventListener('mousedown', function (ev) {
        last = ev;
        down = true;
    });
    window.addEventListener('mouseup', function (ev) { down = false });
    window.addEventListener('mousemove', function (ev) {
        if (!down) return;
        var dx = last ? ev.clientX - last.clientX : 0;
        var dy = last ? ev.clientY - last.clientY : 0;
        last = ev;
        if (!sel.enabled) return;
        if (!sel.selected) return;
        var parts = sel.selected.getAttribute('d').split(/\s+/);
        sel.selected.setAttribute('d', parts.map(function (x) {
            if (/^[\d.]+,[\d.]+$/.test(x)) {
                var s = x.split(',');
                var x = Number(s[0]) + dx;
                var y = Number(s[1]) + dy;
                return x + ',' + y;
            }
            return x;
        }).join(' '));
    });
    
    c.on('enable', function () { sel.disable() });
    c.on('disable', function () { sel.enable(); down = false });
}

var canvas = {}, currentMark;
createMark();
toolbox.select('pencil');
scan(document);
