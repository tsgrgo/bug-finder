const editor = CodeMirror(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'javascript',
	theme: 'default'
});

function createSuggestionCard({ title, details, fix }) {
	const card = document.createElement('div');
	card.className = 'card';

	const header = document.createElement('div');
	header.className = 'card-header';
	header.textContent = title;

	const content = document.createElement('div');
	content.className = 'card-content';
	content.innerHTML = `
	  <strong>Details:</strong><br>${details}<br><br>
	  <strong>Possible Fix:</strong><br>${fix}
	`;

	header.addEventListener('click', () => {
		content.classList.toggle('show');
	});

	card.appendChild(header);
	card.appendChild(content);
	return card;
}

document.getElementById('analyzeBtn').addEventListener('click', async () => {
	const code = editor.getValue();
	const suggestionsContainer = document.getElementById('suggestions');
	suggestionsContainer.innerHTML = 'Analyzing...';

	const response = await fetch('/analyze', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code })
	});

	const { suggestions } = await response.json();

	suggestionsContainer.innerHTML = '';
	suggestions.forEach(suggestion => {
		suggestionsContainer.appendChild(createSuggestionCard(suggestion));
	});
});
