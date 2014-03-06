var parseTime = require('../time/parse.js');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Left;
inherits(Left, EventEmitter);

function Left (pxps) {
    if (!(this instanceof Left)) return new Left(pxps);
    this.pixelsPerSecond = pxps;
}

Left.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
    return this;
};

Left.prototype.setScale = function (pxps) {
    this.pixelsPerSecond = pxps;
    if (this._lastPixels) this.setPixels(this._lastPixels);
    else if (this._lastTime) this.setTime(this._lastTime);
};

Left.prototype.setTime = function (time) {
    this._lastPixels = null;
    this._lastTime = time;
    var seconds = typeof time === 'number' ? time : parseTime(time);
    this.emit('seconds', seconds);
    this.emit('left', seconds * this.pixelsPerSecond);
};

Left.prototype.setPixels = function (px) {
    this._lastPixels = px;
    this._lastTime = null;
    
    this.emit('seconds', px / this.pixelsPerSecond);
    this.emit('left', px);
};
