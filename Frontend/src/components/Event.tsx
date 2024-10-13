import {
    useCurrentAccount,
    useSignAndExecuteTransaction,
    useSuiClient,
    useSuiClientQuery,
  } from "@mysten/dapp-kit";
  import type { SuiObjectData } from "@mysten/sui/dist/cjs/client";
  import { Transaction } from "@mysten/sui/dist/cjs/transactions";
  import { useNetworkVariable } from "../networkConfig";
  
  export function Event({ id }: { id: string }) {
    const ticketingAppPackageId = useNetworkVariable("ticketingAppPackageId");
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
  
    const executeMoveCall = (method: "buyTicket" | "resellTicket", price?: number) => {
      const tx = new Transaction();
  
      if (method === "buyTicket") {
        tx.moveCall({
          arguments: [tx.object(id)],
          target: `${ticketingAppPackageId}::event::buy_ticket`,
        });
      } else if (method === "resellTicket" && price !== undefined) {
        tx.moveCall({
          arguments: [tx.object(id), tx.pure.u64(price)],
          target: `${ticketingAppPackageId}::event::resell_ticket`,
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
  
    if (!data.data) return <p>Event not found</p>;
  
    const ownedByCurrentAccount =
      getEventFields(data.data)?.owner === currentAccount?.address;
  
    return (
      <div className="max-w-md mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-4">Event {id}</h1>
        <div className="flex flex-col gap-2">
          <p>Event Name: {getEventFields(data.data)?.name}</p>
          <p>Ticket Price: {getEventFields(data.data)?.ticketPrice}</p>
          <p>Available Tickets: {getEventFields(data.data)?.numTickets}</p>
          <div className="flex flex-row gap-2">
            <button
              className="btn btn-primary"
              onClick={() => executeMoveCall("buyTicket")}
            >
              Buy Ticket
            </button>
            {ownedByCurrentAccount && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const price = prompt("Enter resale price:");
                  if (price) {
                    executeMoveCall("resellTicket", parseInt(price, 10));
                  }
                }}
              >
                Resell Ticket
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  function getEventFields(data: SuiObjectData) {
    if (data.content?.dataType !== "moveObject") {
      return null;
    }
  
    return data.content.fields as { name: string; ticketPrice: number; numTickets: number; owner: string };
  }
  