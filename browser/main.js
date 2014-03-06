var timeline = document.querySelector('#timeline');
var cursor = require('./cursor.js');

var active = cursor('active', 50).appendTo(timeline);
var hover = cursor('hover', 50).appendTo(timeline);
hover.hide();

timeline.addEventListener('mouseover', function (ev) {
    hover.show();
});

timeline.addEventListener('mouseout', function (ev) {
    hover.hide();
});

timeline.addEventListener('mousemove', function (ev) {
    hover.setPixels(ev.clientX - this.offsetLeft);
    hover.show();
});

timeline.addEventListener('click', function (ev) {
    active.setPixels(ev.clientX - this.offsetLeft);
});

var toolbox = require('./toolbox.js')();
toolbox.appendTo('#workspace');

(function () {
    var moving = [], last;
    window.addEventListener('mousemove', function (ev) {
        var dx = last ? ev.clientX - last.clientX : 0;
        var dy = last ? ev.clientY - last.clientY : 0;
        for (var i = 0; i < moving.length; i++) moving[i](dx, dy);
        last = ev;
    });
    window.addEventListener('mouseup', function (ev) { moving = [] });
    
    var elems = document.querySelectorAll('*[x-drag]')
    for (var i = 0; i < elems.length; i++) (function (elem) {
        var target = elem;
        var tstyle = window.getComputedStyle(target);
        var tpos = { x: parseInt(tstyle.left), y: parseInt(tstyle.top) };
        
        var handles = elem.querySelectorAll('*[x-drag-handle]');
        if (handles.length === 0) handles = [ elem ];
        
        for (var j = 0; j < handles.length; j++) (function (h) {
            h.addEventListener('mousedown', function () {
                moving.push(onmove);
            });
            function onmove (dx, dy) {
                target.style.left = (tpos.x += dx);
                target.style.top = (tpos.y += dy);
            }
        })(handles[j]);
    })(elems[i]);
})();
