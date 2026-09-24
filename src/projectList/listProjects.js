import { PROJECTS_JSON_PATH, BuildSkillChipsHtml } from './renderHelpers.js';

const CARTRIDGE_BACK_IMAGE = 'images/PortfolioGameCartridge2.png';
const CARTRIDGE_SIDE_IMAGE = 'images/cartridgeSide.png';
// Cartridge side thickness as a fraction of the cartridge width (the side sprite is 6px of a 64px cartridge)
const SideThickness = 6 / 64;
// Idle spin: one full turn takes this many seconds
const SpinDuration = 8;
// Each cartridge lags the one before it by this many seconds (spin and bob)
const SpinStagger = 0.5;
// Idle bob: one full up and down takes this many seconds
const BobDuration = 4;
const BobStagger = 0.5;
// While hovered/focused the cartridge floats this high and stays there
const HoverFloat = '-14px';
// Seconds for a hovered cartridge to turn to face the player (per half turn), and to rejoin the shared spin
const FaceFrontTime = 0.5;
const RejoinTime = 0.9;

const ProjectsSection = document.getElementById("projects")
const ReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

fetch(PROJECTS_JSON_PATH)
    .then((response) => response.json())
    .then((data) => RenderProjects(data))
    .catch((error) => console.error('Error loading JSON:', error));

// Make a cartridge for each project; the detail page renders the project by id
function RenderProjects(data){
    let list = document.createElement('div');
    list.className = 'save-list';
    data.forEach((project, index) => {
        let slot = document.createElement('a');
        slot.className = 'save-slot';
        slot.href = `project.html?id=${encodeURIComponent(project.id)}`;
        slot.setAttribute('aria-label', project.name);
        slot.innerHTML = `
            <div class="cart-face cart-front">
                <img class="save-slot__image" src="${project.splashGif}" alt="${project.name}">
                <div class="save-slot__name">${project.name}</div>
                <div class="save-slot__info">
                    <div class="save-slot__tagline">${project.tagline}</div>
                    <div class="save-slot__role">${project.role}</div>
                    <div class="save-slot__skills">${BuildSkillChipsHtml(project.skills, 4)}</div>
                    <div class="save-slot__cta">&#9654; VIEW PROJECT</div>
                </div>
            </div>
            <div class="cart-face cart-back">
                <img class="cart-back__image" src="${CARTRIDGE_BACK_IMAGE}" alt="">
            </div>
            <img class="cart-side" src="${CARTRIDGE_SIDE_IMAGE}" alt="">`;
        list.appendChild(slot);
        cartridges.push(new Cartridge(slot, index));
    });
    ProjectsSection.appendChild(list);
    if (!ReducedMotion) requestAnimationFrame(Tick);
}

// ---------------------------------------------------------------------------------------------
// Spinning cartridges
//
// Each cartridge has a turn angle (degrees, 0 = front facing the viewer, 180 = back). The front,
// back and side are siblings that each set their own width from that angle, so the side is not
// squeezed along with the faces:
//   face width = |cos(angle)|            side width = SideThickness * |sin(angle)|
// The side sits on the near edge of the face; which edge flips each time the cartridge goes
// edge-on. Between 180 and 360 degrees the other physical side is showing, so the sprite is mirrored.
// ---------------------------------------------------------------------------------------------
const cartridges = [];

function Tick(nowMs){
    let now = nowMs / 1000;
    cartridges.forEach((cartridge) => cartridge.Update(now));
    requestAnimationFrame(Tick);
}

// Angle a cartridge would be at on the shared idle clock (unwrapped, so it never jumps at 360)
function SharedAngle(index, now){
    return 360 * (now - index * SpinStagger) / SpinDuration;
}

// Seconds until the cartridge's next bob cycle begins, so it can rejoin the shared bob without snapping
function SecondsToNextBob(index, now){
    let phase = (((now - index * BobStagger) % BobDuration) + BobDuration) % BobDuration;
    return (BobDuration - phase) % BobDuration;
}

const EaseOut = (u) => 1 - (1 - u) * (1 - u);
const EaseInOut = (u) => u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);

class Cartridge {
    constructor(slot, index){
        this.slot = slot;
        this.index = index;
        this.front = slot.querySelector('.cart-front');
        this.back = slot.querySelector('.cart-back');
        this.side = slot.querySelector('.cart-side');
        this.mode = 'idle';   // 'idle' | 'facing' | 'rejoin'
        this.angle = 0;
        this.transition = null;

        let now = performance.now() / 1000;
        slot.style.setProperty('--bob-duration', `${BobDuration}s`);
        slot.style.setProperty('--bob-delay', `${-((now - index * BobStagger) % BobDuration)}s`);
        this.Update(now);

        slot.addEventListener('mouseenter', () => this.FaceFront());
        slot.addEventListener('focus', () => this.FaceFront());
        slot.addEventListener('mouseleave', () => this.Rejoin());
        slot.addEventListener('blur', () => this.Rejoin());
    }

    // Stop the idle spin and turn to the nearest front-facing angle, and float up
    FaceFront(){
        if (this.mode === 'facing') return;
        let now = performance.now() / 1000;
        let target = 360 * Math.round(this.angle / 360);
        let halfTurns = Math.abs(target - this.angle) / 180;
        this.transition = { start: now, from: this.angle, to: target, duration: 0.15 + FaceFrontTime * halfTurns };
        this.mode = 'facing';

        // Hold the cartridge at its current bob height, then float it up from there
        this.slot.style.translate = getComputedStyle(this.slot).translate;
        this.slot.classList.add('is-facing');
        this.slot.getBoundingClientRect(); // commit the held height so the float animates from it
        this.slot.style.translate = `0 ${HoverFloat}`;
    }

    // Settle back down and blend into the shared spin with a quick turn, so there's no snap
    Rejoin(){
        if (this.mode !== 'facing') return;
        let now = performance.now() / 1000;
        let shared = SharedAngle(this.index, now);
        // Pick a whole number of turns so the catch-up spins at least a quarter turn (90..450 degrees)
        let turns = Math.floor((shared - this.angle - 90) / 360);
        this.transition = { start: now, from: this.angle, turns: turns, duration: RejoinTime };
        this.mode = 'rejoin';

        this.slot.classList.remove('is-facing');
        this.slot.style.translate = '0 0';
        this.slot.style.setProperty('--bob-delay', `${SecondsToNextBob(this.index, now)}s`);
    }

    Update(now){
        if (ReducedMotion){
            this.Apply(0);
            return;
        }
        let t = this.transition;
        if (this.mode === 'idle'){
            this.angle = SharedAngle(this.index, now);
        } else if (this.mode === 'facing'){
            let u = Math.min(1, (now - t.start) / t.duration);
            this.angle = t.from + (t.to - t.from) * EaseOut(u);
        } else {
            let u = Math.min(1, (now - t.start) / t.duration);
            // The target keeps moving with the shared clock, so the two line up exactly at u = 1
            let target = SharedAngle(this.index, now) - 360 * t.turns;
            this.angle = t.from + (target - t.from) * EaseInOut(u);
            if (u >= 1){
                this.mode = 'idle';
                this.transition = null;
            }
        }
        this.Apply(this.angle);
    }

    // Lay out the faces and side for a turn angle. Widths are fractions of the cartridge width.
    Apply(angleDegrees){
        let radians = angleDegrees * Math.PI / 180;
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);

        let faceWidth = Math.abs(cos);
        let sideWidth = SideThickness * Math.abs(sin);
        let left = (1 - faceWidth - sideWidth) / 2;

        let sideOnLeft = sin * cos > 0;
        let faceX = sideOnLeft ? left + sideWidth : left;
        let sideX = sideOnLeft ? left : left + faceWidth;

        let faceElement = cos > 0 ? this.front : this.back;
        let hiddenElement = cos > 0 ? this.back : this.front;
        faceElement.style.visibility = 'visible';
        hiddenElement.style.visibility = 'hidden';
        faceElement.style.transform = `translateX(${faceX * 100}%) scaleX(${faceWidth})`;

        // The side element is SideThickness wide, so its translate/scale are relative to that.
        // Mirrored (flipped about its own left edge, then shifted back) for the other physical side.
        let sideScale = sideWidth / SideThickness;
        let mirrored = Math.sin(radians) < 0;
        this.side.style.transform = mirrored
            ? `translateX(${(sideX + sideWidth) / SideThickness * 100}%) scaleX(${-sideScale})`
            : `translateX(${sideX / SideThickness * 100}%) scaleX(${sideScale})`;
    }
}
