import React from 'react'
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/dist/cjs/client";
import { Transaction } from "@mysten/sui/dist/cjs/transactions";
import { useNetworkVariable } from "../networkConfig";

interface MyTicketsProps {
  address: string;
}

const MyTickets: React.FC<MyTicketsProps> = ({ address }) => {
  return (
    <div>MyTickets {address}</div>
  )
}

export default MyTickets