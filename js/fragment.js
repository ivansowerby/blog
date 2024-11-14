const scrollToElement = (fragment, margin = 0, speed = "slow") => {
    if(String.prototype.isAlpha(fragment.at(0))) { fragment = `#${fragment}`; }
    const scrollTop = $(fragment).offset().top - margin;
    $("html, body").animate({
        scrollTop: scrollTop
    }, speed);
}

const scrollToFragment = (margin = 0) => {
    const hash = window.location.hash;
    if(hash != "" && $(document.body).has(hash).length) {
        scrollToElement(hash, margin);
    }
}
