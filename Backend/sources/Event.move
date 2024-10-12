module TicketingApp::Event {
    use sui::transfer;  // No need to alias, directly call transfer functions

    // Event structure
    public struct Event has key {
        id: UID,
        creator: address,
        name: vector<u8>,
        ticket_price: u64,
        tickets_available: u64,
        refundable: bool,
        resellable: bool,
        max_refund_price: u64,  // Maximum refund amount for tickets
        max_resell_price: u64,  // Maximum price the ticket can be resold for
    }

    // Getter for event fields (necessary to access fields from other modules)
    public fun get_event_details(event: &Event): (&UID, vector<u8>, u64, bool, bool) {
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

    // Function to create an event (only available to "creator" accounts)
    public fun create_event(
        user_account: &UserAccount::UserAccount,
        name: vector<u8>,
        ticket_price: u64,
        tickets_available: u64,
        refundable: bool,
        max_refund_price: u64,
        max_resell_price: u64,
        ctx: &mut TxContext
    ): Event {
        let is_creator = UserAccount::is_creator(user_account);
        assert!(is_creator, 1);  // Abort if the user is not a "creator" (error code 1)

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

        // Transfer the event to the zero address to effectively "burn" it
        transfer::public_transfer(event, 0x0, ctx);  // or use public_burn if available
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

        event.ticket_price = new_ticket_price;
        event.tickets_available = new_tickets_available;
        event.refundable = new_refundable;
        event.max_refund_price = new_max_refund_price;
        event.max_resell_price = new_max_resell_price;
    }
}