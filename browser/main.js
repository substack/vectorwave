var timeline = document.querySelector('#timeline');
var select = timeline.querySelector('.cursor.select');
var pixelsPerSecond = 100;
var cursor = require('cursor');

timeline.addEventListener('mousemove', function (ev) {
    var x = ev.clientX - this.offsetLeft;
    select.style.left = x;
    var active = cursor()
});
