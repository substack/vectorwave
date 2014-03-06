module.exports = function (s) {
    var parts = [ Math.floor(s / 60 % 60), Math.floor(s % 60) ].map(pad);
    if (s > 60 * 60) parts.unshift(Math.floor(s / 60 / 60));
    return parts.join(':');
};
function pad (n) { return n < 10 ? '0' + n : String(n) }
