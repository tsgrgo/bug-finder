const editor = CodeMirror(document.getElementById('editor'), {
	lineNumbers: true,
	mode: 'javascript',
	theme: 'default'
});

document.getElementById('analyzeBtn').addEventListener('click', async () => {
	const code = editor.getValue();

	const response = await fetch('/analyze', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code })
	});

	const data = await response.json();
	document.getElementById('suggestions').textContent =
		data.suggestions || 'No suggestions found.';
});
