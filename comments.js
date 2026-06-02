
/**
 * Модуль комментариев "Отзывы Ордена"
 * Добавление, сохранение в localStorage, удаление и перерисовка списка.
 */
const CommentsModule = (() => {
    const form = document.getElementById('comment-form');
    const authorInput = document.getElementById('comment-author');
    const textInput = document.getElementById('comment-text');
    const commentsContainer = document.getElementById('comments-list');
    const STORAGE_KEY = 'code-geass-comments';

    const loadComments = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.warn('Failed to parse comments:', err);
            return [];
        }
    };

    const saveComments = (comments) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    };

    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str ?? '')));
        return div.innerHTML;
    };

    const createCommentElement = (comment, index) => {
        const div = document.createElement('div');
        div.className = 'comment-item appearing';
        div.style.animationDelay = `${Math.min(index * 40, 240)}ms`;
        div.innerHTML = `
            <div class="comment-header">
                <strong class="comment-author">${escapeHTML(comment.author || 'Аноним')}</strong>
                <span class="comment-date">${escapeHTML(comment.date || '')}</span>
                <button class="delete-comment" data-index="${index}" type="button" title="Удалить отзыв" aria-label="Удалить отзыв">✕</button>
            </div>
            <p class="comment-text">${escapeHTML(comment.text || '')}</p>
        `;
        return div;
    };

    const renderComments = () => {
        const comments = loadComments();
        commentsContainer.innerHTML = '';
        comments.forEach((comment, index) => {
            commentsContainer.appendChild(createCommentElement(comment, index));
        });
        commentsContainer.querySelectorAll('.delete-comment').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    };

    const handleDelete = (e) => {
        const index = Number(e.currentTarget.getAttribute('data-index'));
        if (Number.isNaN(index)) return;
        const comments = loadComments();
        comments.splice(index, 1);
        saveComments(comments);
        renderComments();
    };

    const addComment = (author, text) => {
        const comments = loadComments();
        const now = new Date();
        const dateStr = now.toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        comments.push({
            author: author.trim(),
            text: text.trim(),
            date: dateStr
        });

        saveComments(comments);
        renderComments();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const author = authorInput?.value.trim() || '';
        const text = textInput?.value.trim() || '';

        if (!text) {
            alert('Текст отзыва не может быть пустым.');
            textInput?.focus();
            return;
        }

        addComment(author, text);
        if (authorInput) authorInput.value = '';
        if (textInput) textInput.value = '';
        textInput?.focus();
    };

    const init = () => {
        if (!form || !commentsContainer || !authorInput || !textInput) return;
        renderComments();
        form.addEventListener('submit', handleSubmit);
    };

    return { init };
})();

document.addEventListener('DOMContentLoaded', CommentsModule.init);
