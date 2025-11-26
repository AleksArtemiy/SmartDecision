<?php
session_start();
if (!isset($_SESSION['user']) || $_SESSION['user']['role'] !== 'teacher') {
    header('Location: ../index.php');
    exit();
}

// Данные преподавателя (в реальном приложении брались бы из БД)
$teacher_name = "Иванова А.С.";
$teacher_stats = [
    'total_groups' => 12,
    'total_lectures' => 24,
    'avg_attendance' => 78
];

// Данные для расписания (в реальном приложении брались бы из БД)
$schedule_data = [
    'current_week' => '18 - 24 ноября 2024',
    'time_slots' => [
        '09:00-10:30',
        '10:45-12:15', 
        '13:00-14:30',
        '14:45-16:15',
        '16:30-18:00'
    ]
];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Журнал 2.0 - Кабинет преподавателя</title>
    <link rel="stylesheet" href="../styles/style.css">
    <link rel="stylesheet" href="../styles/teacher_styles.css">
</head>
<body>
<!-- Шапка -->
<header class="header">
    <a href="../headmen/index.html" class="logo">Журнал 2.0</a>
    <div class="user-menu">
        <span>Преподаватель: <?php echo htmlspecialchars($teacher_name); ?></span>
        <button class="btn btn-secondary" onclick="logout()">Выйти</button>
    </div>
</header>

<div class="container">
    <div class="dashboard">
        <div class="card">
            <div class="schedule-controls">
                <h2>Мое расписание</h2>
                <div class="week-navigation">
                    <button class="btn btn-secondary" id="prev-week">← Пред.</button>
                    <div class="current-week" id="current-week"><?php echo htmlspecialchars($schedule_data['current_week']); ?></div>
                    <button class="btn btn-secondary" id="next-week">След. →</button>
                </div>
            </div>

            <!-- Легенда -->
            <div class="legend">
                <div class="legend-item">
                    <div class="legend-color future"></div>
                    <span>Предстоящие пары</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color attended"></div>
                    <span>Студенты присутствовали</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color missed"></div>
                    <span>Студенты отсутствовали</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color partial"></div>
                    <span>Частичное посещение</span>
                </div>
            </div>

            <!-- КОНТЕЙНЕР ДЛЯ ГОРИЗОНТАЛЬНОЙ ПРОКРУТКИ -->
            <div class="schedule-container">
                <table class="schedule-table">
                    <thead>
                    <tr>
                        <th>Время</th>
                        <th>Пн</th>
                        <th>Вт</th>
                        <th>Ср</th>
                        <th>Чт</th>
                        <th>Пт</th>
                        <th>Сб</th>
                    </tr>
                    </thead>
                    <tbody id="schedule-body">
                    <?php foreach ($schedule_data['time_slots'] as $time_slot): ?>
                    <tr>
                        <td class="time-column"><?php echo htmlspecialchars($time_slot); ?></td>
                        <td data-time="<?php echo htmlspecialchars($time_slot); ?>" data-day="monday"></td>
                        <td data-time="<?php echo htmlspecialchars($time_slot); ?>" data-day="tuesday"></td>
                        <td data-time="<?php echo htmlspecialchars($time_slot); ?>" data-day="wednesday"></td>
                        <td data-time="<?php echo htmlspecialchars($time_slot); ?>" data-day="thursday"></td>
                        <td data-time="<?php echo htmlspecialchars($time_slot); ?>" data-day="friday"></td>
                        <td data-time="<?php echo htmlspecialchars($time_slot); ?>" data-day="saturday"></td>
                    </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="card">
            <h2 style="margin-bottom: 1.5rem;">Моя статистика</h2>
            <div class="stats-overview">
                <div class="stat-card good">
                    <div class="stat-value good" id="total-groups"><?php echo $teacher_stats['total_groups']; ?></div>
                    <div class="stat-label">Групп всего</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value" id="total-lectures"><?php echo $teacher_stats['total_lectures']; ?></div>
                    <div class="stat-label">Пар в неделю</div>
                </div>
                <div class="stat-card warning">
                    <div class="stat-value warning" id="avg-attendance"><?php echo $teacher_stats['avg_attendance']; ?>%</div>
                    <div class="stat-label">Средняя посещаемость</div>
                    <div class="progress-bar">
                        <div class="progress-fill warning" style="width: <?php echo $teacher_stats['avg_attendance']; ?>%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно просмотра -->
<div class="modal-overlay" id="view-modal">
    <div class="modal-content">
        <div class="modal-header">
            <div class="modal-title" id="view-modal-title">Посещаемость</div>
            <button class="close-modal" id="close-view-modal">×</button>
        </div>

        <div class="modal-body" id="view-modal-body">
            <!-- Содержимое будет заполнено через JavaScript -->
        </div>

        <div class="modal-actions">
            <button class="btn btn-primary" id="grading-journal-btn">📊 Журнал оценивания</button>
            <button class="btn btn-primary" id="force-edit-btn">Принудительно изменить</button>
            <button class="btn btn-secondary" id="close-view-btn">Закрыть</button>
        </div>
    </div>
</div>

<!-- Модальное окно редактирования -->
<div class="modal-overlay" id="edit-modal">
    <div class="modal-content">
        <div class="modal-header">
            <div class="modal-title" id="edit-modal-title">Редактирование посещаемости</div>
            <button class="close-modal" id="close-edit-modal">×</button>
        </div>

        <div class="modal-body">
            <div class="edit-notice">
                📝 Режим редактирования. Кликните на студента для изменения статуса
            </div>

            <div id="edit-modal-body">
                <!-- Содержимое будет заполнено через JavaScript -->
            </div>
        </div>

        <div class="modal-actions">
            <button class="btn btn-secondary" id="cancel-edit">Отмена</button>
            <button class="btn btn-success" id="save-edit-changes">Подтвердить изменения</button>
        </div>
    </div>
</div>

<script src="../js/teacher.js"></script>
</body>
</html>