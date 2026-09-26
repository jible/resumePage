import { SetUpSkyBands } from './skyBands.js';
import { SetUpSkyElements, spawnInitialBackgroundElements, RandomlySpawnBackgroundElement, skyObjectsLayer, SkyParallax } from './skyElements.js';

// The sky is three pieces, each in its own file:
//   skyBackground.js  the fixed sky color (day/night cycle) and where in the cycle it is
//   skyBands.js       the dithered bands that fade the sky in steps down the page
//   skyElements.js    the clouds and stars that drift across it
// This file just sets them up, in the order they need to be in the page, and is the one place the rest of
// the site imports the sky from.
SetUpSkyBands();
SetUpSkyElements();


export { spawnInitialBackgroundElements, RandomlySpawnBackgroundElement, skyObjectsLayer, SkyParallax };
