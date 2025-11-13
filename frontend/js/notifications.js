class NotificationSystem {
    constructor() {
        this.container = this.initializeContainer();
        this.queue = [];
    }

    initializeContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(title, message = '', type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type]}</span>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                ${message ? `<div class="notification-message">${message}</div>` : ''}
            </div>
        `;

        this.container.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    remove(notification) {
        notification.classList.add('removing');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    success(title, message = '', duration = 3000) {
        return this.show(title, message, 'success', duration);
    }

    error(title, message = '', duration = 4000) {
        return this.show(title, message, 'error', duration);
    }

    warning(title, message = '', duration = 4000) {
        return this.show(title, message, 'warning', duration);
    }

    info(title, message = '', duration = 3000) {
        return this.show(title, message, 'info', duration);
    }
}

class ConfirmationDialog {
    static show(options = {}) {
        return new Promise((resolve) => {
            const {
                title = '¿Estás seguro?',
                message = '',
                icon = '⚠',
                confirmText = 'Confirmar',
                cancelText = 'Cancelar',
                isDangerous = false
            } = options;

            const overlay = document.createElement('div');
            overlay.className = 'confirmation-overlay';

            const modal = document.createElement('div');
            modal.className = 'confirmation-modal';

            modal.innerHTML = `
                <div class="icon">${icon}</div>
                <h2>${title}</h2>
                ${message ? `<p>${message}</p>` : ''}
                <div class="confirmation-actions">
                    <button class="btn btn-cancel" id="confirmCancel">${cancelText}</button>
                    <button class="btn ${isDangerous ? 'btn-danger-confirm' : 'btn-confirm'}" id="confirmOk">${confirmText}</button>
                </div>
            `;

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Cerrar al hacer click fuera
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    resolve(false);
                    overlay.remove();
                }
            });

            // Botón cancelar
            modal.querySelector('#confirmCancel').addEventListener('click', () => {
                resolve(false);
                overlay.remove();
            });

            // Botón confirmar
            modal.querySelector('#confirmOk').addEventListener('click', () => {
                resolve(true);
                overlay.remove();
            });

            // Tecla Escape
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    resolve(false);
                    overlay.remove();
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);
        });
    }
}

// Crear instancia global
const notify = new NotificationSystem();
