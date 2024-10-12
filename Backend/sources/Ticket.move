module TicketingApp::Ticket {

    // Ticket structure
    public struct Ticket has key, store {
        id: UID,                 // Unique identifier for the ticket
        event_id: ID,           // ID of the event this ticket belongs to
        owner: address,          // Address of the ticket owner (customer)
        price: u64,              // Price at which the ticket was purchased
    }

    public fun create_ticket(
        event_id: ID,
        ticket_price: u64,
        ctx: &mut TxContext
    ): Ticket {
        Ticket {
            id: object::new(ctx),
            event_id: event_id,
            owner: tx_context::sender(ctx),
            price: ticket_price,
            // other things
        }
    }

    public fun get_event_id(ticket: &Ticket): ID {
        ticket.event_id
    }

    public fun get_owner(ticket: &Ticket): address {
        ticket.owner
    }

    public fun get_price(ticket: &Ticket): u64 {
        ticket.price
    }

}