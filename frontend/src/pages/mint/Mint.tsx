import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Nav from "../../components/navbar/Navbar";

const Mint = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string>("");
  const { signAndSubmitTransaction, account } = useWallet();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

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

      const mintResponse = await signAndSubmitTransaction({
        sender: account!.address,
        data: {
          function: `${
            import.meta.env.VITE_CONTRACT_ADDRESS
          }::airnft::mint_new_token`,
          typeArguments: [],
          functionArguments: [
            description,
            name,
            `ipfs://${ipfsHash}`,
            1122334455,
          ],
        },
      });
      // Send POST request to localhost:8060/token
      const postTokenRequest = {
        collectionId: id,
        name: name,
        description: description,
        imageIpfsHash: imageHash,
        walletAddress: account?.address || "",
        price: "1", // Hardcoded price
        id: mintResponse.events[3].data.token_id,
      };

      const response = await fetch("http://localhost:8060/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postTokenRequest),
      });

      if (response.ok) {
        console.log("Token created successfully");
      } else {
        console.error("Error creating token");
      }
    } catch (error) {
      console.error("Error uploading image or metadata:", error);
    }
    navigate({
      pathname: `/collection`,
      search: `?id=${id}`,
    });
  };
  return (
    <>
      <Nav />

      <div
        className="min-h-screen bg-cover bg-center flex justify-center bg-slate-950"
        // style={{
        //   backgroundImage: "url('/bg.jpg')",
        // }}
      >
        <div className="max-w-lg mx-auto flex flex-col items-center">
          <h2 className="text-4xl font-bold mb-8 mt-12 text-white">Mint</h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="border border-cyan-400 border-2 p-6 rounded-md bg-transparent py-16 px-10"
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100"
              >
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                placeholder="Name"
                onChange={handleNameChange}
                className="mt-1 bg-transparent text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-100"
              >
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                placeholder="Description"
                onChange={handleDescriptionChange}
                className="mt-1 bg-transparent text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-100"
              >
                Image:
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 bg-transparent text-white focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-1"
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
              className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-transparent hover:border-2  hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
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
    </>
  );
};

export default Mint;
