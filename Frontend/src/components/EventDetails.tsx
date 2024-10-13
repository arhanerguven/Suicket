import { useState, useEffect } from "react";
import { useSuiClient } from "@mysten/dapp-kit";

function EventDetails({ eventId }: { eventId: string | null }) {
    const suiClient = useSuiClient();
    const [eventData, setEventData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    eventId = '0xbdbebf864cbb302d0e6e6e2a0bc61d7228044e3b7debb18c734d4786858b0d41' // TODO change

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

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="event-details">
            <h2>Event Details</h2>
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
        </div>
    );
}

export default EventDetails;
