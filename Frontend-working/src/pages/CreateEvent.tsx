import React, { useState } from 'react';
// import { createEvent } from '../suiService';
import Button from '../components/Button';

const CreateEvent: React.FC<{ address: string }> = ({ address }) => {
  const [name, setName] = useState('');
  const [numTickets, setNumTickets] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);

  const handleSubmit = async () => {
    const eventData = { name, numTickets, ticketPrice };
    // await createEvent(eventData, address);
    alert('Event created successfully!');
  };

  return (
    <div>
      <h2>Create Event</h2>
      <form>
        <input type="text" placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="number" placeholder="Number of Tickets" value={numTickets} onChange={(e) => setNumTickets(parseInt(e.target.value))} />
        <input type="number" placeholder="Ticket Price" value={ticketPrice} onChange={(e) => setTicketPrice(parseInt(e.target.value))} />
        <Button onClick={handleSubmit}>Publish Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;
