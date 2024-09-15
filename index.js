


const fs = require("node:fs"); // for reading/writing files
// create the server
const express = require("express");
const app = express();

// put all your existing files in a folder called static (you can change the name)
const STATIC_FOLDER = "static";
var fileText;
var roomCode = "main";
var blacklist = ["testingbansdax"]
var readonlychat = false;

app.use(express.static(__dirname + "/" + STATIC_FOLDER));

// set the default page
app.get("/", function(req, res) {
	res.sendFile(__dirname + "/" + STATIC_FOLDER + "/index.js");
});

// this just handles parsing requests into JSON when neccessary (this should be above any `GET` or `POST` request handlers)
app.use(express.json());

app.get("/read", function(req, res) {
	fs.readFile(__dirname + "/" + roomCode + ".txt", function(err, data) {
		if (err) {
			res.send("Error reading file");
		} else {
			fileText = data.toString();
			res.send(data.toString());
		}
	});
});

app.get("/getbanlist", function(req, res) {
	res.send(blacklist);
});
/*
fs.writeFile(__dirname + "/" + roomCode + ".txt", "", function(err){
	if(err){
		res.json({
			success: false,
			error: err
		});
	} else {
		res.send({
			success: true
		});
	}
})
*/
app.post("/write", function(req, res) {
	let dollarsign = req.body.data.split("|")
	console.log(dollarsign)
	if(blacklist.includes(dollarsign[1])){
		console.log(dollarsign[1] + " tried to chat: '" + dollarsign[1] + "' (BANNED)")
	} else {
		if(dollarsign[2] !== null && dollarsign[1] != ""){
			fs.writeFile(__dirname + "/" + roomCode + ".txt", fileText + dollarsign[0] + "\n" + dollarsign[1] + ": " + dollarsign[2] + "\n\n", function(err) {

				if (err) {
					res.json({
						success: false,
						error: err
					});
				} else {
					res.send({
						success: true
					});
				}
			});
		}
	}
	
	
});

app.post("/ban", function(req, res) {
	let value = req.body.data.split("|")
	let user = value[0]
	let type = value[1]
	if(type == "ban"){
		if(blacklist.includes(user)){
			console.log(user + " is already banned.")
		} else {
			blacklist.push(user)
			console.log(user + " is now banned!")
		}
	}
	if(type == "unban"){
		if(blacklist.includes(user)){
			const newArray = blacklist.filter(item => item !== user)
			blacklist = newArray
			console.log(user + " is now unbanned!")
		} else {
			console.log(user + " wasn't already banned.")
		}
	}
});

app.post("/clear", function(req, res){
	fs.writeFile(__dirname + "/" + roomCode + ".txt", "", function(err){
		if(err){
			res.json({
				success: false,
				error: err
			});
		} else {
			res.send({
				success: true
			});
		}
	})
})

app.post("/readonly", function(req, res){
	let value = req.body.data;
	if(value == "true"){
		readonlychat = true;
	} else {
		readonlychat = false;
	}
})



// start the server
app.listen(3000);