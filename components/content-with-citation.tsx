import React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ExternalLink } from "lucide-react"

function CitationButton({ 
    number, 
    source, 
    onClick 
  }: { 
    number: number
    source?: { url: string; title?: string }
    onClick?: () => void 
  }) {
    const handleClick = () => {
      if (source?.url) {
        window.open(source.url, '_blank', 'noopener,noreferrer')
      }
      onClick?.()
    }
  
  
    const getWebsiteInfo = (url: string) => {
      try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname
        const websiteName = domain.replace('www.', '').split('.')[0]
        const capitalizedName = websiteName.charAt(0).toUpperCase() + websiteName.slice(1)
        return {
          domain,
          name: capitalizedName,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
        }
      } catch {
        return {
          domain: url,
          name: 'Unknown Source',
          favicon: null
        }
      }
    }
  
    const websiteInfo = source?.url ? getWebsiteInfo(source.url) : null
    if (!source?.url) {
  
      return (
        <sup>
          <button
            onClick={handleClick}
            className="inline-flex items-center justify-center w-4 h-4 mx-0.5 text-[0.6rem] font-mono text-white dark:text-gray-900 bg-gray-800 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border rounded transition-colors duration-200 cursor-pointer"
            title={`Source ${number}`}
          >
            {number}
          </button>
        </sup>
      )
    }
  
    return (
      <sup>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button
              onClick={handleClick}
              className="inline-flex items-center justify-center w-4 h-4 mx-0.5 text-[0.6rem] font-mono text-white dark:text-gray-900 bg-gray-800 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 border rounded transition-colors duration-200 cursor-pointer"
              title={source?.title || source?.url || `Source ${number}`}
            >
              {number}
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 p-3" side="top">
            <div className="flex items-center space-x-3">
              {websiteInfo?.favicon && (
                <img 
                  src={websiteInfo.favicon} 
                  alt={`${websiteInfo.name} favicon`}
                  className="w-4 h-4 flex-shrink-0"
                  onError={(e) => {
  
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {source.title || websiteInfo?.name || 'Source'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {websiteInfo?.domain}
                </p>
              </div>
              <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </div>
          </HoverCardContent>
        </HoverCard>
      </sup>
    )
  }

  const parseTextWithCitations = (text: string, sources: Array<{ url: string; title?: string }>) => {
    const citationRegex = /\[(\d+)\]/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = citationRegex.exec(text)) !== null) {

      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index)
        if (beforeText) {
          parts.push(beforeText)
        }
      }


      const citationNumber = parseInt(match[1])
      const source = sources[citationNumber - 1]
      parts.push(
        <CitationButton
          key={`citation-${match.index}-${citationNumber}`}
          number={citationNumber}
          source={source}
        />
      )

      lastIndex = match.index + match[0].length
    }


    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText) {
        parts.push(remainingText)
      }
    }

    return parts.length > 1 ? parts : text
  }

  const processChildrenForCitations = (children: React.ReactNode, sources: Array<{ url: string; title?: string }>): React.ReactNode => {
    return React.Children.map(children, (child, index) => {
      if (typeof child === 'string') {
        // Only process citations if there are actual citation patterns
        if (/\[\d+\]/.test(child)) {
          const result = parseTextWithCitations(child, sources)
          // If result is an array, wrap in a fragment to avoid key issues
          if (Array.isArray(result)) {
            return <React.Fragment key={index}>{result}</React.Fragment>
          }
          return result
        }
        return child
      } else if (React.isValidElement(child)) {
        // Only process children if they exist and the element supports them
        if (child.props && child.props.children !== undefined) {
          return React.cloneElement(child, {
            ...child.props,
            key: child.key || index,
            children: processChildrenForCitations(child.props.children, sources)
          })
        }
      }
      return child
    })
  }
  
  
  export default function ContentWithCitations({ 
    content, 
    sources = [] 
  }: { 
    content: string
    sources?: Array<{ url: string; title?: string }>
  }) {
    const components = {
      p: ({ children }: { children: React.ReactNode }) => {
        return <p className="mb-4 leading-relaxed">{processChildrenForCitations(children, sources)}</p>
      },
      td: ({ children }: { children: React.ReactNode }) => {
        return <td>{processChildrenForCitations(children, sources)}</td>
      },
      th: ({ children }: { children: React.ReactNode }) => {
        return <th>{processChildrenForCitations(children, sources)}</th>
      },
      strong: ({ children }: { children: React.ReactNode }) => {
        return <strong className="font-semibold">{processChildrenForCitations(children, sources)}</strong>
      },
      em: ({ children }: { children: React.ReactNode }) => {
        return <em className="italic">{processChildrenForCitations(children, sources)}</em>
      },
      li: ({ children }: { children: React.ReactNode }) => {
        return <li className="mb-1 ml-4">{processChildrenForCitations(children, sources)}</li>
      },
      ul: ({ children }: { children: React.ReactNode }) => {
        return <ul className="mb-4 ml-4 list-disc space-y-1">{children}</ul>
      },
      ol: ({ children }: { children: React.ReactNode }) => {
        return <ol className="mb-4 ml-4 list-decimal space-y-1">{children}</ol>
      },
      h1: ({ children }: { children: React.ReactNode }) => {
        return <h1 className="text-3xl font-bold mb-6 mt-8">{processChildrenForCitations(children, sources)}</h1>
      },
      h2: ({ children }: { children: React.ReactNode }) => {
        return <h2 className="text-2xl font-bold mb-4 mt-6">{processChildrenForCitations(children, sources)}</h2>
      },
      h3: ({ children }: { children: React.ReactNode }) => {
        return <h3 className="text-xl font-semibold mb-3 mt-5">{processChildrenForCitations(children, sources)}</h3>
      },
      h4: ({ children }: { children: React.ReactNode }) => {
        return <h4 className="text-lg font-semibold mb-2 mt-4">{processChildrenForCitations(children, sources)}</h4>
      },
      h5: ({ children }: { children: React.ReactNode }) => {
        return <h5 className="text-base font-semibold mb-2 mt-3">{processChildrenForCitations(children, sources)}</h5>
      },
      h6: ({ children }: { children: React.ReactNode }) => {
        return <h6 className="text-sm font-semibold mb-2 mt-3">{processChildrenForCitations(children, sources)}</h6>
      },
      hr: () => {
        return <hr className="my-8 border-gray-300 dark:border-gray-600" />
      },
      blockquote: ({ children }: { children: React.ReactNode }) => {
        return <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic">{children}</blockquote>
      },
      code: ({ children, className }: { children: React.ReactNode; className?: string }) => {
        const isBlock = className?.includes('language-')
        if (isBlock) {
          return <code className={`block bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm font-mono mb-4 ${className || ''}`}>{children}</code>
        }
        return <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">{children}</code>
      },
      pre: ({ children }: { children: React.ReactNode }) => {
        return <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm font-mono mb-4">{children}</pre>
      }
    }
  
    return (
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    )
  }