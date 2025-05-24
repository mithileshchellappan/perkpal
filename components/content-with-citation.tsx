import React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from 'remark-gfm';
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
  
  
  export default function ContentWithCitations({ 
    content, 
    sources = [] 
  }: { 
    content: string
    sources?: Array<{ url: string; title?: string }>
  }) {
    const components = {
      p: ({ children }: { children: React.ReactNode }) => {
        const textContent = React.Children.toArray(children).join('')
        
        if (typeof textContent === 'string' && /\[\d+\]/.test(textContent)) {
          return <div>{parseTextWithCitations(textContent)}</div>
        }
        
        return <p>{children}</p>
      },
      td: ({ children }: { children: React.ReactNode }) => {
        const textContent = React.Children.toArray(children).join('')
        
        if (typeof textContent === 'string' && /\[\d+\]/.test(textContent)) {
          return <td>{parseTextWithCitations(textContent)}</td>
        }
        
        return <td>{children}</td>
      },
      th: ({ children }: { children: React.ReactNode }) => {
        const textContent = React.Children.toArray(children).join('')
        
        if (typeof textContent === 'string' && /\[\d+\]/.test(textContent)) {
          return <th>{parseTextWithCitations(textContent)}</th>
        }
        
        return <th>{children}</th>
      }
    }
  
    const parseTextWithCitations = (text: string) => {
      const citationRegex = /\[(\d+)\]/g
      const parts = []
      let lastIndex = 0
      let match
  
      while ((match = citationRegex.exec(text)) !== null) {
  
        if (match.index > lastIndex) {
          const beforeText = text.slice(lastIndex, match.index)
          if (beforeText) {
            parts.push(<span key={`text-${lastIndex}`}>{beforeText}</span>)
          }
        }
  
  
        const citationNumber = parseInt(match[1])
                const source = sources[citationNumber - 1]
        parts.push(
          <CitationButton
            key={`citation-${match.index}`}
            number={citationNumber}
            source={source}
          />
        )
  
        lastIndex = match.index + match[0].length
      }
  
  
      if (lastIndex < text.length) {
        const remainingText = text.slice(lastIndex)
        if (remainingText) {
          parts.push(<span key={`text-${lastIndex}`}>{remainingText}</span>)
        }
      }
  
      return parts.length > 0 ? parts : text
    }
  
    return (
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    )
  }