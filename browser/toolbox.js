var fs = require('fs');
var html = fs.readFileSync(__dirname + '/toolbox.html', 'utf8');
var domify = require('domify');
var classList = require('class-list');

module.exports = Toolbox;

function Toolbox () {
    var self = this;
    if (!(this instanceof Toolbox)) return new Toolbox;
    var div = this.element = domify(html);
    var buttons = div.querySelectorAll('button');
    var selected = {};
    
    for (var i = 0; i < buttons.length; i++) (function (button) {
        var mode = button.getAttribute('x-mode');
        var name = button.getAttribute('name');
        
        button.addEventListener('click', function () {
            if (mode && selected[mode]) selected[mode].remove('selected');
            if (mode) {
                selected[mode] = classList(button);
                selected[mode].add('selected');
            }
            
            self.emit('click', button, name);
            self.emit(name, button);
        });
    })(buttons[i]);
}

Toolbox.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
};
