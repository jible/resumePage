// ------------------------------------------------------------------------------------------
// IMPORTS
//------------------------------------------------------------------------------------------
import { startBackGroundRenderLoop } from "./Background.js";
import { startIslandRenderLoop } from "./Island.js";
import { startTextRenderLoop } from "./Text.js";


let canvases = document.querySelectorAll(".title--canvas");
const contexts = {};  // Declare the contexts object properly





// ------------------------------------------------------------------------------------------
//  Render Canvases
//------------------------------------------------------------------------------------------

startBackGroundRenderLoop();
startIslandRenderLoop();
startTextRenderLoop();

function start(){

}