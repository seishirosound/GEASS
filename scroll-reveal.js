/**
 * Плавное появление элементов при прокрутке.
 * Логика сохранена: элементы .reveal получают класс .visible,
 * но теперь у них есть направление появления и более мягкий тайминг.
 */
const ScrollReveal = (() => {
    const pickMotion = (el, index) => {
        if (el.dataset.motion) return el.dataset.motion;
        if (el.matches('.hero, .download, .comments-section')) return 'up';
        if (el.matches('.features')) return 'left';
        if (el.matches('.gallery')) return 'right';
        return index % 2 === 0 ? 'left' : 'right';
    };

    const init = () => {
        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        const showElement = (el) => {
            if (el.dataset.revealed === '1') return;
            el.dataset.revealed = '1';
            requestAnimationFrame(() => {
                el.classList.add('visible');
            });
        };

        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(showElement);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = Number(entry.target.dataset.revealDelay || 0);
                window.setTimeout(() => showElement(entry.target), delay);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -8% 0px'
        });

        revealElements.forEach((el, index) => {
            el.dataset.motion = pickMotion(el, index);
            if (!el.dataset.revealDelay) {
                el.dataset.revealDelay = String(Math.min(index * 70, 280));
            }
            observer.observe(el);
        });
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', ScrollReveal.init);
