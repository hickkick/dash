
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

    container.innerHTML = projects.map((project, idx) => `
    <div class="project-item" data-index="${idx}">
      <div class="project-header">
        <div class="project-header-content">
          <div class="project-title-row">
            <h3 class="project-name">${project.name}</h3>
            <span class="project-status ${project.status}">${getStatusIcon(project.status)}</span>
          </div>
          <p class="project-description">${project.description}</p>
        </div>
        <span class="arrow">▼</span>
      </div>
      
      <div class="project-content">
        <div class="project-tech">
          ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        
        <div class="project-links">
          <a href="${project.github}" target="_blank" rel="noopener">GitHub →</a>
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener">Live Demo →</a>` : ''}
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