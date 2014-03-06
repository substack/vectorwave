module.exports = function () {
    var moving = [], last;
    window.addEventListener('mousemove', function (ev) {
        var dx = last ? ev.clientX - last.clientX : 0;
        var dy = last ? ev.clientY - last.clientY : 0;
        for (var i = 0; i < moving.length; i++) moving[i].on(dx, dy);
        last = ev;
    });
    window.addEventListener('mouseup', function (ev) {
        for (var i = 0; i < moving.length; i++) moving[i].off();
        moving = [];
    });
    
    return function scan (root) {
        var elems = root.querySelectorAll('*[x-drag]')
        if (root.getAttribute && root.getAttribute('x-drag') !== undefined) {
            elems = [].slice.call(elems).concat(root);
        }
        
        for (var i = 0; i < elems.length; i++) (function (elem) {
            var target = elem;
            var tclist = classList(elem);
            var tstyle = window.getComputedStyle(target);
            var tpos = { x: parseInt(tstyle.left), y: parseInt(tstyle.top) };
            
            var handles = elem.querySelectorAll('*[x-drag-handle]');
            if (handles.length === 0) handles = [ elem ];
            
            for (var j = 0; j < handles.length; j++) (function (h) {
                h.addEventListener('mousedown', function () {
                    moving.push({ on: onmove, off: off });
                    tclist.add('dragging');
                });
                function off () { tclist.remove('dragging') }
                function onmove (dx, dy) {
                    target.style.left = (tpos.x += dx);
                    target.style.top = (tpos.y += dy);
                }
            })(handles[j]);
        })(elems[i]);
    };
};
