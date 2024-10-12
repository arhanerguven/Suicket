module TicketingApp::Event {
    use std::string::String;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    
    public struct Ticket has key, store {
        id: UID,                 // Unique identifier for the ticket
        event_id: ID,           // ID of the event this ticket belongs to
        owner: address,          // Address of the ticket owner (customer)
        price: u64,              // Price at which the ticket was purchased
        sequence_number: u64,
    }

    // Event structure
    public struct Event has key, store {
        id: UID,
        creator: address,
        name: String,
        ticket_price: u64,
        ticket_pool: vector<Ticket>,
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


    // Function to create an event (only available to "creator" accounts)
    public fun create_event(
        name: String,
        ticket_price: u64,
        tickets_available: u64,
        ctx: &mut TxContext
    ): Event {
        let ticket_pool = vector::empty<Ticket>();

        let event = Event {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            name: name,
            ticket_price: ticket_price,
            ticket_pool: ticket_pool,
        };
  
        let mut i = 0;
        while (i < tickets_available) {
            let ticket = create_ticket(
                object::id(&event),
                event.ticket_price,
                i,
                ctx,
            );
            vector::push_back<Ticket>(&mut event.ticket_pool, ticket);
            i = i + 1;
        }
        
        event
    }

    // Function to delete an event (oŁnly by the creator)
    public fun delete_event(
        event: Event,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(sender == event.creator, 2);  // Ensure only the creator can delete the event

        // Transfer the event to a zero address to effectively "burn" it
        transfer::public_transfer(event, @0x0);
    }
    
    public fun buy_ticket(
        event: &mut Event,
        user_coin: Coin<SUI>,
        ctx: &mut TxContext
    ): Ticket {

        // Check if tickets are available
        assert!(vector::length(&event.ticket_pool) > 0, 3);

        // Assert user_coin is equal to the ticket price
        assert!(user_coin.balance().value() == event.ticket_price, 3);

        // Pay for the ticket
        transfer::public_transfer(user_coin, event.creator);

        // Change ticket ownership
        let ticket = vector::pop_back<Ticket>(&mut event.ticket_pool);
        change_owner(tx_context::sender(ctx), ticket);

        ticket
    }


    public fun create_ticket(
        event_id: ID,
        ticket_price: u64,
        sequence_number: u64,
        ctx: &mut TxContext
    ): Ticket {
        Ticket {
            id: object::new(ctx),
            event_id: event_id,
            owner: tx_context::sender(ctx),
            price: ticket_price,
            sequence_number: sequence_number
        }
    }

    public fun change_owner(
        new_owner: address,
        ticket: Ticket,
    ) {
        ticket.owner = new_owner
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

    public fun get_sequence_number(ticket: &Ticket): u64 {
        ticket.sequence_number
    }
}