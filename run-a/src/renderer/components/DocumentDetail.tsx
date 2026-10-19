import React, { useEffect, useState } from 'react';
import { Document, Chunk } from '../../shared/types';

interface Props { document: Document; onIndex: () => void; onDelete: () => void; busy: boolean; }
export function DocumentDetail({ document, onIndex, onDelete, busy }: Props) {
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [showChunks, setShowChunks] = useState(true);
  useEffect(() => { window.knowledgeBase.indexing.chunks(document.id).then(setChunks).catch(() => setChunks([])); }, [document.id]);
  return <article className="document-detail"><div className="breadcrumb">LIBRARY <span>›</span> {document.filename.toUpperCase()}</div><div className="detail-heading"><span className="file-icon large">{document.filename.toLowerCase().endsWith('.md') ? 'M' : 'T'}</span><div className="detail-title"><h1>{document.title}</h1><p>Added {new Date(document.importedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} · {(document.size / 1024).toFixed(1)} KB</p></div><button className="delete-button" onClick={onDelete}>Remove</button></div>
    <div className="detail-summary"><span className={`status-pill ${document.status}`}>{document.status === 'indexed' ? '✓ Indexed' : document.status === 'indexing' ? 'Indexing' : document.status === 'error' ? 'Indexing issue' : 'Not indexed'}</span><span>{chunks.length ? `${chunks.length} searchable sections` : 'Text document'}</span></div>
    {document.status !== 'indexed' && <div className="index-prompt"><div className="index-symbol">✳</div><div><strong>Make this document ready for questions</strong><p>We’ll prepare its sections so you can find answers with sources.</p></div><button className="primary-button" disabled={busy} onClick={onIndex}>{busy ? 'Preparing…' : 'Prepare document'}</button></div>}
    <div className="section-title content-title"><span>DOCUMENT CONTENT</span><button className="text-button" onClick={() => setShowChunks(!showChunks)}>{showChunks ? 'Collapse' : 'Show content'} <span>{showChunks ? '⌃' : '⌄'}</span></button></div>
    {showChunks && (chunks.length ? <div className="chunks">{chunks.map(chunk => <section className="chunk-card" key={chunk.id}><div className="chunk-label">SECTION {String(chunk.index + 1).padStart(2, '0')}</div><p>{chunk.content}</p></section>)}</div> : <div className="content-empty">Prepare this document to see its content here.</div>)}
  </article>;
}
