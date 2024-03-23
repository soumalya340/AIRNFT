import { useState } from "react";
import "./Form.css";
import Wheel from "../../components/spinner_wheel/Wheel";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [candidateName1, setCandidateName1] = useState<string>("");
  const [candidateName2, setCandidateName2] = useState<string>("");
  const [candidateName3, setCandidateName3] = useState<string>("");
  const [candidateName4, setCandidateName4] = useState<string>("");
  const [candidateName5, setCandidateName5] = useState<string>("");
  const [isWheelOpen, setIsWheelOpen] = useState<boolean>(false);
  // If you want to add more candidate you not only have to increase the state variables and input but also add candidates in candidateNamesArray
  const candidateNamesArray = [
    { name: candidateName1, setName: setCandidateName1 },
    { name: candidateName2, setName: setCandidateName2 },
    { name: candidateName3, setName: setCandidateName3 },
    { name: candidateName4, setName: setCandidateName4 },
    { name: candidateName5, setName: setCandidateName5 },
  ];

  const navigate = useNavigate();

  const handleSubmitFormForSpin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsWheelOpen(true);
  };

  return (
    <>
      <Navbar />
      <section className="grid grid-cols-2 pt-5 mb-5 bg-slate-950 min-h-screen">
        <div id="grid-item-1" className="ml-5 mr-2 ">
          <form
            encType="multipart/form-data"
            className="border border-gray-300 p-6 rounded-md bg-transparent w-full"
            onSubmit={handleSubmitFormForSpin}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Name1:
              </label>
              <input
                type="text"
                id="name"
                value={candidateName1}
                onChange={(event) => {
                  setCandidateName1(event.target.value);
                }}
                placeholder="Name1"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Name2:
              </label>
              <input
                type="text"
                id="name"
                value={candidateName2}
                onChange={(event) => setCandidateName2(event.target.value)}
                placeholder="Name2"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Name3:
              </label>
              <input
                type="text"
                id="name"
                value={candidateName3}
                onChange={(event) => setCandidateName3(event.target.value)}
                placeholder="Name3"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Name4:
              </label>
              <input
                type="text"
                id="name"
                value={candidateName4}
                onChange={(event) => setCandidateName4(event.target.value)}
                placeholder="Name4"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Name5:
              </label>
              <input
                type="text"
                id="name"
                value={candidateName5}
                onChange={(event) => setCandidateName5(event.target.value)}
                placeholder="Name5"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm p-2 border-2 "
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                navigate("/spin");
              }}
            >
              Create your own referral
            </button>
          </form>
        </div>
        <div id="grid-item-2" className="ml-2 mr-5">
          {isWheelOpen && (
            <Wheel
              candidateNamesArray={candidateNamesArray.map(
                (candidate) => candidate.name
              )}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Form;
