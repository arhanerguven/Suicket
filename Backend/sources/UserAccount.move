module TicketingApp::UserAccount {
    use std::string::String;

    // User Account structure
    public struct UserAccount has key, store {
        id: UID,
        owner: address,
        email: String,
        name: String,
        surname: String,
        password_hash: String,
        loyalty_points: u64,
        is_creator: bool,  // true for creator, false for customer
    }

    // Function to create a new user account
    public fun create_user_account(
        email: String,
        name: String,
        surname: String,
        password_hash: String,
        is_creator: bool,  // true for creator, false for customer
        ctx: &mut TxContext
    ): UserAccount {
        // Create the UserAccount
        UserAccount {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            email,
            name,
            surname,
            password_hash,
            loyalty_points: 0,
            is_creator,
        }
    }

    // Accessor functions
    public fun get_email(account: &UserAccount): &String {
        &account.email
    }

    public fun get_name(account: &UserAccount): &String {
        &account.name
    }

    public fun get_surname(account: &UserAccount): &String {
        &account.surname
    }

    public fun get_password_hash(account: &UserAccount): &String {
        &account.password_hash
    }

    public fun get_loyalty_points(account: &UserAccount): u64 {
        account.loyalty_points
    }

    public fun is_creator(account: &UserAccount): bool {
        account.is_creator
    }

    public fun is_customer(account: &UserAccount): bool {
        !account.is_creator // If not creator, it's a customer
    }
}