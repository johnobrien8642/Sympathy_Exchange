import DOMPurify from 'dompurify';
import React from 'react';

const QuotePostInput = ({
  post, 
  quote, 
  setQuote,
  source, 
  setSource
}) => {

  return (
    <div
      className='quoteAndSourceInputContainer'
    >
      <div
        className='quoteInputContainer'
      >
        <span
          data-placeholder='"Quote"'
          data-quote={'"'}
          className={quote ? 'quoteInput active' : 'quoteInput placeholder'}
          contentEditable='true'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post ? post.quote : '')
          }}
          onInput={e => {
            setQuote(quote = e.target.textContent)
          }}
        ></span>
      </div>

      <div
        className='dashAndSource'
      >
        <span
          className='dash'
        >
          <span>-</span>
        </span>
        <span
          data-placeholder='Source'
          className={source ? 'sourceInput' : 'sourceInput placeholder'}
          contentEditable='true'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post ? post.source : '')
          }}
          onInput={e => {
            setSource(source = e.target.textContent)
          }}
        ></span>
      </div>
    </div>
  )
}

export default QuotePostInput;