
// Оновлення часу
function updateTime() {
    const now = new Date();

    // МІЙ час (Prague)
    const myTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Prague'
    });
    document.getElementById('current-time').textContent = myTime;

    // Час КОРИСТУВАЧА (його таймзона)
    const userTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    document.getElementById('user-time').textContent = userTime;

    // Визначаємо таймзону користувача (без дозволу!)
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Форматуємо красиво: "Europe/Kiev" → "Kyiv, Ukraine"
    const formattedTimezone = formatTimezone(userTimezone);
    document.getElementById('user-timezone').textContent = formattedTimezone;
}

// Форматування таймзони
function formatTimezone(timezone) {
    // Якщо таймзона не визначилась
    if (!timezone) return 'Unknown';

    // Розбиваємо "Europe/Kiev" → ["Europe", "Kiev"]
    const parts = timezone.split('/');

    if (parts.length === 1) {
        // Якщо просто "UTC" або щось таке
        return timezone;
    }

    // Беремо останню частину і замінюємо _ на пробіли
    const city = parts[parts.length - 1].replace(/_/g, ' ');
    const region = parts[0];

    // Спеціальні випадки для красивого відображення
    const cityMap = {
        'Kiev': 'Kyiv',
        'Calcutta': 'Kolkata',
        'Saigon': 'Ho Chi Minh City'
    };

    const displayCity = cityMap[city] || city;

    return `${displayCity}`;
}

function updateStatus() {
    const now = new Date();

    // Час в твоїй таймзоні (Prague)
    const pragueTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Prague' }));
    const hour = pragueTime.getHours();

    let status = {
        emoji: '🧠',
        text: 'Learning'
    };

    // Розклад дня
    if (hour >= 2 && hour < 9) {
        status = { emoji: '😴', text: 'Dreaming in Ruby' };
    }
    else if (hour >= 9 && hour < 10) {
        status = { emoji: '☕', text: 'Compiling Coffee' };
    }
    else if (hour >= 10 && hour < 13) {
        status = { emoji: '💻', text: 'Debugging Life' };
    }
    else if (hour >= 13 && hour < 14) {
        status = { emoji: '🍜', text: 'Refueling' };
    }
    else if (hour >= 14 && hour < 18) {
        status = { emoji: '📚', text: 'Learning Mode' };
    }
    else if (hour >= 18 && hour < 20) {
        status = { emoji: '🔥', text: 'Shipping Code' };
    }
    else if (hour >= 20 && hour < 22) {
        status = { emoji: '🎯', text: 'Git Commit Streak' };
    }
    else if (hour >= 22 || hour < 2) {
        status = { emoji: '🦉', text: 'Night Coding' };
    }

    const statusElement = document.getElementById('current-status');
    statusElement.textContent = `${status.emoji} ${status.text}`;
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
updateStatus();
setInterval(updateStatus, 60000);
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


async function loadProjects() {
    try {
        const response = await fetch('/.netlify/functions/projects');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Failed to load projects:', error);
        document.getElementById('projects-list').innerHTML =
            '<div style="color: #999; padding: 2rem;">Failed to load projects.</div>';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

function renderProjects(projects) {
    const container = document.getElementById('projects-list');

    if (!container) {
        console.error('projects-list container not found');
        return;
    }

    container.innerHTML = projects.map((project, idx) => `
    <div class="project-item" data-index="${idx}">
      <div class="project-header">
        <div class="project-header-content">
          <div class="project-title-row">
            <div class="project-title-group">
              <h3 class="project-name">${project.name}</h3>
              <span class="project-status ${project.status}">${getStatusIcon(project.status)}</span>
            </div>
            <div class="arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          <p class="project-description">${project.description}</p>
        </div>
      </div>
      
      <div class="project-content">
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        
        <div class="project-links">
          <a href="${project.github}" target="_blank" rel="noopener">
            GitHub
          </a>
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener">
            Live Demo
          </a>` : ''}
        </div>
        
        <div class="project-meta">
          <span>Updated ${formatDate(project.updated)}</span>
        </div>
      </div>
    </div>
  `).join('');

    // Акордеон
    document.querySelectorAll('.project-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const wasActive = item.classList.contains('active');

            // Закрити всі
            document.querySelectorAll('.project-item').forEach(p => p.classList.remove('active'));

            // Відкрити поточний (якщо не був активний)
            if (!wasActive) item.classList.add('active');
        });
    });
}

function getStatusIcon(status) {
    const icons = {
        live: '🟢 Live',
        progress: '🟡 In Progress',
        archived: '🔴 Archived'
    };
    return icons[status] || '⚪ Unknown';
}

loadProjects()