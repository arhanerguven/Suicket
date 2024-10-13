// import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
// import React from 'react';

// function UserCoins() {
//     const account = useCurrentAccount();
    
//     // If the account is not connected, show a message
//     if (!account) {
//         return <div>Please connect your wallet to see your SUI coins.</div>;
//     }

//     // Query to get owned coin objects
//     const { data, isLoading, error } = useSuiClientQuery('getOwnedObjects', {
//         owner: account.address,
//         filter: {
//             StructType: 'Coin<SUI>', // Filter for SUI coins
//         },
//     });

//     // Handle loading state
//     if (isLoading) {
//         return <div>Loading your coins...</div>;
//     }

//     // Handle error state
//     if (error) {
//         return <div>Error fetching coins: {error.message}</div>;
//     }

//     // Render the list of coins
//     return (
//         <div>
//             <h2>Your SUI Coins</h2>
//             {data.data.length > 0 ? (
//                 <ul>
//                     {data.data.map((coin) => (
//                         <li key={coin.data?.objectId}>
//                             <strong>Coin ID:</strong> {coin.data?.objectId} <br />
//                             <strong>Balance:</strong> {coin.data?.balance.value}
//                         </li>
//                     ))}
//                 </ul>
//             ) : (
//                 <p>No SUI coins found.</p>
//             )}
//         </div>
//     );
// }

// export default UserCoins;
