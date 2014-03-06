var fs = require('fs');
var html = fs.readFileSync(__dirname + '/mark.html', 'utf8');
var domify = require('domify');
var Left = require('./left.js');

module.exports = Mark;

function Mark (pos) {
    var self = this;
    if (!(this instanceof Mark)) return new Mark(pos);
    
    this.pos = pos;
    this.element = domify(html);
    
    if (pos.px) self.element.style.left = pos.px;
    
    pos.on('left', function (px) {
        self.element.style.left = px;
    });
}

Mark.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
};
