import * as crypto from "../../modules/crypto.js";

$().ready(() => {
    const blogContainer = $(".blog-container");
    const blogItem = addChild(blogContainer, "div", "blog-item");
    
    window.error = new Error(blogItem);
    
    const query = new URLSearchParams(window.location.search);
    if(query.has("hash")) {
        const statusContainer = blogContainer.parent();
        const hash = query.get("hash");
        getBlog(
            statusContainer,
            hash,
            (blog) => {
                window.blog = blog;
                if(blog.hasOwnProperty("title")) {
                    const title = blog.title;
                    $("title").prependToText(title, " - ");
                }
            }
        ).then((blog) => {
            if(blog === undefined) { return null; };
            
            //hash
            const hash = window.blog["hash"];
            let hashStatus = INVALID_STATUS;
            if(hash != null && blog.hasHash(hash)) {
                hashStatus = VALID_STATUS;
            }
            setStatus(hashStatus, "hash");

            //signature
            const [signature, publicKey] = [window.blog["signature"], window.blog["public-key"]];
            let signatureStatus = INVALID_STATUS;
            if((signature != null && publicKey != null) && signature.isVerified(publicKey)) {
                hashStatus = VALID_STATUS;
            }
            setStatus(signatureStatus, "signature");

            const converter = new showdown.Converter();
            const html = converter.makeHtml(blog);

            blogItem.html(html);
            
            styleBlogForHeader();
            
            fragmentHeadings(blogItem);
            scrollToBlogFragment();

            //table of contents
            const tableOfContents = addChild($(".layout-item").last(), "div", "table-of-contents");
            const contents = new Contents(tableOfContents);
            contents.from(blogItem);
        });
    }
    else {
        window.error.newMessage(
            "missing hash parameter",
            "the entered URL must include a hash query parameter, corresponding to the hash of the related file (blog), as per  the index.(json)",
            ".../read/?hash=<REPLACE-WITH-HASH>"
        );
    }
});

const createStatusHeader = (parent, headerPlan, statusPlan) => {
    window.statuses = new Statuses(parent, headerPlan, statusPlan);
    //post-processing
    const headerItems = window.statuses.headerItems; 
    const wrapper = $("<div>");
    wrapper.attr("class", "status");
    headerItems.each((_, headerItem) => {
        const target = $(headerItem);
        target.children(".status-image, .status-state").wrapAll(wrapper);
    });
}

const setStatus = (status, ...classes) => {
    if(window.statuses == undefined) { return null; }
    const headerItems = window.statuses.setStatus(status, ...classes);
    //post-processing
    headerItems.attr("value", status);
    const _status = headerItems.children(".status");
    const statusState = _status.children(".status-state");
    const statusContentWidth = cssUnitToFloat(_status.css("max-width"));
    const statusFontSize = statusContentWidth / status.length * 2;
    statusState.css("font-size", `${statusFontSize}px`)
    statusState.text(status);
}

String.prototype.hasHash = function(check) {
    return crypto.hasHash(this, check);
}

String.prototype.isVerified = function(publicKey) {
    return crypto.isVerified(this, publicKey);
}

async function getBlog(statusContainer, hash, parser) {
    const libraryPlan = new LibraryPlan("../json/library/index.json");
    return await libraryPlan.load().then((libraryPlan) => {
        for(const bookProperties of libraryPlan) {
            if(!bookProperties.hasOwnProperty("hash") || bookProperties.hash != hash) { continue; }
            return parseBlog(statusContainer, bookProperties, parser);
        }
        window.error.newMessage(
            "invalid hash",
            "the given hash parameter does not correspond to any file (blog), as per the index(.json)"
        );
    });
}

async function parseBlog(statusContainer, blog, parser) {
    const headerPlan = new HeaderPlan();
    return await headerPlan.load().then((headerPlan) => {
        const statusPlan = new StatusPlan();
        return statusPlan.load().then((statusPlan) => {
            createStatusHeader(statusContainer, headerPlan, statusPlan);
            headerPlan.forEach(([_class, _]) => setStatus(CHECKING_STATUS, _class));
            parser(blog);
            return loadBlog(blog);
        }); 
    });
}

async function loadBlog(blog) {
    const filepath = [
        "../json/library",
        blog.filepath
    ].join("/");
    return await $.get(filepath, (data, statusCode) => {
        if(statusCode == "success") { return data; }
        else {
            window.error.newMessage(
                "failed fetching",
                "blog failed to be fetched and loaded"
            );
        }
    });
}