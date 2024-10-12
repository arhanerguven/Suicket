module TicketingApp::Event {
    use std::string::String;
    use TicketingApp::Ticket;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    // Event structure
    public struct Event has key, store {
        id: UID,
        creator: address,
        name: String,
        ticket_price: u64,
        tickets_available: u64,
        refundable: bool,
        resellable: bool,
        max_refund_price: u64,  // Maximum refund amount for tickets
        max_resell_price: u64,  // Maximum price the ticket can be resold for
    }

    // Getter for event fields (necessary to access fields from other modules)
    public fun get_event_details(event: &Event): (&UID, String, u64, bool, bool) {
        (&event.id, event.name, event.ticket_price, event.refundable, event.resellable)
    }

    // Getter for tickets_available
    public fun get_tickets_available(event: &Event): u64 {
        event.tickets_available
    }

    // Setter for tickets_available
    public fun update_tickets_available(event: &mut Event, new_tickets_available: u64) {
        event.tickets_available = new_tickets_available;
    }

    public fun get_creator(event: &Event): address {
        event.creator
    }

    public fun get_name(event: &Event): &String {
        &event.name
    }

    public fun get_ticket_price(event: &Event): u64 {
        event.ticket_price
    }

    public fun get_refundable(event: &Event): bool {
        event.refundable
    }

    public fun get_resellable(event: &Event): bool {
        event.resellable
    }

    public fun get_max_refund_price(event: &Event): u64 {
        event.max_refund_price
    }

    public fun get_max_resell_price(event: &Event): u64 {
        event.max_resell_price
    }


    // Function to create an event (only available to "creator" accounts)
    public fun create_event(
        name: String,
        ticket_price: u64,
        tickets_available: u64,
        refundable: bool,
        max_refund_price: u64,
        max_resell_price: u64,
        ctx: &mut TxContext
    ): Event {
        Event {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            name: name,
            ticket_price: ticket_price,
            tickets_available: tickets_available,
            refundable: refundable,
            resellable: true,
            max_refund_price: max_refund_price,
            max_resell_price: max_resell_price,
        }
    }

    // Function to delete an event (only by the creator)
    public fun delete_event(
        event: Event,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == event.creator, 2);  // Ensure only the creator can delete the event

        // Transfer the event to a zero address to effectively "burn" it
        transfer::public_transfer(event, @0x0);
    }

    // Function to update the event information (only by the creator)
    public fun update_event_info(
        event: &mut Event,
        new_ticket_price: u64,
        new_tickets_available: u64,
        new_refundable: bool,
        new_max_refund_price: u64,
        new_max_resell_price: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == event.creator, 3);  // Ensure only the creator can update the event

        // Update event fields
        event.ticket_price = new_ticket_price;
        event.tickets_available = new_tickets_available;
        event.refundable = new_refundable;
        event.max_refund_price = new_max_refund_price;
        event.max_resell_price = new_max_resell_price;
    }

    public fun buy_ticket(
        event: &mut Event,
        user_coin: Coin<SUI>,
        ctx: &mut TxContext
    ): Ticket::Ticket {

        // Assert tickets are available
        let available_tickets = event.tickets_available;
        assert!(available_tickets > 0, 2);

        // Assert user_coin is equal to the ticket price
        assert!(user_coin.balance().value() == event.ticket_price, 3);

        // Pay for the ticket
        transfer::public_transfer(user_coin, event.creator);

        // Return the created ticket
        event.tickets_available = event.tickets_available - 1;
        Ticket::create_ticket(
            object::id(event),
            event.ticket_price,
            ctx
        )
    }
}