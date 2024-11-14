const getBlogTopMargin = () => {
    return $(document).outerHeight() - $(".top-blog-item").innerHeight(); 
}

const scrollToBlogElement = (hash) => {
    const margin = getBlogTopMargin();
    scrollToElement(hash, margin);
}

const scrollToBlogFragment = () => {
    const margin = getBlogTopMargin();
    scrollToFragment(margin);
}

const updateFragment = (hash) => {
    window.location.hash = hash;
    scrollToBlogFragment();
    createNotification();
}

const fragmentHeadings = (...parents) => {
    const headingContainer = $("<div>");
    const _class = "heading-container";
    headingContainer.attr("class", _class)
    const headings = filterHeadings(...parents);
    headings.forEach((heading) => {
        heading.attr("class", "heading");
        heading.wrap(headingContainer)
        const headingContainers = heading.parent();
        const fragmentImageSrc = "img/tag_FILL0_wght700_GRAD200_opsz48.svg";
        const fragmentButton = addImageWithinButton(headingContainers, "heading-fragment-button", fragmentImageSrc, BEFORE_ELEMENT)
        fragmentButton.on("click", (e) => {
            const child = $(e.target);
            const grandparent = ancestor(2, child);
            const granduncle = grandparent.siblings();
            const hash = granduncle.attr("id");
            updateFragment(hash);
        });
    }); 
}

const traverse = (n, element, locomotion) => {
    if(n <= 0) {
        return element;
    } else {
        n--;
        return ancestor(n, locomotion(element));
    }
}

const ancestor = (n, child) => {
    return traverse(n, child, (element) => element.parent());
}
