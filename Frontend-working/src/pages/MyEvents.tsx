import { useEffect, useState } from "react";
import { useWallets, useSuiClient } from "@mysten/dapp-kit";

function MyEvents() {
    const wallets = useWallets();
    const suiClient = useSuiClient();
    const [eventIds, setEventIds] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Use the first connected wallet's address if available
        if (wallets && wallets.length > 0) {
            const walletAddress = wallets[0].accounts[0].address;
            fetchMyEvents(walletAddress);
        }
    }, [wallets]);

    async function fetchMyEvents(walletAddress: string) {
        setLoading(true);
        setError(null);

        try {
            // Fetch the owned objects by the wallet address
            const response = await suiClient.getOwnedObjects({
                owner: walletAddress,
                filter: {
                    StructType: "Event", // The specific struct type you're looking for
                },
                options: {
                    showType: true,
                    showContent: true,
                    showOwner: true,
                },
            });

            // Filter the response to only include objects that match the Event struct type
            const ids = response.data
                ?.filter((obj) => obj.data && obj.data.type && obj.data.type.includes("::Event::"))
                .map((obj) => obj.data?.objectId) || [];

            setEventIds(ids.filter((id): id is string => id !== undefined));
        } catch (err: any) {
            setError("Error fetching events: " + err.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading your events...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="my-events">
            <h2>My Events</h2>
            {eventIds.length > 0 ? (
                <ul>
                    {eventIds.map((id) => (
                        <li key={id}>
                            <a href={`https://example-explorer.com/object/${id}`} target="_blank" rel="noopener noreferrer">
                                {id}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
}

export default MyEvents;
