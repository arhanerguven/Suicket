import React from 'react'
import Navbar from '../components/Navbar'

interface MyTicketsProps {
  address: string;
  activeEventId: string | null;
}

const MyTickets: React.FC<MyTicketsProps> = ({ address, activeEventId }) => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Navbar />
      {!activeEventId && <p>No active event</p>}
      {activeEventId && 
        <div>Active event: {activeEventId}
          
        </div>}
    </div>
  )
}

export default MyTickets