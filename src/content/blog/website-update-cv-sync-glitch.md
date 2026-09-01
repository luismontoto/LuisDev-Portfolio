---
title: "Website Update: CV Sync & Glitch Effects"
description: "Documenting the recent updates to my portfolio: syncing all data from my CV and adding a distinctive glitch micro-interaction to project titles."
pubDate: 2026-08-24
tags: ["portfolio", "css", "animation", "update"]
---

Today I made a significant update to my portfolio, addressing two key aspects: complete data synchronization from my CV and implementing a distinctive micro-interaction.

## CV Synchronization

My website was outdated compared to my PDF CV. The main changes made:

### Updated data
- **Personal information**: Full name, real email, phone number, and location (Sevilla, Spain)
- **Professional title**: Adjusted to "Junior Full-Stack Developer"
- **Experience**: From 1 generic entry to 5 detailed positions with bullet-point highlights
- **Skills**: Added Java, C++, C#, MySQL, and new "AI-Assisted Development" category
- **Education**: Corrected dates and degree names

### Added projects
- **Psychology Practice Website**: Client project built with React/Next.js
- **Pomodoro Timer**: Project developed for Lean Mind with Node.js/Express/Socket.io

### Technical changes
The CV template (`cv.astro`) now renders a `highlights` array instead of a simple `description`, allowing specific achievements to be shown for each position.

## Glitch Effect on Projects

Inspired by the "distinctive micro-interaction" concept from itomdev, I implemented a glitch effect on project titles on hover.

### Technical implementation

**Approach**: Pure CSS with pseudo-elements and animated `clip-path`.

**Mechanism**:
```css
.glitch-title::before,
.glitch-title::after {
    content: attr(data-text);
    position: absolute;
    /* Color layers that separate */
}
```

**Animations**:
- `glitch-1` and `glitch-2`: Vertical cuts with `clip-path: inset()` moving in opposite directions
- `glitch-skew`: Subtle tilt of the main text
- **Colors**: Cyan (#0ff) and Magenta (#f0f) for chromatic aberration effect

**Performance**: Animations use `transform` and `clip-path`, both GPU-accelerated. Duration of 0.3s with `cubic-bezier(0.25, 0.46, 0.45, 0.94)` easing.

### Result

When hovering over a project title:
1. Text briefly distorts with vertical cuts
2. Color layers separate creating chromatic aberration
3. Text tilts subtly
4. Everything returns to normal in 0.3 seconds

It's a memorable but non-intrusive effect that reinforces the technical identity of the portfolio without affecting readability.

## Next steps

- Commit and push these changes
- Consider more micro-interactions in other sections
- Optimize for mobile (glitch effect disabled on touch devices)
