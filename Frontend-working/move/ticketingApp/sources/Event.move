module 0x0::Event {
    use std::string::String;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::table::{Self, Table};
    use sui::url::{Self, Url};

    // TODO define error codes
    
    public struct Ticket has key, store {
        id: UID,                 // Unique identifier for the ticket
        event_id: ID,           // ID of the event this ticket belongs to
        owner: address,          // Address of the ticket owner (customer)
        price: u64,              // Price at which the ticket was purchased
        sequence_number: u64,
        url: Url
    }

    // Event structure
    public struct Event has key, store {
        id: UID,
        creator: address,
        name: String,
        ticket_price: u64,
        remaining_tickets: u64,
        ticket_sequence_number: u64,
        resale_tickets: Table<ID, Ticket>,
        unused_tickets: Table<ID, bool>,
        ticket_verifiers: Table<address, bool>,
        url: vector<u8>
    }

    // Function to create an event (only available to "creator" accounts)
    public fun create_event(
        name: String,
        ticket_price: u64,
        tickets_available: u64,
        url: vector<u8>,
        ctx: &mut TxContext
    ): Event {  
        let event = Event {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            name: name,
            ticket_price: ticket_price,
            remaining_tickets: tickets_available,
            ticket_sequence_number: 1,
            resale_tickets: table::new<ID, Ticket>(ctx),
            unused_tickets: table::new<ID, bool>(ctx),
            ticket_verifiers: table::new<address, bool>(ctx),
            url: url
        };
        event
    }
    
    public fun buy_resold_ticket(
        ticket: &Ticket,
        event: &mut Event,
        user_coin: Coin<SUI>,
        ctx: &mut TxContext
    ): Ticket {
        // Check if the ticket is in the resale_tickets
        let ticket_id = object::id(ticket);
        assert!(event.resale_tickets.contains(ticket_id), 3);

        // Assert user_coin is equal to the ticket price
        assert!(user_coin.balance().value() == ticket.price, 3);

        // Pay for the ticket
        transfer::public_transfer(user_coin, event.creator);

        // Change ticket ownership
        let mut ticket = event.resale_tickets.remove(ticket_id);

        ticket.owner = ctx.sender();
        
        ticket
    }

    public fun buy_regular_ticket(
        event: &mut Event,
        user_coin: Coin<SUI>,
        ctx: &mut TxContext
    ): Ticket {

        // Assert tickets are available
        let available_tickets = event.remaining_tickets;
        assert!(available_tickets > 0, 2);

        // Assert user_coin is equal to the ticket price
        assert!(user_coin.balance().value() == event.ticket_price, 3);

        // Pay for the ticket
        transfer::public_transfer(user_coin, event.creator);

        // Get and increment Ticket sequence number
        let ticket_sequence_number = event.ticket_sequence_number;
        event.ticket_sequence_number = event.ticket_sequence_number + 1;
        event.remaining_tickets = event.remaining_tickets - 1;
        let url_current = event.url;
        // Create a new ticket
        let ticket = create_ticket(
            object::id(event),
            event.ticket_price,
            ticket_sequence_number,
            url_current,
            ctx
        );

        // Add the ticket to unused tickets
        event.unused_tickets.add(object::id(&ticket), true);
        
        ticket
    }

    public fun resell_ticket(
        ticket: Ticket,
        event: &mut Event,
        ctx: &TxContext
    ) {
        // Check if the owner of the ticket called this
        assert!(ticket.owner == ctx.sender(), 1);

        // Check if the ticket is unused
        let is_unused = event.unused_tickets.contains(object::id(&ticket));
        assert!(is_unused, 1);

        // Check if the ticket is for this event
        assert!(!(ticket.event_id == object::id(event)), 2);
        
        // Check if the ticket is already in the resale_tickets 
        let ticket_id = object::id(&ticket);
        assert!(!event.resale_tickets.contains(ticket_id), 3);

        event.resale_tickets.add(ticket_id, ticket);
    }

    // Authorizes an account to verify tickets 
    public fun add_verifier(
        verifier_address: address,
        event: &mut Event,
        ctx: &TxContext
    ) {
        // Assert that the account calling this func. is the organizer
        assert!(ctx.sender() == event.creator, 1);

        event.ticket_verifiers.add(verifier_address, true);
    }

    // Verify a ticket
    public fun verify_ticket(
        ticket: &Ticket,
        event: &mut Event,
        ctx: &TxContext
    ): bool {
        // Assert that the account calling this is a verifier
        assert!(event.ticket_verifiers.contains(ctx.sender()), 1);
        
        let ticket_id = object::id(ticket);
        let is_used = event.unused_tickets.contains(ticket_id);
        if (!is_used) {
            event.unused_tickets.remove(ticket_id); 
            true
        } else {
            false
        }
    }

    fun create_ticket(
        event_id: ID,
        ticket_price: u64,
        sequence_number: u64,
        url: vector<u8>,
        ctx: &mut TxContext
    ): Ticket {
        Ticket {
            id: object::new(ctx),
            event_id: event_id,
            owner: tx_context::sender(ctx),
            price: ticket_price,
            sequence_number: sequence_number,
            url: url::new_unsafe_from_bytes(url)
        }
    }


    // ----------- Getters --------- TODO cleanup

    // -- Event --
    
    public fun get_creator(event: &Event): address {
        event.creator
    }

    public fun get_name(event: &Event): &String {
        &event.name
    }

    public fun get_ticket_price(event: &Event): u64 {
        event.ticket_price
    }

    // -- Ticket --

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