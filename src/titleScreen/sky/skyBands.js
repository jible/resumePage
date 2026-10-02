import { skyBackground } from './skyBackground.js';

// Dithered bands that make the sky fade in steps. Each band runs from its own top edge down to the bottom
// of the PAGE, so they overlap and the tint builds up toward the end of the page. The top edge of every
// band is the dither tile (a 16px ramp from sparse dots to solid), so each step fades in instead of
// cutting in.
//
// The sky itself stays fixed, since it is a backdrop. The bands are not part of it: they live in their
// own layer that is as tall as the whole page and scrolls with it, sitting just above the fixed sky and
// under the page content.
const SkyBandCount = 3;
const SkyBandOpacity = 0.4;   // per band; they stack, so the bottom is about 1 - (1 - opacity)^count
const DitherTileSize = 32;      // height of skyDitherLong.png in image pixels
const DitherPixel = 4;         // screen pixels per dither pixel, a whole number so the dots stay crisp
const BottomBandPink = 35;      // percent of the dating sim pink mixed into the bottom bands' color
const PinkBandCount = 2;        // how many bands, counting up from the bottom, get the pink
const FirstBandAboveWaves = 160; // screen pixels from the top of the first band down to the top of the waves
const WaterRestingHeight = 0.5;  // .water's height once the intro sweep ends, as a fraction of the title screen (title.css)

export function SetUpSkyBands(){
    let skyBands = document.createElement('div');
    skyBands.classList.add('sky-bands');
    skyBands.style.setProperty('--band-opacity', SkyBandOpacity);
    skyBands.style.setProperty('--dither-size', `${DitherTileSize * DitherPixel}px`);
    for (let i = 0; i < SkyBandCount; i++){
        let band = document.createElement('div');
        band.classList.add('sky-band');
        if (i >= SkyBandCount - PinkBandCount){
            band.style.setProperty('--band-pink', `${BottomBandPink}%`);
        }
        skyBands.appendChild(band);
    }
    skyBackground.after(skyBands);

    // The layer is as tall as the page (measured to the end of the last section, so it never feeds back into
    // its own measurement). The first band starts a set distance above the waves, so its dither always shows
    // in the title screen's sky; the rest follow at even steps down to the bottom of the page. Everything is
    // snapped to the dither pixel grid so the edges stay sharp. Redone whenever the layout changes: the window
    // resizes, or the project cartridges finish loading and make the projects section taller.
    //
    // The waves are placed where they rest after the intro sweep rather than measured, since the sweep animates
    // the water's height: a layout during the sweep (a resize from a browser toolbar settling, say) would
    // otherwise put the bands at the top of the page until the sweep ends.
    let lastSection = document.getElementById('about');
    let titleScreen = document.getElementById('title-screen');
    let waves = document.querySelector('.waves');
    function LayoutSkyBands(){
        let pageHeight = lastSection.offsetTop + lastSection.offsetHeight;
        skyBands.style.height = `${pageHeight}px`;
        let wavesTop = PageTop(titleScreen) + titleScreen.offsetHeight * (1 - WaterRestingHeight) - waves.offsetHeight;
        let firstTop = Math.max(0, wavesTop - FirstBandAboveWaves);
        let step = (pageHeight - firstTop) / SkyBandCount;
        Array.from(skyBands.children).forEach((band, i) => {
            let top = Math.round((firstTop + i * step) / DitherPixel) * DitherPixel;
            band.style.top = `${top}px`;
        });
    }
    window.addEventListener('resize', LayoutSkyBands);
    let sectionSizes = new ResizeObserver(LayoutSkyBands);
    document.querySelectorAll('#projects, #about').forEach((section) => sectionSizes.observe(section));
    LayoutSkyBands();
}

// Where an element's top edge is on the page. The body is the scrolling element, so its scroll is added back in.
function PageTop(element){
    return element.getBoundingClientRect().top - document.body.getBoundingClientRect().top + document.body.scrollTop;
}
