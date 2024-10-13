import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { useState } from "react";

export function Ticket({
  eventId,
  ticketId,
  onTicketResold,
}: {
  eventId: string;
  ticketId?: string;
  onTicketResold: (ticketId: string) => void;
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

  const [verifierAddress, setVerifierAddress] = useState("");

  const resellTicket = () => {
    if (!ticketId) {
      alert("Ticket ID is required for reselling");
      return;
    }

    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(ticketId), tx.object(eventId)],
      target: `${ticketingAppPackageId}::Task::resell_ticket`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          if (result.effects?.mutated) {
            onTicketResold(ticketId);
            alert(`Ticket ${ticketId} has been successfully resold.`);
          }
        },
      },
    );
  };

  const addVerifier = () => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.pure.string(verifierAddress), tx.object(eventId)],
      target: `${ticketingAppPackageId}::Task::add_verifier`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          if (result.effects?.mutated) {
            alert(`Verifier ${verifierAddress} has been added successfully.`);
          }
        },
      },
    );
  };

  const verifyTicket = () => {
    if (!ticketId) {
      alert("Ticket ID is required for verification");
      return;
    }

    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.object(ticketId), tx.object(eventId)],
      target: `${ticketingAppPackageId}::Task::verify_ticket`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const isVerified = (result.effects?.mutated?.length ?? 0) > 0;
          alert(isVerified ? `Ticket ${ticketId} has been verified successfully.` : `Ticket ${ticketId} could not be verified.`);
        },
      },
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <div className="flex flex-col gap-2">
        <button className="btn btn-primary" onClick={resellTicket}>
          Resell Ticket
        </button>
        <input
          type="text"
          placeholder="Verifier Address"
          value={verifierAddress}
          onChange={(e) => setVerifierAddress(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4"
        />
        <button className="btn btn-secondary" onClick={addVerifier}>
          Add Verifier
        </button>
        <button className="btn btn-success" onClick={verifyTicket}>
          Verify Ticket
        </button>
      </div>
    </div>
  );
}
