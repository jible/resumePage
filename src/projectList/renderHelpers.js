// Shared by the project select page and the project detail page.

export const PROJECTS_JSON_PATH = 'src/projectList/projects.json';

// Renders a picture, YouTube embed, or local video for `source` (an object with optional
// `picture`/`video` fields), in that priority order. `label` is used as the iframe title
export function BuildMediaHtml(source, label){
    let youtubeEmbedUrl = GetYoutubeEmbedUrl(source.video);
    if (source.picture){
        return `<img src="${source.picture}" class = "gameplay-gif" loading="lazy">`;
    } else if (youtubeEmbedUrl){
        return `<iframe class = "youtube-embed" src="${youtubeEmbedUrl}" title="${label}" loading="lazy" allowfullscreen></iframe>`;
    } else if (source.video){
        return `<video data-src="${source.video}" class = "gameplay-gif" muted loop playsinline preload="none"></video>`;
    }
    return ``;
}

// Renders text as one or more <p> tags. Accepts either a single string or an array of paragraph strings
export function BuildParagraphsHtml(text){
    let paragraphs = Array.isArray(text) ? text : [text];
    return paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('');
}

// Returns a YouTube embed URL if `url` points to a YouTube video, otherwise null
function GetYoutubeEmbedUrl(url){
    if (!url) return null;
    let match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

// Starts loading local <video data-src> elements inside `root` and plays them
export function LoadDeferredMedia(root = document){
    root.querySelectorAll('.gameplay-gif[data-src]').forEach((el) => {
        el.src = el.dataset.src;
        el.removeAttribute('data-src');
        if (el.tagName === 'VIDEO') {
            el.load();
            el.play().catch(() => {});
        }
    });
}

// Splits the comma separated `skills` string into chip markup; `max` limits how many are shown
export function BuildSkillChipsHtml(skills, max = Infinity){
    let list = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()).filter(Boolean);
    return list.slice(0, max).map((skill) => `<span class="skill-chip">${skill}</span>`).join('');
}
