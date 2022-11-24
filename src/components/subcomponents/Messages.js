import React, { useState, useEffect } from 'react'
import "../../styles/subcomponents/Messages.css"
import NewMessageIcon from '@material-ui/icons/AddComment'
import MessagesIcon from '@material-ui/icons/Message'
import SearchIcon from '@material-ui/icons/Search'
import RecentsIcon from '@material-ui/icons/History'
import DriverIcon from '@material-ui/icons/DirectionsBus'
import SystemAdminIcon from '@material-ui/icons/SupervisorAccount'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ConversationList from './Messages/ConversationList'
import ConversationIndv from './Messages/ConversationIndv'
import DefaultDisplay from './Messages/DefaultDisplay'
import NewMessage from './Messages/NewMessage'
import DefaultImg from '../../resources/imgs/defaultimg.png'

function Messages() {

  const [conversationFilter, setconversationFilter] = useState("Recents");

  const navigate = useNavigate()
  const params = useLocation()
  
  useEffect(() => {
    if(params.pathname.split("/")[3] == undefined || params.pathname.split("/")[3] == ""){
      navigate("/home/messages/recents")
    }

    if(params.pathname.split("/")[3] == "recents"){
      setconversationFilter("Recents");
    }
    else if(params.pathname.split("/")[3] == "da"){
      setconversationFilter("Drivers");
    }
    else if(params.pathname.split("/")[3] == "sa"){
      setconversationFilter("SystemAdmins");
    }
  }, [])
  

  return (
    <div id='div_messages'>
      <div id='div_messages_container'>
        <div id='div_conversation_list'>
          <div id='div_conversation_header'>
            <div id='div_messages_icon'>
              <MessagesIcon style={{color: "white", fontSize: "22px"}} />
            </div>
            <p id='p_messages_label'>Messages</p>
            <button id='btn_new_message' onClick={() => { navigate(`/home/messages/${params.pathname.split("/")[3]}/newmessage`) }}><NewMessageIcon style={{color: "#FFB905"}} /></button>
          </div>
          <div id='div_input_search_section'>
            <div id='div_input_search_container'>
              <input type='text' id='input_search_conversation' placeholder='Search' />
              <button id='btn_search_conversation'><SearchIcon style={{fontSize: "22px"}} /></button>
            </div>
          </div>
          <div id='div_convo_list_navs'>
            <button className='btn_convo_list_navs' onClick={() => { setconversationFilter("Recents"); navigate("/home/messages/recents") }} ><RecentsIcon style={{color: conversationFilter == "Recents"? "#FFB905" : "#D9D9D9"}} /></button>
            <button className='btn_convo_list_navs' onClick={() => { setconversationFilter("Drivers"); navigate("/home/messages/da") }} ><DriverIcon style={{color: conversationFilter == "Drivers"? "#FFB905" : "#D9D9D9"}} /></button>
            <button className='btn_convo_list_navs' onClick={() => { setconversationFilter("SystemAdmins"); navigate("/home/messages/sa") }} ><SystemAdminIcon style={{color: conversationFilter == "SystemAdmins"? "#FFB905" : "#D9D9D9"}} /></button>
          </div>
          <div id='div_convo_list_layout'>
            <Routes>
              <Route path='/recents/*' element={<ConversationList convFilter="recents" filterType="recents" />} />
              <Route path='/da/*' element={<ConversationList convFilter="da" filterType="drivers" />} />
              <Route path='/sa/*' element={<ConversationList convFilter="sa" filterType="systemadmins" />} />
            </Routes>
          </div>
        </div>
        <div id='div_conversation_section'>
          <Routes>
            <Route path={`/recents/newmessage`} element={<NewMessage convFilter="recents" filterType="recents" />} />
            <Route path={`/da/newmessage`} element={<NewMessage convFilter="da" filterType="drivers" />} />
            <Route path={`/sa/newmessage`} element={<NewMessage convFilter="sa" filterType="systemadmins" />} />
            <Route path={`/${params.pathname.split("/")[3]}`} element={<DefaultDisplay />} />
            <Route path={`/recents/ex/:conversationID`} element={<ConversationIndv convFilter="recents" filterType="recents" />} />
            <Route path={`/da/ex/:conversationID`} element={<ConversationIndv convFilter="da" filterType="drivers" />} />
            <Route path={`/sa/ex/:conversationID`} element={<ConversationIndv convFilter="sa" filterType="systemadmins" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default Messages