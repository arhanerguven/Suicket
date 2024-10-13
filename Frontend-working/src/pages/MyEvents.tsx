import React from 'react'
import Navbar from '../components/Navbar'

interface MyEventsProps {
  address: string;
}

const MyEvents: React.FC<MyEventsProps> = ({ address }) => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Navbar />
      MyEvents {address}
    </div>
  )
}

export default MyEvents