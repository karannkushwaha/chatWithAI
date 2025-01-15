import * as ai from "../services/geminiAI.service.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;
    const result = await ai.generateAIContent(prompt);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
