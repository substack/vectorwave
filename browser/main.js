var timeline = document.querySelector('#timeline');
var cursor = require('./cursor.js');

var active = cursor('active', 50).appendTo(timeline);
var hover = cursor('hover', 50).appendTo(timeline);

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
