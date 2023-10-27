$(window).ready(() => {
    //icon button
    const baseURL = getBaseUrl();
    
    const iconButton = $("#icon-button");
    iconButton.on("click", () => {
        window.open(baseURL, "_self");
    });
});