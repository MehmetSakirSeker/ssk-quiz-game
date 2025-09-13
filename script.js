const startScreen = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const statsScreen = document.getElementById('stats-screen');
const leaderboardList = document.getElementById('leaderboard-list');

const usernameInput = document.getElementById('username');
const startBtn = document.getElementById('start-btn');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const scoreDisplay = document.getElementById('score-display');
const nextPlayerBtn = document.getElementById('next-player');

const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

let username = '';
let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let lockOptions = false; 
let userAnswers = []; 

let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');


const allQuestions = [
    {
        q: "Sosyal sorumluluk projelerinin en temel amacı nedir?",
        options: ["Reklam yapmak", "Topluma fayda sağlamak", "Sadece eğlence düzenlemek", "Kar elde etmek"],
        answer: "Topluma fayda sağlamak",
        properAnswer: "Topluma fayda sağlamak, sosyal sorumluluk projelerinin en temel amacıdır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Aşağıdakilerden hangisi bir sosyal sorumluluk projesi örneğidir?",
        options: ["İhtiyaç sahiplerine gıda yardımı yapmak", "Arkadaşlarla piknik düzenlemek", "Spor salonuna üye olmak", "Alışveriş yapmak"],
        answer: "İhtiyaç sahiplerine gıda yardımı yapmak",
        properAnswer: "İhtiyaç sahiplerine gıda yardımı yapmak, sosyal sorumluluk projesine örnektir.",
        level: "kolay",
        topic: "İnsan Hakları"
    },
    {
        q: "Çevre için yapılan en yaygın sosyal sorumluluk projesi nedir?",
        options: ["Ağaç dikme kampanyaları", "Alışveriş merkezine gitmek", "Tatil yapmak", "Spor turnuvası düzenlemek"],
        answer: "Ağaç dikme kampanyaları",
        properAnswer: "Ağaç dikme kampanyaları, çevre odaklı sosyal sorumluluk projelerinin en yaygın örneğidir.",
        level: "kolay",
        topic: "Çevre"
    },
    {
        q: "Sosyal sorumluluk projesi yaparken en önemli ilke nedir?",
        options: ["Sadece gönüllülere fayda sağlamak", "Toplumun ihtiyacına uygun olmak", "Kâr amaçlı çalışmak", "Popüler görünmek"],
        answer: "Toplumun ihtiyacına uygun olmak",
        properAnswer: "Sosyal sorumluluk projeleri, toplumun ihtiyacına uygun olmalıdır.",
        level: "kolay",
        topic: "Genel"
    },
    {
        q: "Sağlık temalı bir sosyal sorumluluk projesine örnek hangisidir?",
        options: ["Kan bağışı kampanyası", "Futbol turnuvası düzenlemek", "Alışveriş festivali", "Konser bileti satışı"],
        answer: "Kan bağışı kampanyası",
        properAnswer: "Kan bağışı kampanyası, sağlık temalı sosyal sorumluluk projelerine örnektir.",
        level: "kolay",
        topic: "Sağlık"
    }
];


function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function prepareQuestions() {
    const easy = shuffle(allQuestions.filter(q => q.level === "kolay")).slice(0, 2);
    const medium = shuffle(allQuestions.filter(q => q.level === "orta")).slice(0, 2);
    const hard = shuffle(allQuestions.filter(q => q.level === "zor")).slice(0, 1);
    return shuffle([...easy, ...medium, ...hard]);
}

function showQuestion() {
    updateProgress();

    if (currentQuestionIndex >= questions.length) {
        endGame();
        return;
    }
    const q = questions[currentQuestionIndex];
    questionText.textContent = q.q;
    optionsDiv.innerHTML = '';
    q.options.forEach(option => {
        const btn = document.createElement('div');
        btn.textContent = option;
        btn.classList.add('option');
        btn.addEventListener('click', () => handleAnswer(option, btn, q.answer));
        optionsDiv.appendChild(btn);
    });
}

function handleAnswer(selected, btn, correct) {
    if (lockOptions) return;

    lockOptions = true;
    const q = questions[currentQuestionIndex];

    // Tüm seçenekleri devre dışı bırak
    document.querySelectorAll('.option').forEach(o => o.style.pointerEvents = 'none');

    if (selected === correct) {
        btn.classList.add('correct');
        score += getPoint(currentQuestionIndex);
        userAnswers.push({ topic: q.topic, isCorrect: true });
        setTimeout(() => {
            currentQuestionIndex++;
            lockOptions = false;
            showQuestion();
        }, 200); // doğruysa hızlı geçiş
    } else {
        btn.classList.add('wrong');
        userAnswers.push({ topic: q.topic, isCorrect: false });

        // Yanlışsa properAnswer'ı göster
        showProperAnswer(q.properAnswer);
    }
}

function showProperAnswer(text) {
    // ProperAnswer alanını oluştur veya güncelle
    let existing = document.getElementById('proper-answer');
    if (!existing) {
        const div = document.createElement('div');
        div.id = 'proper-answer';
        div.style.marginTop = '10px';
        div.style.padding = '10px';
        div.style.border = '1px solid #ccc';
        div.style.borderRadius = '5px';
        div.style.backgroundColor = '#fff3cd'; // sarı arka plan
        div.style.color = '#856404';
        div.style.fontWeight = 'bold';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';

        const answerText = document.createElement('div');
        answerText.textContent = text;
        answerText.style.marginBottom = '10px';

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Devam';
        nextBtn.style.alignSelf = 'flex-end'; // butonu sağa yaslar
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            lockOptions = false;
            div.remove(); // properAnswer'ı kaldır
            showQuestion();
        });

        div.appendChild(answerText);
        div.appendChild(nextBtn);
        optionsDiv.appendChild(div);
    } else {
        // Eğer daha önce eklenmişse sadece texti güncelle
        existing.querySelector('div').textContent = text;
    }
}



function getPoint(index) {
    const q = questions[index];
    if (q.level === "kolay") return 1;
    if (q.level === "orta") return 2;
    if (q.level === "zor") return 3;
}

function endGame() {
    questionScreen.classList.add('hidden');
    statsScreen.classList.remove('hidden');

    createFireworks();
    const totalQuestions = questions.length;
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;

    // Topic bazlı sayılar
    const topics = [...new Set(allQuestions.map(q => q.topic))];
    const correctPerTopic = topics.map(topic =>
        userAnswers.filter(a => a.isCorrect && a.topic === topic).length
    );
    const wrongPerTopic = topics.map(topic =>
        userAnswers.filter(a => !a.isCorrect && a.topic === topic).length
    );

    statsScreen.innerHTML = `
        <h2>İstatistikler</h2>
        <div class="stat-card"><span>Oyuncu:</span><span>${username}</span></div>
        <div class="stat-card"><span>Toplam Puan:</span><span>${score}</span></div>
        <div class="stat-card"><span>Doğru:</span><span>✅ ${correctAnswers}</span></div>
        <div class="stat-card"><span>Yanlış:</span><span>❌ ${wrongAnswers}</span></div>
        <div class="charts-container">
            <div class="chart-box">
                <h3>Doğru Cevaplar </h3>
                <canvas id="correctChart"></canvas>
            </div>
            <div class="chart-box">
                <h3>Yanlış Cevaplar </h3>
                <canvas id="wrongChart"></canvas>
            </div>
        </div>
        <button id="next-player">Sonraki Oyuncu</button>
    `;

    // Chartları oluştur
    createPieChart('correctChart', topics, correctPerTopic, 'Doğru Cevaplar');
    createPieChart('wrongChart', topics, wrongPerTopic, 'Yanlış Cevaplar');

    document.getElementById('next-player').addEventListener('click', () => {
        statsScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        usernameInput.value = '';
        userAnswers = [];
    });

    leaderboard.push({ name: username, score });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    updateLeaderboard();
}


function updateLeaderboard() {
    leaderboardList.innerHTML = '';
    leaderboard
        .sort((a, b) => b.score - a.score)
        .forEach((entry, index) => {
            const div = document.createElement('div');
            div.classList.add('leaderboard-entry');

            if (index === 0) div.classList.add('gold');
            else if (index === 1) div.classList.add('silver');
            else if (index === 2) div.classList.add('bronze');

            div.innerHTML = `
                <span class="rank">#${index + 1}</span>
                <span class="name">${entry.name}</span>
                <span class="score">${entry.score} puan</span>
            `;
            leaderboardList.appendChild(div);
        });
}

function createPieChart(canvasId, labels, data, label) {
    new Chart(document.getElementById(canvasId), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                backgroundColor: ["#34d399", "#60a5fa", "#fbbf24", "#f87171", "#a78bfa"]
            }]
        },
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let total = context.dataset.data.reduce((a, b) => a + b, 0);
                            let value = context.raw;
                            let percentage = total ? ((value / total) * 100).toFixed(1) : 0;
                            return `${context.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

startBtn.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (!username) return alert("Lütfen isim girin.");

    const lowerUsername = username.toLowerCase();

    // deleteallusers komutu
    if (lowerUsername === 'deleteallusers') {
        leaderboard = [];
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
        alert("Leaderboard temizlendi!");
        usernameInput.value = '';
        return;
    }
    // deleteuser <name> komutu
    if (lowerUsername.startsWith('deleteuser ')) {
        const nameToDelete = lowerUsername.replace('deleteuser ', '').trim();
        const initialLength = leaderboard.length;
        leaderboard = leaderboard.filter(entry => entry.name.toLowerCase() !== nameToDelete);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        updateLeaderboard();
        if (leaderboard.length < initialLength) {
            alert(`${nameToDelete} leaderboarddan silindi!`);
        } else {
            alert(`${nameToDelete} leaderboardda bulunamadı!`);
        }
        usernameInput.value = '';
        return;
    }

    // Kullanıcı adı daha önce leaderboard'da var mı kontrol et
    const isDuplicate = leaderboard.some(entry => entry.name.toLowerCase() === lowerUsername);
    if (isDuplicate) {
        alert("Bu isim zaten mevcut, lütfen başka bir isim giriniz.");
        usernameInput.value = '';
        return;
    }

    // Oyun başlat
    startScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    questions = prepareQuestions();
    currentQuestionIndex = 0;
    score = 0;

    showQuestion();
});



function createFireworks() {
    const container = document.createElement('div');
    container.className = 'fireworks-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    // Create multiple fireworks bursts
    const burstCount = 7;
    const burstPositions = [
        { x: 50, y: 30 },
        { x: 20, y: 40 },
        { x: 80, y: 40 },
        { x: 30, y: 60 },
        { x: 70, y: 60 }
    ];

    burstPositions.forEach((pos, index) => {
        setTimeout(() => {
            createFireworkBurst(container, pos.x, pos.y);
        }, index * 300);
    });

    // Remove container after animation completes
    setTimeout(() => {
        container.remove();
    }, 4000);
}

function createFireworkBurst(container, xPercent, yPercent) {
    const particleCount = 140;
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'absolute';
    burstContainer.style.left = `${xPercent}%`;
    burstContainer.style.top = `${yPercent}%`;
    burstContainer.style.transform = 'translate(-50%, -50%)';
    burstContainer.style.width = '0';
    burstContainer.style.height = '0';
    container.appendChild(burstContainer);

    // Create initial rising effect
    const risingDot = document.createElement('div');
    risingDot.style.position = 'absolute';
    risingDot.style.width = '7px';
    risingDot.style.height = '7px';
    risingDot.style.backgroundColor = '#ffffff';
    risingDot.style.borderRadius = '50%';
    risingDot.style.left = '0';
    risingDot.style.top = '0';
    risingDot.style.boxShadow = '0 0 8px 2px rgba(255, 255, 255, 0.8)';
    burstContainer.appendChild(risingDot);

    // Animate the rising dot
    const riseAnimation = risingDot.animate([
        { transform: 'translate(0, 0)', opacity: 1 },
        { transform: 'translate(0, -100px)', opacity: 1 }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });

    riseAnimation.onfinish = () => {
        risingDot.remove();
        
        // Create explosion effect
        for (let i = 0; i < particleCount; i++) {
            createParticle(burstContainer);
        }
        
        // Add flash effect
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.left = '0';
        flash.style.top = '0';
        flash.style.width = '60px';
        flash.style.height = '60px';
        flash.style.borderRadius = '50%';
        flash.style.backgroundColor = '#ffffff';
        flash.style.opacity = '0.8';
        flash.style.transform = 'translate(-50%, -50%)';
        flash.style.filter = 'blur(10px)';
        burstContainer.appendChild(flash);
        
        // Animate flash
        flash.animate([
            { opacity: 0.8, transform: 'translate(-50%, -50%) scale(0.5)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(2)' }
        ], {
            duration: 400,
            easing: 'ease-out'
        }).onfinish = () => flash.remove();
    };
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = getRandomFireworkColor();
    particle.style.left = '0';
    particle.style.top = '0';
    particle.style.boxShadow = '0 0 4px 1px rgba(255, 255, 255, 0.6)';
    container.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    const size = 4 + Math.random() * 6;
    const duration = 1200 + Math.random() * 700;
    const delay = Math.random() * 100;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Animate particle
    const animation = particle.animate([
        { 
            transform: 'translate(0, 0) scale(1)', 
            opacity: 1 
        },
        { 
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.2)`, 
            opacity: 0 
        }
    ], { 
        duration: duration, 
        delay: delay,
        easing: 'cubic-bezier(0.1, 0.3, 0.2, 1)' 
    });

    animation.onfinish = () => particle.remove();
}

function getRandomFireworkColor() {
    const colors = [
        '#ff5252', '#ff4081', '#e040fb', '#7c4dff', 
        '#536dfe', '#448aff', '#40c4ff', '#18ffff',
        '#64ffda', '#69f0ae', '#b2ff59', '#eeff41',
        '#ffff00', '#ffd740', '#ffab40', '#ff6e40',
        '#ff3d00', '#ff1744', '#f50057', '#d500f9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
window.addEventListener('load', () => {
    setTimeout(createFireworks, 1000);
});

function updateProgress() {
    const total = questions.length;
    const current = currentQuestionIndex;
    const progress = (current / total) * 100;

    progressBar.style.width = progress + "%";
    progressText.textContent = current + "/" + total;
}

updateLeaderboard();
