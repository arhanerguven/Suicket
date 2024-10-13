import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { useState } from "react";

export function EventManager({
  eventId,
  ticketId,
  onTicketBought,
}: {
  eventId: string;
  ticketId?: string;
  onTicketBought: (ticketId: string) => void;
}) {
  const ticketingAppPackageId = useNetworkVariable("ticketingAppPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const [userCoinId, setUserCoinId] = useState("");

  const buyRegularTicket = () => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(eventId), tx.object(userCoinId)],
      target: `${ticketingAppPackageId}::Event::buy_regular_ticket`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const newTicketId = result.effects?.created?.[0]?.reference?.objectId;
          if (newTicketId) {
            onTicketBought(newTicketId);
          }
        },
      },
    );
  };

  const buyResoldTicket = () => {
    if (!ticketId) {
      alert("Ticket ID is required for resold ticket purchase");
      return;
    }

    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(ticketId), tx.object(eventId), tx.object(userCoinId)],
      target: `${ticketingAppPackageId}::Event::buy_resold_ticket`,
    });

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
      },
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">Event Manager</h1>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="User Coin ID"
          value={userCoinId}
          onChange={(e) => setUserCoinId(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={buyRegularTicket}
        >
          Buy Regular Ticket
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={buyResoldTicket}
        >
          Buy Resold Ticket
        </button>
      </div>
    </div>
  );
}
