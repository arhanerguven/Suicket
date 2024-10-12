module TicketingApp::EventTests {
    use TicketingApp::Event;
    use std::string::utf8;
    use sui::tx_context::dummy;

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
}