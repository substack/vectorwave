var fs = require('fs');
var html = fs.readFileSync(__dirname + '/mark.html', 'utf8');
var domify = require('domify');
var Left = require('./left.js');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Mark;
inherits(Mark, EventEmitter);

function Mark (pos) {
    var self = this;
    if (!(this instanceof Mark)) return new Mark(pos);
    
    this.pos = pos;
    var div = this.element = domify(html);
    div.addEventListener('click', function (ev) {
        ev.stopPropagation();
        self.emit('click', div);
    });
    
    div.addEventListener('mousedown', function (ev) {
        window.addEventListener('mouseup', mouseup);
        function mouseup () {
            pos.setPixels(div.style.left);
            window.removeEventListener('mouseup', mouseup);
        }
    });
    
    if (pos.px) self.element.style.left = pos.px;
    
    pos.on('left', function (px) {
        self.element.style.left = px;
    });
}

Mark.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
};
