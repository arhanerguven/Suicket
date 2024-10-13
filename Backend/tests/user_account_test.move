module TicketingApp::UserAccountTests {
    use TicketingApp::UserAccount;
    use std::string::utf8;
    use sui::tx_context::dummy;

    #[test]
    public fun test_create_user_account() {
        // Define parameters
        let mut ctx = dummy();
        
        let user_email = b"user@example.com".to_vector();
        let user_name = b"John Doe".to_vector();          

        // Call the create_user_account function
        let user_account = UserAccount::create_user_account(user_email, user_name, ctx);

        // Assert
        assert!(user_account.owner == ctx.sender(), 1);        
        assert!(user_account.email == user_email, 2);         
        assert!(user_account.name == user_name, 3);             
        assert!(user_account.loyalty_points == 0, 4);           
    }
}