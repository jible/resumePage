import { PROJECTS_JSON_PATH, BuildParagraphsHtml, BuildSkillChipsHtml, GetYoutubeEmbedUrl, PickMainMedia } from './renderHelpers.js';

const Container = document.getElementById("project-detail");
const projectId = new URLSearchParams(window.location.search).get('id');

fetch(PROJECTS_JSON_PATH)
    .then((response) => response.json())
    .then((data) => {
        let index = data.findIndex((p) => p.id === projectId);
        if (index < 0) {
            Container.innerHTML = `<p class="pd-missing">Project not found.</p>`;
            return;
        }
        let project = data[index];
        document.title = `${project.name} - James Milestone`;
        ApplyTheme(project.theme);
        Container.innerHTML = BuildPageHtml(project, data[(index - 1 + data.length) % data.length], data[(index + 1) % data.length]);
        SetUpLazyVideos();
    })
    .catch((error) => console.error('Error loading JSON:', error));

// Maps a project's `theme` fields to the CSS variables the page is styled with; anything the
// theme leaves out keeps the default from projectPage.css
const ThemeVariables = {
    bgTop: '--pd-bg-top',
    bgBottom: '--pd-bg-bottom',
    accent: '--pd-accent',
    headingShadow: '--pd-heading-shadow',
    panel: '--pd-panel',
    panelText: '--pd-panel-text',
};
function ApplyTheme(theme){
    Object.entries(theme || {}).forEach(([key, color]) => {
        if (ThemeVariables[key]) document.body.style.setProperty(ThemeVariables[key], color);
    });
}

// Page order, top to bottom: main video, title + links, at-a-glance facts, overview, what I built, prev/next
function BuildPageHtml(project, previous, next){
    let highlights = Object.entries(project.highlights || {});
    let highlightsHtml = highlights.map(([title, highlight], i) => BuildHighlightHtml(title, highlight, i)).join('');

    return `
    <div class="pd-hero">${BuildMediaHtml(PickMainMedia(project), project.name, true)}</div>
    <div class="pd">
        <header class="pd-title">
            <h1>${project.name}</h1>
            <p class="pd-tagline">${project.tagline || ''}</p>
            <div class="pd-links">${BuildLinksHtml(project.links)}</div>
        </header>

        <section class="pd-panel pd-glance">
            <div class="pd-fact">
                <div class="pd-label">My Role</div>
                <div class="pd-value">${project.role || ''}</div>
            </div>
            <div class="pd-fact">
                <div class="pd-label">Scope</div>
                <div class="pd-value">${project.stat || ''}</div>
            </div>
            <div class="pd-fact">
                <div class="pd-label">Status</div>
                <div class="pd-value pd-status pd-status--${StatusKind(project.status)}">${project.status || ''}</div>
            </div>
            <div class="pd-fact pd-fact--wide">
                <div class="pd-label">Skills</div>
                <div class="pd-chips">${BuildSkillChipsHtml(project.skills)}</div>
            </div>
        </section>

        <div class="pd-pair">
            <section class="pd-panel">
                <h2>The Project</h2>
                ${BuildBulletsHtml(project.about)}
            </section>
            <section class="pd-panel">
                <h2>My Contribution</h2>
                ${BuildBulletsHtml(project.contribution)}
            </section>
        </div>

        ${highlights.length ? `
        <section class="pd-panel">
            <h2>What I Built</h2>
            ${highlightsHtml}
        </section>` : ''}

        <nav class="pd-pager">
            <a href="project.html?id=${encodeURIComponent(previous.id)}">&#9664; ${previous.name}</a>
            <a href="project.html?id=${encodeURIComponent(next.id)}">${next.name} &#9654;</a>
        </nav>
    </div>`;
}

// Picks the color of the dot beside the status: finished, cancelled, or still in progress
function StatusKind(status){
    if (status === 'Complete') return 'done';
    if (status === 'Cancelled') return 'cancelled';
    return 'active';
}

function BuildBulletsHtml(items){
    return `<ul class="pd-bullets">${(items || []).map((item) => `<li>${item}</li>`).join('')}</ul>`;
}

function BuildLinksHtml(links){
    if (!links) return '';
    return links.map((link, i) =>
        `<a class="pd-button${i === 0 ? ' pd-button--primary' : ''}" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>`
    ).join('');
}

function BuildHighlightHtml(title, highlight, i){
    let media = BuildMediaHtml(highlight, title, false);
    return `
    <article class="pd-highlight${media ? ' pd-highlight--media' : ''}">
        <div class="pd-highlight__text">
            <h3><span class="pd-number">${String(i + 1).padStart(2, '0')}</span>${title}</h3>
            <div class="pd-text">${BuildParagraphsHtml(highlight.text)}</div>
        </div>
        ${media ? `<div class="pd-highlight__media">${media}</div>` : ''}
    </article>`;
}

// The main video is a control-free banner that plays right away. The other videos have controls and
// only load and play while they are on screen (see SetUpLazyVideos).
function BuildMediaHtml(source, label, isMain){
    let youtubeEmbedUrl = GetYoutubeEmbedUrl(source.video);
    if (youtubeEmbedUrl){
        return `<iframe class="pd-embed" src="${youtubeEmbedUrl}" title="${label}" loading="${isMain ? 'eager' : 'lazy'}" allowfullscreen></iframe>`;
    } else if (source.video){
        return isMain
            ? `<video class="pd-video" src="${source.video}" muted loop playsinline autoplay></video>`
            : `<video class="pd-video" data-src="${source.video}" controls muted loop playsinline preload="none"></video>`;
    } else if (source.picture){
        return `<img class="pd-image" src="${source.picture}" alt="${label}" loading="${isMain ? 'eager' : 'lazy'}">`;
    }
    return ``;
}

function SetUpLazyVideos(){
    let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            let video = entry.target;
            if (entry.isIntersecting){
                if (video.dataset.src){
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                    video.load();
                }
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.25 });
    Container.querySelectorAll('.pd-video').forEach((video) => observer.observe(video));
}
