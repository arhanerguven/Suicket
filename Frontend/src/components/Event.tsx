import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { useState, useEffect } from "react";

export function EventManager({
  eventId,
  onTicketBought,
}: {
  eventId: string | null;
  onTicketBought: (ticketId: string ) => string;
}) {

    // eventId = '0xbdbebf864cbb302d0e6e6e2a0bc61d7228044e3b7debb18c734d4786858b0d41' // TODO change

    const suiClient = useSuiClient();
    const [eventData, setEventData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (eventId) {
            fetchEventDetails(eventId);
        }
    }, [eventId]);

    async function fetchEventDetails(eventId: string | null) {
        setLoading(true);
        setError(null);

        if (!eventId) {
            setError("Event ID is required.");
            setLoading(false);
            return;
        }
        try {
            // Fetch event details using suiClient
            const eventDetails = await suiClient.getObject({
                id: eventId,
                options: {
                    showContent: true,
                    showType: true,
                },
            });

            if (eventDetails.data) {
                setEventData(eventDetails.data);
            } else {
                setError("Failed to fetch event details.");
            }
        } catch (err: any) {
            setError("Error fetching event details: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    // if (loading) return <p>Loading event details...</p>;
    // if (error) return <p>Error: {error}</p>;

  // connect to the network
  const ticketingAppPackageId = useNetworkVariable("ticketingAppPackageId");
  // const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) => {
      const result = await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      });
      return result;
    },
  });

  // const [userCoinId, setUserCoinId] = useState("");

  
  // prepare arguments
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [100]);

  // Function to buy a regular ticket 
  const buyRegularTicket = async () => {    
    // make a call to move
    if (eventId) {
      tx.moveCall({
        arguments: [tx.object(eventId), coin],
        target: `${ticketingAppPackageId}::Event::buy_regular_ticket`,
      });
    } else {
      console.error("Event ID is null");
      alert("Event ID is missing. Please try again.");
    }

    // sign and execute
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const purchasedTicketId = result.effects?.created?.[0]?.reference?.objectId;
          if (purchasedTicketId) {
            onTicketBought(purchasedTicketId);
          }
        },
        onError: (error) => {
          console.error("Failed to buy a ticket:", error);
          alert("Failed to buy a ticket. Please try again.");
        },
      }
    );
  };

  return (
    <div className="ticket-info">
      <h2>Event Tickets</h2>
      {eventData ? (
          <div>
              <p><strong>Name:</strong> {eventData.content?.fields?.name}</p>
              <p><strong>Ticket Price:</strong> {eventData.content?.fields?.ticket_price}</p>
              <p><strong>Tickets Available:</strong> {eventData.content?.fields?.remaining_tickets}</p>
              <p><strong>Creator:</strong> {eventData.content?.fields?.creator}</p>
              {/* Add more fields as needed */}
          </div>
      ) : (
          <p>No data available for this event.</p>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={buyRegularTicket}
      >
        Buy Regular Ticket
      </button>
    </div>
  );
}


// return (
//   <div className="event-details">
//       <h2>Event Details</h2>
//       {eventData ? (
//           <div>
//               <p><strong>Name:</strong> {eventData.content?.fields?.name}</p>
//               <p><strong>Ticket Price:</strong> {eventData.content?.fields?.ticket_price}</p>
//               <p><strong>Tickets Available:</strong> {eventData.content?.fields?.remaining_tickets}</p>
//               <p><strong>Creator:</strong> {eventData.content?.fields?.creator}</p>
//               {/* Add more fields as needed */}
//           </div>
//       ) : (
//           <p>No data available for this event.</p>
//       )}
//   </div>
// );