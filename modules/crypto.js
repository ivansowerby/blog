import cryptoBrowserify from "https://cdn.jsdelivr.net/npm/crypto-browserify@3.12.0/+esm"

//sha256
export const hash = (s, encoding = "utf8") => {
    const hashStream = cryptoBrowserify.createHash("sha256");
    hashStream.update(s, encoding);
    const base = 16;
    const bytes = hashStream.digest();
    return Array.from(bytes).map((byte) => {
        const padding = Math.log(Math.pow(2, 8)) / Math.log(base);
        return byte.toString(base)
                   .padStart(padding, "0");
    }).join("");
}

export const hasHash = (s, check) => {
    return hash(s) == check;
}


export const isVerified = (signature, publicKey) => {
    //TODO
    return null;    
}