<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'teacher') {
    header('Location: ../index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Журнал оценивания</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/teacher_styles.css">
    <link rel="stylesheet" href="../styles/grading_styles.css"> <!-- ИСПРАВЛЕНО -->
</head>
<body>
<header class="header">
    <a href="teacher.php" class="logo">← Назад к расписанию</a>
    <div class="user-menu">
        <span>Преподаватель: Иванова А.С.</span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<div class="container">
    <!-- Основной layout с таблицей -->
    <div class="journal-layout">
        <!-- Левая колонка - информация -->
        <div class="journal-sidebar">
            <div class="card">
                <h3>📊 Журнал оценивания</h3>
                
                <div class="subject-controls">
                    <div class="control-group">
                        <label for="subject-select">Предмет:</label>
                        <select id="subject-select" class="form-select">
                            <option value="Математический анализ" selected>Математический анализ</option>
                            <option value="Высшая математика">Высшая математика</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label for="group-select">Группа:</label>
                        <select id="group-select" class="form-select">
                            <option value="5092" selected>5092</option>
                            <option value="4081">4081</option>
                            <option value="3094">3094</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" id="load-journal">Обновить данные</button>
                </div>

                <div class="subject-info-card">
                    <div class="info-header">
                        <h4 id="current-subject">Математический анализ</h4>
                        <span class="group-badge" id="current-group">5092</span>
                    </div>
                    
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value" id="students-count">0</div>
                            <div class="stat-label">Студентов</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="lectures-count">0</div>
                            <div class="stat-label">Занятий</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="grades-count">0</div>
                            <div class="stat-label">Оценок</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="attendance-percent">0%</div>
                            <div class="stat-label">Посещаемость</div>
                        </div>
                    </div>
                </div>

                <div class="quick-actions">
                    <h4>Быстрые действия</h4>
                    <button class="btn btn-secondary btn-sm" id="export-grades">📤 Экспорт в Excel</button>
                    <button class="btn btn-secondary btn-sm" id="print-journal">🖨️ Печать</button>
                </div>

                <div class="instructions">
                    <h4>💡 Как работать:</h4>
                    <ul>
                        <li>Кликните на оценку для редактирования</li>
                        <li>Enter - сохранить оценку</li>
                        <li>Escape - отменить редактирование</li>
                        <li>Оценки от 0 до 10 баллов</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Правая колонка - таблица -->
        <div class="journal-main">
            <div class="card">
                <div class="table-container">
                    <table class="journal-table" id="journal-table">
                        <thead>
                            <tr>
                                <th rowspan="2" class="student-col">Студент</th>
                                <!-- Динамические заголовки занятий будут здесь -->
                            </tr>
                            <tr>
                                <!-- Подзаголовки с типами занятий будут здесь -->
                            </tr>
                        </thead>
                        <tbody id="journal-table-body">
                            <!-- Данные студентов будут здесь -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Блок создания правил -->
    <div class="rules-section">
        <div class="card">
            <div class="rules-header">
                <h3>⚙️ Правила оценивания</h3>
                <button class="btn btn-primary" id="create-rule-btn">
                    ➕ Задать правило
                </button>
            </div>

            <!-- Контейнер для правил -->
            <div class="rules-container" id="rules-container">
                <!-- Правила будут добавляться динамически -->
                <div class="no-rules" id="no-rules-message">
                    <p>📝 Правила оценивания еще не заданы</p>
                    <p class="text-muted">Нажмите "Задать правило" чтобы создать первое правило</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно создания правила - ВНЕ контейнера -->
<div class="modal" id="create-rule-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h4>➕ Создание нового правила</h4>
            <button class="close-modal" id="close-rule-modal">×</button>
        </div>
        <div class="modal-body">
            <div class="rule-type-selection">
                <h5>Выберите тип правила:</h5>
                <div class="rule-type-options">
                    <label class="rule-type-option">
                        <input type="radio" name="rule-type" value="cell-values" checked>
                        <div class="rule-type-card">
                            <div class="rule-type-icon">📝</div>
                            <div class="rule-type-info">
                                <h6>Правило значений ячеек</h6>
                                <p>Настройка допустимых диапазонов оценок для типов занятий</p>
                            </div>
                        </div>
                    </label>
                    
                    <label class="rule-type-option">
                        <input type="radio" name="rule-type" value="auto-grading">
                        <div class="rule-type-card">
                            <div class="rule-type-icon">🤖</div>
                            <div class="rule-type-info">
                                <h6>Автоматическое оценивание</h6>
                                <p>Автовыставление оценок на основе посещаемости</p>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" id="cancel-rule">Отмена</button>
                <button class="btn btn-primary" id="confirm-rule-type">Продолжить</button>
            </div>
        </div>
    </div>
</div>

<script src="../js/grading_journal.js"></script>
<script src="../js/rules_manager.js"></script>
<script>
// ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ЖУРНАЛА ОЦЕНИВАНИЯ
const scheduleData = {
    "18 - 24 ноября 2024": {
        "Понедельник": {
            "9:00-10:30": {
                name: "Математический анализ",
                room: "301",
                status: "attended",
                type: "лекция",
                groups: ["5091", "5092"],
                date: "2024-11-18"
            },
            "13:00-14:30": {
                name: "Математический анализ",
                room: "301",
                status: "missed",
                type: "практика",
                groups: ["5091"],
                date: "2024-11-18"
            }
        },
        "Вторник": {
            "10:30-12:00": {
                name: "Математический анализ",
                room: "415",
                status: "attended",
                type: "лабораторная",
                groups: ["5092"],
                date: "2024-11-19"
            }
        },
        "Среда": {
            "9:00-10:30": {
                name: "Математический анализ",
                room: "301",
                status: "partial",
                type: "практика",
                groups: ["4081"],
                date: "2024-11-20"
            }
        }
    }
};

const studentsData = {
    "5091": [
        { id: 1, name: "Иванов Алексей", status: "present" },
        { id: 2, name: "Петрова Мария", status: "present" },
        { id: 3, name: "Сидоров Владимир", status: "absent" },
        { id: 4, name: "Козлова Анна", status: "present" }
    ],
    "5092": [
        { id: 1, name: "Орлова Екатерина", status: "absent" },
        { id: 2, name: "Федоров Максим", status: "absent" },
        { id: 3, name: "Семенова Ирина", status: "present" },
        { id: 4, name: "Волков Андрей", status: "absent" }
    ],
    "4081": [
        { id: 1, name: "Белов Александр", status: "present" },
        { id: 2, name: "Крылова Виктория", status: "present" },
        { id: 3, name: "Морозов Иван", status: "absent" },
        { id: 4, name: "Зайцева София", status: "present" }
    ]
};

// Временные интервалы и дни недели для совместимости
const timeSlots = ["9:00-10:30", "10:30-12:00", "13:00-14:30"];
const daysOfWeek = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
</script>
</body>
</html>