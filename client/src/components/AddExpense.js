import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker2 from "./DatePicker2";
import ReactLoading from "react-loading";
import { Scrollbars } from "react-custom-scrollbars";

const AddExpense = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [splitBill, setSplitBill] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [splitAmount, setSplitAmount] = useState(0);

  const navigate = useNavigate();
  const [expense, setExpense] = useState({
    amount: "",
    desc: "",
    date: "",
    category: "General",
  });

  const [error, setError] = useState({
    amount: "",
    desc: "",
  });
  console.log("editExpense in modal:", props.editExpense);

  //for editing expesne
  useEffect(() => {
    if (props.editExpense) {
      setExpense({
        amount: props.editExpense.amount?.$numberDecimal || "",
        desc: props.editExpense.desc || "",
        date: props.editExpense.date?.slice(0, 10) || "", // formatted for input
        category: props.editExpense.category || "General",
      });
    } else {
      // If creating new
      setExpense({
        amount: "",
        desc: "",
        date: "",
        category: "General",
      });
    }
  }, [props.editExpense]);

  //edit ends here

  useEffect(() => {
    if (expense.category === "Split Bill") {
      setSplitBill(true);
    } else {
      setSplitBill(false);
      setNumberOfPeople(1);
      setSplitAmount(0);
    }
  }, [expense.category]);

  useEffect(() => {
    if (splitBill && expense.amount && numberOfPeople) {
      setSplitAmount((expense.amount / numberOfPeople).toFixed(2));
    } else {
      setSplitAmount(0);
    }
  }, [splitBill, expense.amount, numberOfPeople]);

  // const handleAddExpense = async (e) => {
  //   setIsLoading(true);
  //   setError({
  //     msg: "",
  //   });
  //   const url = props.editExpense
  //     ? `/expense/updateexpense/${props.editExpense._id}`
  //     : "/expense/addexpense";

  //   const method = props.editExpense ? "PUT" : "POST";

  //   const res = await fetch(url, {
  //     //"/expense/addexpense"
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(expense),
  //   });
  //   const data = await res.json();
  //   if (data.errors) {
  //     setIsLoading(false);
  //     setError(data.errors);
  //     console.log(data.errors);
  //   } else {
  //     setIsLoading(false);
  //     props.closeModalExpense();
  //     navigate("/dashboard");
  //     window.location.reload();
  //   }
  // };

  const handleAddExpense = async (e) => {
    setIsLoading(true);
    setError({
      msg: "",
    });

    const url = props.editExpense
      ? `/expense/updateexpense/${props.editExpense._id}`
      : "/expense/addexpense";

    const method = props.editExpense ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method, // Changed from hardcoded "POST"
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Needed for auth
        body: JSON.stringify({
          ...expense,
          amount: parseFloat(expense.amount), // Ensure amount is a number
        }),
      });

      const data = await res.json();
      if (data.errors) {
        setError(data.errors);
      } else {
        props.closeModalExpense();
        if (props.editExpense && props.updateExpenseInList) {
          props.updateExpenseInList(data.updated || data.expense);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setError({ msg: "Something went wrong" });
    } finally {
      setIsLoading(false);
    }
    window.location.reload();
  };

  const handleShare = () => {
    const message = `You have to pay ₹${splitAmount} for the shared expense.`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Scrollbars style={{ width: 540, height: 500 }} className="mt-8">
      <div className=" grid grid-cols-2 font-lexend ">
        <div className="col-span-4 bg-rp-black p-6 ">
          <div className=" flex mt-4 ">
            {/* <h1 className="text-jp-white text-2xl font-bold ">Add Expense</h1> */}
            <h1 className="text-custom-black text-2xl font-bold">
              {props.editExpense ? "Edit Expense" : "Add Expense"}
            </h1>
          </div>
          <div className=" text-custom-black flex mt-4 ">
            <h1 className="text-custom-black text-4xl border-b-2 mt-2">₹</h1>
            <input
              className="p-3 bg-rp-black text-3xl w-3/4 border-b-2 outline-none "
              placeholder="0"
              type="number"
              value={expense.amount}
              onChange={(e) => {
                const tempExpense = { ...expense };
                tempExpense.amount = e.target.value;
                setExpense(tempExpense);
              }}
            ></input>
          </div>
          <span className="pt-1 text-sm text-red-500 font-lexend">
            {error.msg}
          </span>
          <div>
            <input
              className="p-3 px-4 rounded-md mt-6  w-3/4 placeholder-rp-yellow bg-jp-black outline-none text-custom-black"
              placeholder="What was this expense for?"
              value={expense.desc}
              onChange={(e) => {
                const tempExpense = { ...expense };
                tempExpense.desc = e.target.value;
                setExpense(tempExpense);
              }}
            ></input>
          </div>
          <div className="">
            <DatePicker2 expense={expense} setExpense={setExpense} />
          </div>
          <div>
            <h1 className="text-custom-black text-jp-slate font-bold  mt-4">
              Category
            </h1>
          </div>
          <div className="text-mj-black">
            <select
              className="bg-jp-black text-custom-black px-3 py-2 my-1 rounded"
              name="Categories"
              id="categories"
              value={expense.category}
              onChange={(e) => {
                const tempExpense = { ...expense };
                tempExpense.category = e.target.value;
                setExpense(tempExpense);
              }}
            >
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Fuel">Fuel</option>
              <option value="Grocery">Grocery</option>
              <option value="Shopping">Shopping</option>
              <option value="Travel">Travel</option>
              <option value="Fun">Fun</option>
              <option value="Split Bill">Split Bill</option>
            </select>
          </div>
          {splitBill && (
            <div className="mt-4">
              <input
                className="p-3 px-4 rounded-md w-3/4 placeholder-rp-yellow bg-jp-black outline-none text-custom-black"
                type="number"
                placeholder="Number of people"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
              ></input>
              <div className="mt-2 text-custom-black">
                Each person should pay: ₹{splitAmount}
              </div>
              <button
                onClick={handleShare}
                className="mt-2 p-2 bg-green-500 text-white rounded"
              >
                Share on WhatsApp
              </button>
            </div>
          )}
          <div className="border-rp-yellow border-2 rounded-md w-fit px-8 mt-10">
            {isLoading ? (
              <ReactLoading
                type="bubbles"
                color="#645394"
                height={50}
                width={50}
              />
            ) : (
              <button
                onClick={handleAddExpense}
                className="font-bold text-white bg-jp-yellow py-4 px-6 rounded-md"
              >
                Save Expense
              </button>
            )}
          </div>
        </div>
      </div>
    </Scrollbars>
  );
};

export default AddExpense;
