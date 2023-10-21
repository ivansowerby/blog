$().ready(() => {
    const libraryPlan = new LibraryPlan();
    libraryPlan.load().then((libraryPlan) => {
        for(const bookProperties of libraryPlan.reverse()) {
            const book = new Book(bookProperties);
            const shelf = $(".shelf-container"); 
            book.shelf(onto = shelf);
        }
        scrollToFragment();
    });
})