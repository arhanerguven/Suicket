module SuissTicket::UserAccount {

    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use std::string::String;

    // Define the UserAccount struct
    public struct UserAccount has key {
        id: UID,               // Unique identifier for the user account
        email: String,         // Email address of the user
        name: String,          // First name of the user
        surname: String,       // Last name of the user
        password_hash: String, // Hash of the user's password
        loyalty_points: u64,   // Points earned by the user
        user_type: String,     // e.g., "creator" , "buyer"
    }

    // Function to create a new user account
    public fun create_user_account(
        email: String,
        name: String,
        surname: String,
        password_hash: String,
        ctx: &mut TxContext
    ): UserAccount {
        UserAccount {
            id: object::new(ctx),
            email,
            name,
            surname,
            password_hash,
            loyalty_points: 0,
            user_type: "buyer",  // Default user type is "buyer", can be adjusted
        }
    }

    // Function to delete the user account (only by the user itself)
    public fun delete_user_account(
        user_account: UserAccount,
        ctx: &mut TxContext
    ) {
        // Ensure that only the owner (the one calling the function) can delete the account
        let sender = tx_context::sender(ctx);
        assert!(sender == object::owner(&user_account.id), 1);  // Error code 1 if not the owner

        // If the check passes, delete the account (burn the object)
        transfer::public_burn(user_account);
    }

    // Additional functions to manage the user account can be added here
}