const headingSelectors = Array(6).fill("h").map((s, i) => `${s}${i + 1}`);

const filterHeadings = (...parents) => {
    return parents.map((_parent) => _parent.findFrom(headingSelectors.join(", ")));
}