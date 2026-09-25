import { PROJECTS_JSON_PATH, BuildSkillChipsHtml, PickMainMedia, GetYoutubeEmbedUrl } from './renderHelpers.js';

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
// The focused cartridge floats up by this fraction of its own width and stays there
const HoverFloatFraction = 0.1;
// Cartridges share the row equally, but never get smaller or bigger than these (px). Below the minimum
// they wrap onto more rows instead.
const MinCartridgeSize = 96;
const MaxCartridgeSize = 256;
const CartridgeGap = 16;
// Seconds for the focused cartridge to turn to face the player (per half turn)
const FaceFrontTime = 0.5;

const ProjectsSection = document.getElementById("projects")
const ReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

fetch(PROJECTS_JSON_PATH)
    .then((response) => response.json())
    .then((data) => RenderProjects(data))
    .catch((error) => console.error('Error loading JSON:', error));

// A big preview of the focused project, above a row of cartridges. Hovering (or tabbing to) a
// cartridge focuses it and the preview shows that project. Clicking a cartridge, or the preview,
// opens the project's page, which renders it by id.
function RenderProjects(data){
    let preview = BuildPreview();
    let list = document.createElement('div');
    list.className = 'save-list';
    data.forEach((project, index) => {
        let slot = document.createElement('a');
        slot.className = 'save-slot';
        slot.href = ProjectUrl(project);
        slot.setAttribute('aria-label', project.name);
        slot.innerHTML = `
            <div class="cart-face cart-front">
                ${BuildWindowHtml(project)}
            </div>
            <div class="cart-face cart-back">
                <img class="cart-back__image" src="${CARTRIDGE_BACK_IMAGE}" alt="">
            </div>
            <img class="cart-side" src="${CARTRIDGE_SIDE_IMAGE}" alt="">`;
        list.appendChild(slot);
        cartridges.push(new Cartridge(slot, index, project));
    });
    ProjectsSection.appendChild(preview.element);
    ProjectsSection.appendChild(list);
    KeepCartridgesFitted(list, data.length);
    showPreview = preview.Show;
    if (!ReducedMotion) requestAnimationFrame(Tick);

    // Start with the first project in focus so the preview is never empty
    FocusCartridge(cartridges[0]);
}

// Sizes the cartridges so all of them fit across the row, however many projects there are, and
// keeps them fitted as the window changes size
function KeepCartridgesFitted(list, count){
    function Fit(){
        let style = getComputedStyle(list);
        let width = list.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        let size = Math.floor((width - CartridgeGap * (count - 1)) / count); // floor so rounding never forces a wrap
        size = Math.min(MaxCartridgeSize, Math.max(MinCartridgeSize, size));
        list.style.setProperty('--cart-size', `${size}px`);
        list.style.gap = `20px ${CartridgeGap}px`;
    }
    new ResizeObserver(Fit).observe(list);
    Fit();
}

function ProjectUrl(project){
    return `project.html?id=${encodeURIComponent(project.id)}`;
}

// What shows through the cartridge's window: the title image, or the project's name when it has none
function BuildWindowHtml(project){
    let background = ThemedBackground(project.theme);
    if (project.titleImage){
        return `<img class="save-slot__image" src="${project.titleImage}" alt="${project.name}" style="${background}">`;
    }
    let color = project.theme ? project.theme.accent : '#ffcd3c';
    return `<div class="save-slot__image save-slot__fallback" style="${background} color: ${color};"><span>${project.name}</span></div>`;
}

// Only one cartridge is focused at a time. It floats up and faces front; the one before it goes back
// to spinning. Leaving a cartridge does not unfocus it, so the preview keeps showing the last one.
let focused = null;
let showPreview = () => {};
function FocusCartridge(cartridge){
    if (focused === cartridge) return;
    if (focused) focused.Rejoin();
    focused = cartridge;
    cartridge.FaceFront();
    showPreview(cartridge.project);
}

// The preview panel: a video (or picture) with the focused project's name, tagline and top skills over it
function BuildPreview(){
    let element = document.createElement('a');
    element.className = 'project-preview';
    element.innerHTML = `
        <div class="project-preview__media">
            <video class="project-preview__video" muted loop playsinline></video>
            <img class="project-preview__image" alt="">
        </div>
        <div class="project-preview__caption">
            <div class="project-preview__name"></div>
            <div class="project-preview__tagline"></div>
            <div class="project-preview__skills"></div>
            <div class="project-preview__cta">&#9654; VIEW PROJECT</div>
        </div>`;
    let media = element.querySelector('.project-preview__media');
    let video = element.querySelector('video');
    let image = element.querySelector('img');
    let token = 0; // so a quick change of focus cancels a slower earlier load

    function Show(project){
        let current = ++token;
        element.href = ProjectUrl(project);
        element.style.setProperty('--preview-accent', project.theme ? project.theme.accent : '#ffcd3c');
        element.style.setProperty('--preview-bg', project.theme ? `linear-gradient(to bottom, ${project.theme.bgTop}, ${project.theme.bgBottom})` : '#123');
        element.querySelector('.project-preview__name').textContent = project.name;
        element.querySelector('.project-preview__tagline').textContent = project.tagline || '';
        element.querySelector('.project-preview__skills').innerHTML = BuildSkillChipsHtml(project.skills, 4);

        // Fade the picture out, swap in the new one, and fade back in once it has loaded
        media.classList.add('is-switching');
        let source = PickMainMedia(project, 'previewVideo');
        let isVideo = source.video && !GetYoutubeEmbedUrl(source.video);
        let ready = () => {
            if (current !== token) return;
            media.classList.remove('is-switching');
        };
        if (isVideo){
            image.hidden = true;
            video.hidden = false;
            video.onloadeddata = ready;
            video.src = source.video;
            video.play().catch(() => {});
        } else {
            video.hidden = true;
            video.pause();
            image.hidden = false;
            image.onload = ready;
            image.src = source.picture || project.titleImage || project.splashGif;
        }
    }
    return { element, Show };
}

// Title images can be transparent, so the cartridge window gets the project's theme colors behind them
function ThemedBackground(theme){
    if (!theme) return '';
    return `background: linear-gradient(to bottom, ${theme.bgTop}, ${theme.bgBottom});`;
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

class Cartridge {
    constructor(slot, index, project){
        this.slot = slot;
        this.index = index;
        this.project = project;
        this.front = slot.querySelector('.cart-front');
        this.back = slot.querySelector('.cart-back');
        this.side = slot.querySelector('.cart-side');
        this.mode = 'idle';   // 'idle' | 'facing'
        this.angle = 0;
        this.spinOffset = 0;  // degrees this cartridge is ahead of the shared spin (grows each time it's hovered)
        this.transition = null;

        let now = performance.now() / 1000;
        slot.style.setProperty('--bob-duration', `${BobDuration}s`);
        slot.style.setProperty('--bob-delay', `${-((now - index * BobStagger) % BobDuration)}s`);
        this.Update(now);

        // Hovering or tabbing to a cartridge focuses it. Leaving does not, so the preview stays put.
        slot.addEventListener('mouseenter', () => FocusCartridge(this));
        slot.addEventListener('focus', () => FocusCartridge(this));
    }

    // Stop the idle spin, turn to the nearest front-facing angle, and float up
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
        this.slot.style.translate = `0 ${-this.slot.offsetWidth * HoverFloatFraction}px`;
    }

    // Settle back down and carry on spinning at the normal speed from wherever the cartridge is,
    // so it drifts out of step with the others
    Rejoin(){
        if (this.mode !== 'facing') return;
        let now = performance.now() / 1000;
        this.spinOffset = this.angle - SharedAngle(this.index, now);
        this.mode = 'idle';
        this.transition = null;

        this.slot.classList.remove('is-facing');
        this.slot.style.translate = '0 0';
        this.slot.style.setProperty('--bob-delay', `${SecondsToNextBob(this.index, now)}s`);
    }

    Update(now){
        if (ReducedMotion){
            this.Apply(0);
            return;
        }
        if (this.mode === 'idle'){
            this.angle = SharedAngle(this.index, now) + this.spinOffset;
        } else {
            // Ease to (and then hold) the front-facing angle
            let t = this.transition;
            let u = Math.min(1, (now - t.start) / t.duration);
            this.angle = t.from + (t.to - t.from) * EaseOut(u);
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
