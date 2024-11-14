jQuery.fn.findFrom = function(selector) {
    return this.find(selector).add(this.filter(selector))
}

jQuery.fn.edit = function(properties) {
    if(properties.hasOwnProperty("attributes")) {
        const attributes = properties.attributes;
        this.attr(attributes);
    }
    if(properties.hasOwnProperty("style")) {
        const style = properties.style;
        this.css(style);
    }
}

jQuery.fn.appendToText = function(...text) {
    this.text(this.text() + text.join(""));
}

jQuery.fn.prependToText = function(...text) {
    this.text(text.join("") + this.text());
}
