module TicketingApp::EventTests {
    use TicketingApp::Event;
    use std::string::utf8;
    use sui::tx_context::dummy;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;

    #[test]
    public fun test_create_event(ctx: &mut TxContext) {
        // Define test parameters
        let name = String::utf8(b"Test Event");
        let ticket_price = 100;
        let tickets_available = 10;

        // Call the create_event function
        let event = Event::create_event(name, ticket_price, tickets_available, ctx);

        // Assert the event's properties
        assert!(Event::get_name(&event) == &String::utf8(b"Test Event"), 1);
        assert!(Event::get_ticket_price(&event) == ticket_price, 2);
        assert!(vector::length(&event.ticket_pool) == tickets_available, 3);

        // Check each ticket in the ticket_pool
        let event_id = object::id(&event);
        let i = 0;
        while (i < tickets_available) {
            let ticket = vector::borrow(&event.ticket_pool, i);
            assert!(ticket.event_id == event_id, 4);
            assert!(ticket.owner == @0x0, 5); // Assuming tickets are initially unowned
            assert!(ticket.price == ticket_price, 6);
            assert!(ticket.sequence_number == ticket_price, 6);
            i = i + 1;
        }
    }

    #[test]
    fun test_buy_ticket() {
        // Initialize test context and objects
        let mut ctx_creator = dummy();
        let mut ctx_buyer = dummy(); // TODO check how to do tests
        let mut event = Event::new(/* parameters */);
        let user_coin = Coin::new(/* parameters */);

        let mut event = Event::create_event(
            utf8(b"Test Event"),
            100,  // Ticket price
            1,   // Tickets available
            &mut ctx_creator,
        );

        // Call the function
        let ticket = buy_ticket(&mut event, user_coin, &mut ctx);

        assert!(ticket.get_event_id() == object::id(&event), 100);
        assert!(ticket.get_owner() == tx_context::sender(&ctx_buyer), 102);
        assert!(ticket.get_price() == event.get_ticket_price(), 101);
    }

}