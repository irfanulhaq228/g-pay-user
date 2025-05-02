import React from 'react'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'


const Layout = ({children}) => {
  return (
    <div className='min-h-[100vh] pb-[10px] flex flex-col justify-between'>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}

export default Layout
