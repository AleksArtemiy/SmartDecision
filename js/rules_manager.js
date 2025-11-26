// Менеджер правил оценивания - с корректным переключением
class RulesManager {
    constructor() {
        this.rules = this.loadRules();
        this.nextRuleId = 1;
        this.init();
    }

    init() {
        this.renderRules();
        this.setupEventListeners();
    }

    loadRules() {
        const saved = localStorage.getItem('grading_rules');
        return saved ? JSON.parse(saved) : [];
    }

    saveRules() {
        localStorage.setItem('grading_rules', JSON.stringify(this.rules));
        this.updateNextRuleId();
    }

    updateNextRuleId() {
        if (this.rules.length === 0) {
            this.nextRuleId = 1;
        } else {
            this.nextRuleId = Math.max(...this.rules.map(rule => rule.id)) + 1;
        }
    }

    renderRules() {
        const container = document.getElementById('rules-container');
        const noRulesMessage = document.getElementById('no-rules-message');

        if (this.rules.length === 0) {
            noRulesMessage.style.display = 'block';
            container.innerHTML = '<div class="no-rules" id="no-rules-message"><p>📝 Правила оценивания еще не заданы</p><p class="text-muted">Нажмите "Задать правило" чтобы создать первое правило</p></div>';
            return;
        }

        noRulesMessage.style.display = 'none';
        container.innerHTML = this.rules.map(rule => this.createRuleElement(rule)).join('');
    }

    createRuleElement(rule) {
        const isCollapsed = rule.collapsed !== false;
        
        return `
            <div class="rule-card ${isCollapsed ? 'collapsed' : ''}" data-rule-id="${rule.id}">
                <div class="rule-card-header" onclick="rulesManager.toggleRule(${rule.id})">
                    <div class="rule-card-title">
                        <div class="rule-icon">${rule.type === 'cell-values' ? '📝' : '🤖'}</div>
                        <div class="rule-card-info">
                            <h4>${this.getRuleTitle(rule)}</h4>
                            <p>${this.getRuleDescription(rule)}</p>
                        </div>
                    </div>
                    <div class="rule-status">Активно</div>
                </div>
                
                <div class="rule-card-content">
                    ${rule.type === 'cell-values' ? this.createCellValuesRuleContent(rule) : this.createAutoGradingRuleContent(rule)}
                    
                    <div class="rule-actions">
                        <button class="btn btn-success" onclick="rulesManager.saveRuleChanges(${rule.id})">
                            💾 Сохранить изменения
                        </button>
                        <button class="delete-rule" onclick="rulesManager.deleteRule(${rule.id})">
                            🗑️ Удалить правило
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createCellValuesRuleContent(rule) {
        return `
            <div class="rule-settings">
                <div class="setting-group">
                    <label class="setting-label">Тип занятия:</label>
                    <div class="checkbox-group">
                        <label class="checkbox-item">
                            <input type="checkbox" name="lecture-type-${rule.id}" value="all" ${rule.lectureTypes.includes('all') ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Все типы
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="lecture-type-${rule.id}" value="лекция" ${rule.lectureTypes.includes('лекция') ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Лекции
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="lecture-type-${rule.id}" value="практика" ${rule.lectureTypes.includes('практика') ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Практики
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="lecture-type-${rule.id}" value="лабораторная" ${rule.lectureTypes.includes('лабораторная') ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Лабораторные
                        </label>
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-group">
                        <label class="setting-label">Минимальная оценка:</label>
                        <input type="number" class="form-input" id="min-grade-${rule.id}" value="${rule.minGrade}" min="0" max="100">
                    </div>
                    
                    <div class="setting-group">
                        <label class="setting-label">Максимальная оценка:</label>
                        <input type="number" class="form-input" id="max-grade-${rule.id}" value="${rule.maxGrade}" min="1" max="100">
                    </div>
                </div>

                <div class="setting-group">
                    <label class="setting-label">Формат оценок:</label>
                    <div class="radio-group">
                        <label class="radio-item">
                            <input type="radio" name="grade-format-${rule.id}" value="integer" ${rule.gradeFormat === 'integer' ? 'checked' : ''}>
                            <span class="radiomark"></span>
                            Целые значения
                        </label>
                        <label class="radio-item">
                            <input type="radio" name="grade-format-${rule.id}" value="decimal" ${rule.gradeFormat === 'decimal' ? 'checked' : ''}>
                            <span class="radiomark"></span>
                            Дробные значения
                        </label>
                    </div>
                </div>

                ${rule.gradeFormat === 'decimal' ? `
                    <div class="step-setting">
                        <div class="setting-group">
                            <label class="setting-label">Шаг дробной части:</label>
                            <select class="form-select" id="decimal-step-${rule.id}">
                                <option value="0.1" ${rule.decimalStep === 0.1 ? 'selected' : ''}>0.1 (4.1, 4.2, 4.3...)</option>
                                <option value="0.25" ${rule.decimalStep === 0.25 ? 'selected' : ''}>0.25 (4.25, 4.5, 4.75...)</option>
                                <option value="0.5" ${rule.decimalStep === 0.5 ? 'selected' : ''}>0.5 (4.5, 5.0, 5.5...)</option>
                                <option value="0.01" ${rule.decimalStep === 0.01 ? 'selected' : ''}>0.01 (4.01, 4.02, 4.03...)</option>
                            </select>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createAutoGradingRuleContent(rule) {
        return `
            <div class="rule-settings">
                <p>🤖 Автоматическое оценивание будет доступно в следующем обновлении</p>
            </div>
        `;
    }

    getRuleTitle(rule) {
        return rule.type === 'cell-values' ? 'Правило значений ячеек' : 'Автоматическое оценивание';
    }

    getRuleDescription(rule) {
        if (rule.type === 'cell-values') {
            const types = rule.lectureTypes.includes('all') ? 'все типы' : rule.lectureTypes.join(', ');
            const format = rule.gradeFormat === 'integer' ? 'целые числа' : 'дробные числа';
            return `${types} • ${rule.minGrade}-${rule.maxGrade} • ${format}`;
        }
        return 'Автовыставление оценок на основе посещаемости';
    }

    createNewRule(ruleType) {
        const baseRule = {
            id: this.nextRuleId++,
            type: ruleType,
            collapsed: false
        };

        if (ruleType === 'cell-values') {
            return {
                ...baseRule,
                lectureTypes: ['all'],
                minGrade: 0,
                maxGrade: 10,
                gradeFormat: 'integer',
                decimalStep: 0.1
            };
        } else {
            return baseRule;
        }
    }

    addRule(ruleType) {
        const newRule = this.createNewRule(ruleType);
        this.rules.push(newRule);
        this.saveRules();
        this.renderRules();
        this.showNotification('Новое правило создано!', 'success');
    }

    deleteRule(ruleId) {
        if (confirm('Удалить это правило?')) {
            this.rules = this.rules.filter(rule => rule.id !== ruleId);
            this.saveRules();
            this.renderRules();
            this.showNotification('Правило удалено!', 'success');
        }
    }

    toggleRule(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        rule.collapsed = !rule.collapsed;
        this.saveRules();
        this.updateSingleRule(ruleId);
    }

    updateSingleRule(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        const ruleElement = document.querySelector(`.rule-card[data-rule-id="${ruleId}"]`);
        if (ruleElement) {
            if (rule.collapsed) {
                ruleElement.classList.add('collapsed');
            } else {
                ruleElement.classList.remove('collapsed');
            }
            
            // Обновляем описание правила
            const descriptionElement = ruleElement.querySelector('.rule-card-info p');
            if (descriptionElement) {
                descriptionElement.textContent = this.getRuleDescription(rule);
            }
        }
    }

    saveRuleChanges(ruleId) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (!rule) return;

        // Собираем данные из формы
        const lectureTypes = Array.from(document.querySelectorAll(`input[name="lecture-type-${ruleId}"]:checked`))
            .map(checkbox => checkbox.value);
        
        const minGrade = parseInt(document.getElementById(`min-grade-${ruleId}`).value);
        const maxGrade = parseInt(document.getElementById(`max-grade-${ruleId}`).value);
        const gradeFormat = document.querySelector(`input[name="grade-format-${ruleId}"]:checked`).value;
        const decimalStep = gradeFormat === 'decimal' ? 
            parseFloat(document.getElementById(`decimal-step-${ruleId}`).value) : 0.1;

        // Валидация
        if (minGrade >= maxGrade) {
            this.showNotification('Минимальная оценка должна быть меньше максимальной!', 'danger');
            return;
        }
        
        if (lectureTypes.length === 0) {
            this.showNotification('Выберите хотя бы один тип занятия!', 'danger');
            return;
        }

        // Обновляем правило
        rule.lectureTypes = lectureTypes;
        rule.minGrade = minGrade;
        rule.maxGrade = maxGrade;
        rule.gradeFormat = gradeFormat;
        rule.decimalStep = decimalStep;
        
        // Сворачиваем правило после сохранения
        rule.collapsed = true;

        this.saveRules();
        this.updateSingleRule(ruleId);
        
        this.showNotification('Изменения сохранены! Правило свернуто.', 'success');
    }

    setupEventListeners() {
        // Кнопка создания правила
        document.getElementById('create-rule-btn').addEventListener('click', () => {
            this.openCreateRuleModal();
        });

        // Модальное окно
        document.getElementById('close-rule-modal').addEventListener('click', () => {
            this.closeCreateRuleModal();
        });

        document.getElementById('cancel-rule').addEventListener('click', () => {
            this.closeCreateRuleModal();
        });

        document.getElementById('confirm-rule-type').addEventListener('click', () => {
            this.confirmRuleType();
        });

        // Закрытие модального окна по клику вне его
        document.getElementById('create-rule-modal').addEventListener('click', (e) => {
            if (e.target.id === 'create-rule-modal') {
                this.closeCreateRuleModal();
            }
        });

        // Обработка чекбокса "Все типы"
        document.addEventListener('change', (e) => {
            if (e.target.name && e.target.name.startsWith('lecture-type-')) {
                this.handleLectureTypeChange(e.target);
            }
        });
    }

    handleLectureTypeChange(checkbox) {
        const ruleId = checkbox.name.split('-')[2];
        const lectureType = checkbox.value;
        
        if (lectureType === 'all') {
            if (checkbox.checked) {
                document.querySelectorAll(`input[name="lecture-type-${ruleId}"]:not([value="all"])`).forEach(cb => {
                    cb.checked = false;
                });
            }
        } else {
            if (checkbox.checked) {
                document.querySelector(`input[name="lecture-type-${ruleId}"][value="all"]`).checked = false;
            }
        }
    }

    openCreateRuleModal() {
        document.getElementById('create-rule-modal').classList.add('active');
    }

    closeCreateRuleModal() {
        document.getElementById('create-rule-modal').classList.remove('active');
    }

    confirmRuleType() {
        const selectedType = document.querySelector('input[name="rule-type"]:checked').value;
        this.addRule(selectedType);
        this.closeCreateRuleModal();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Инициализация менеджера правил
document.addEventListener('DOMContentLoaded', () => {
    window.rulesManager = new RulesManager();
});