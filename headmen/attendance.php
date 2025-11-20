<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал посещаемости 2.0</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/attendance_styles.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <div class="logo">Журнал 2.0</div>
    <div class="user-menu">
        <span>Староста: Петров И.С.</span>
    </div>
</header>

<!-- Основной контент -->
<div class="container">
    <!-- Кнопка назад -->
    <a href="headmen.php" class="back-button">
        ← Назад к расписанию
    </a>

    <!-- Информация о текущей паре -->
    <div class="lecture-info">
        <div class="lecture-title">Математический анализ</div>
        <div>10:30 - 12:00 • Аудитория 301</div>
        <div>Преподаватель: Иванова А.С. • Группа: ПИ-201</div>
    </div>

    <!-- Статистика -->
    <div class="stats-bar">
        <div class="stat-item">
            <div class="stat-value present" id="present-count">0</div>
            <div>Присутствуют</div>
        </div>
        <div class="stat-item">
            <div class="stat-value absent" id="absent-count">0</div>
            <div>Отсутствуют</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" id="total-count">4</div>
            <div>Всего студентов</div>
        </div>
    </div>

    <!-- Поиск -->
    <div class="search-box">
        <input type="text" class="search-input" placeholder="Поиск студента...">
    </div>

    <!-- Список студентов -->
    <div class="card">
        <h2 style="margin-bottom: 1rem;">Список студентов</h2>
        <div class="students-list">
            <!-- Студент 1 -->
            <div class="student-item" data-id="1">
                <div class="student-info">
                    <span class="student-name">Иванов Алексей Сергеевич</span>
                    <span class="student-id">№ 201001</span>
                </div>
                <div class="status-badge default">Не отмечен</div>
            </div>

            <!-- Студент 2 -->
            <div class="student-item" data-id="2">
                <div class="student-info">
                    <span class="student-name">Петрова Мария Константиновна</span>
                    <span class="student-id">№ 201002</span>
                </div>
                <div class="status-badge default">Не отмечен</div>
            </div>

            <!-- Студент 3 -->
            <div class="student-item" data-id="3">
                <div class="student-info">
                    <span class="student-name">Сидоров Владимир Петрович</span>
                    <span class="student-id">№ 201003</span>
                </div>
                <div class="status-badge default">Не отмечен</div>
            </div>

            <!-- Студент 4 -->
            <div class="student-item" data-id="4">
                <div class="student-info">
                    <span class="student-name">Козлова Анна Дмитриевна</span>
                    <span class="student-id">№ 201004</span>
                </div>
                <div class="status-badge default">Не отмечен</div>
            </div>
        </div>

        <!-- Быстрые действия -->
        <div class="quick-actions">
            <button class="btn btn-primary" id="mark-all-present">Отметить всех</button>
            <button class="btn btn-secondary" id="mark-all-absent">Все отсутствуют</button>
            <button class="btn btn-secondary" id="reset-all">Сбросить все</button>
            <button class="btn btn-primary" style="margin-left: auto;" id="save-changes">Сохранить изменения</button>
        </div>
    </div>
</div>

<script src="../js/attendance.js"></script>
</body>
</html>