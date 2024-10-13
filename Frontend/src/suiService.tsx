//   import { Transaction } from "@mysten/sui/transactions";
//   import {
//     useCurrentAccount,
//     useSignAndExecuteTransaction,
//     useSuiClient,
//     useSuiClientQuery,
//   } from "@mysten/dapp-kit";
  
//   export const SuiService =  () => {
//     // Initialize the Sui client
//     const suiClient = useSuiClient();
    
//     type EventData = {
//         name: string;
//         numTickets: number;
//         ticketPrice: number;
//     };
  
//   // Function to fetch account information
//   export const getAccountInfo = async (address: string) => {
//     try {
//       const accountInfo = await suiClient.getAccountInfo(address);
//       return accountInfo;
//     } catch (error) {
//       console.error("Failed to get account info:", error);
//       throw error;
//     }
//   };
  
//   // Function to buy a ticket
//   export const buyTicket = async (eventId: string, address: string) => {
//     try {
//       const tx = new Transaction();
//       tx.moveCall({
//         target: "your_package_id::ticket_module::buy_ticket",
//         arguments: [tx.object(eventId)],
//       });
  
//       const response = await suiClient.executeTransactionBlock({
//         transactionBlock: tx.bytes,
//         options: {
//           showRawEffects: true,
//           showEffects: true,
//         },
//       });
  
//       return response;
//     } catch (error) {
//       console.error("Failed to buy ticket:", error);
//       throw error;
//     }
//   };
  
//   // Function to create an event
//   export const createEvent = async (eventData: EventData, address: string) => {
//     try {
//       const tx = new Transaction();
//       tx.moveCall({
//         target: "your_package_id::event_module::create_event",
//         arguments: [
//           tx.pure(eventData.name),
//           tx.pure.u64(eventData.numTickets),
//           tx.pure.u64(eventData.ticketPrice),
//         ],
//       });
  
//       const response = await suiClient.executeTransactionBlock({
//         transactionBlock: tx.bytes,
//         options: {
//           showRawEffects: true,
//           showEffects: true,
//         },
//       });
  
//       return response;
//     } catch (error) {
//       console.error("Failed to create event:", error);
//       throw error;
//     }
//   };
  
//   // Function to get tickets for the current user
//   export const getMyTickets = async (address: string) => {
//     try {
//       const tickets = await suiClient.callFunction(
//         "app-backend.move",
//         "get_my_tickets",
//         [],
//         { from: address }
//       );
//       return tickets;
//     } catch (error) {
//       console.error("Failed to fetch tickets:", error);
//       throw error;
//     }
//   };
  
//   // Function to get events for the current user
//   export const getMyEvents = async (address: string) => {
//     try {
//       const events = await suiClient.callFunction(
//         "app-backend.move",
//         "get_my_events",
//         [],
//         { from: address }
//       );
//       return events;
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//       throw error;
//     }
//   };
  
//   // Helper function to extract fields from a SuiObjectData
//   export function getEventFields(data: SuiObjectData) {
//     if (data.content?.dataType !== "moveObject") {
//       return null;
//     }
  
//     return data.content.fields as {
//       name: string;
//       numTickets: number;
//       ticketPrice: number;
//     };
//   }
  
//   // The functions are structured similarly to the Counter example with the logic for events and tickets.
// }