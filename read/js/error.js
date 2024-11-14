class Error {
    constructor(parent) {
        this.parent = parent;
    }

    newMessage(...messages) {
        const errorContainer = addChild(this.parent, "div", "error-container");
        messages.forEach((message, i) => {
            const errorItem = addTwins(errorContainer, "div", "error-item");
            $(errorItem[i]).text(message);
        });
    }
}
