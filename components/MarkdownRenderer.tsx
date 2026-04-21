'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-slate max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override heading styles to match our theme
          h1: ({ children }) => (
            <h1 className="text-2xl font-serif text-white mb-4 mt-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-serif text-white mb-3 mt-5">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-serif text-white mb-2 mt-4">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-serif text-slate-200 mb-2 mt-3">{children}</h4>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="text-slate-300 leading-relaxed mb-3 last:mb-0">{children}</p>
          ),
          // Bold text
          strong: ({ children }) => (
            <strong className="text-cyan-400 font-semibold">{children}</strong>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 mb-3 text-slate-300">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-3 text-slate-300">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-amber-500/40 pl-4 my-3 italic text-slate-400">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="border-slate-700 my-6" />
          ),
          // Code inline
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <pre className="bg-slate-800/50 rounded-lg p-4 overflow-x-auto my-4">
                <code className="text-slate-300 text-sm font-mono">{children}</code>
              </pre>
            );
          },
          // Links
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm text-left text-slate-300 border border-slate-700 rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-800 text-slate-200 uppercase text-xs">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 border-b border-slate-700 font-medium">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 border-b border-slate-800">{children}</td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-slate-800/50 transition-colors">{children}</tr>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
