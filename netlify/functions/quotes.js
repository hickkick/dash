const quotes = [
    // Ruby legends
    {
        quote: "Make it work, make it right, make it fast.",
        author: "Kent Beck"
    },
    {
        quote: "Often people, especially computer engineers, focus on the machines. But in fact we need to focus on humans.",
        author: "Yukihiro Matsumoto (Matz)"
    },
    {
        quote: "Ruby is designed to make programmers happy.",
        author: "Yukihiro Matsumoto (Matz)"
    },
    {
        quote: "Programmers are not to be measured by their ingenuity and their logic but by the completeness of their case analysis.",
        author: "Alan Perlis"
    },
    {
        quote: "The best error message is the one that never shows up.",
        author: "Thomas Fuchs"
    },
    {
        quote: "Convention over configuration.",
        author: "David Heinemeier Hansson (DHH)"
    },
    {
        quote: "Optimize for programmer happiness.",
        author: "David Heinemeier Hansson (DHH)"
    },
    {
        quote: "No one in the brief history of computing has ever written a piece of perfect software. It's unlikely that you'll be the first.",
        author: "Andy Hunt"
    },
    {
        quote: "Good code is its own best documentation.",
        author: "Steve McConnell"
    },
    {
        quote: "Code never lies, comments sometimes do.",
        author: "Ron Jeffries"
    },
    {
        quote: "Duplication is far cheaper than the wrong abstraction.",
        author: "Sandi Metz"
    },
    {
        quote: "The art of programming is the art of organizing complexity.",
        author: "Edsger W. Dijkstra"
    },
    // Humor about code
    {
        quote: "Code is like humor. When you have to explain it, it's bad.",
        author: "Cory House"
    },
    {
        quote: "There are only two hard things in Computer Science: cache invalidation and naming things.",
        author: "Phil Karlton"
    },
    {
        quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        author: "Martin Fowler"
    },
    {
        quote: "Programming is the art of telling another human what one wants the computer to do.",
        author: "Donald Knuth"
    },
    {
        quote: "First, solve the problem. Then, write the code.",
        author: "John Johnson"
    },
    {
        quote: "Debugging is twice as hard as writing the code in the first place.",
        author: "Brian Kernighan"
    }
];

exports.handler = async (event, context) => {
    try {
        // Quotable.io - безкоштовне API, без CORS проблем
        const response = await fetch('https://api.quotable.io/random?tags=technology,famous-quotes');
        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quote: data.content,
                author: data.author
            })
        };
    } catch (error) {
        // Fallback якщо API не працює
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quotes[Math.floor(Math.random() * quotes.length)])
        };
    }
};