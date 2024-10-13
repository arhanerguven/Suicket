import { getFullnodeUrl } from "@mysten/sui/client";
import {
  DEVNET_TICKETING_APP_PACKAGE_ID,
  MAINNET_TICKETING_APP_PACKAGE_ID,
  TESTNET_TICKETING_APP_PACKAGE_ID,
} from './constants';
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        ticketingAppPackageId: DEVNET_TICKETING_APP_PACKAGE_ID, 
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        ticketingAppPackageId: TESTNET_TICKETING_APP_PACKAGE_ID,
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        ticketingAppPackageId: MAINNET_TICKETING_APP_PACKAGE_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
