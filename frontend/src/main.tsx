import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage.tsx";
import Owner from "./pages/owner/Owner.tsx";
import BuyPage from "./pages/buy/Buy.tsx";
import BreedPage from "./pages/breed/Breed.tsx";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import Mint from "./pages/mint/Mint.tsx";
import LaunchCollection from "./pages/launchCollection/LaunchCollection.tsx";

const wallets = [new PetraWallet()];
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/owned",
    element: <Owner />,
  },
  {
    path: "/buy",
    element: <BuyPage />,
  },
  {
    path: "/breed",
    element: <BreedPage />,
  },
  {
    path: "/mint",
    element: <Mint />,
  },
  {
    path: "/launch",
    element: <LaunchCollection />,
  },
  // {
  //   path: "/contact",
  //   element: <ContactPage />,
  // },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <RouterProvider router={router} />;
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);
