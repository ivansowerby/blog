class Contents {
    constructor(parent) {
        this.contentContainer = addChild(parent, "div", "content-container");
        const contentsTitle = addChild(this.contentContainer, "h1", "heading content-item");
        contentsTitle.text("Contents");
        this.fragmentContainer = addChild(this.contentContainer, "div", "fragment-container content-item")
        //styling
        const top = getBlogTopMargin();
        this.contentContainer.css("top", numberToCssUnit(top));
    }

    from(element) {
        const headings = filterHeadings(element.findFrom(".heading-container"));
        headings.forEach((headings) => {
            for(const headingSelector of headings) {
                const heading = $(headingSelector);
                const contentButton = addChild(this.fragmentContainer, "button");
                const contentItem = addChild(contentButton, "div", "fragment-item");
                const contentHeadingPrefix = addChild(contentItem, "p", "heading-prefix");
                const contentHeading = addChild(contentItem, "p", "heading");
                const tag = heading.prop("tagName");
                const nprefix = parseInt(tag.slice(1, tag.length));
                const prefix = Array(nprefix).fill("#").join("");
                contentHeadingPrefix.text(prefix)
                const text = heading.text();
                contentHeading.text(text);
                //interactable
                contentButton.on("click", () => {
                    const hash = heading.attr("id");
                    updateFragment(hash);
                });
            }
        });
        const parent = this.contentContainer.parent();
        const containerWidth = this.contentContainer.outerWidth();
        $(window).on("resize", () => {
            const right = parent.width() - containerWidth;
            if(right < 0) {
                this.contentContainer.css("display", "none");
            }
            else if(this.contentContainer.css("display") == "none") {
                this.contentContainer.css("display", "flex");
            }
            this.contentContainer.css("right", numberToCssUnit(right));
        }).trigger("resize");
    }
}
