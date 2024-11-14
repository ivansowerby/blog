function* zip(...arrays) {
    let i = 0;
    while(true) {
        let generator = [];
        for(const array of arrays) {
            if(i >= array.length) { return null; }
            generator.push(array[i]);
        }
        yield generator;
        i++;
    }
}
