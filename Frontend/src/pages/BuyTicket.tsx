import React, { useState, useEffect } from 'react';
// import { getAccountInfo, buyTicket } from '../suiService';
import Button from '../components/Button';

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Events</h2>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="p-4 border rounded-lg shadow-md">
            <p className="text-lg font-semibold">{event.name}</p>
            <p className="text-gray-600">Price: {event.price}</p>
            <p className="text-gray-600">Tickets available: {event.ticketsAvailable}</p>
            <Button onClick={() => handleBuy(event.id)}>
              Buy Ticket
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyTicket;
