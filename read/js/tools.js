$().ready(() => {
    //back button
    const blogURL = getBlogUrl();

    const backButton = $("#back-button");
    backButton.on("click", () => {
        window.open(blogURL, "_self");
    });
    
    //tool container
    const toolContainer = $(".tool-container");
    const blogContainer = $(".blog-container");
    $(window).on("resize", () => {
        if(toolContainer.outerWidth() * 2 + blogContainer.width() > $("body").prop("clientWidth")) {
            toolContainer.css("display", "none");
        }
        else if(toolContainer.css("display") == "none") {
            toolContainer.css("display", "flex");
        } 
    });
});