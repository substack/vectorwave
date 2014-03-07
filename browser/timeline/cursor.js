var fs = require('fs');
var html = fs.readFileSync(__dirname + '/cursor.html', 'utf8');
var domify = require('domify');
var classList = require('class-list');
var formatTime = require('../time/format.js');
var Left = require('./left.js');

module.exports = Cursor;

function Cursor (name, pxps) {
    var self = this;
    if (!(this instanceof Cursor)) return new Cursor(name, pxps);
    this.element = domify(html);
    this.classList = classList(this.element);
    if (name) this.classList.add(name);
    
    this.left = Left(pxps);
    this.left.on('left', function (px) {
        self.element.style.left = px;
    });
    this.left.on('seconds', function (seconds) {
        self.element.textContent = formatTime(seconds);
    });
}

Cursor.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
    return this;
};

Cursor.prototype.hide = function () {
    this.element.style.display = 'none';
};

Cursor.prototype.show = function () {
    this.element.style.display = 'block';
};

Cursor.prototype.setTime = function (time) {
    this.left.setTime(time);
};

Cursor.prototype.getSeconds = function () {
    return this.left.seconds || 0;
};

Cursor.prototype.setPixels = function (px) {
    this.left.setPixels(px);
};
