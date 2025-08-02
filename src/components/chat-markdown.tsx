"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ChatMarkdownProps = {
  children: string;
};

/**
 * ChatMarkdown
 * A focused markdown renderer used in chat messages.
 * - Supports GFM (tables, strikethrough, task lists)
 * - Syntax highlighting via rehype-highlight
 * - Maps table elements to shadcn/ui table components
 */
export function ChatMarkdown({ children }: ChatMarkdownProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[RehypeHighlight as any]}
        components={{
          table: ({ children, ...props }) => (
            <Table className="my-4" {...props}>
              {children}
            </Table>
          ),
          thead: ({ children, ...props }) => (
            <TableHeader {...props}>{children}</TableHeader>
          ),
          tbody: ({ children, ...props }) => (
            <TableBody {...props}>{children}</TableBody>
          ),
          tr: ({ children, ...props }) => (
            <TableRow {...props}>{children}</TableRow>
          ),
          th: ({ children, ...props }) => (
            <TableHead {...props}>{children}</TableHead>
          ),
          td: ({ children, ...props }) => (
            <TableCell {...props}>{children}</TableCell>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}