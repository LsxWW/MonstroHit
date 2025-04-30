let lives = 30;
let timerValue = 20;
let gameInterval;
let attackLevel = 1;
let damage = 1;
let upgradePoints = 0;
let upgradeCost = 3;
let gameStarted = false;
let maxLives = 30;
let isDialogShowing = false;
let phaseChanged = false;
let isTimerPaused = false;

// Элементы DOM
const statsToggleButton = document.querySelector('.stats-toggle-button');
const statsSidebar = document.querySelector('.stats-sidebar');
const sidebarUpgradeAttack = document.querySelector('#sidebarUpgradeAttack');
const sidebarAttackLevel = document.querySelector('#sidebarAttackLevel');
const sidebarDamage = document.querySelector('#sidebarDamage');
const sidebarUpgradePoints = document.querySelector('#sidebarUpgradePoints');
const bossDialog = document.querySelector('#bossDialog');
const dialogContent = document.querySelector('.dialog-content');
const clickButton = document.querySelector('#clickButton');
const timerElement = document.querySelector('#timer');
const monsterImage = document.querySelector('#monsterImage');
const healthBar = document.querySelector('#healthBar');
const livesText = document.querySelector('#livesText');
const timerBar = document.querySelector('.timer-bar');
const timerText = document.querySelector('.timer-text');
const restartButton = document.getElementById('restartButton');

const bossDialogs = {
    3: [ // Босс 1
        "Ты посмел бросить вызов Повелителю Тьмы?!",
        "Ты слаб, как младенец!",
        "АААРГХ! Ты заплатишь за это!"
    ],
    7: [ // Босс 2
        "Я - Апокалипсис во плоти!",
        "Твои удары - как комариные укусы!",
        "НЕВОЗМОЖНО! Как ты мог...",
        "*предсмертный хрип*"
    ]
};

const backgrounds = [
    'Backgrounds/background1.jpg',
    'Backgrounds/background2.jpg',
    'Backgrounds/background3.jpg'
];
let currentBackgroundIndex = 0;

const monsterImages = [
    'Monsters/монстр1.png',
    'Monsters/монстр2.png',
    'Monsters/монстр3.png',
    'Bosses/Босс1_фаза_1.png',
    'Monsters/монстр4.png',
    'Monsters/монстр5.png',
    'Monsters/монстр6.png',
    'Bosses/Босс2_фаза_2.png'
];
let currentMonsterIndex = 0;

// Основные функции игры
function handleFirstClick() {
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(updateTimer, 1000);
    }
    updateLives();
}

function updateLives() {
    lives -= damage;
    if (lives < 0) lives = 0;
    
    if (currentMonsterIndex === 3) {
        if (lives <= 150 && lives > 0 && !phaseChanged) {
            phaseChanged = true;
            monsterImage.src = 'Bosses/Босс1_фаза_2.png';
            showDialog(bossDialogs[3][1]);
        }
        if (lives <= 0) {
            showDialog(bossDialogs[3][2], 2000);
            changeBackground();
        }
    }
    if (currentMonsterIndex === 7) {
        if (lives <= 300 && lives > 0 && !phaseChanged) {
            phaseChanged = true;
            monsterImage.src = 'Bosses/Босс2_фаза_2.png';
            showDialog(bossDialogs[7][1]);
        }
        if (lives <= 0) {
            showDialog(bossDialogs[7][3], 2000);
            changeBackground();
        }
    }
    
    const healthPercent = (lives / maxLives) * 100;
    healthBar.style.width = `${healthPercent}%`;
    livesText.textContent = `${lives}/${maxLives}`;
    
    if (healthPercent < 30) {
        healthBar.style.backgroundColor = '#ff0000';
    } else if (healthPercent < 60) {
        healthBar.style.backgroundColor = '#f39c12';
    } else {
        healthBar.style.backgroundColor = '#2ecc71';
    }
    
    if (lives <= 0) {
        upgradePoints += currentMonsterIndex + 1;
        sidebarUpgradePoints.textContent = upgradePoints;
        changeMonsterImage();
        updateMonsterLives();
    }
    sidebarUpgradeAttack.disabled = upgradePoints < upgradeCost;
}

function changeBackground() {
    currentBackgroundIndex = (currentBackgroundIndex + 1) % backgrounds.length;
    document.querySelector('.background').style.backgroundImage = `url('${backgrounds[currentBackgroundIndex]}')`;
}

function showDialog(text, duration = 3000) {
    if (isDialogShowing) return;
    
    isDialogShowing = true;
    dialogContent.textContent = text;
    bossDialog.style.display = 'block';
    bossDialog.style.opacity = '1';
    
    setTimeout(() => {
        bossDialog.style.opacity = '0';
        setTimeout(() => {
            bossDialog.style.display = 'none';
            isDialogShowing = false;
        }, 500);
    }, duration);
}

function updateMonsterLives() {
    const levels = {
        0: 30, 1: 60, 2: 150, 3: 300, 
        4: 175, 5: 225, 6: 300, 7: 600
    };
    lives = maxLives = levels[currentMonsterIndex];
    phaseChanged = false;
    
    healthBar.style.width = '100%';
    livesText.textContent = `${lives}/${maxLives}`;
    healthBar.style.backgroundColor = '#2ecc71';
    timerValue = 20;
    sidebarUpgradeAttack.disabled = upgradePoints < upgradeCost;
}

function upgradeAttack() {
    if (upgradePoints >= upgradeCost) {
        upgradePoints -= upgradeCost;
        attackLevel++;
        damage = Math.floor(attackLevel * 2);
        upgradeCost = Math.floor(3 + attackLevel);
        
        updateCursor();
        sidebarAttackLevel.textContent = attackLevel;
        sidebarDamage.textContent = damage;
        sidebarUpgradePoints.textContent = upgradePoints;
        sidebarUpgradeAttack.textContent = `Улучшить атаку (${upgradeCost} очков)`;
        sidebarUpgradeAttack.disabled = upgradePoints < upgradeCost;
    }
}

function updateCursor() {
    const cursors = [
        [2, 'Деревянный.png'],
        [5, 'Каменный.png'],
        [8, 'Железный.png'],
        [11, 'Золотой.png'],
        [14, 'Алмазный.png'],
        [17, 'Алмазный_зач.png'],
        [20, 'Незеритовый.png'],
        [23, 'Незеритовый_зач.png']
    ];
    
    let cursorImage = 'Деревянный.png';
    for (const [level, cursor] of cursors) {
        if (attackLevel < level) {
            cursorImage = cursor;
            break;
        }
    }
    
    clickButton.style.cursor = `url('Cursors/${cursorImage}'), auto`;
}

function changeMonsterImage() {
    currentMonsterIndex = (currentMonsterIndex + 1) % monsterImages.length;
    phaseChanged = false;
    
    if (currentMonsterIndex === 3) {
        monsterImage.src = 'Bosses/Босс1_фаза_1.png';
        setTimeout(() => {
            showDialog(bossDialogs[3][0]);
        }, 500);
    } else if (currentMonsterIndex === 7) {
        monsterImage.src = 'Bosses/Босс2_фаза_1.png';
        setTimeout(() => {
            showDialog(bossDialogs[7][0]);
        }, 500);
    } else {
        monsterImage.src = monsterImages[currentMonsterIndex];
    }
    
    monsterImage.style.transform = 'scale(1.1)';
    setTimeout(() => {
        monsterImage.style.transform = 'scale(1)';
    }, 100);
}

function updateTimer() {
    if (isTimerPaused) return; // Не обновляем таймер, если он на паузе
    
    timerValue--;
    timerText.textContent = timerValue;
    const timerPercent = (timerValue / 20) * 100;
    timerBar.style.height = `${timerPercent}%`;
    
    if (timerPercent < 30) {
        timerBar.style.backgroundColor = '#e74c3c';
    } else if (timerPercent < 60) {
        timerBar.style.backgroundColor = '#f39c12';
    } else {
        timerBar.style.backgroundColor = '#3498db';
    }
    
    if (timerValue <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    clickButton.disabled = true;
    const message = lives <= 0 ? "Вы проиграли!" : "Монстр убил вас!";
    alert(`${message}\nОсталось жизней: ${lives > 0 ? lives : 0}`);
}

function startGame() {
    lives = maxLives = 30;
    timerValue = 20;
    currentMonsterIndex = 0;
    attackLevel = 1;
    damage = 1;
    upgradePoints = 0;
    gameStarted = false;
    
    updateCursor();
    healthBar.style.width = '100%';
    livesText.textContent = `${lives}/${maxLives}`;
    healthBar.style.backgroundColor = '#2ecc71';
    timerBar.style.height = '100%';
    timerBar.style.backgroundColor = '#3498db';
    timerText.textContent = timerValue;
    upgradeCost = 3;

    currentBackgroundIndex = 0;
    document.querySelector('.background').style.backgroundImage = `url('${backgrounds[0]}')`;
    
    monsterImage.src = monsterImages[0];
    timerElement.textContent = `Время: ${timerValue} секунд`;
    
    clickButton.disabled = false;
    
    sidebarAttackLevel.textContent = attackLevel;
    sidebarDamage.textContent = damage;
    sidebarUpgradePoints.textContent = upgradePoints;
    sidebarUpgradeAttack.textContent = `Улучшить атаку (${upgradeCost} очков)`;
    sidebarUpgradeAttack.disabled = true;
    
    clearInterval(gameInterval);
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    startGame();
    
    clickButton.addEventListener('click', handleFirstClick);
    sidebarUpgradeAttack.addEventListener('click', upgradeAttack);
    
    if (statsToggleButton && statsSidebar) {
        statsToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            handleFirstClick();
            statsSidebar.classList.toggle('active');
            statsToggleButton.style.display = statsSidebar.classList.contains('active') ? 'none' : 'block';
            
            // Пауза/возобновление таймера при открытии/закрытии сайдбара
            isTimerPaused = statsSidebar.classList.contains('active');
        });

        document.addEventListener('click', (e) => {
            if (!statsSidebar.contains(e.target) && e.target !== statsToggleButton) {
                statsSidebar.classList.remove('active');
                statsToggleButton.style.display = 'block';
                
                // Возобновляем таймер при закрытии сайдбара
                isTimerPaused = false;
            }
        });
    }

    if (restartButton) {
        restartButton.addEventListener('click', startGame);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.target === clickButton && 
        (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter')) {
        e.preventDefault();
        e.stopPropagation();
    }
});

clickButton.addEventListener('click', function(e) {
    if (e.pointerType !== 'mouse') { // Разрешаем только клики мышкой
        return;
    }
    handleFirstClick();
});