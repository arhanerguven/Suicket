import React from 'react'

interface MyEventsProps {
  address: string;
}

const MyEvents: React.FC<MyEventsProps> = ({ address }) => {
  return (
    <div>MyEvents {address}</div>
  )
}

export default MyEvents