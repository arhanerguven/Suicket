module TicketingApp::UserAccount {
    use std::string::String;

    public struct UserAccount has key, store {
        id: UID,                // Unique identifier for the user
        owner: address,         // User address
        email: String,          // User email
        name: String,           // User name (for in person verification)
        loyalty_points: u64,    // The number of loyalty points
    }

    // Create a new user account
    public fun create_user_account(
        email: String,
        name: String,
        ctx: &mut TxContext
    ): UserAccount {
        UserAccount {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            email,
            name,
            loyalty_points: 0,
        }
    }

    // ----------- Getters ------------

    public fun get_email(account: &UserAccount): &String {
        &account.email
    }

    public fun get_name(account: &UserAccount): &String {
        &account.name
    }

    public fun get_loyalty_points(account: &UserAccount): u64 {
        account.loyalty_points
    }
}