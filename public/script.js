const editor = CodeMirror(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'javascript',
	theme: 'default'
});

function createSuggestionCard(suggestion) {
	const { title, details, fix, example_fix } = suggestion;

	const card = document.createElement('div');
	card.className = 'card';

	const header = document.createElement('div');
	header.className = 'card-header';
	header.textContent = title;

	const content = document.createElement('div');
	content.className = 'card-content';

	const pre = document.createElement('pre');
	const code = document.createElement('code');
	code.className = 'language-javascript';
	code.textContent = example_fix;

	const copyBtn = document.createElement('button');
	copyBtn.className = 'copy-btn';
	copyBtn.textContent = '📋';
	copyBtn.title = 'Copy to clipboard';
	copyBtn.addEventListener('click', () => {
		navigator.clipboard.writeText(example_fix);
		copyBtn.textContent = '✅';
		setTimeout(() => (copyBtn.textContent = '📋'), 1500);
	});

	pre.appendChild(copyBtn);
	pre.appendChild(code);

	const applyBtn = document.createElement('button');
	applyBtn.className = 'apply-btn';
	applyBtn.textContent = 'Apply Suggestion';
	applyBtn.addEventListener('click', async () => {
		const originalCode = editor.getValue();

		applyBtn.disabled = true;
		applyBtn.textContent = 'Applying...';

		const res = await fetch('/apply-fix', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ originalCode, suggestion })
		});

		const data = await res.json();
		if (data.updatedCode) {
			const parsedCode = JSON.parse(JSON.stringify(data.updatedCode));
			editor.setValue(parsedCode);
		}

		applyBtn.textContent = 'Applied ✅';
	});

	content.innerHTML = `
	  <strong>Details:</strong><br>${details}<br><br>
	  <strong>Fix:</strong><br>${fix}<br><br>
	  <strong>Example Fix:</strong>
	`;
	content.appendChild(pre);
	content.appendChild(applyBtn);

	header.addEventListener('click', () => {
		content.classList.toggle('show');
		Prism.highlightElement(code);
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
