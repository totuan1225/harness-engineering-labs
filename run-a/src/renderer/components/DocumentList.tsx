import React from 'react';
import { Document } from '../../shared/types';

interface Props { documents: Document[]; onSelect: (doc: Document) => void; selectedId: string | null; compact?: boolean; }
const icon = (name: string) => name.toLowerCase().endsWith('.md') ? 'M' : 'T';
export function DocumentList({ documents, onSelect, selectedId, compact = false }: Props) {
  if (!documents.length) return <div className="empty-list">{compact ? 'No documents yet.' : <>Nothing here yet.<br /><span>Add a document to begin.</span></>}</div>;
  return <div className={compact ? 'document-list compact-list' : 'document-list'}>{documents.map(doc => <button key={doc.id} className={`document-row ${selectedId === doc.id ? 'selected' : ''}`} onClick={() => onSelect(doc)}><span className={`file-icon ${icon(doc.filename) === 'M' ? 'markdown' : ''}`}>{icon(doc.filename)}</span><span className="document-row-copy"><strong>{doc.title}</strong><span>{doc.status === 'indexed' ? 'Ready to ask' : doc.status === 'error' ? 'Needs attention' : 'Not indexed'} · {(doc.size / 1024).toFixed(0)} KB</span></span><span className={`doc-state ${doc.status}`} title={doc.status}>{doc.status === 'indexed' ? '✓' : '·'}</span></button>)}</div>;
}
