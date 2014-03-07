var fs = require('fs');
var html = fs.readFileSync(__dirname + '/toolbox.html', 'utf8');
var domify = require('domify');
var classList = require('class-list');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Toolbox;
inherits(Toolbox, EventEmitter);

function Toolbox () {
    var self = this;
    if (!(this instanceof Toolbox)) return new Toolbox;
    var div = this.element = domify(html);
    var buttons = div.querySelectorAll('button');
    this.selected = {};
    this.buttons = {};
    
    for (var i = 0; i < buttons.length; i++) (function (button) {
        var name = button.getAttribute('name');
        self.buttons[name] = button;
        
        button.addEventListener('click', function () {
            self.setMode(name);
        });
    })(buttons[i]);
}

Toolbox.prototype.select = function (name) {
    var button = this.buttons[name];
    var mode = button.getAttribute('x-mode');
    
    if (mode && this.selected[mode]) {
        this.selected[mode].remove('selected');
    }
    if (mode) {
        this.selected[mode] = classList(button);
        this.selected[mode].add('selected');
    }
    this.emit('click', button, name);
    this.emit(name, button);
};

Toolbox.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
};
