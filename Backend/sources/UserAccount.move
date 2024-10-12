module TicketingApp::UserAccount {
    use sui::object::{UID};
    use sui::tx_context::TxContext;
    use std::string::String;
    use std::string;

    // User Account structure
    public struct UserAccount has key {
        id: UID,
        owner: address,
        email: String,
        name: String,
        surname: String,
        password_hash: String,
        loyalty_points: u64,
        user_type: String, // e.g., "creator", "buyer"
    }

    // Function to create a new user account
    public fun create_user_account(
        email: String,
        name: String,
        surname: String,
        password_hash: String,
        user_type: String, // "creator" or "buyer"
        ctx: &mut TxContext
    ): UserAccount {
        UserAccount {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            email,
            name,
            surname,
            password_hash,
            loyalty_points: 0,
            user_type,
        }
    }

    // Function to check if the user is a creator
    public fun is_creator(user_account: &UserAccount): bool {
        string::eq(&user_account.user_type, &"creator")
    }

    // Function to check if the user is a customer
    public fun is_customer(user_account: &UserAccount): bool {
        string::eq(&user_account.user_type, &"buyer")
    }
}