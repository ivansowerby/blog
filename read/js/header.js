class HeaderPlan {
    constructor(path = "json/header.json") {
        this.path = path;
    }

    async load() {
        return Object.entries(
            await $.getJSON(this.path)
                .fail(() => this.load())
        );
    } 
}

class StatusPlan {
    constructor(path = "json/status.json") {
        this.path = path;
    }

    async load() {
        return await $.getJSON(this.path)
            .fail(() => this.load());
    }
}

const CHECKING_STATUS = "checking";
const VALID_STATUS = "valid";
const INVALID_STATUS = "invalid";

class Statuses {
    constructor(parent, elements, statusPlan) {
        this.statusPlan = statusPlan;
        const header = addChild(parent, "div", "header", BEFORE_ELEMENT);
        const headerContainer = addChild(header, "div", "header-container");
        const headerItemClass = "header-item";
        addArea(elements.length, () => addChild(headerContainer, "div", headerItemClass));
        this.headerItems = headerContainer.children(asJoinedClasses(headerItemClass));
        for(const [containerSelector, [elementClass, elementsProperties]] of zip(this.headerItems, elements)) {
            const container = $(containerSelector);
            container.addClass(elementClass);
            for(const elementProperties of elementsProperties) {
                let attributes = elementProperties.attributes;
                const tag = elementProperties.tag;
                const _class = attributes.class;
                delete attributes.class;
                const element = addChild(container, tag, _class);
                element.attr(attributes);
                const content = elementProperties.content;
                element.html(content);
            }
            $(window).trigger("resize");
        }
    }

    setStatus(status, ...parentClasses) {
        const selector = asJoinedClasses(...parentClasses);
        const container = this.headerItems.filter(selector);
        const statusObjects = this.statusPlan[status];
        for(const [statusClassName, statusClassProperties] of Object.entries(statusObjects)) {
            let item = container;
            if(statusClassName != "") { item = item.findFrom(asJoinedClasses(statusClassName)) }
            item.edit(statusClassProperties)
        }
        return container;
    }
}

const styleBlogForHeader = () => {
    const header = $(".header");
    const headerHeight = header.innerHeight();
    const blogContainer = $(".blog-container");
    blogContainer.css("margin-top", `${headerHeight}px`);

    const blogItem = $(".blog-item").first();
    blogItem.addClass("top-blog-item");
}
