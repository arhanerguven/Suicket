module TicketingApp::EventTests {
    use TicketingApp::Event;
    use std::string::utf8;
    use sui::tx_context::dummy;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    #[test]
    fun test_create_event() {
        let mut ctx = dummy();

        // Create an event
        let event = Event::create_event(
            utf8(b"Test Event"),
            100,  // Ticket price
            50,   // Tickets available
            true, // Refundable
            50,   // Max refund price
            200,  // Max resell price
            &mut ctx,
        );

        // Verify the event was created with the correct details
        assert!(Event::get_name(&event) == utf8(b"Test Event"), 1);
        assert!(Event::get_ticket_price(&event) == 100, 2);
        assert!(Event::get_refundable(&event) == true, 3);
        assert!(Event::get_resellable(&event) == true, 4);
        assert!(Event::get_max_refund_price(&event) == 50, 5);
        assert!(Event::get_max_resell_price(&event) == 200, 6);
        let dummy_address = @0x0;
        transfer::public_transfer(event, dummy_address);
    }

    #[test]
    fun test_update_event() {
        let mut ctx = dummy();

        // Create an event
        let mut event = Event::create_event(
            utf8(b"Test Event"),
            100,  // Ticket price
            50,   // Tickets available
            true, // Refundable
            50,   // Max refund price
            200,  // Max resell price
            &mut ctx,
        );

        // Update the event details
        Event::update_event_info(
            &mut event,
            120,  // New ticket price
            30,   // New tickets available
            false, // Not refundable anymore
            40,   // New max refund price
            180,  // New max resell price
            &mut ctx,
        );

        // Verify the updated event details
        assert!(Event::get_ticket_price(&event) == 120, 1);
        assert!(Event::get_tickets_available(&event) == 30, 2);
        assert!(Event::get_refundable(&event) == false, 3);
        assert!(Event::get_max_refund_price(&event) == 40, 4);
        assert!(Event::get_max_resell_price(&event) == 180, 5);
        let dummy_address = @0x0;
        transfer::public_transfer(event, dummy_address);
    }

    #[test]
    fun test_delete_event() {
        let mut ctx = dummy();

        // Create an event
        let event = Event::create_event(
            utf8(b"Test Event"),
            100,  // Ticket price
            50,   // Tickets available
            true, // Refundable
            50,   // Max refund price
            200,  // Max resell price
            &mut ctx,
        );

        // Delete the event
        Event::delete_event(event, &mut ctx);

        // After deletion, no further checks are necessary; the event is assumed to be removed.
    }

    #[test]
    fun test_buy_ticket() {
        let mut ctx_creator = dummy();
        let mut ctx_buyer = dummy();

        // Create an event
        let mut event = Event::create_event(
            utf8(b"Test Event"),
            100,  // Ticket price
            1,   // Tickets available
            true, // Refundable
            50,   // Max refund price
            200,  // Max resell price
            &mut ctx_creator,
        );

        // Mint coins for the buyer
        let user_coin = coin::mint_for_testing<SUI>(event.get_ticket_price(), &mut ctx_creator);

        // Buy a ticket
        let ticket = Event::buy_ticket(
            &mut event,           
            user_coin,             
            &mut ctx_buyer,        
        );

        assert!(ticket.get_event_id() == object::id(&event), 100);
        assert!(ticket.get_owner() == tx_context::sender(&ctx_buyer), 102);
        assert!(ticket.get_price() == event.get_ticket_price(), 101);

        let dummy_address = @0x0;
        transfer::public_transfer(ticket, dummy_address);
        Event::delete_event(event, &mut ctx_creator);
    }
}