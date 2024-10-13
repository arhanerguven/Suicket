import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BuyTicket from './pages/BuyTicket';
import {CreateEvent} from './pages/CreateEvent';
import MyTickets from './pages/MyTickets';
import MyEvents from './pages/MyEvents';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  const address = '0xYourBlockchainAddress'; // TODO remove this - it is in networkConfig.ts

  const [activeEvent, setActiveEvent] = React.useState<string | null>(null);

  const handleEventCreated = (eventId: string) => {
    // Store the event ID in state and return it
    setActiveEvent(eventId);
    console.log(` active event ${activeEvent}`)
    return eventId;
};

  return (
    <Router>
          <Routes>
            <Route path="/buy" element={<BuyTicket address={address} />} />
            <Route path="/create" element={<CreateEvent onCreated={handleEventCreated} />} />
            <Route path="/tickets" element={<MyTickets address={address} />} />
            <Route path="/events" element={<MyEvents address={address} />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
    </Router>
  );
};

export default App;
