require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.MODEL;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/analyze', async (req, res) => {
	const { code } = req.body;

	try {
		const response = await openai.chat.completions.create({
			model: model,
			messages: [
				{
					role: 'system',
					content: `You are an expert developer following clean code and best practices. Given a piece of code, return an array of suggestions (3 or more) in JSON format. Make sure to only suggest changes that are definitely not already implemented in the code.

Each suggestion must be an object with:
- "title": A concise summary of the issue
- "details": A detailed explanation of the problem
- "fix": A suggestion for how to fix or improve the code
- "example_fix": A short CODE snippet showing the suggested fix (only code with optional comments as a string, properly escaped if needed)

Respond ONLY with the JSON array, without markdown formatting or code fences.`
				},
				{
					role: 'user',
					content: `Analyze this code and return suggestions:\n\n${code}`
				}
			],
			temperature: 0.8
		});

		const suggestionsRaw = response.choices[0].message.content.trim();

		console.log(suggestionsRaw);

		const suggestions = JSON.parse(suggestionsRaw);
		res.json({ suggestions });
	} catch (err) {
		console.error('Failed to parse suggestions:', err);
		res.status(500).json({ error: 'AI response parsing failed.' });
	}
});

app.post('/apply-fix', async (req, res) => {
	const { originalCode, suggestion } = req.body;

	try {
		const response = await openai.chat.completions.create({
			model: model,
			messages: [
				{
					role: 'system',
					content: `You are an expert programmer. Implement the suggested changes in the code.
- Do not reformat or rewrite unrelated parts of the code
- Only change the lines that are required to implement the suggestion
- Respond with the the whole code and not just the changed part. as a plain string, without markdown formatting or code fences`
				},
				{
					role: 'user',
					content: `Code:\n${originalCode}\n\nSuggestion:\n${JSON.stringify(
						suggestion
					)}`
				}
			],
			temperature: 0.2
		});

		const updatedCode = response.choices[0].message.content.trim();
		res.json({ updatedCode });
	} catch (err) {
		console.error('Error applying fix:', err);
		res.status(500).json({ error: 'Failed to apply suggestion.' });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
