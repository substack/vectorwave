var fs = require('fs');
var html = fs.readFileSync(__dirname + '/cursor.html', 'utf8');
var domify = require('domify');
var classList = require('class-list');
var parseTime = require('./parse_time.js');
var formatTime = require('./format_time.js');

module.exports = Cursor;

function Cursor (name, pxps) {
    if (!(this instanceof Cursor)) return new Cursor(name, pxps);
    this.element = domify(html);
    this.classList = classList(this.element);
    if (name) this.classList.add(name);
    this.pixelsPerSecond = pxps;
}

Cursor.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
    return this;
};

Cursor.prototype.setTime = function (time) {
    var seconds = typeof time === 'number' ? time : parseTime(time);
    this.element.textContent = formatTime(seconds);
    this.element.style.left = seconds * this.pixelsPerSecond;
    return this;
};

Cursor.prototype.setPixels = function (px) {
    var seconds = px / this.pixelsPerSecond;
    this.setTime(seconds);
};
