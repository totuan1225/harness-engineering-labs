import React, { useState } from 'react';
interface Props { onAsk: (question: string) => void; busy: boolean; hasDocuments: boolean; }
export function QuestionPanel({ onAsk, busy, hasDocuments }: Props) {
  const [question, setQuestion] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (!question.trim() || busy) return; onAsk(question.trim()); setQuestion(''); };
  return <form className="question-dock" onSubmit={submit}><div className="question-box"><span className="question-spark">✳</span><input value={question} onChange={e => setQuestion(e.target.value)} placeholder={hasDocuments ? 'Ask anything about your documents…' : 'Add a document to start asking'} disabled={busy || !hasDocuments} aria-label="Ask a question about your documents" /><button className="send-button" type="submit" disabled={busy || !question.trim() || !hasDocuments} aria-label="Send question">{busy ? '…' : '↑'}</button></div><div className="dock-note">Answers are based on your library <span>·</span> Sources included</div></form>;
}
