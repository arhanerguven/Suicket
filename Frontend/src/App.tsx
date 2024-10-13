import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BuyTicket from './pages/BuyTicket';
import CreateEvent from './pages/CreateEvent';
import MyTickets from './pages/MyTickets';
import MyEvents from './pages/MyEvents';

const App: React.FC = () => {
  const address = '0xYourBlockchainAddress'; // TODO remove this - it is in networkConfig.ts

  return (
    <Router>
      <div className="container mx-auto">
        <header>
          <h1 className="text-3xl font-bold mb-4">Ticketing App</h1>
        </header>
        <nav className="mb-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/buy" className="text-blue-500 hover:text-blue-700">Buy Ticket</Link>
            </li>
            <li>
              <Link to="/create" className="text-blue-500 hover:text-blue-700">Create Event</Link>
            </li>
            <li>
              <Link to="/tickets" className="text-blue-500 hover:text-blue-700">My Tickets</Link>
            </li>
            <li>
              <Link to="/events" className="text-blue-500 hover:text-blue-700">My Events</Link>
            </li>
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/buy" element={<BuyTicket address={address} />} />
            <Route path="/create" element={<CreateEvent address={address} />} />
            <Route path="/tickets" element={<MyTickets address={address} />} />
            <Route path="/events" element={<MyEvents address={address} />} />
            <Route path="/" element={<h2>Welcome to the Ticketing App</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
