import { OpenAI } from 'openai';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_TOKEN });

const sys = fs.readFileSync('sys.txt', 'utf8');

async function query(prompt) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: sys,
      },
      { role: 'user', content: prompt },
    ],
  });
  return response;
}

let transcript = fs.readFileSync('transcripts/-9FWBaWah28.txt', 'utf-8');

// divide the transcript up into sentences
let sentences = transcript.split(/[.!?]/g);

let jsonl = '';
for (let i = 0; i < sentences.length; i++) {
  let result = await query(sentences[i]);
  console.log(sentences[i]);
  console.log(result.choices[0].message.content);
  jsonl += result.choices[0].message.content;
  jsonl += '\n';
}

fs.writeFileSync('output.jsonl', jsonl);
