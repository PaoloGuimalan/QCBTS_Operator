import React from 'react'
import '../../../styles/subcomponents/NewMessage.css'

function NewMessage({convFilter, filterType}) {
  return (
    <div>
        NewMessage: {convFilter} | {filterType}
    </div>
  )
}

export default NewMessage