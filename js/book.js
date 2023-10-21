class Book {
    constructor(content) {
        this.content = content
        //time and date
        const timestamp = this.content.timestamp;
        const timeAndDate = [getTime(timestamp, ":"), getDate(timestamp, "/")].join(" ");
        Object.assign(this.content, {"time and date": timeAndDate});
    }

    shelf(onto) {
        const book = addChild(onto, "div", "book-container");
        //focusable
        book.attr("tabindex", "0");
        const hash = this.content.hash;
        book.attr("id", hash);
        //left
        const bookItemLeft = addChild(book, "div", "book-item-left");
        this.#add(bookItemLeft, ["title", "author", "time and date", "timestamp"]);
        //right
        const bookItemRight = addArea(2, () => {
            return addChild(book, "div", "book-item-right");
        });
        this.#add(bookItemRight, ["filepath", "hash"]);
        //middle
        const bookItemMiddle = addArea(3, () => {
            return addChild(book, "div", "book-item-middle");
        });
        this.#add(bookItemMiddle, ["blurb"]);
        //bottom
        const bookItemBottom = addArea(3, () => {
            return addChild(book, "div", "book-item-bottom");
        });

        const queryObj = {
            "hash": hash
        };
        
        const baseURL = [
            window.location.protocol,
            window.location.host
        ].join("//") + window.location.pathname;
        let i = baseURL.length - 1;
        while(["/", "\\"].includes(baseURL.at(i))) { i--; }
        const query = new URLSearchParams(queryObj).toString();
        const blogURL = [baseURL.slice(0, i + 1), "read", `?${query}`].join("/");

        const openInTabButtonImageSrc = "img/open_in_browser_FILL0_wght700_GRAD200_opsz48.svg";
        const openInTabButton = addImageWithinButton(bookItemBottom, "book-item-button", openInTabButtonImageSrc);
        openInTabButton.on("click", () => {
            //_self target
            window.open(blogURL, "_self");
        });
        
        const openInNewTabImageSrc = "img/open_in_new_FILL0_wght700_GRAD200_opsz48.svg";
        const openInNewTabButton = addImageWithinButton(bookItemBottom, "book-item-button", openInNewTabImageSrc);
        openInNewTabButton.on("click", () => {
            //_blank target
            window.open(blogURL, "_blank");
        });
        
        const linkImageSrc = "img/link_FILL0_wght700_GRAD200_opsz48.svg";
        const linkButton = addImageWithinButton(bookItemBottom, "book-item-button", linkImageSrc);
        linkButton.on("click", () => {
            navigator.clipboard.writeText(blogURL);
            createNotification();
        });
        
        const fragmentImageSrc = "img/tag_FILL0_wght700_GRAD200_opsz48.svg";
        const fragmentButton = addImageWithinButton(bookItemBottom, "book-item-button", fragmentImageSrc);        
        fragmentButton.on("click", () => {
            window.location.hash = hash;
            createNotification();
        });
    }

    #add(element, classes) {
        for(const key of classes) {
            const value = this.content[key];
            const _class = key.replaceAll(" ", "-");
            //parent (pair)
            const pair = addChild(element, "div", _class);
            //key
            const bookItemKey = addChild(pair, "div", "book-item-key");
            bookItemKey.text(key);
            //value
            const bookItemValue = addChild(pair, "div", `book-item-value ${_class}`);
            bookItemValue.text(value);
        }
    }
}

const addImageWithinButton = (parent, _class, src, relative = AFTER_ELEMENT) => {
    const button = addTwins(parent, "button", _class, relative);
    button.wrap("<div>");
    const image = addTwins(button, "img");
    image.attr("src", src);
    return button;
}


class LibraryPlan {
    constructor(path = "json/library/index.json") {
        this.path = path;
    }

    async load() {
        return (
            await $.getJSON(this.path)
                .fail(() => this.load())
        ).library;
    }
}