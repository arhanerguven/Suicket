import React, { useState, useEffect } from 'react';
// import { getAccountInfo, buyTicket } from '../suiService';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { EventManager } from '../components/Event';

const BuyTicket: React.FC<{ address: string }> = ({ address }) => {

  // const [events, setEvents] = useState<any[]>([]);
  const events = [
    {
      id: '1',
      name: 'Event 1',
      ticketsAvailable: 10,
      price: 100,
    },
    {
      id: '2',
      name: 'Event 2',
      ticketsAvailable: 20,
      price: 200,
    },
  ];

  useEffect(() => {
    // Fetch available events from the blockchain
    // For simplicity, assume the data is fetched from a blockchain function
    const fetchEvents = async () => {
      // const eventsData = await getAccountInfo(address);
      const eventsData = "";
      // setEvents(eventsData);
    };

    fetchEvents();
  }, [address]);

  const handleBuy = async (eventId: string) => {
    // await buyTicket(eventId, address);
    alert('Ticket purchased successfully!');
  };

  const doNothing = () => {
    // do nothing
  }

  return (
    <div className="w-full min-h-full flex flex-col">
      <Navbar />
      <EventManager onTicketBought={doNothing} eventId={''}  />
    </div>
  );
};

export default BuyTicket;
