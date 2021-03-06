import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

function Transfer() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(0);
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    const getCurrentUserDetails = async () => {
      let data = await axios.get(
        `https://powerful-reaches-83567.herokuapp.com/user/${id}`
      );
      data = await data.data;
      setUserDetails(data.user);
    };
    getCurrentUserDetails();
    const getAllUserDetails = async () => {
      let data = await axios.get(
        "https://powerful-reaches-83567.herokuapp.com/listAllUsers"
      );
      data = await data.data;
      setAllUsers(data.map((details) => details.name));
    };
    getAllUserDetails();
  }, [id]);
  const userSelectHandler = (e) => {
    console.log(e.target.innerHTML);
    setName(e.target.innerHTML);
  };
  const changeAmountHandler = (e) => {
    setAmount(e.target.value);
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const transferData = {
      receiver: name,
      sender: userDetails.name,
      amtTransfered: parseInt(amount),
      transferDate: new Date(),
    };
    axios.post(
      `https://powerful-reaches-83567.herokuapp.com/transfer/${id}`,
      transferData
    );
    setTimeout(() => {
      navigate("/transferHistory");
    }, 2000);
    setSubmitClicked(1);
  };
  return (
    <div className="container-fluid">
      <div className="container d-flex col-12 mt-3">
        <form onSubmit={onSubmitHandler}>
          <p>Id: {userDetails.accId}</p>
          <p>Email: {userDetails.email}</p>
          <p>Name: {userDetails.name}</p>
          <p>Balance: {userDetails.currentBalance}</p>
          <div className="">
            <Autocomplete
              disablePortal
              options={allUsers}
              renderInput={(params) => (
                <TextField {...params} label="Customer" />
              )}
              onChange={userSelectHandler}
            />
            <TextField
              type="number"
              id="standard-basic"
              label="Amount"
              variant="standard"
              onChange={changeAmountHandler}
            />
          </div>
          <Button variant="contained" type="submit" className="mt-3">
            Make Transaction
          </Button>
        </form>
      </div>
      {submitClicked && (
        <div class="container mt-3 alert alert-success" role="alert">
          Transaction Successful???check it out in History
        </div>
      )}
    </div>
  );
}

export default Transfer;
