const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const parseGeminiResponse = (text) => {
  const questions = [];
  const lines = text.split('\n').filter((line) => line.trim());

  let currentQuestion = null;
  let currentAnswer = [];

  for (const line of lines) {
    const qMatch = line.match(/^\d+\.\s*(.+)/) || line.match(/^Q\d*[:\s]+(.+)/i) || line.match(/^\*\*Q[^:]*:\*\*\s*(.+)/);
    const aMatch = line.match(/^[Aa]nswer[:\s]+(.+)/i) || line.match(/^\*\*[Aa]nswer[:\s]*\*\*\s*(.+)/);

    if (qMatch) {
      if (currentQuestion) {
        questions.push({
          question: currentQuestion,
          answer: currentAnswer.join(' ').trim() || 'No answer provided.',
          isPinned: false,
        });
      }
      currentQuestion = qMatch[1].trim();
      currentAnswer = [];
    } else if (aMatch && currentQuestion) {
      currentAnswer.push(aMatch[1].trim());
    } else if (currentQuestion && line.trim() && !line.match(/^[-*=#]/)) {
      currentAnswer.push(line.trim());
    }
  }

  if (currentQuestion) {
    questions.push({
      question: currentQuestion,
      answer: currentAnswer.join(' ').trim() || 'No answer provided.',
      isPinned: false,
    });
  }

  if (questions.length === 0) {
    questions.push({
      question: 'Could not parse questions. Please try again.',
      answer: 'The AI response could not be parsed. Please regenerate.',
      isPinned: false,
    });
  }

  return questions;
};

const generateFallbackQuestions = (role, experience) => {
  return [
    { question: `What experience do you have with ${role}?`, answer: `As a ${experience} professional, focus on highlighting your relevant experience and key achievements.`, isPinned: false },
    { question: `Describe a challenging project in your ${role} career.`, answer: `Use the STAR method: Situation, Task, Action, Result. Be specific about your contributions.`, isPinned: false },
    { question: `How do you stay updated with industry trends in ${role}?`, answer: `Mention courses, blogs, conferences, or communities you follow. Show continuous learning.`, isPinned: false },
    { question: `What are your strengths for a ${role} position?`, answer: `Align your strengths with the role requirements. Provide concrete examples.`, isPinned: false },
    { question: `Where do you see yourself in 5 years?`, answer: `Connect your goals with the company's growth and the role's career path.`, isPinned: false },
  ];
};

exports.generateInterviewQuestions = async (role, experience) => {
  if (!process.env.GEMINI_API_KEY) {
    return generateFallbackQuestions(role, experience);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate exactly 5 interview questions and suggested answers for a candidate applying for a ${role} position with ${experience} level experience.

Format each question and answer clearly like this:
1. [Question text]
Answer: [Suggested answer or key points]

2. [Question text]
Answer: [Suggested answer or key points]

Continue for all 5 questions. Make questions specific to ${role} and appropriate for ${experience} experience level.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const questions = parseGeminiResponse(text);
    return questions.length >= 3 ? questions.slice(0, 5) : generateFallbackQuestions(role, experience);
  } catch (error) {
    console.error('Gemini API error:', error.message);
    return generateFallbackQuestions(role, experience);
  }
};
