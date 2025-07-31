import React, { useState } from "react";
import ReactLoading from "react-loading";
import budget from "../assets/budget_.png";
export default function SetBudget(props) {
  const [monthlyBudget, setMonthlyBudget] = useState({
    budget: "",
  });
  const [error, setError] = useState({
    budget: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const HandleSetBudget = async (e) => {
    setIsLoading(true);

    setError({
      budget: "",
    });

    const res = await fetch("/expense/setbudget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(monthlyBudget),
    });
    const data = await res.json();
    console.log(data);

    if (data.errors) {
      setIsLoading(false);
      setError(data.errors);
    } else {
      setIsLoading(false);
      props.closeModalBudget();
      window.location.reload();
    }
  };

  return (
    <div className="grid grid-cols-3 text-jp-white h-fit font-lexend">
      <div className="col-span-3 bg-rp-black h-fit p-10 py-14 rounded-md">
        <div className="flex justify-between items-start">
          {/* Left section: all text and input */}
          <div className="flex flex-col">
            <h1 className="font-bold text-xl mt-3 text-black">Set Budget</h1>
            <div className="mt-4">
              <label className="w-fit text-black">
                what's your budget amount?
              </label>
            </div>

            <div className="flex bg-jp-black w-fit mt-4 p-2 rounded">
              <h1 className="font-bold text-xl text-black">₹</h1>
              <input
                value={monthlyBudget.budget}
                onChange={(e) => {
                  const tempBudget = { ...monthlyBudget };
                  tempBudget.budget = e.target.value;
                  setMonthlyBudget(tempBudget);
                }}
                type="number"
                placeholder=""
                className="setbuget-input bg-jp-black ml-4 outline-none text-black"
              />
            </div>
            <span className="text-sm text-red-500">{error.msg}</span>

            <div className="mt-20 border-rp-yellow border-2 w-fit rounded-md">
              {isLoading ? (
                <ReactLoading
                  type="bubbles"
                  color="#645394"
                  height={50}
                  width={50}
                />
              ) : (
                <button
                  onClick={HandleSetBudget}
                  className="p-2 px-3 rounded-lg font-bold text-rp-yellow hover:bg-jp-yellow hover:scale-105 transition-transform"
                >
                  Save Budget
                </button>
              )}
            </div>
          </div>

          {/* Right section: Image */}
          <img
            src={budget}
            alt="Budget Illustration"
            className="w-52 h-auto ml-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
