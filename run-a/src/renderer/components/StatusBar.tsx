import React from 'react';
import { AppStatus } from '../../shared/types';
export function StatusBar({ status }: { status: AppStatus }) {
  return <footer className="status-bar"><span className={`status-dot ${status.indexStatus}`} />{status.indexStatus === 'ready' ? 'Library ready' : status.indexStatus === 'indexing' ? 'Preparing documents' : 'All changes saved'}<span className="status-divider">·</span>{status.documentsLoaded} {status.documentsLoaded === 1 ? 'document' : 'documents'}<span className="status-spacer" /><span className="local-lock">◈</span> Private & local</footer>;
}
