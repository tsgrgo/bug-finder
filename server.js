require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/analyze', async (req, res) => {
	const { code } = req.body;

	try {
		const response = await openai.chat.completions.create({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					role: 'system',
					content:
						'You are an expert developer that helps find bugs and suggest improvements in user-submitted code.'
				},
				{
					role: 'user',
					content: `Analyze this code for bugs and suggest improvements:\n\n${code}`
				}
			],
			temperature: 0.2
		});

		const suggestions = response.choices[0].message.content;
		res.json({ suggestions });
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
