module TicketingApp::Ticket {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use TicketingApp::UserAccount;  // Import the UserAccount module to check user type
    use TicketingApp::Event;        // Import the Event module

    // Ticket structure
    public struct Ticket has key {
        id: UID,                 // Unique identifier for the ticket
        event_id: UID,           // ID of the event this ticket belongs to
        event_name: vector<u8>,  // Name of the event
        owner: address,          // Address of the ticket owner (customer)
        price: u64,              // Price at which the ticket was purchased
        refundable: bool,        // Whether the ticket is refundable
        resellable: bool,        // Whether the ticket is resellable
    }

    // Function to issue a ticket to a "customer"-type user
    public fun issue_ticket(
        user_account: &UserAccount::UserAccount,  // The user buying the ticket
        event: &mut Event::Event,                 // The event for which the ticket is being bought
        ctx: &mut TxContext
    ): Ticket {
        // Ensure the user is of type "customer"
        let is_customer = UserAccount::is_customer(user_account);
        assert!(is_customer, 1);  // Abort if the user is not a "customer" (error code 1)

        // Ensure the event has available tickets
        assert!(event.tickets_available > 0, 2);  // Abort if there are no tickets left (error code 2)

        // Deduct one ticket from the event's available tickets
        event.tickets_available = event.tickets_available - 1;

        // Issue the ticket to the customer
        let ticket = Ticket {
            id: object::new(ctx),
            event_id: event.id,
            event_name: event.name,
            owner: tx_context::sender(ctx),       // The address of the buyer (customer)
            price: event.ticket_price,
            refundable: event.refundable,         // Set based on the event's refund policy
            resellable: event.resellable,         // Set based on the event's resell policy
        };

        ticket
    }

    // Additional functions to manage tickets can be added here
}