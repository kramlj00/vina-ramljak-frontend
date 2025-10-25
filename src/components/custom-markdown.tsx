import ReactMarkdown from 'react-markdown';

import remarkGfm from 'remark-gfm';

interface CustomMarkdownProps {
  content: string;
}

const CustomMarkdown = ({ content }: CustomMarkdownProps) => {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1({ children }) {
            return (
              <h1 className="text-heading-sm mb-4 font-semibold [&:not(:first-child)]:mt-8">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="mb-3 text-xl font-semibold [&:not(:first-child)]:mt-6 mb-4">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mb-2 text-lg font-medium [&:not(:first-child)]:mt-5 mb-4">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 className="mb-4 text-base font-medium [&:not(:first-child)]:mt-4">
                {children}
              </h4>
            );
          },
          a({ children, ...props }) {
            return (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-100 underline hover:no-underline">
                {children}
              </a>
            );
          },
          p({ children }) {
            return (
              <p className="whitespace-pre-line [&:not(:first-child)]:mt-[10px] mb-4">
                {children}
              </p>
            );
          },
        }}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default CustomMarkdown;
