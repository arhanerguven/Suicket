import { Link } from 'react-router-dom';
import { ConnectButton } from "@mysten/dapp-kit";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 fixed top-0 z-50 h-20 mb-4 pb-0">
      <div className="navbar-start flex items-center space-x-2">
        
        {/* Existing logo and text */}
        <Link to="/" className="btn btn-ghost normal-case text-xl hover:scale-110 transition-transform duration-200 flex items-center space-x-2">
        <img src="/Images/suiss_ticket_logo-2.png" alt="SuissTicket Icon" className="h-1 w-1" />
          <span>Suiss Ticket</span>
        </Link>
      </div>
      
      {/* Rest of the navbar content remains the same */}
      <div className="navbar-center">
        <ul className="menu menu-horizontal px-1 space-x-2">
          <li>
            <Link to="/" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Home</Link>
          </li>
          <li>
            <Link to="/NFT" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">NFT</Link>
          </li>
          <li>
            <Link to="/Debug" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Debug</Link>
          </li>
          <li>
            <Link to="/Contract" className="btn btn-base-100 text-lg normal-case hover:scale-110 transition-transform duration-200">Contract</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;