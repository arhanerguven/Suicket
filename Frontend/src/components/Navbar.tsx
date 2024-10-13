// components/Navbar.js
import { Link } from 'react-router-dom';
import { ConnectButton } from "@mysten/dapp-kit";

const Navbar = () => {
  return (
    <div className="w-full flex flex-row items-center p-4 container mx-auto border-b-2">
      <ul className="w-full flex flex-row justify-between items-center px-4">
        <li>
        <Link to="/" className="btn btn-ghost normal-case text-xl hover:scale-110 transition-transform duration-200 font-bold">
          BSA x SUI Starter Pack
        </Link>
        </li>
        <li>
        <Link to="/buy" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Buy</Link>
        </li>
        <li>
        <Link to="/create" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Create</Link>
        </li>
        <li>
        <Link to="/tickets" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Tickets</Link>
        </li>
        <li>
        <Link to="/events" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Events</Link>
        </li>
        <li>
          <ConnectButton className="bg-purple-300 p-3 rounded-md" />
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
