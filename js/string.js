String.prototype.isAlpha = function(c) {
    return /^[A-Z]$/i.test(c);
}

String.prototype.at = function(i) { 
    if(i < 0) { i += this.length; }
    return this.charAt(i);
}
