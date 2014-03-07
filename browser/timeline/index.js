var cursor = require('./cursor.js');
var classList = require('class-list');
var Mark = require('./mark.js');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Timeline;
inherits(Timeline, EventEmitter);

function Timeline (pxps) {
    if (!(this instanceof Timeline)) return new Timeline(pxps);
    var div = this.element = document.createElement('div');
    div.style.height = '100%';
    div.style.width = '100%';
    
    this.pixelsPerSecond = pxps;
    this.active = cursor('active', pxps).appendTo(div);
    this.hover = cursor('hover', pxps).appendTo(div);
    this.hover.hide();
    this.marks = [];
    this._listen(div);
}

Timeline.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
    return this;
};

Timeline.prototype.mark = function () {
    var self = this;
    var m = Mark(this.active.left.copy());
    m.id = Math.floor(Math.random() * Math.pow(16,8)).toString(16);
    m.on('click', function (div) {
        for (var i = 0; i < self.marks.length; i++) {
            classList(self.marks[i].element).remove('active');
        }
        classList(div).add('active');
        self._activeMark = m.id;
    });
    this.marks.push(m);
    m.appendTo(this.element);
    this.emit('mark', m, m.element);
    return m;
};

Timeline.prototype.removeMark = function (m) {
    if (m === '_active') m = this._activeMark;
    if (!m) return false;
    for (var i = 0; i < this.marks.length; i++) {
        if (this.marks[i].id === m) {
            this.element.removeChild(this.marks[i].element);
            this.marks.splice(i, 1);
            return true;
        }
    }
    return false;
};

Timeline.prototype.start = function () {
    if (this._started) return;
    var self = this;
    this._started = Date.now();
    this._offset = this.active.getSeconds();
    window.requestAnimationFrame(function f () {
        if (!self._started) return;
        self._tick();
        window.requestAnimationFrame(f);
    });
    this.emit('start');
};

Timeline.prototype._tick = function () {
    this.active.setTime(this._offset + (Date.now() - this._started) / 1000);
};

Timeline.prototype.stop = function () {
    if (!this._started) return;
    this._started = 0;
    this.emit('stop');
};

Timeline.prototype.toggle = function () {
    if (this._started) this.stop()
    else this.start()
};

Timeline.prototype.setTime = function () {
    this.active.setTime
};

Timeline.prototype._listen = function (div) {
    var self = this;
    div.addEventListener('mouseover', function (ev) {
        self.hover.show();
    });
    
    div.addEventListener('mouseout', function (ev) {
        self.hover.hide();
    });
    
    div.addEventListener('mousemove', function (ev) {
        self.hover.setPixels(ev.clientX - this.offsetLeft);
        self.hover.show();
    });
    
    div.addEventListener('click', function (ev) {
        self.active.setPixels(ev.clientX - this.offsetLeft);
    });
};
