module.exports = function (str) { 
    var seconds = 0;
    var parts = str.split(':');
    for (var i = 0, len = parts.length; i < len; i++) {
        seconds += Number(parts[i]) * Math.pow(60, len - i - 1);
    }
    return seconds;
};
