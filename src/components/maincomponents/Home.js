import React from 'react'
import { useSelector } from 'react-redux'

function Home() {

  const authdetails = useSelector(state => state.authdetails)

  return (
    <div>Home: {JSON.stringify(authdetails)}</div>
  )
}

export default Home