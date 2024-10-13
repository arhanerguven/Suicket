import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import BuyTicket from './pages/BuyTicket';
import {CreateEvent} from './pages/CreateEvent';
import MyTickets from './pages/MyTickets';
import MyEvents from './pages/MyEvents';
import HomePage from './pages/HomePage';
import EventDetails from './components/EventDetails';
import {EventManager} from './components/Event';


const App: React.FC = () => {
  const address = '0xYourBlockchainAddress'; // TODO remove this - it is in networkConfig.ts

  const [activeEventId, setactiveEventId] = React.useState<string | null>(() => {
    const savedEvent = localStorage.getItem('activeEventId');
    return savedEvent ? JSON.parse(savedEvent) : null;
  });

  React.useEffect(() => {
    localStorage.setItem('activeEventId', JSON.stringify(activeEventId));
  }, [activeEventId]);

  const handleEventCreated = (eventId: string) => {
    // Store the event ID in state and return it
    setactiveEventId(eventId);
    console.log(` active event ${activeEventId}`)
    console.log(` event id ${eventId}`) 
    return eventId;
};

const handleTicketBought = (ticketId: string) => {
  // Store the ticket ID in state and return it
  console.log(` ticket id ${ticketId}`)
  return ticketId;
}


  return (
    <Router>
          <Routes>
            <Route path="/buy" element={<EventManager eventId={activeEventId} onTicketBought={handleTicketBought} />} />
            <Route path="/create" element={<CreateEvent onCreated={handleEventCreated} />} />
            {/* <Route path="/tickets" element={<MyTickets address={address} event={activeEvent} />} /> */}
            <Route path="/tickets" element={<EventManager eventId={activeEventId} onTicketBought={handleTicketBought} />} />
            <Route path="/events" element={<MyEvents />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
    </Router>
  );
};

export default App;
