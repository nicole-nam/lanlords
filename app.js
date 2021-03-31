//jshint esversion: 6
const client = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

client.setConfig({
  apiKey: "4808ca0108a1d5227b0675a578a63886-us7",
  server: "us7",
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
  };

  const run = async () => {
    const response = await client.lists.addListMember("daf158e89b", {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
    console.log(response);
    res.sendFile(__dirname + "/success.html");
    console.log(
      `Successfully added contact as an audience member. The contact's id is ${response.id}.`
    );
  };
  run().catch((e) => res.sendFile(__dirname + "/failure.html"));
});

app.post("/failure", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/success", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
