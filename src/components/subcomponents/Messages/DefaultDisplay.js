import React from 'react'
import '../../../styles/subcomponents/DefaultDisplay.css'
import NoneIcon from '@material-ui/icons/FilterNone'

function DefaultDisplay() {
  return (
    <div id='div_defaultdisplay'>
        <NoneIcon style={{fontSize: "100px", color: "grey"}}/>
        <p id='p_default_label'>Select a Conversation</p>
    </div>
  )
}

export default DefaultDisplay