// Shared behaviour for hariprasadss.com. Every feature is optional:
// pages render fully without JS, this only adds motion and filtering.
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll reveal
    const revealEls = document.querySelectorAll('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
        revealEls.forEach(el => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        revealEls.forEach(el => observer.observe(el));
    }

    // Pipeline terminal animation (looping)
    const lines = document.querySelectorAll('#pipeline .t-line');
    if (lines.length) {
        if (reduced) {
            lines.forEach(l => l.classList.add('on'));
        } else {
            let i = 0;
            const step = () => {
                if (i < lines.length) {
                    lines[i].classList.add('on');
                    i++;
                    setTimeout(step, i === lines.length ? 2800 : 620);
                } else {
                    lines.forEach(l => l.classList.remove('on'));
                    i = 0;
                    setTimeout(step, 700);
                }
            };
            setTimeout(step, 600);
        }
    }

    // Systems filter
    const filters = document.querySelectorAll('.filter[data-filter]');
    const systems = document.querySelectorAll('.system[data-cat]');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            filters.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
            systems.forEach(card => {
                const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
                card.hidden = !show;
                if (show) card.classList.add('visible');
            });
        });
    });
})();
