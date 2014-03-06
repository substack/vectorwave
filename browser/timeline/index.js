var cursor = require('./cursor.js');
var classList = require('class-list');

module.exports = Timeline;

function Timeline (pxps) {
    if (!(this instanceof Timeline)) return new Timeline(pxps);
    var div = this.element = document.createElement('div');
    div.style.height = '100%';
    div.style.width = '100%';
    
    this.pixelsPerSecond = pxps;
    this.active = cursor('active', pxps).appendTo(div);
    this.hover = cursor('hover', pxps).appendTo(div);
    this.hover.hide();
    this._listen(div);
}

Timeline.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
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
