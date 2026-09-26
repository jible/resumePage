import { skyBackground } from './skyBackground.js';

// Dithered bands that make the sky fade in steps. Each band runs from its own top edge down to the bottom
// of the PAGE, so they overlap and the tint builds up toward the end of the page. The top edge of every
// band is the dither tile (a 16px ramp from sparse dots to solid), so each step fades in instead of
// cutting in.
//
// The sky itself stays fixed, since it is a backdrop. The bands are not part of it: they live in their
// own layer that is as tall as the whole page and scrolls with it, sitting just above the fixed sky and
// under the page content.
const SkyBandCount = 8;
const SkyBandOpacity = 0.3;   // per band; they stack, so the bottom is about 1 - (1 - opacity)^count
const DitherPixel = 4;         // screen pixels per dither pixel, a whole number so the dots stay crisp

export function SetUpSkyBands(){
    let skyBands = document.createElement('div');
    skyBands.classList.add('sky-bands');
    skyBands.style.setProperty('--band-opacity', SkyBandOpacity);
    skyBands.style.setProperty('--dither-size', `${16 * DitherPixel}px`);
    for (let i = 0; i < SkyBandCount; i++){
        let band = document.createElement('div');
        band.classList.add('sky-band');
        skyBands.appendChild(band);
    }
    skyBackground.after(skyBands);

    // The layer is as tall as the page (measured to the end of the last section, so it never feeds back into
    // its own measurement), with the bands at even steps down it, snapped to the dither pixel grid so the
    // edges stay sharp. Redone whenever a section changes size: the window resizes, or the project cartridges
    // finish loading and make the projects section taller.
    let lastSection = document.getElementById('about');
    function LayoutSkyBands(){
        let pageHeight = lastSection.offsetTop + lastSection.offsetHeight;
        skyBands.style.height = `${pageHeight}px`;
        Array.from(skyBands.children).forEach((band, i) => {
            let top = Math.round(i * pageHeight / SkyBandCount / DitherPixel) * DitherPixel;
            band.style.top = `${top}px`;
        });
    }
    window.addEventListener('resize', LayoutSkyBands);
    let sectionSizes = new ResizeObserver(LayoutSkyBands);
    document.querySelectorAll('#projects, #about').forEach((section) => sectionSizes.observe(section));
    LayoutSkyBands();
}
