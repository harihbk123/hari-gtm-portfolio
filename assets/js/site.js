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

    // Contact form: Netlify Forms, submitted in place so the visitor never leaves the page.
    // Without JS the form still posts normally and lands on /thanks/.
    const form = document.querySelector('form.brief-form');
    if (form) {
        const status = form.querySelector('.form-status');
        const button = form.querySelector('button[type="submit"]');
        const success = form.parentElement.querySelector('.form-success');
        const fallback = 'Something went wrong sending that. Please email <a href="mailto:mail2hariprasadss@gmail.com">mail2hariprasadss@gmail.com</a> instead, or try again.';

        // "Ask about ..." links pre-fill the message with the engagement type
        document.querySelectorAll('a[data-model]').forEach(link => {
            link.addEventListener('click', () => {
                const msg = form.querySelector('#f-message');
                if (msg && !msg.value.trim()) msg.value = `Interested in: ${link.dataset.model}.\n\n`;
                setTimeout(() => form.querySelector('#f-name')?.focus({ preventScroll: true }), 400);
            });
        });

        // Inline validation replaces the browser's default bubbles (no-JS visitors keep native validation)
        form.noValidate = true;
        const messages = {
            name: () => 'Please add your name.',
            email: (el) => el.value.trim() ? 'That email doesn\'t look right.' : 'Please add your email so I can reply.',
            message: () => 'A sentence or two is enough.'
        };
        const setError = (el, text) => {
            const field = el.closest('.field');
            const slot = document.getElementById(el.getAttribute('aria-describedby'));
            field.classList.toggle('invalid', Boolean(text));
            el.setAttribute('aria-invalid', text ? 'true' : 'false');
            if (slot) slot.textContent = text || '';
        };
        const required = [...form.querySelectorAll('[required]')];
        required.forEach(el => el.addEventListener('input', () => {
            if (el.closest('.field').classList.contains('invalid') && el.checkValidity()) setError(el, '');
        }));
        const validate = () => {
            let first = null;
            required.forEach(el => {
                el.value = el.value.trimStart();
                const ok = el.checkValidity() && el.value.trim() !== '';
                setError(el, ok ? '' : messages[el.name](el));
                if (!ok && !first) first = el;
            });
            if (first) first.focus();
            return !first;
        };

        const label = button.querySelector('.btn-label');
        const setBusy = (busy) => {
            button.disabled = busy;
            button.setAttribute('aria-busy', String(busy));
            if (label) label.textContent = busy ? 'Sending...' : 'Send details';
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!validate()) return;
            status.textContent = '';
            setBusy(true);

            const data = new FormData(form);
            const needs = data.getAll('needs');
            data.delete('needs');
            data.append('needs', needs.join(', ') || 'Not specified');

            try {
                const res = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(data).toString()
                });
                if (!res.ok) throw new Error(String(res.status));
                const first = (data.get('name') || '').toString().trim().split(/\s+/)[0];
                success.querySelector('.success-name').textContent = first ? `, ${first}` : '';
                form.hidden = true;
                form.parentElement.classList.add('is-sent');
                success.hidden = false;
                success.focus();
            } catch (err) {
                status.innerHTML = fallback;
                setBusy(false);
            }
        });
    }
})();
