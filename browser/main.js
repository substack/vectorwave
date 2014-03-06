var timeline = document.querySelector('#timeline');
var cursor = require('./cursor.js');

var active = cursor('active', 50).appendTo(timeline);
var hover = cursor('hover', 50).appendTo(timeline);

timeline.addEventListener('mousemove', function (ev) {
    hover.setPixels(ev.clientX - this.offsetLeft);
});

timeline.addEventListener('click', function (ev) {
    active.setPixels(ev.clientX - this.offsetLeft);
});
