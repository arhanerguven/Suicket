import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { useState } from "react";

export function CreateEvent({
    onCreated,
}: {
    onCreated: (id: string) => void;
}) {
    const ticketingAppPackageId = useNetworkVariable("ticketingAppPackageId");
    const suiClient = useSuiClient();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction({
        execute: async ({ bytes, signature }) =>
        await suiClient.executeTransactionBlock({
            transactionBlock: bytes,
            signature,
            options: {
            // Raw effects are required so the effects can be reported back to the wallet
            showRawEffects: true,
            showEffects: true,
            },
        }),
    });

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [ticketsAvailable, setTicketsAvailable] = useState("");

    return (
        <div className="max-w-md mx-auto p-4 mt-20">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Event Name
                </label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                    Ticket Price
                </label>
                <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ticketsAvailable">
                    Tickets Available
                </label>
                <input
                    id="ticketsAvailable"
                    type="number"
                    value={ticketsAvailable}
                    onChange={(e) => setTicketsAvailable(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        create();
                    }}
                >
                    Create Event
                </button>
            </div>
        </div>
    );

  function create() {
    const tx = new Transaction();

    tx.moveCall({
        arguments: [
            tx.pure.string(name),
            tx.pure.u64(Number(price)),
            tx.pure.u64(Number(ticketsAvailable)),
        ],
        target: `${ticketingAppPackageId}::Event::create_event`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const objectId = result.effects?.created?.[0]?.reference?.objectId;
          if (objectId) {
            onCreated(objectId);
          }
        },
      },
    );
  }
}
