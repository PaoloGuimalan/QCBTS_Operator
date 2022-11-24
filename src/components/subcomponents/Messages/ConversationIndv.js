import React from 'react'
import "../../../styles/subcomponents/ConversationIndv.css"

function ConversationIndv({convFilter, filterType}) {
  return (
    <div id='div_conversationindv'>
        ConversationIndv: {convFilter} | {filterType}
    </div>
  )
}

export default ConversationIndv