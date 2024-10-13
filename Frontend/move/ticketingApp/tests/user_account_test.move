module TicketingApp::UserAccountTests {
    use TicketingApp::UserAccount;
    use std::string::utf8;
    use sui::tx_context::dummy;

    #[test]
    fun test_create_and_consume_user_account() {
        let mut ctx = dummy();

        // Test 1: Creating a customer (is_creator = false)
        let customer_account = UserAccount::create_user_account(
            utf8(b"user@example.com"),
            utf8(b"John"),
            utf8(b"Doe"),
            utf8(b"hashed_password"),
            &mut ctx,
        );
        // Test 2: Creating a creator (is_creator = true)
        let creator_account = UserAccount::create_user_account(
            utf8(b"creator@example.com"),
            utf8(b"Jane"),
            utf8(b"Smith"),
            utf8(b"creator_password"),
            &mut ctx,
        );
        // Consume the accounts by transferring them to a dummy address
        let dummy_address = @0x0;
        transfer::public_transfer(customer_account, dummy_address);
        transfer::public_transfer(creator_account, dummy_address);
    }
}