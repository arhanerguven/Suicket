module TicketingApp::UserAccountTests {
    use TicketingApp::UserAccount;
    use std::string::utf8;
    use sui::tx_context::dummy;

    #[test]
    fun test_create_user_account() {
        let mut ctx = dummy();
        let email = utf8(b"user@example.com");
        let name = utf8(b"John");
        let surname = utf8(b"Doe");
        let password_hash = utf8(b"hashed_password");
        let user_type_creator = utf8(b"creator");
        let user_type_buyer = utf8(b"buyer");

        // Test creating a creator account
        let creator_account = UserAccount::create_user_account(
            email,
            name,
            surname,
            password_hash,
            user_type_creator,
            &mut ctx
        );
        assert!(UserAccount::is_creator(&creator_account), 1);
        assert!(!UserAccount::is_customer(&creator_account), 2);

        // Consume the creator account by overwriting it
        let _ = creator_account;

        // Test creating a buyer account
        let buyer_account = UserAccount::create_user_account(
            email,
            name,
            surname,
            password_hash,
            user_type_buyer,
            &mut ctx
        );
        assert!(UserAccount::is_customer(&buyer_account), 3);
        assert!(!UserAccount::is_creator(&buyer_account), 4);

        // Consume the buyer account by overwriting it
        let _ = buyer_account;
    }
}