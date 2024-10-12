module TicketingApp::Tests {
    use 0x1::Test;  // Import the Move testing framework
    use TicketingApp::UserAccount;
    use sui::tx_context::TxContext;

    // Test for creating a user account
    public fun test_create_user_account() {
        let ctx = TxContext::zero();  // Create a dummy transaction context

        // Create a user account (buyer type)
        let user_account = UserAccount::create_user_account(
            b"testuser@example.com",   // Email
            b"John",                   // First name
            b"Doe",                    // Last name
            b"hashed_password",        // Password hash
            b"buyer",                  // User type ("buyer")
            &mut ctx                   // Transaction context
        );

        // Check if the account fields are set correctly
        Test::assert(user_account.email == b"testuser@example.com", 1);  // Assert email is correct
        Test::assert(user_account.name == b"John", 2);                   // Assert first name is correct
        Test::assert(user_account.surname == b"Doe", 3);                 // Assert last name is correct
        Test::assert(user_account.password_hash == b"hashed_password", 4);  // Assert password hash
        Test::assert(user_account.user_type == b"buyer", 5);             // Assert user type is "buyer"
        Test::assert(user_account.loyalty_points == 0, 6);               // Assert loyalty points is 0
    }
}