var fs = require('fs');
var html = fs.readFileSync(__dirname + '/cursor.html', 'utf8');
var domify = require('domify');
var parseTime = require('./parse_time.js');

module.exports = Cursor;

function Cursor () {
    this.element = domify(html);
}

Cursor.prototype.appendTo = function (target) {
    if (typeof target !== 'string') target = document.querySelector(target);
    target.appendChild(this.element);
};

Cursor.prototype.setTime = function (time) {
    if (typeof time === 'string') time = parseTime(time);
    this.element.textContent = time;
};
