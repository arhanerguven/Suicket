module 0x0::UserAccount {
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
    }

    // Function to create a new user account
    public fun create_user_account(
        email: String,
        name: String,
        surname: String,
        password_hash: String,
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

}