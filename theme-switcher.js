/**
 * Переключение тем с сохранением состояния.
 * Логика та же, но переход стал мягче: добавляется краткий
 * промежуточный режим, чтобы фон и карточки менялись без рывка.
 */
const ThemeSwitcher = (() => {
    const STORAGE_KEY = 'code-geass-theme';
    const DEFAULT_THEME = 'britannia';

    const getThemeClasses = () => ['theme-britannia', 'theme-cc'];

    const updateButtonText = (btn, theme) => {
        btn.textContent = theme === 'britannia' ? '☀️ Тема C.C.' : '🌙 Тема Британия';
    };

    const applyTheme = (themeName) => {
        const body = document.body;
        getThemeClasses().forEach(cls => body.classList.remove(cls));
        body.classList.add(`theme-${themeName}`);
        body.dataset.theme = themeName;
        localStorage.setItem(STORAGE_KEY, themeName);

        const btn = document.getElementById('theme-toggle');
        if (btn) {
            updateButtonText(btn, themeName);
            btn.setAttribute('aria-pressed', String(themeName === 'cc'));
        }
    };

    const getSavedTheme = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;

    const toggleTheme = () => {
        const current = getSavedTheme();
        const next = current === 'britannia' ? 'cc' : 'britannia';
        const body = document.body;
        body.classList.add('theme-switching');
        body.dataset.themeTransition = next;
        applyTheme(next);
        window.setTimeout(() => {
            body.classList.remove('theme-switching');
            delete body.dataset.themeTransition;
        }, 420);
    };

    const init = () => {
        applyTheme(getSavedTheme());

        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', toggleTheme);
            toggleBtn.setAttribute('type', 'button');
        }
    };

    return { init, toggleTheme, getSavedTheme };
})();

document.addEventListener('DOMContentLoaded', ThemeSwitcher.init);
