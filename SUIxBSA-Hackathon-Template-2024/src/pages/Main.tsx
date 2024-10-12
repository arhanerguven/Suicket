import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="flex justify-center items-center bg-base-200">
      <Navbar />
      <main className="container mx-auto px-4 mt-20">
        {/* SuissTicket logo */}
        <section className="flex justify-between items-center py-4">
          <div>
            <img src="/Images/suiss_ticket_logo.png" alt="SuissTicket Logo" className="h-20" />
          </div>
          <div>
            <button className="btn btn-primary bg-blue-500 hover:bg-blue-600">Register</button>
          </div>
        </section>

        {/* Current Events Section */}
        <section className="hero bg-base-100 rounded-lg shadow-md mb-8">
          <div className="hero-content text-center py-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-5xl font-bold mb-4 text-blue-600">SuissTicket</h1>
              <p className="mb-6">
                Welcome to SuissTicket, your gateway to purchasing event tickets globally through secure and scalable blockchain technology, ensuring transparency, efficiency, and trust.
              </p>
              <button className="btn btn-primary bg-blue-500 hover:bg-blue-600">Purchase Ticket</button>
            </div>
          </div>
        </section>

        {/* Current Events Display */}
        <section className="bg-base-100 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Current Events</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link to="/event/1" className="card bg-base-100 shadow-sm">
                <img src="/Images/Image_1.jpg" alt="Blockchain Expo 2024" className="h-40 w-full object-cover" />
                <div className="card-body">
                  <h3 className="card-title text-blue-500">Blockchain Expo 2024</h3>
                  <p className="text-black">Join the biggest blockchain expo of the year where industry leaders gather to discuss the future of decentralized technologies.</p>
                </div>
              </Link>
              <Link to="/event/2" className="card bg-base-100 shadow-sm">
                <img src="/Images/Image_1.jpg" alt="Future of AI Summit" className="h-40 w-full object-cover" />
                <div className="card-body">
                  <h3 className="card-title text-blue-500">Future of AI Summit</h3>
                  <p className="text-black">A conference focused on the intersection of AI and blockchain, featuring talks by leading experts in both fields.</p>
                </div>
              </Link>
              <Link to="/event/3" className="card bg-base-100 shadow-sm">
                <img src="/Images/Image_1.jpg" alt="Global Music Festival" className="h-40 w-full object-cover" />
                <div className="card-body">
                  <h3 className="card-title text-blue-500">Global Music Festival</h3>
                  <p className="text-black">Experience live performances from international artists at this year’s Global Music Festival.</p>
                </div>
              </Link>
              <Link to="/event/4" className="card bg-base-100 shadow-sm">
                <img src="/Images/Image_1.jpg" alt="Tech Innovators Meetup" className="h-40 w-full object-cover" />
                <div className="card-body">
                  <h3 className="card-title text-blue-500">Tech Innovators Meetup</h3>
                  <p className="text-black">Network with tech innovators and startups at this exclusive meetup event showcasing the latest advancements.</p>
                </div>
              </Link>
              <Link to="/event/5" className="card bg-base-100 shadow-sm">
                <img src="/Images/Image_1.jpg" alt="Crypto Conference 2024" className="h-40 w-full object-cover" />
                <div className="card-body">
                  <h3 className="card-title text-blue-500">Crypto Conference 2024</h3>
                  <p className="text-black">The world’s leading cryptocurrency event, bringing together top blockchain developers, enthusiasts, and investors.</p>
                </div>
              </Link>
              <Link to="/event/6" className="card bg-base-100 shadow-sm">
                <img src="/Images/Image_1.jpg" alt="Blockchain for Social Good" className="h-40 w-full object-cover" />
                <div className="card-body">
                  <h3 className="card-title text-blue-500">Blockchain for Social Good</h3>
                  <p className="text-black">A summit on how blockchain can be leveraged for social good, featuring NGO leaders and technology experts.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;