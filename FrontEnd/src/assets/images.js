function getImage (name){
    return new URL(`./image/${name}`, import.meta.url).href
}
export default getImage;

