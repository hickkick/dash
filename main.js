
// Оновлення часу
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    document.getElementById('current-time').textContent = timeString;
}

// Завантаження цитати
async function loadQuote() {
    try {

        const response = await fetch('/.netlify/functions/quotes');

        // Перевіряємо чи запит успішний
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Парсимо JSON
        const data = await response.json();

        // Використовуємо дані (структура залежить від оригінального API)
        document.getElementById('quote').innerHTML = `
            <div class="quote-text">"${data.quote}"</div>
            <div class="quote-author">— ${data.author}</div>
        `;

    } catch (error) {
        console.log(error)
        document.getElementById('quote').innerHTML = `
                    <div class="quote-text">"Code is like humor. When you have to explain it, it's bad."</div>
                    <div class="quote-author">— Cory House</div>
                `;
    }
}

// Ініціалізація
updateTime();
setInterval(updateTime, 60000);
loadQuote();




// Confetti функція
function launchConfetti() {
    // Перший залп з центру
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Через трошки - з лівого кута
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
    }, 200);

    // І з правого кута
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 400);

    // Фінальний великий бум!
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#ffd93d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
        });
    }, 600);
}