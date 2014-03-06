var fs = require('fs');
var html = fs.readFileSync(__dirname + '/toolbox.html', 'utf8');
var domify = require('domify');

module.exports = Toolbox;

function Toolbox () {
    if (!(this instanceof Toolbox)) return new Toolbox;
    this.element = domify(html);
}

Toolbox.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
};
