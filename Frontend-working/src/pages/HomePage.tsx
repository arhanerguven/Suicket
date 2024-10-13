import React from 'react'
import Navbar from '../components/Navbar'

const HomePage = () => {
  return (
    <div className='flex flex-col'>
      <Navbar />
      <header>
        <h1 className="text-2xl font-bold text-center mt-4">
          Welcome to Suicket portal
        </h1>
      </header>
    </div>
  )
}

export default HomePage