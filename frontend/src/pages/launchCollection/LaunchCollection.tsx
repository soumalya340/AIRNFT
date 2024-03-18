import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const LaunchCollection = () => {
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
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNBNDlDN0UzNDIwREEwNzUwRjIwMTcxZDg4OTQ0MjE0MGY1MDJEQjQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNDczMDYzNjQyNiwibmFtZSI6ImxhemFydXMifQ.hhlIUivSknC150OzUWrD2cp8wIW3haa60r2VdNlg3pc", // Replace YOUR_API_KEY with your actual API key
        },
        body: formData,
      });

      const imageData = await uploadResponse.json();
      const cid = imageData.value.cid;

      // Form data for uploading metadata with the CID
      const metadata = {
        name,
        description,
        image: `ipfs://${cid}`, // Include the CID in the image field
        // Add other metadata fields as needed
      };

      const metadataResponse = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDNBNDlDN0UzNDIwREEwNzUwRjIwMTcxZDg4OTQ0MjE0MGY1MDJEQjQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcwNDczMDYzNjQyNiwibmFtZSI6ImxhemFydXMifQ.hhlIUivSknC150OzUWrD2cp8wIW3haa60r2VdNlg3pc", // Replace YOUR_API_KEY with your actual API key
        },
        body: JSON.stringify(metadata),
      });

      const metadataData = await metadataResponse.json();
      const ipfsHash = metadataData.value.cid;

      setIpfsHash(ipfsHash);

      const mintResponse = await signAndSubmitTransaction({
        sender: account!.address,
        data: {
          function:
            "0xb8c95dfb8b5957336b2fed573d546a269cebfeee5b51f72e0a857877ebd9465f::airnft::launch_collection",
          typeArguments: [],
          functionArguments: [description, `ipfs://${ipfsHash}`],
        },
      });
      console.log("created collection:", mintResponse);
    } catch (error) {
      console.error("Error uploading image or metadata:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 mt-12">Launch Collection</h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="border border-gray-300 p-6 rounded-md"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>
            <textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image:
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="mt-2 max-w-lg"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload Image
          </button>
        </form>
        {ipfsHash && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">IPFS Hash:</h3>
            <p className="mt-2">{ipfsHash}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default LaunchCollection;
