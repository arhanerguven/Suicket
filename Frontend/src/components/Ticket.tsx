import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
    useSuiClientQuery,
  } from "@mysten/dapp-kit";
  import type { SuiObjectData } from "@mysten/sui/dist/cjs/client";
  import { Transaction } from "@mysten/sui/dist/cjs/transactions";
  import { useNetworkVariable } from "../networkConfig";
  
  export function Ticket({ id }: { id: string }) {
    const ticketingAppPackageId = useNetworkVariable("ticketingAppPackageId"); // TODO update the package name
    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();
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
  
    const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
      id,
      options: {
        showContent: true,
        showOwner: true,
      },
    });
  
    const executeMoveCall = (method: "useTicket" | "transferTicket", newOwner?: string) => {
      const tx = new Transaction();
  
      if (method === "useTicket") {
        tx.moveCall({
          arguments: [tx.object(id)],
          target: `${ticketingAppPackageId}::ticket::use_ticket`,
        });
      } else if (method === "transferTicket" && newOwner) {
        tx.moveCall({
          arguments: [tx.object(id), tx.pure.address(newOwner)],
          target: `${ticketingAppPackageId}::ticket::transfer_ticket`,
        });
      }
  
      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: async () => {
            await refetch();
          },
        },
      );
    };
  
    if (isPending) return <p>Loading...</p>;
  
    if (error) return <p>Error: {error.message}</p>;
  
    if (!data.data) return <p>Ticket not found</p>;
  
    const ownedByCurrentAccount =
      getTicketFields(data.data)?.owner === currentAccount?.address;
  
    return (
      <div className="max-w-md mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-4">Ticket {id}</h1>
        <div className="flex flex-col gap-2">
          <p>Event: {getTicketFields(data.data)?.eventName}</p>
          <p>Seat Number: {getTicketFields(data.data)?.seatNumber}</p>
          <p>Status: {getTicketFields(data.data)?.isUsed ? "Used" : "Available"}</p>
          <div className="flex flex-row gap-2">
            {ownedByCurrentAccount && !getTicketFields(data.data)?.isUsed && (
              <button
                className="btn btn-primary"
                onClick={() => executeMoveCall("useTicket")}
              >
                Use Ticket
              </button>
            )}
            {ownedByCurrentAccount && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const newOwner = prompt("Enter new owner address:");
                  if (newOwner) {
                    executeMoveCall("transferTicket", newOwner);
                  }
                }}
              >
                Transfer Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  function getTicketFields(data: SuiObjectData) {
    if (data.content?.dataType !== "moveObject") {
      return null;
    }
  
    return data.content.fields as {
      eventName: string;
      seatNumber: number;
      isUsed: boolean;
      owner: string;
    };
  }
  