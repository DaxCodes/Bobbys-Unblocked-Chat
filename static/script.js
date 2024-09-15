var cooldown = false;

function changeTimeFormat() {
	let date = new Date();

	let hours = date.getHours();
	let minutes = date.getMinutes();

	// Check whether AM or PM
	let newformat = hours >= 12 ? "PM" : "AM";

	// Find current hour in AM-PM Format
	hours = hours % 12;

	// To display "0" as "12"
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? "0" + minutes : minutes;

	return hours + ":" + minutes + " " + newformat;
}

if (localStorage.getItem("nick") == undefined) {
	var username = prompt("Enter a nickname:");
	localStorage.setItem("nick", username);
}
if (localStorage.getItem("namechangetime") == undefined) {
	localStorage.setItem("namechangetime", 0);
}

const globalvariable_elem = document.getElementById("globalvariable");
var newText;

var messageBody = document.querySelector("#chat");
messageBody.scrollTop = messageBody.scrollHeight;

fetch("/read")
	.then((res) => res.text())
	.then((data) => newText(data));

const globalvariable_input = document.getElementById("toglobalvariable");

var commandinput = document.getElementById("commandinput");

document.getElementById("submit").addEventListener("click", function () {
	if (globalvariable_input.value != "/auth" && cooldown == false) {
		if (globalvariable_input.value.includes("|")) {
			alert("Your message contains banned characters. Try again.");
		} else {
			fetch("/write", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					data:
						changeTimeFormat() +
						"|" +
						localStorage.getItem("nick") +
						"|" +
						globalvariable_input.value,
				}),
			}).then(() => finalsendMessage());
		}
	} else {
		let enteredPass = prompt("[ Admin Key Required ]");
		if (enteredPass == "admin*7") {
			commandinput.style.display = "inline";
			globalvariable_input.value = "";
		} else {
			alert("Incorrect Key.");
			globalvariable_input.value = "";
		}
	}
});

function newText(asdf) {
	globalvariable_elem.textContent = asdf;
	newText = asdf;
}

setInterval(function () {
	fetch("/read")
		.then((res) => res.text())
		.then((data) => (globalvariable_elem.textContent = data));
	messageBody.scrollTop = messageBody.scrollHeight;
}, 3250);

setInterval(function(){
	if (localStorage.getItem("changenametime") > 0) {
		localStorage.setItem(
			"changenametime",
			localStorage.getItem("changenametime") - 1,
		);
	}
}, 1000)

function finalsendMessage() {
	fetch("/read")
		.then((res) => res.text())
		.then((data) => (globalvariable_elem.textContent = data));
	cooldown = true;
	globalvariable_input.value = "";
	globalvariable_input.placeholder = "type whatever here (1s cooldown)";
	setTimeout(function(){
		cooldown = false;
		globalvariable_input.placeholder = "type whatever here";
	}, 1000)
}

var adminonlynicks = [
	"[creator]",
	"[owner]",
	"[mod]",
	"[admin]",
	"[administrator]",
	"[moderator]",
	"bobby",
	"dax",
	"mr tophat",
	"elliott",
	"[creator] dax",
	"[owner] dax",
	"[creator] bobby",
	"[owner] bobby",
];
function nickname() {
	if (localStorage.getItem("changenametime") <= 0) {
		var username = prompt("Enter a nickname:");
		if (username !== null) {
			if(username.length <= 50){
				if (adminonlynicks.includes(username.toLowerCase())) {

					let verify = prompt("[ Admin Only Username. Key Required! ]");
					if (verify == "admin*7") {
						localStorage.setItem("nick", username);
						localStorage.setItem("changenametime", 900);
					} else {
						alert("Incorrect.");
						localStorage.setItem("changenametime", 900);
					}
				} else {
					localStorage.setItem("nick", username);
					localStorage.setItem("changenametime", 900);
				}
			} else {
				alert("Username too long. Try again! (50 max char.)")
			}
		}
	} else {
		let timeLeftMin = Math.round(localStorage.getItem("changenametime") / 60);
		let timeLeft = localStorage.getItem("changenametime");
		if (timeLeft <= 60) {
			alert(
				"You are on cooldown. " +
					timeLeft.toString() +
					"s remaining.\n\n(You have to be on the page in order for the timer to work!)",
			);
		} else {
			alert(
				"You are on cooldown. " +
					timeLeftMin.toString() +
					"m remaining.\n\n(You have to be on the page in order for the timer to work!)",
			);
		}
	}
}

globalvariable_input.addEventListener("keydown", function (event) {
	if (event.key === "Enter" && cooldown == false) {
		if (globalvariable_input.value != "/auth") {
			if (globalvariable_input.value.includes("|")) {
				alert("Your message contains banned characters. Try Again.");
			} else {
				fetch("/write", {
					headers: {
						"Content-Type": "application/json",
					},
					method: "POST",
					body: JSON.stringify({
						data:
							changeTimeFormat() +
							"|" +
							localStorage.getItem("nick") +
							"|" +
							globalvariable_input.value,
					}),
				}).then(() => finalsendMessage());
			}
		} else {
			let enteredPass = prompt("[ Admin Key Required ]");
			if (enteredPass == "admin*7") {
				commandinput.style.display = "inline";
				globalvariable_input.value = "";
			} else {
				alert("Incorrect Key.");
				globalvariable_input.value = "";
			}
		}
	}
});

commandinput.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		if (commandinput.value == "/ban") {
			let userToBan = prompt("Nickname/User to ban...");
			fetch("/ban", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					data: userToBan + "|" + "ban",
				}),
			}).then(() => (commandinput.value = ""));
		}

		if (commandinput.value == "/unban") {
			let userToBan = prompt("Nickname/User to unban...");
			fetch("/ban", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify({
					data: userToBan + "|" + "unban",
				}),
			}).then(() => (commandinput.value = ""));
		}

		if (commandinput.value == "/clear") {
			fetch("/clear", {
				headers: {
					"Content-Type": "application/json",
				},
				method: "POST",
			}).then(() => (commandinput.value = ""));
		}

		if (commandinput.value == "/uncooldown") {
			localStorage.setItem("changenametime", 0);
			alert("Removed Nickname Cooldown!");
			commandinput.value = "";
		}

		if (commandinput.value == "/uncooldown") {
			let newNick = prompt("Enter a nickname [ADMIN PERMS]:");
			localStorage.setItem("nick", newNick);
			commandinput.value = "";
		}

		/*if(commandinput.value == "/readonly"){
				fetch("/readonly", {
					headers: {
						"Content-Type": "application/json"
					},
					method: "POST",
					body: JSON.stringify({
						data: "true"
					})
				})
					.then(() => commandinput.value = "");
			}

			if(commandinput.value == "/unreadonly"){
				fetch("/readonly", {
					headers: {
						"Content-Type": "application/json"
					},
					method: "POST",
					body: JSON.stringify({
						data: "false"
					})
				})
					.then(() => commandinput.value = "");
			}*/

		if (commandinput.value == "/banlist") {
			fetch("/getbanlist")
				.then((res) => res.text())
				.then((data) => alert(data));
		}
	}
});

var ixlToggle = false;
var ixlfake = document.getElementById("ixlscreenlol");
document.addEventListener("keydown", function (event) {
	if (event.key === "`") {
		if (ixlToggle == false) {
			ixlToggle = true;
			ixlfake.style.display = "block";
		} else {
			ixlToggle = false;
			ixlfake.style.display = "none";
		}
	}
});
