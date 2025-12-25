// Мінімальні доповнення до GitHub даних
const projectMeta = {
    'dumpling': {
        tech: ['Ruby', 'Roda', 'PostgreSQL', 'Telegram API'],
        status: 'archived',
        featured: false
    },
    'w_new': {
        tech: ['Sinatra', 'Ruby', 'PostgreSQL', 'SQlite3', 'Spotify API'],
        status: 'live',
        featured: true
    }
};

exports.handler = async () => {
    try {
        const repos = Object.keys(projectMeta);

        const githubData = await Promise.all(
            repos.map(repo =>
                fetch(`https://api.github.com/repos/hickkick/${repo}`)
                    .then(r => r.json())
            )
        );

        const projects = githubData.map(gh => {
            const meta = projectMeta[gh.name] || {};

            return {
                name: gh.name,
                description: gh.description || 'No description',
                // Використовуємо topics з GitHub, якщо є, інакше fallback
                tech: (gh.topics && gh.topics.length > 0)
                    ? gh.topics.map(t => t.charAt(0).toUpperCase() + t.slice(1)) // capitalize
                    : meta.tech || [gh.language],
                status: meta.status || 'archived',
                featured: meta.featured || false,
                github: gh.html_url,
                demo: gh.homepage || null,
                created: gh.created_at,
                updated: gh.updated_at,
                language: gh.language || 'Unknown'
            };
        });

        projects.sort((a, b) => b.featured - a.featured);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projects)
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch projects' })
        };
    }
};