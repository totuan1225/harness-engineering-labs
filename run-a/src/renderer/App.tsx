import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppStatus, Document, QAResponse } from '../shared/types';
import { DocumentList } from './components/DocumentList';
import { QuestionPanel } from './components/QuestionPanel';
import { DocumentDetail } from './components/DocumentDetail';
import { StatusBar } from './components/StatusBar';

export function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [status, setStatus] = useState<AppStatus>({ documentsLoaded: 0, indexStatus: 'idle', lastActivity: '' });
  const [response, setResponse] = useState<QAResponse | null>(null);
  const [question, setQuestion] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const [docs, nextStatus] = await Promise.all([window.knowledgeBase.documents.list(), window.knowledgeBase.indexing.status()]);
      setDocuments(docs);
      setStatus(nextStatus);
      setSelectedDoc(current => current ? docs.find(doc => doc.id === current.id) ?? null : null);
    } catch { setError('Could not load your library. Please try refreshing.'); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  const filteredDocs = useMemo(() => documents.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase())), [documents, query]);
  const importDocuments = async () => {
    setError('');
    try {
      const added = await window.knowledgeBase.documents.pick();
      if (added.length) { setSelectedDoc(added[0]); await refresh(); }
    } catch (err) { setError(err instanceof Error ? err.message : 'Import failed.'); }
  };
  const ask = async (value: string) => {
    setBusy(true); setError(''); setQuestion(value);
    try { setResponse(await window.knowledgeBase.qa.ask(value)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not answer that question.'); }
    finally { setBusy(false); }
  };
  const startIndexing = async () => {
    if (!selectedDoc) return;
    setBusy(true);
    try { await window.knowledgeBase.indexing.start(selectedDoc.id); await refresh(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Indexing failed.'); }
    finally { setBusy(false); }
  };
  const removeDocument = async () => {
    if (!selectedDoc) return;
    try { await window.knowledgeBase.documents.delete(selectedDoc.id); setSelectedDoc(null); await refresh(); }
    catch { setError('Could not remove this document.'); }
  };

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Papertrail home"><span className="brand-mark">p</span><span>papertrail</span></a>
      <div className="topbar-center"><span className="workspace-dot" /> Personal library <span className="topbar-chevron">⌄</span></div>
      <button className="avatar" title="Your workspace">T</button>
    </header>
    <div className="workspace">
      <aside className="sidebar">
        <div className="sidebar-heading"><div><div className="eyebrow">YOUR SPACE</div><h2>Library <span>{documents.length}</span></h2></div><button className="icon-button" onClick={() => void refresh()} title="Refresh library">↻</button></div>
        <label className="search-box"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a document" /><kbd>⌘ K</kbd></label>
        <button className="add-document" onClick={() => void importDocuments()}><span>＋</span> Add documents <span className="shortcut">⌘ O</span></button>
        <div className="list-label">DOCUMENTS <span>{filteredDocs.length}</span></div>
        <DocumentList documents={filteredDocs} onSelect={setSelectedDoc} selectedId={selectedDoc?.id ?? null} />
        <div className="sidebar-bottom"><div className="privacy-icon">◈</div><div><strong>Your documents stay yours</strong><span>Stored locally on this device</span></div></div>
      </aside>
      <section className="main-area">
        <div className="content-scroll">
          <div className="page-wrap">
            {error && <div className="error-banner" role="alert">{error}<button onClick={() => setError('')}>Dismiss</button></div>}
            {selectedDoc ? <DocumentDetail document={selectedDoc} onIndex={startIndexing} onDelete={removeDocument} busy={busy} /> : <>
              <div className="welcome-label"><span className="welcome-spark">✳</span> YOUR PERSONAL RESEARCH SPACE</div>
              <h1>A little more clarity,<br />one document at a time.</h1>
              <p className="welcome-copy">Bring your notes and reading together. Ask a question and get an answer grounded in your own documents.</p>
              <button className="primary-button welcome-add" onClick={() => void importDocuments()}>＋ &nbsp; Add your first document</button>
              <div className="feature-row"><div><span className="feature-icon lilac">▤</span><strong>Keep it together</strong><p>Your notes and reading, in one quiet space.</p></div><div><span className="feature-icon peach">✳</span><strong>Ask your library</strong><p>Get useful answers from what you’ve saved.</p></div><div><span className="feature-icon mint">⌁</span><strong>See the source</strong><p>Every answer points back to its context.</p></div></div>
              {documents.length > 0 && <div className="recent-section"><div className="section-title"><span>Pick up where you left off</span><span>{documents.length} saved</span></div><DocumentList documents={documents.slice(0, 4)} onSelect={setSelectedDoc} selectedId={null} compact />
                {!response && <div className="starter-questions"><span>TRY ASKING</span><button onClick={() => void ask('What are the main ideas in my documents?')}>What are the main ideas in my documents? <b>↗</b></button><button onClick={() => void ask('Summarize my latest notes')}>Summarize my latest notes <b>↗</b></button></div>}
              </div>}
            </>}
            {response && <section className="answer-card"><div className="answer-head"><div className="answer-icon">✳</div><div><span>ANSWER</span><p>{question}</p></div><button className="icon-button" onClick={() => setResponse(null)} title="Close answer">×</button></div><div className="answer-body">{response.answer}</div><div className="answer-meta">{response.citations.length > 0 ? <><span className="source-count">{response.citations.length} SOURCES</span>{response.citations.map((c, i) => <button key={`${c.documentId}-${i}`} className="source-chip" onClick={() => setSelectedDoc(documents.find(doc => doc.id === c.documentId) ?? null)}><span>▤</span>{c.documentTitle}<span className="source-page">Section {c.chunkIndex + 1}</span></button>)}</> : <span className="no-sources">No matching sources found</span>}</div></section>}
          </div>
        </div>
        <QuestionPanel onAsk={ask} busy={busy} hasDocuments={documents.length > 0} />
        <StatusBar status={status} />
      </section>
    </div>
  </main>;
}
