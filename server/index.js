const express = require("express");
const app = express();
const { Configuration, OpenAIApi } = require("openai");
const CHATGPT_API_KEY = "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";

const configuration = new Configuration({
    apiKey: CHATGPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/:word", async (req, res) => {
    console.log(req.params.word);
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "user",
                content: `Give me 10 english sentences following these rules:
                        1. The sentence must have this word: '${req.params.word}, word '${req.params.word}' must be placed in <b></b> tag, Example: 'I love <b>my parents</b> very much',
                        2. Translate each the sentence to Vietnamese, mush abide by the following structure: [example in english] - [translate in vietnamese]
                        3. No wrap to new line in a sentence
                        Example: 'Drinking water can <b>alleviate</b> hunger. - Uống nước có thể giảm đói.'`,
            },
        ],
    });
    const content = completion.data.choices[0].message.content;
    const examples = content
        .trim()
        .split("\n")
        .map((item, index) => item.split(`${index + 1}. `)[1])
        .map((item) => ({
            en: item.split(" - ")[0],
            vi: item.split(" - ")[1],
        }));
    console.log(examples);
    res.json(examples);
});

app.listen(3000, () => console.log(`Server is running on port is: http://localhost:${3000}/`));
