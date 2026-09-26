// The sky's background: the fixed element whose color cycles through day and night. The color animation
// itself is CSS (@keyframes background-day-night in title.css); the only thing script needs from it is
// where in the cycle it currently is, so clouds and stars can be spawned to match.
const NightStart = .25;
const NightEnd = .72;

export const skyBackground = document.querySelector('.sky-background');

// True while the cycle is in its daytime part
export function IsDayTime(){
    let sky = document.getElementsByClassName("sky-background");
    let isDay = true;
    if (sky != null){
        let skyAnimation = sky[0].getAnimations()[0];
        if (skyAnimation != null){
            let progress = skyAnimation.currentTime/ skyAnimation.effect.getComputedTiming().duration;
            isDay = progress < NightStart || progress > NightEnd;
        }
    }
    return isDay;
}
