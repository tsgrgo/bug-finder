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
					content: `You are an expert developer. Given a piece of code, return an array of issues in JSON format.
		  
		  Each issue must be an object with:
		  - "title": A concise summary of the issue
		  - "details": A detailed explanation of the problem
		  - "fix": A suggestion for how to fix or improve it
		  - "example_fix": A short code snippet showing the suggested fix (as a string, properly escaped if needed)
		  
		  Respond ONLY with the JSON array.`
				},
				{
					role: 'user',
					content: `Analyze this code and return suggestions:\n\n${code}`
				}
			],
			temperature: 0.2
		});

		const suggestionsRaw = response.choices[0].message.content.trim();
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
					content: `You are an expert programmer. Given some code and a suggestion, apply the suggestion and return only the modified code (as a string, properly escaped if needed, with NO markdown formatting or code fences).`
				},
				{
					role: 'user',
					content: `Original code:\n${originalCode}\n\nSuggestion:\n${JSON.stringify(
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
