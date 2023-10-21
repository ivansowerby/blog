const fontSize = 100;
const fontFamily = "Space Grotesk";

$().ready(() => {
    const canvas = $("#background");

    const matrix = new Matrix(canvas);
    
    const multiplier = 2;
    $(window).on("resize", () => {
        matrix.resize(multiplier)
        const libraryWidth = getLibraryWidth() * multiplier;
        const regionWidth = (matrix.ctx.canvas.width - libraryWidth) / 2;
        Array(2).fill(regionWidth).forEach((width, i) => {
            const gap = libraryWidth * i;
            const from = (width * i) + gap;
            const region = [from, 0, width - fontSize, matrix.ctx.canvas.height];
            matrix.gerrymander(i, region)            
        });
    }).trigger("resize");

    window.limit = 0;
    until(50, () => {
        window.limit++
    }, 100);

    const animate = () => {
        let continuityFlag = true;
        matrix.per((region) => {
            //add
            for(i = 0; i < window.limit - region.glyphs.length; i++) {
                const [x, y] = [Math.random(), 0]; 
                const alphanumeric = String.prototype.randomAlphanumeric();
                const style = new Gradient([255, 255, 255], [32, 32, 32]);
                const glyph = new Glyph(alphanumeric, [x, y], style);
                region.glyphs.push(glyph);
            }
            //check
            for(const glyph of region.glyphs) {
                continuityFlag = continuityFlag && (glyph.y > 1);
            }
        });
        matrix.clear();
        matrix.draw();
        //freefall
        matrix.per((region) => {
            region.glyphs = region.glyphs.map((glyph) => {
                const canvasHeight = canvas.height();
                const canvasHeightScaler = canvasHeight / 10;
                glyph.moveY(1 / canvasHeightScaler);
                glyph.style.progress(canvasHeightScaler);
                return glyph;
            });
        });
        if(!continuityFlag) { requestAnimationFrame(animate); }
    }
    animate();
});

const sleep = (timeout) => new Promise(resolve => setTimeout(resolve, timeout));

async function until(n, f, timeout) {
    for(let i = 0; i < n; i++) {
        f();
        await sleep(timeout);
    }
}

const getLibraryWidth = () => {
    const libraryContainer = $(".library-container");
    const libraryWidth = libraryContainer.width();
    return libraryWidth;
}

class Matrix {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.get(0).getContext("2d");
        this.regions = [];
    }

    resize(multiplier) {
        this.ctx.canvas.width = this.canvas.width() * multiplier;
        this.ctx.canvas.height = this.canvas.height() * multiplier;
    }

    per(f) {
        this.regions.forEach((region) => f(region));
    }

    gerrymander(i, region) {
        if(this.regions.length <= i) { 
            this.regions.push(...Array(i - this.regions.length + 1).fill(null));
            this.regions[i] = new Region(...region);
        }
        else {
            this.regions[i].region = region;
        }
    }

    clear() {
        // this.regions.forEach((region) => this.ctx.clearRect(...region.region));
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    draw() {
        this.regions.forEach((region) => {
            const glyphs = region.glyphs;
            const [left, top, width, height] = region.region;
            glyphs.forEach((glyph) => {
                const [x, y] = [glyph.x * width + left, glyph.y * height + top];
                const alphanumeric = glyph.glyph;
                const style = glyph.style;
                this.ctx.fillStyle = style.color.toRGB();
                this.ctx.font = `${fontSize}px ${fontFamily}`
                this.ctx.fillText(alphanumeric, x, y);
            });
        });
    }
}

class Region {
    constructor(left, top, width, height) {
        this.region = [left, top, width, height];
        this.glyphs = [];
    }
}