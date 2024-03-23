import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Nav from "../../components/navbar/Navbar";
import axios from "axios";
import { BackgroundBeams } from "../../components/ui/background-beams";
import { motion } from "framer-motion";
import { LampContainer } from "../../components/ui/lamp";

const LaunchCollection = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const { signAndSubmitTransaction, account } = useWallet();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImage(file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if an image is selected
    if (!image) {
      console.error("Please select an image");
      return;
    }

    // Form data for uploading the image
    const formData = new FormData();
    formData.append("file", image);

    try {
      // Upload image to NFT.storage
      const uploadResponse = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_NFTSTORAGE_KEY}`,
        },
        body: formData,
      });

      const imageData = await uploadResponse.json();
      const cid = imageData.value.cid;
      const imageHash = `${cid}/${image.name}`;
      // Form data for uploading metadata with the CID
      const metadata = {
        name,
        description,
        image: `ipfs://${cid}/${image.name}`, // Include the CID in the image field
        // Add other metadata fields as needed
      };

      const metadataResponse = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_NFTSTORAGE_KEY}`,
        },
        body: JSON.stringify(metadata),
      });

      const metadataData = await metadataResponse.json();
      const ipfsHash = metadataData.value.cid;

      setIpfsHash(ipfsHash);

      // const mintResponse = await signAndSubmitTransaction({
      //   sender: account!.address,
      //   data: {
      //     function: `${
      //       import.meta.env.VITE_CONTRACT_ADDRESS
      //     }::airnft::launch_collection`,
      //     typeArguments: [],
      //     functionArguments: [description, `ipfs://${ipfsHash}`],
      //   },
      // });
      // console.log("created collection:", mintResponse);

      // Post form details and image IPFS hash to backend using Axios
      await axios.post("http://localhost:8060/collection", {
        name,
        description,
        imageIpfsHash: imageHash,
        metadataIpfsHash: ipfsHash,
        walletAddress: account?.address,
        // Add other form fields as needed
      });

      navigate("/collections");
    } catch (error) {
      console.error("Error uploading image or metadata:", error);
    }
  };
  return (
    <>
      <Nav />
      <BackgroundBeams />

      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 500 }}
          whileInView={{ opacity: 1, y: 300 }}
          transition={{
            delay: 0.3,
            duration: 0.4,
            ease: "easeInOut",
          }}
          className="m-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          <div
            className="min-h-screen bg-cover bg-center flex justify-center "
            // style={{
            //   backgroundImage: "url('/bg.jpg')",
            // }}
          >
            <div className="max-w-lg mx-auto flex flex-col items-center ">
              <h2 className="text-4xl font-bold mb-4 mt-12 mb-12">
                Launch Collection
              </h2>
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="border border-cyan-500 border-2 p-6 rounded-md bg-transparent"
              >
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block  font-medium text-gray-100 text-lg mb-2"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    placeholder="Name"
                    onChange={handleNameChange}
                    className="mt-1 text-white bg-transparent focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-lg  font-medium text-gray-100 text-lg mb-2"
                  >
                    Description:
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    placeholder="Description"
                    onChange={handleDescriptionChange}
                    className="mt-1 text-white bg-transparent focus:ring-indigo-500 focus:border-indigo-500 block w-full text-black shadow-sm sm:text-sm p-2 border-2"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-lg font-medium text-gray-100 text-lg mb-2"
                  >
                    Image:
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 text-white bg-transparent focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-1"
                  />
                  {uploadedImage && (
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="mt-2 max-w-lg"
                      style={{ maxWidth: "100%", maxHeight: "400px" }}
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-lg py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Launch Collection
                </button>
              </form>
              {ipfsHash && (
                <div className="mt-4">
                  <h3 className="text-lg font-bold">IPFS Hash:</h3>
                  <p className="mt-2">{ipfsHash}</p>
                </div>
              )}
            </div>
          </div>
        </motion.h1>
      </LampContainer>
    </>
  );
};
export default LaunchCollection;
