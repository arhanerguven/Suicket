module TicketingApp::EventTests {
    use TicketingApp::Event;
    use std::string::utf8;
    use sui::tx_context::dummy;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    // Dummy initializer functions

    fun dummy_event(ctx: &mut TxContext): Event {
        create_event(
            utf8(b"Test Event"),
            100,  // Ticket price
            1,   // Tickets available
            &mut ctx_creator
        )
    }

    fun dummy_ticket(event: &Event, ctx: &mut TxContext): Ticket {
        create_ticket(
            object::id(event),
            100,
            42,
            new_unsafe_from_bytes(Vector::empty<u8>()),
            ctx
        )
    }
    
    // create_event tests

    #[test]
    public fun test_create_event() {
        // Define parameters
        let mut ctx = dummy();
        let name = String::utf8(b"Test Event");
        let ticket_price = 100;
        let tickets_available = 10;
        let url = Vector::empty<u8>();

        // Call the create_event function
        let event = create_event(
            name,
            ticket_price, 
            tickets_available, 
            ctx
        );

        // Assert
        assert!(event.creator == ctx.sender(), 1)
        assert!(event.name == &String::utf8(b"Test Event"), 2);
        assert!(event.ticket_price == ticket_price, 3);
        assert!(event.remaining_tickets == tickets_available, 4);
        assert!(ticket_sequence_number, 5);
        assert!(event.url == url, 5);
        assert!(Table::is_empty(event.resale_tickets), 6);
        assert!(Table::is_empty(event.unused_tickets), 7);
        assert!(Table::is_empty(event.ticket_verifiers), 8);
    }

    // resold_ticket tests
    
    #[test]
    public fun test_buy_resold_ticket() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let buyer_address = Signer::address_of(&Signer::create_signer());
        let mut event = dummy_event(ctx);
        event.resale_tickets.add(object::id(ticket), ticket);
        let ticket = dummy_ticket(&event, ctx);
        let mut user_coin = Coin::create<SUI>(ticket_price);

        // Call the buy_resold_ticket function
        let bought_ticket = buy_resold_ticket(
            &ticket, 
            &mut event, 
            user_coin, 
            ctx
        );

        // Assert
        assert!(bought_ticket.price == ticket_price, 1);
        assert!(bought_ticket.owner == ctx.sender(), 2);
        assert!(!test_event.resale_tickets.contains(Object::id(&ticket)), 3);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_owner_mismatch() {
        // Define parameters
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);
        let ticket = dummy_ticket(&event, ctx);
        ticket.owner = Signer::address_of(&Signer::create_signer());

        // Attempt to resell the ticket (should fail due to owner mismatch)
        resell_ticket(ticket, &mut event, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_not_unused() {
        // Define parameters
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);
        let ticket = dummy_ticket(&event, ctx);

        event.unused_tickets.remove(object::id(&ticket));

        // Attempt to resell the ticket (should fail due to the ticket being marked as used)
        resell_ticket(ticket, &mut event, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_wrong_event() {
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);
        let ticket = dummy_ticket(&event, ctx);

        ticket.event_id = object::new(ctx);

        // Attempt to resell the ticket (should fail due to wrong event id)
        resell_ticket(ticket, &mut event, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_already_in_resale() {
        // Define parameters
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);
        let ticket = dummy_ticket(&event, ctx);

        event.resale_tickets.add(object::id(ticket), ticket);

        // Attempt to resell the ticket (should fail due to ticket already being in resale)
        resell_ticket(ticket, &mut event, ctx);
    }

    // buy_regular_ticket tests

    #[test]
    public fun test_buy_regular_ticket() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut user_coin = Coin::create<SUI>(ticket_price);
        let mut event = dummy_event(ctx);
        event.remaining_tickets = 1;

        // Call the buy_resold_ticket function
        let bought_ticket = buy_regular_ticket(&mut event, user_coin, ctx);

        // Assert
        assert!(bought_ticket.price == ticket_price, 1);
        assert!(bought_ticket.sequence_number == 1, 2);
        assert!(bought_ticket.event_id == object::id(&event), 3);
        assert!(Vector::is_empty(&bought_ticket.url), 4);
        assert!(event.ticket_sequence_number == 1, 5);
        assert!(event.remaining_tickets == remaining_tickets - 1, 6);
        assert!(event.unused_tickets.contains(object::id(&bought_ticket)), 7);
    }

    #[test]
    #[expected_failure]
    public fun test_buy_regular_ticket_no_available_tickets() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut user_coin = Coin::create<SUI>(ticket_price);
        let mut event = dummy_event(ctx);

        event.remaining_tickets = 0;

        // Attempt to buy at ticket (should fail due to no available tickets)
        buy_regular_ticket(&mut event, user_coin, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_buy_regular_ticket_incorrect_coin_balance() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut event = dummy_event(ctx);
        event.remaining_tickets = 1;

        let mut user_coin = Coin::create<SUI>(ticket_price - 1); // Incorrect balance

        // Attempt to buy at ticket (should fail due to wrong coin balance)
        let bought_ticket = EventModule::buy_regular_ticket(&mut event, user_coin, ctx);
    }

    // resell_ticket tests

    #[test]
    public fun test_resell_ticket() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_owner = ctx.sender();
        let ticket_price = 100;

        let mut event = dummy_event(ctx);
        event.remaining_tickets = 10;

        let ticket = dummy_ticket(event, ctx);
        event.unused_tickets.add(object::id(&ticket), true);

        // Call the resell_ticket function
        resell_ticket(ticket, &mut event, ctx);

        // Assert
        assert!(event.resale_tickets.contains(object::id(&ticket)), 1);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_wrong_owner() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut event = dummy_event(ctx);

        let ticket = dummy_ticket(event, ctx);
        ticket.owner =  Signer::address_of(&Signer::create_signer()); // Different owner
        event.unused_tickets.add(object::id(&ticket), true);

        // Attempt to resell ticket (should fail because the sender is not the owner)
        resell_ticket(ticket, &mut event, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_not_unused() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut event = dummy_event(ctx);

        let ticket = dummy_ticket(event, ctx);
        event.unused_tickets.add(object::id(&ticket), false);

        // Attempt to resell ticket (should fail because the ticket is not marked unused)
        resell_ticket(ticket, &mut event, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_wrong_event() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut event = dummy_event(ctx);

        let ticket = dummy_ticket(event, ctx);
        event.unused_tickets.add(object::id(&ticket), true);

        ticket.event_id = object::id(&wrong_event);  // Not the correct event

        // Attempt to resell ticket (should fail because the ticket is for a different event)
        resell_ticket(ticket, &mut event, ctx);
    }

    #[test]
    #[expected_failure]
    public fun test_resell_ticket_already_in_resale_pool() {
        // Define parameters
        let mut ctx = dummy();
        let ticket_price = 100;
        let mut event = dummy_event(ctx);
        let ticket = dummy_ticket(event, ctx);
        event.unused_tickets.add(object::id(&ticket), true);

        event.resale_tickets.add(object::id(&ticket), ticket);  // Ticket already added to resale pool

        // Attempt to resell the ticket (should fail because the ticket is already in resale pool)
        EventModule::resell_ticket(ticket, &mut event, ctx);
    }

    // add_verifier tests

    #[test]
    public fun test_add_verifier_correct() {
        // Define parameters
        let mut ctx = dummy();
        let organizer_address = ctx.sender(); 
        let verifier_address = Signer::address_of(&Signer::create_signer()); 
        let mut event = dummy_event(ctx);

        // Call the add_verifier function
        add_verifier(verifier_address, &mut event, ctx);

        // Assert
        assert!(event.ticket_verifiers.contains(verifier_address), 1);
    }

    #[test]
    #[expected_failure]
    public fun test_add_verifier_not_organizer() {
        // Define parameters
        let mut ctx = dummy();
        let organizer_address = Signer::address_of(&Signer::create_signer()); 
        let verifier_address = Signer::address_of(&Signer::create_signer()); 
        let mut event = dummy_event(ctx);

        // Attempt to add a verifier (should fail because the sender is not the organizer)
        add_verifier(verifier_address, &mut event, ctx);
    }

    // verify_ticket tests

    #[test]
    public fun test_verify_ticket_unused() {
        // Define parameters
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);

        let verifier_address = ctx.sender();
        event.ticket_verifiers.add(verifier_address, true);

        let ticket = dummy_ticket(event, ctx);
        event.unused_tickets.add(object::id(&ticket), true); 

        // Call the verify_ticket function
        let result = verify_ticket(&ticket, &mut event, ctx);

        // Assert
        assert!(result == true, 1);
        assert!(!event.unused_tickets.contains(object::id(&ticket)), 2);
    }

    #[test]
    public fun test_verify_ticket_used() {
        // Define parameters
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);

        let verifier_address = ctx.sender();
        event.ticket_verifiers.add(verifier_address, true);

        let ticket = dummy_ticket(event, ctx);

        // Call the verify_ticket function
        let result = verify_ticket(&ticket, &mut event, ctx);

        // Assert
        assert!(result == false, 1);
        assert!(!event.unused_tickets.contains(object::id(&ticket)), 2);
    }

    #[test]
    #[expected_failure]
    public fun test_verify_ticket_not_a_verifier() {
        // Define parameters
        let mut ctx = dummy();
        let mut event = dummy_event(ctx);

        let non_verifier_address = ctx.sender();

        let ticket = dummy_ticket(event, ctx);

        // Attempt to verify ticket (should fail because the sender is not a verifier)
        verify_ticket(&ticket, &mut event, ctx);
    }

    // create_ticket tests
    #[test]
    public fun test_create_ticket() {
        // Define parameters
        let mut ctx = dummy();
        let event_id = object::new(ctx);
        let ticket_price = 100;
        let sequence_number = 1;
        let event_url = Vector::from_bytes(b"https://example.com".to_vector());

        // Call the create_ticket function
        let ticket = create_ticket(event_id, ticket_price, sequence_number, event_url, ctx);

        // Assert
        assert!(ticket.event_id == event_id, 1); 
        assert!(ticket.price == ticket_price, 2);
        assert!(ticket.sequence_number == sequence_number, 3);
        assert!(ticket.owner == ctx.sender(), 4);
        assert!(Vector::from_bytes(&ticket.url) == Vector::from_bytes(&event_url), 5);
    }
}
