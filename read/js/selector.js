const asClasses = (...selector) => asPrefix(".", ...selector);

const asJoinedClasses = (...selectors) => asClasses(...selectors).join(" ");

const asIds = (...selector) => asPrefix("#", ...selector);

const asPrefix = (prefix, ...selectors) => {
    return selectors.map((selector) => {
        if(selector.at(0) != prefix) { selector = prefix + selector; }
        return selector;
    });
}