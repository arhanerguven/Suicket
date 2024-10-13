import React from 'react'
import Navbar from '../components/Navbar'

interface MyTicketsProps {
  address: string;
}

const MyTickets: React.FC<MyTicketsProps> = ({ address }) => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Navbar />
      <p>MyTickets {address}</p>
    </div>
  )
}

export default MyTickets