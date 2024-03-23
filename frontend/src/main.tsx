import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage.tsx";
import Owner from "./pages/owner/Owner.tsx";
import BuyPage from "./pages/buy/Buy.tsx";
import BreedPage from "./pages/breed/Breed.tsx";
import WheelOfPrizes from "./pages/wheel_of_prizes/WheelOfPrizes.tsx";
import Form from "./pages/form/Form.tsx";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import Mint from "./pages/mint/Mint.tsx";
import LaunchCollection from "./pages/launchCollection/LaunchCollection.tsx";
import Collection from "./pages/collection/Collection.tsx";
import Settings from "./pages/settings/Settings.tsx";
import ChatBot from "./components/chat/Chatbot.tsx";
import Animation from "./pages/breed/Animation.tsx";
import Community from "./pages/community/community.tsx";
import Nft from "./pages/nft/Nft.tsx";

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

  {
    path: "/collections",
    element: <Collection />,
  },
  {
    path: "/collection",
    element: <Nft />,
  },

  {
    path: "/spin",
    element: <Form />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/chatbot",
    element: <ChatBot />,
  },
  {
    path: "/animation",
    element: <Animation />,
  },
  {
    path: "/community",
    element: <Community />,
  },
  {
    path: "/nft",
    element: <Nft />,
  },
  // {
  //   path: "/contact",
  //   element: <ContactPage />,
  // },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <RouterProvider router={router} />
    </AptosWalletAdapterProvider>
  </React.StrictMode>
);
