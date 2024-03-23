import { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { BackgroundGradient } from "../../components/ui/background-gradient";

interface Collection {
  id: string;
  name: string;
  description: string;
  imageIpfsHash: string;
}

const Collection = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8060/collection/all"
        );
        setCollections(response.data.collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleClick = (id: string) => {
    console.log("ok");
    navigate({
      pathname: `/collection`,
      search: `?id=${id}`,
    });
    // history.push(`/collection/${id}`);
  };

  return (
    <>
      <Nav />
      <div
        className="container min-h-screen mx-auto px-4 bg-cover bg-black pb-10"
        // style={{
        //   backgroundImage: "url('/02.jpg')",
        // }}
      >
        <h1 className="text-4xl font-semibold mb-8 text-center text-white pt-5 ">
          Collections
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mx-56 ">
          {collections.map((collection) => (
            <BackgroundGradient className="rounded-[22px] max-w-auto bg-white dark:bg-zinc-900 p-6">
              <div
                key={collection.id}
                className=" rounded-lg overflow-hidden shadow-lg"
                onClick={() => handleClick(collection.id)} // Handle click event
                style={{ cursor: "pointer" }} // Change cursor to pointer
              >
                <div className="flex justify-center items-center">
                  <img
                    src={`https://nftstorage.link/ipfs/${collection.imageIpfsHash}`}
                    alt={collection.name}
                    className="w-72 h-72 object-cover rounded-lg"
                  />
                </div>
                <div className="pt-4">
                  <h2 className="text-xl font-semibold mb-2 text-teal-400">
                    {collection.name}
                  </h2>
                  <p className="text-gray-500">
                    Description:{" "}
                    <span className="text-indigo-400">
                      {collection.description}
                    </span>
                  </p>
                </div>
              </div>
            </BackgroundGradient>
          ))}
        </div>
      </div>
    </>
  );
};

export default Collection;
