// import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
// import { Transaction } from "@mysten/sui/transactions";
// import { useNetworkVariable } from "../networkConfig";
// import { useState } from "react";


// const PTB = () => {
//     interface Transfer {
//         to: string;
//         amount: number;
//     }
    
//     // Procure a list of some Sui transfers to make:
//     const transfers: Transfer[] = getTransfers();
    
//     const tx = new Transaction();
    
//     // First, split the gas coin into multiple coins:
//     const coins = tx.splitCoins(
//         tx.gas,
//         transfers.map((transfer) => tx.pure(transfer.amount)),
//     );
    
//     // Next, create a transfer transaction for each coin:
//     transfers.forEach((transfer, index) => {
//         tx.transferObjects([coins[index]], tx.pure(transfer.to));
//     });
// }

//  {
//     // Prepare arguments
//      // Function to buy a regular ticket

//         const buyRegularTicket = async () => {
//         const newTicketId = await createTicket();
//         if (!newTicketId || !eventId) {
//           alert("Failed to create a ticket. Please try again.");
//           return;
//         }
    
//         // make a call to move
//         const tx = new Transaction();
    
//         tx.moveCall({
//           arguments: [tx.object(eventId), tx.object(newTicketId), tx.object(userCoinId)],
//           target: `${ticketingAppPackageId}::Event::buy_regular_ticket`,
//         });
    
//         // sign and execute
//         signAndExecute(
//           {
//             transaction: tx,
//           },
//           {
//             onSuccess: (result) => {
//               const purchasedTicketId = result.effects?.created?.[0]?.reference?.objectId;
//               if (purchasedTicketId) {
//                 onTicketBought(purchasedTicketId);
//               }
//             },
//             onError: (error) => {
//               console.error("Failed to buy a ticket:", error);
//               alert("Failed to buy a ticket. Please try again.");
//             },
//           }
//         );
//       };

//     // connect signature with account
//     const ticketingAppPackageId = useNetworkVariable("ticketingAppPackageId");
//     const suiClient = useSuiClient();
//     const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction({
//       execute: async ({ bytes, signature }) => {
//         const result = await suiClient.executeTransactionBlock({
//           transactionBlock: bytes,
//           signature,
//           options: {
//             showRawEffects: true,
//             showEffects: true,
//           },
//         });
//         return result;
//       },
//     });
//  }