"use strict";

/* account.js for AccountSetup.html
by Randolph Torrey

To do list:
**Add option for mirror users (most useful when auto provisioning)
**Create more separation for multiple names (There is no logic being used by ██████ to how names are separated currently)
**When parsing, generate code to align ticket fields with job title
**!!!!Add ██ ████ to notes
**Make provisioning table appear in it's own movable window
**Pull incidents and set up notes for password resets
**███████████ usernames are required to be at least 7 characters long
**(Meh?) Add a checkbox within each account's details that mirrors the checkbox at the bottom for that account
**makeTable can be handled a lot cleaner than outerHTML
**Make button to Notate when █████ and access info isn't available for <role>
**Shorten removeAccount by setting up associative array for copy buttons ["g":"department","1":"fname", etc.]
**currently ignoring ████/██████/███/etc email addresses (~line 450)
Bugs:
**cant read innerText error on "if (line.children[1].innerText == uid) {\" line of findUser function of add███. line had a message stating essentially 'no active query'
**Alerting name field doubled up on loa███ on Temp Term 
**On temp terms, spaces will still be added to notes even if no note is entered for a system
*/

//Declare global variables
let ███████Page, █████Page, █████Page, ███████Page, ██████Page, ██████Page, ████Page, ███Page, ████Page, ███Page, ssoadmPage, █████Page, █████Page, ████████Page, ███████Page, █████Page, ██████Page, ████Page;
let ████████sv, ███DbCsv, customLinksCsv;
let numOfAccts = 1;
//Arrays containing field names to dynamically address fields
let acctDetailList = ["acct1"], acctNameList = ["acctName1"], revealerList = ["revealer1"], tickListList = ["tickList1"], tickTypeList = ["tickType1"], itemNumList = ["itemNum1"], phoneNumList = ["phoneNum1"], oldPhoneNumList = ["oldPhoneNum1"], ███NameList = ["███Name1"], userNameList = ["uname1"], firstNameList = ["fname1"], lastNameList = ["lname1"], fullNameList = ["fullname1"], emailList = ["eaddy1"], ███NameList = ["███uname1"], ███IdList = ["███id1"], ████UNameList = ["████uname1"], roleList = ["role1"], localeList = ["locale1"], managerList = ["manager1"], departmentList = ["department1"], mirrorUserList = ["mirrorUser1"], dateList = ["startDate1"], infoList = ["info1"], notesList = ["notes1"], toggleAcctList = ["toggleAcct1"], codeForAcctList = ["codeForAcct1"], checkboxList = ["check1"], checkDivList = ["checkDiv1"];

function darkMode() {
	document.body.classList.add("darkModeBody");
	document.getElementById("header").classList.add("blackBack");
	document.getElementById("trueFoot").classList.add("blackBack");
	if (document.querySelector("table")) {
		document.querySelector("table").style.borderColor = "white";
	}
	document.getElementById("darkButton").innerText = "Light Mode";
	document.getElementById("darkButton").setAttribute("onclick", "lightMode()");
}

function lightMode() {
	document.body.classList.remove("darkModeBody");
	document.getElementById("header").classList.remove("blackBack");
	document.getElementById("trueFoot").classList.remove("blackBack");
	if (document.querySelector("table")) {
		document.querySelector("table").style.borderColor = "black";
	}
	document.getElementById("darkButton").innerText = "Dark Mode";
	document.getElementById("darkButton").setAttribute("onclick", "darkMode()");
}

function removeSpaces(textToRemove) { //remove all spaces and tabs before text starts and after text ends
	for (let i=0;;) {
		if ((textToRemove.substr(0,1) == " ")||(textToRemove.substr(0,1) == "\t")||(textToRemove.substr(0,1) == "&nbsp;")||(textToRemove.substr(0,1) == "\u00A0")) {
			textToRemove = textToRemove.substr(1);
		} else {
			break
		}
	}
	for (let j=0;;) {
		if ((textToRemove.substr(-1,1) == " ")||(textToRemove.substr(-1,1) == "\t")||(textToRemove.substr(-1,1) == "&nbsp;")||(textToRemove.substr(-1,1) == "\u00A0")) {
			textToRemove = textToRemove.substr(0,textToRemove.length-1);
		} else {
			break
		}
	}
	return textToRemove
}

function generate███(field) { //Make a ███ profile name based on AD username for new █████ users
	let num = field.replace(/[^0-9]/g, ''); //Pull the number from the passed argument
	if (document.getElementById(userNameList[num-1]).value == "") {
		document.getElementById("statusBox").innerText = "No username available to generate ███ profile name for Account " + num.toString();
		return;
	}
	let ███ID = "███" + document.getElementById(userNameList[num-1]).value.replace(/\./g, ''); //remove invalid '.' character if present
	███ID = ███ID.toUpperCase(); //Make username uppercase as per naming convention
	if (███ID.length > 15) {
		let num2 = ███ID.replace(/[^0-9]/g, ''); //Check for a number in the ███ profile name
		if (███ID.substr(-2) == "██") { //check if user is from ██████ using the ███ID
			███ID = ███ID.substring(0, 13-num2.toString().length) + num2 + "██";
		} else {
			███ID = ███ID.substring(0, 15-num2.toString().length) + num2; //Make sure ███ profile name is 15 characters or less
		}
	}

	document.getElementById(field).value = ███ID; //Place ███ profile name in field
}

function generate███(field) { //Make a valid ███ username based on AD username for new hires
	let num = field.replace(/[^0-9]/g, ''); //Pull the number from the passed argument
	if (document.getElementById(userNameList[num-1]).value == "") {
		document.getElementById("statusBox").innerText = "No username available to generate ███ username for Account " + num.toString();
		return;
	}
	let ███ID, tick = 0;
	
	if (document.getElementById(localeList[num-1]).value == '███') {//Check if user is in ███
		███ID = document.getElementById(userNameList[num-1]).value.substr(0,1) + document.getElementById(userNameList[num-1]).value.substr(document.getElementById(userNameList[num-1]).value.indexOf(".")+1); //grab first initial and last name from username
		███ID = ███ID.toLowerCase(); //Make username lowercase for ease
		███ID = ███ID + "███";//if so, add ███ to the end of the ███ username
		tick = 1;
	} else {
		███ID = document.getElementById(userNameList[num-1]).value.replace(/\./g, ''); //remove invalid '.' character if present
		███ID = ███ID.toLowerCase(); //Make username lowercase for ease
	}
	
	if (███ID.length < 8) {//Make sure new ███ username is long enough
		let num1 = ███ID.length;
		if (tick == 1) {
			███ID = ███ID.substr(0, num1-3);
		} else if (███ID.substr(-2) == "██") {
			tick = 2;
			███ID = ███ID.substr(0, num1-2);
		}
		for (let i=num1; i<8; i++) {
			if (i==7) { //if only 1 more character is needed
				███ID = ███ID + "1"; //add the number 1
			} else {
				███ID = ███ID + "0"; //add the number 0
			}
		}
		if (tick == 1) {
			███ID = ███ID + "███";
		} else if (tick == 2) {
			███ID = ███ID + "██";
		}
	}
	document.getElementById(field).value = ███ID; //Place username in field
}

function open███████() { //Opens window for ██████████ Ticket system
	document.getElementById("statusBox").innerText = "";
	if (servicePage === undefined) {
		servicePage = window.open("https://██████.███████-███.com/███/███/██/███████/██████/██████/███████████████.do", "_blank");
	} else { //If ██████Page is defined, advise page was opened already
		document.getElementById("statusBox").innerText = "██████████ page has already been opened";
	}
}

function notate███████() { //

}

function open█████() { //Opens window for █████ Administration
	document.getElementById("statusBox").innerText = "";
	if (█████Page === undefined) {
		█████Page = window.open("https://████-█████.█████████████████.com:████/", "_blank");
	} else { //If █████Page is defined, advise page was opened already
		document.getElementById("statusBox").innerText = "█████ page has already been opened";
	}
	
};

function open█████() { //Opens window for █████
	document.getElementById("statusBox").innerText = "";
	if (█████Page === undefined) {
		█████Page = window.open("https://█████.█████████████████.com/█████/█████/pages/█████SignIn.jsf", "_blank");
		//document.getElementById("pagePlace").innerHTML = '<iframe src="https://█████.█████████████████.com/█████/█████/pages/█████SignIn.jsf" title="█████"></iframe>'
	} else { //If █████Page is defined, advise page was opened already
		document.getElementById("statusBox").innerText = "█████ page has already been opened";
	}
	
};

function open███████() { //Opens window for █████████ Administration
	document.getElementById("statusBox").innerText = "";
	if (███████Page === undefined) {
		███████Page = window.open("https://██████████████.█████████████████.com/", "_blank");
	} else { //If ███████Page is defined, advise page was opened already
		document.getElementById("statusBox").innerText = "█████████ Administration page has already been opened";
	}
	
};

function open██████() {
	document.getElementById("statusBox").innerText = "";
	if (██████Page === undefined) {
		██████Page = window.open("https://██████████.█████████████.com/█████████████/█████████.do?id=██████", "_blank");
	} else { //If ██████Page is defined, advise page was opened already
		document.getElementById("statusBox").innerText = "███ ███ page has already been opened";
	}
}

function open██████() {
	document.getElementById("statusBox").innerText = "";
	if (██████Page === undefined) {
		██████Page = window.open("https://██████████1.█████████████.com/█████████████/█████████.do?id=██████", "_blank");
	} else { //If ██████Page is defined, advise page was opened already
		document.getElementById("statusBox").innerText = "███ ███ page has already been opened";
	}
}

function pull███████() {
	document.getElementById("codeForPages").innerText = "let list = [];\
		for (const item of document.getElementById(\"███████████████████████\").children[0].elements) {\
			if (item.labels) {\
				if (item.labels.length > 0) {\
					let label = item.labels[0].innerText;\
					if ((label.substr(0,1) == \"&nbsp;\")||(label.substr(0,1) == \"\u00A0\")||(label.substr(0,1)==\" \")) {\
						label = label.substr(1);\
					}\
					switch (label) {\
						case \"Number\":\
							list[0] = item.value;\
							break;\
						case \"Short ███████████\":\
							list[1] = item.value.substr(0,item.value.indexOf(\":\"));\
							break;\
						case \"Employee's full legal name\":\
							list[2] = item.value;\
							break;\
						case \"Active Directory Username (for NewHires put - NA)\":\
							list[3] = item.value;\
							break;\
						case \"Mirror Access of\":\
							list[4] = item.value;\
							break;\
						case \"Job Title\":\
							if (item.value != \"\") {\
								list[5] = item.value;\
							}\
							break;\
						case \"█████ - N████\":\
							list[6] = item.checked;\
							break;\
						case \"Company\":\
							list[7] = item.value;\
							break;\
						case \"Manager\":\
							list[8] = item.value;\
							break;\
						case \"Department\":\
							list[9] = item.value;\
							break;\
						case \"Effective Date\":\
							list[10] = item.value;\
							break;\
						case \"Direct Phone Line\":\
							list[11] = item.value;\
							break;\
						case \"Personal Fax\":\
							list[12] = item.value;\
							break;\
						case \"Temporary Deactivate\":\
							list[13] = item.value;\
							break;\
						case \"Comments\":\
							list[14] = item.value;\
							break;\
						case \"██████_Notes\":\
						case \"██████ Notes\":\
							list[15] = item.value;\
							break;\
						case \"████████_Notes\":\
						case \"████████ Notes\":\
							list[16] = item.value;\
							break;\
					}\
				}\
			}\
		}\
		if (list[5] == undefined) {\
			list[5] = \"\";\
		}\
		list;";
	addToClipboard("codeForPages");
	
	/*
	The following is research on fields in ██████████
	[107 lines redacted]
	*/
}

function parseInput(num) {
	let companyNum, companyName, roleName, departmentName;
	if (document.getElementById(tickListList[num]).value != "") {
		let list = JSON.parse(document.getElementById(tickListList[num]).value);
		//Clear Username Email and Name fields just in case
		document.getElementById(emailList[num]).value = "";
		document.getElementById(userNameList[num]).value = "";
		document.getElementById(firstNameList[num]).value = "";
		document.getElementById(lastNameList[num]).value = "";
		document.getElementById(fullNameList[num]).value = "";
		document.getElementById(infoList[num]).value = "";
		document.getElementById(itemNumList[num]).value = list[0]; //████ number
		switch (list[1]) { //Type
			case "New Hire":
				document.getElementById(tickTypeList[num]).value = "newHire";
				break;
			case "Transfer":
				document.getElementById(tickTypeList[num]).value = "transfer";
				break;
			case "Reactivate":
				document.getElementById(tickTypeList[num]).value = "reactivate";
				break;
			case "Termination":
				if (list[13] == "Yes") {
					document.getElementById(tickTypeList[num]).value = "tempTerm";
				} else if (list[13] == "No") {
					document.getElementById(tickTypeList[num]).value = "term";
				} else {
					document.getElementById("statusBox").innerText = "Can not determine ticket type for account " + (num + 1);
				}
				break;
			default:
				document.getElementById("statusBox").innerText = "Can not determine ticket type for account " + (num + 1);
		}
		companyNum = list[7];
		roleName = removeSpaces(list[5]);
		departmentName = removeSpaces(list[9]);
		document.getElementById(roleList[num]).value = roleName; //Role
		document.getElementById(departmentList[num]).value = departmentName; //Department
		if (companyNum == 10) { //Location
			document.getElementById(localeList[num]).value = "███";
		} else if (companyNum == 3) {
			document.getElementById(localeList[num]).value = "█████";
		} else if ((companyNum == 11) || (list[14].toLowerCase().indexOf("███-nv") >= 0)) {
			document.getElementById(localeList[num]).value = "█████";
		} else if (list[14].toLowerCase().indexOf("██████ ████") >= 0) {
			document.getElementById(localeList[num]).value = "██████ ████";
		} else if (list[14].toLowerCase().indexOf("████") >= 0) {
			document.getElementById(localeList[num]).value = "████";
		} else if (list[14].toLowerCase().indexOf("███████████") >= 0) {
			document.getElementById(localeList[num]).value = "███████████";
		} else if (list[14].toLowerCase().indexOf("██████") >= 0) {
			document.getElementById(localeList[num]).value = "██████";
		} else if ((list[14].toLowerCase().indexOf("██ - ██ ███ ████") >= 0)||(list[14].toLowerCase().match(/location:.+████████ ████/) != null))  {
			document.getElementById(localeList[num]).value = "██";
			//list[14]
			//more ██ locations
		}
		document.getElementById(mirrorUserList[num]).value = removeSpaces(list[4]); //Mirror User
		document.getElementById(managerList[num]).value = removeSpaces(list[8]); //Manager
		// /([a-zA-Z0-9]+\.*[a-zA-Z0-9]*@[a-zA-Z]+\.{1}[a-zA-Z]+\.*[a-zA-Z0-9]*)/g
		if ((list[3] == "")||(list[3].toUpperCase() == "NA")||(list[3].indexOf("(") >= 0)) {//Username and/or Email
			if (list[15].indexOf("@") != -1) { //Check ██████ Notes for email address
				document.getElementById(emailList[num]).value = list[15].match(/[a-zA-Z0-9\.-]+@[a-zA-Z\.-]+/g)[0];
			} else if ((list[1] != "New Hire")&&(list[14].indexOf("Email Address:") != -1)) { //Check Comments for email address if not a new hire
				let txt = list[14].match(/Email Address.+/g)[0];
				if (txt.indexOf("(") < 0) {
					document.getElementById(emailList[num]).value = removeSpaces(txt.substr(txt.indexOf(":")+1));
				}
			}
			if (document.getElementById(emailList[num]).value != "") { //If email found in ██████ Notes or Comments, fill username
				document.getElementById(userNameList[num]).value = document.getElementById(emailList[num]).value.substr(0, document.getElementById(emailList[num]).value.indexOf("@"));
			} else if (list[14].toLowerCase().indexOf("active directory user name")>=0) { //Not in ██████ notes, check Comments
				let txt = list[14].match(/Active Directory User Name.+/g)[0];
				if (txt.indexOf("(") == -1) {
					document.getElementById(userNameList[num]).value = removeSpaces(txt.substr(txt.indexOf(":")+1));
					if (document.getElementById(localeList[num]).value == "███") {
						document.getElementById(emailList[num]).value = document.getElementById(userNameList[num]).value + "@██████.com.██";
					} else { //TODO: currently ignoring ████/██████/███/etc
						document.getElementById(emailList[num]).value = document.getElementById(userNameList[num]).value + "@█████████████████.com";
					}
				}
			}
		} else {
			document.getElementById(userNameList[num]).value = removeSpaces(list[3]);
			if (document.getElementById(localeList[num]).value == "███") {
				document.getElementById(emailList[num]).value = document.getElementById(userNameList[num]).value + "@██████.com.██";
			} else { //TODO: currently ignoring ████/██████/███/etc
				document.getElementById(emailList[num]).value = document.getElementById(userNameList[num]).value + "@█████████████████.com";
			}
		}
		list[2] = removeSpaces(list[2]); //Name
		list[2] = list[2].replace(/\s[A-Z]\./g, ""); //remove middle initial and preceding space if found
		if (list[2].indexOf(" ", list[2].indexOf(" ") + 1) == -1) { //Name consists of first and last name
			document.getElementById(firstNameList[num]).value = list[2].substr(0, list[2].indexOf(" "));
			document.getElementById(lastNameList[num]).value = list[2].substr(list[2].indexOf(" ") + 1);
			document.getElementById(lastNameList[num]).dispatchEvent(new Event('change'));
		} else if (document.getElementById(userNameList[num]).value != "") { //Name has more than 2 names and username was found
			let lastName
			if (document.getElementById(userNameList[num]).value.indexOf(".") >= 0) { //██████ and ███ usernames
				if (document.getElementById(userNameList[num]).value.indexOf("██") >= 0) {
					lastName = document.getElementById(userNameList[num]).value.substr(1, document.getElementById(userNameList[num]).value.length-4).match(/\D+/g)[0];
				} else {
					lastName = document.getElementById(userNameList[num]).value.match(/\.\D+/g)[0].substr(1);
				}
			} else { //standard usernames
				lastName = document.getElementById(userNameList[num]).value.substr(1).match(/\D+/g)[0];
			}
			document.getElementById(firstNameList[num]).value = list[2].substr(0, list[2].toLowerCase().indexOf(lastName.toLowerCase())-1);
			if ((document.getElementById(firstNameList[num]).value == "")&&(lastName.substr(1).match(/[A-Z]/g) != null)) { //Likely space in Name that isn't in username
				let lastName2 = lastName.substr(0, lastName.indexOf(lastName.substr(1).match(/[A-Z]/g))) + " " + lastName.substr(lastName.indexOf(lastName.substr(1).match(/[A-Z]/g)));
				document.getElementById(firstNameList[num]).value = list[2].substr(0, list[2].toLowerCase().indexOf(lastName2.toLowerCase())-1);
				if (document.getElementById(firstNameList[num]).value == "") {
					//TODO: Need to address instances like "█████ █████ ███. ███████" userID "█████.██████████"
					//Name was entered in AD as "█████ █████ ███ ███████"
					document.getElementById(firstNameList[num]).value = list[2];
				} else {
					document.getElementById(lastNameList[num]).value = list[2].substr(list[2].toLowerCase().indexOf(lastName2.toLowerCase()));
					document.getElementById(lastNameList[num]).dispatchEvent(new Event('change'));
				}
			} else if (document.getElementById(firstNameList[num]).value == "") {
				//TODO: Need to address instances like "██████████"
				document.getElementById(firstNameList[num]).value = list[2];
			} else {
				document.getElementById(lastNameList[num]).value = list[2].substr(list[2].toLowerCase().indexOf(lastName.toLowerCase()));
				document.getElementById(lastNameList[num]).dispatchEvent(new Event('change'));
			}
			
		} else { //catchall in case of more than 2 names and username not found
			document.getElementById(firstNameList[num]).value = list[2];
		}
		if (list[14].toLowerCase().indexOf("status as of") >= 0) { //Effective Date
			let dte = list[14].match(/Status As Of.+/g)[0];
			document.getElementById(dateList[num]).valueAsNumber = new Date(removeSpaces(dte.substr(dte.indexOf(":")+1))).getTime();
		} else if (list[14].toLowerCase().indexOf("start work date") >= 0) {
			let dte = list[14].match(/Start Work Date.+/g)[0];
			document.getElementById(dateList[num]).valueAsNumber = new Date(removeSpaces(dte.substr(dte.indexOf(":")+1))).getTime();
		} else if (list[14].toLowerCase().indexOf("job date of change") >= 0) {
			let dte = list[14].match(/Job Date of Change.+/g)[0];
			document.getElementById(dateList[num]).valueAsNumber = new Date(removeSpaces(dte.substr(dte.indexOf(":")+1))).getTime();
		} else {
			document.getElementById(dateList[num]).valueAsNumber = new Date(list[10]).getTime();
		}
	} else {
		//Prep job lookup from fields for incident
		if ((document.getElementById(localeList[num]).value == "")||(document.getElementById(departmentList[num]).value == "")||(document.getElementById(roleList[num]).value == "")) {
			document.getElementById("statusBox").innerText = "Missing Location/Role/Department to pull info from fields";
			return;
		}
		switch (document.getElementById(localeList[num]).value) {
			case "██████":
			case "██":
				companyNum = 1;
				break;
			case "████":
			case "███████████":
			case "██████ ████":
				companyNum = 14;
				break;
			case "███":
				companyNum = 10;
				break;
			case "█████":
				companyNum = 3;
				break;
			case "█████":
				companyNum = 11;
				break;
			default:
		}
		departmentName = document.getElementById(departmentList[num]).value;
		roleName = document.getElementById(roleList[num]).value;
	}
	//Find job in spreadsheet and display info
	let ret = determineCsv(companyNum);
	let csv = ret[0];
	companyName = ret[1];
	//Filter out commas and &nbsp as they are not welcome here
	departmentName = departmentName.replace(/,/g,"");
	roleName = roleName.replace(/,/g,"");
	departmentName = departmentName.replace(/\u00A0/g," ");
	roleName = roleName.replace(/\u00A0/g," ");
	for (let i=1;i<csv.length;i++) {
		if ((companyName==csv[i][0])&&(departmentName.toLowerCase()==csv[i][1].toLowerCase())&&(roleName.toLowerCase()==csv[i][2].toLowerCase())) {
			let info;
			for (let j=3;j<csv[0].length;j++) {
				if (csv[i][j]!=""&&csv[i][j]!="N/A"&&csv[i][j]!=="No"&&csv[i][j]!=="0") {
					if (info!=undefined) {
						info = info + csv[0][j] + ":\n" + csv[i][j] + "\n\n";
					} else {
						info = csv[0][j] + ":\n" + csv[i][j] + "\n\n";
					}
				}
			}
			document.getElementById(infoList[num]).value = info;
			break
		}
	}
	if (document.getElementById(infoList[num]).value == "") { //Check extra sheet
		for (let i=1;i<customLinksCsv.length;i++) {
			if ((departmentName.toLowerCase()==customLinksCsv[i][0].toLowerCase())&&(roleName.toLowerCase()==customLinksCsv[i][1].toLowerCase())) {
				departmentName = customLinksCsv[i][2];
				roleName = customLinksCsv[i][3];
				break;
			}
		}
	}
	for (let i=1;i<csv.length;i++) { //Check again TODO: make function
		if ((companyName==csv[i][0])&&(departmentName.toLowerCase()==csv[i][1].toLowerCase())&&(roleName.toLowerCase()==csv[i][2].toLowerCase())) {
			let info;
			for (let j=3;j<csv[0].length;j++) {
				if ((csv[i][j]!="")&&(csv[i][j]!="N/A")&&(csv[i][j]!=="No")&&(csv[i][j]!=="0")&&(csv[i][j]!==undefined)) {
					if (info!=undefined) {
						info = info + csv[0][j] + ":\n" + csv[i][j] + "\n\n";
					} else {
						info = csv[0][j] + ":\n" + csv[i][j] + "\n\n";
					}
				}
			}
			document.getElementById(infoList[num]).value = info;
			break
		}
	}
	//Operation SplashBack -- Generate console code to bring ticket in line with job Title
	
	
	
}

function determineCsv(num) {
	if (num==10||num==12||num==17) {
		return [████████sv,"███"];
	} else if (num==14||num==15||num==16||num==18||num==13) {
		return [████████sv,"████"];
	} else if (num==1||num==2) {
		return [███DbCsv,"███_███"];
	} else if (num==3) {
		return [███DbCsv,"███"];
	} else if (num==4) {
		return [███DbCsv,"██████"];
	} else if (num==5) {
		return [███DbCsv,"████"];
	} else if (num==11) {
		return [███DbCsv,"███"];
	} else {
		return [███DbCsv, "███"];
	}
}

function makeTable() { //Generate a table of what to provision for the ticket group
	let sysList = ["No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No","No"];
	let sysNameList = ["Phone","█████","███████","███ ███","███ ███","███████","███","████","████","███","███████","███████","██████","█████████","█████████","██████","███ ███","███████","██████","██ ██████","███","██████","███████","███████","███████"];
	let phone = [];
	let █████ = [];
	let ███████ = [];
	let ██████ = [];
	let ██████ = [];
	let ████ = [];
	let ███ = [];
	let ████ = [];
	let ████ = [];
	let ███ = [];
	let ██████ = [];
	let ██████ = [];
	let ██████ = [];
	let █████ = [];
	let █████ = [];
	let █████ = [];
	let ██████ = [];
	let ███████ = [];
	let ██████ = [];
	let █████ = [];
	let ███ = [];
	let ██████ = [];
	let ███████ = [];
	let █████████ = [];
	let █████████ = [];
	let sysArrayList = [phone,█████,███████,██████,██████,████,███,████,████,███,██████,██████,██████,█████,█████,█████,██████,███████,██████,█████,███,██████,███████,█████████,█████████];
	let tableLayout;
	
	for (let i=0;i<numOfAccts;i++) {
		if (document.getElementById(infoList[i]).value != "") {
			if ((document.getElementById(infoList[i]).value.toLowerCase().indexOf("no setup") >= 0) || (document.getElementById(infoList[i]).value.toLowerCase().indexOf("no █████ setup") >= 0) || (document.getElementById(infoList[i]).value.toLowerCase().indexOf("████████████") == -1)) {
				phone[i] = "Ignore";
				sysList[0] = "Yes";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					phone[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					phone[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					phone[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					phone[i] = "TempDc";
				} else {
					phone[i] = "TempAd";
				}
				sysList[0] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.toLowerCase().indexOf("█████") == -1)||(document.getElementById(infoList[i]).value.toLowerCase().indexOf("no ████████ application access") != -1)) {
				█████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████[i] = "TempDc";
				} else {
					█████[i] = "TempAd";
				}
				sysList[1] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.toLowerCase().indexOf("██████████ app") == -1) {
				███████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					███████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					███████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					███████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					███████[i] = "TempDc";
				} else {
					███████[i] = "TempAd";
				}
				sysList[2] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("███ ███████") == -1) && (document.getElementById(infoList[i]).value.indexOf("███ - ███/███") == -1)) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[3] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("███ ███") == -1) && (document.getElementById(infoList[i]).value.indexOf("███ - ███/███") == -1)) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[4] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("████████ (████████)") == -1) {
				████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					████[i] = "TempDc";
				} else {
					████[i] = "TempAd";
				}
				sysList[5] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("█████████") == -1) {
				███[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					███[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					███[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					███[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					███[i] = "TempDc";
				} else {
					███[i] = "TempAd";
				}
				sysList[6] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("████") == -1) {
				████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					████[i] = "TempDc";
				} else {
					████[i] = "TempAd";
				}
				sysList[7] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("████") == -1) {
				████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					████[i] = "TempDc";
				} else {
					████[i] = "TempAd";
				}
				sysList[8] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("███") == -1)||(document.getElementById(infoList[i]).value.indexOf("███") == document.getElementById(infoList[i]).value.indexOf("███ █████████"))) {
				███[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					███[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					███[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					███[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					███[i] = "TempDc";
				} else {
					███[i] = "TempAd";
				}
				sysList[9] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("████ █████") == -1) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[10] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("███ █████████") == -1) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[11] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("█████████") == -1) && (document.getElementById(infoList[i]).value.indexOf("█████████") == -1)) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[12] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("██████████ (████████) ██████████") >= 0) || ((document.getElementById(infoList[i]).value.indexOf("██████████ (████████)") >= 0) && ((document.getElementById(infoList[i]).value.indexOf("███████████ - ███████") >= 0) || (document.getElementById(infoList[i]).value.indexOf("███ ██████████") >= 0))) || (document.getElementById(infoList[i]).value.indexOf("██████████ (████████) █████") >= 0)) {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████[i] = "TempDc";
				} else {
					█████[i] = "TempAd";
				}
				sysList[13] = "Yes";
			} else {
				█████[i] = "Ignore";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("██████████ (████████) ████") >= 0) || ((document.getElementById(infoList[i]).value.indexOf("██████████ (████████)") >= 0) && ((document.getElementById(infoList[i]).value.indexOf("████ ██████████ - ███████") >= 0) || (document.getElementById(infoList[i]).value.indexOf("████ ████████") >= 0))) || (document.getElementById(infoList[i]).value.indexOf("██████████ (████████) █████") >= 0)) {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████[i] = "TempDc";
				} else {
					█████[i] = "TempAd";
				}
				sysList[14] = "Yes";
			} else {
				█████[i] = "Ignore";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("██████ ███") == -1)||(document.getElementById(infoList[i]).value.indexOf("███ ██ ███████") >= 0)) {
				█████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████[i] = "TempDc";
				} else {
					█████[i] = "TempAd";
				}
				sysList[15] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("███ █████████ ███") == -1) && (document.getElementById(infoList[i]).value.indexOf("███ ████████████") == -1) && (document.getElementById(infoList[i]).value.indexOf("███ ██ ███████") == -1)) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[16] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("███████") == -1) {
				███████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					███████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					███████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					███████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					███████[i] = "TempDc";
				} else {
					███████[i] = "TempAd";
				}
				sysList[17] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("█████ ███ █████████") == -1) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[18] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("███████████ (██████)") == -1) {
				█████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████[i] = "TempDc";
				} else {
					█████[i] = "TempAd";
				}
				sysList[19] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("███") == -1) {
				███[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					███[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					███[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					███[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					███[i] = "TempDc";
				} else {
					███[i] = "TempAd";
				}
				sysList[20] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("██ ████") == -1) {
				██████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					██████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					██████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					██████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					██████[i] = "TempDc";
				} else {
					██████[i] = "TempAd";
				}
				sysList[21] = "Yes";
			}
			if ((document.getElementById(infoList[i]).value.indexOf("███████") == -1)&&(document.getElementById(infoList[i]).value.indexOf("████████") == -1)&&(document.getElementById(infoList[i]).value.indexOf("███████████") == -1)) {
				███████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					███████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					███████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					███████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					███████[i] = "TempDc";
				} else {
					███████[i] = "TempAd";
				}
				sysList[22] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("███████ █████ (███ ████████)") == -1) {
				█████████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████████[i] = "TempDc";
				} else {
					█████████[i] = "TempAd";
				}
				sysList[23] = "Yes";
			}
			if (document.getElementById(infoList[i]).value.indexOf("█████ ██████ (███ ████████)") == -1) {
				█████████[i] = "Ignore";
			} else {
				if (document.getElementById(tickTypeList[i]).value == "newHire") {
					█████████[i] = "Add";
				} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
					█████████[i] = "Update";
				} else if (document.getElementById(tickTypeList[i]).value == "term") {
					█████████[i] = "Remove";
				} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
					█████████[i] = "TempDc";
				} else {
					█████████[i] = "TempAd";
				}
				sysList[24] = "Yes";
			}
		} else {
			phone[i] = "N/A";
			█████[i] = "N/A";
			███████[i] = "N/A";
			██████[i] = "N/A";
			██████[i] = "N/A";
			████[i] = "N/A";
			███[i] = "N/A";
			████[i] = "N/A";
			████[i] = "N/A";
			███[i] = "N/A";
			██████[i] = "N/A";
			██████[i] = "N/A";
			██████[i] = "N/A";
			█████[i] = "N/A";
			█████[i] = "N/A";
			█████[i] = "N/A";
			██████[i] = "N/A";
			███████[i] = "N/A";
			██████[i] = "N/A";
			█████[i] = "N/A";
			███[i] = "N/A";
			██████[i] = "N/A";
			███████[i] = "N/A";
			█████████[i] = "N/A";
			█████████[i] = "N/A";
			continue;
		}
	}
	if (sysList.indexOf("Yes") == -1) {
		document.getElementById("provisionTable").innerHTML = "No systems to provision";
	} else {
		if (document.getElementById("darkButton").textContent == "Dark Mode") {
			tableLayout = "<table><tr><td>Sys</td>";
		} else {
			tableLayout = "<table style=\"border-color: white;\"><tr><td>Sys</td>";
		}
		for (let i=1;i<=document.getElementById("numAcct").value;i++) {
			tableLayout += "<td>" + i + "</td>";
		}
		tableLayout += "</tr>"
		for (let i=0;i<sysNameList.length;i++) {
			if (sysList[i] == "Yes") {
				tableLayout += "<tr><td>" + sysNameList[i] + "</td>";
				for (let j=0;j<sysArrayList[i].length;j++) {
					switch (sysArrayList[i][j]) {
						case "Add":
						tableLayout += "<td class='alwaysBlack' style='background: green;' onclick=\"changeTable(this)\">";
						break;
						case "Update":
						tableLayout += "<td class='alwaysBlack' style='background: yellow;' onclick=\"changeTable(this)\">";
						break;
						case "Remove":
						tableLayout += "<td class='alwaysBlack' style='background: red;' onclick=\"changeTable(this)\">";
						break;
						case "TempDc":
						tableLayout += "<td class='alwaysBlack' style='background: salmon;' onclick=\"changeTable(this)\">";
						break;
						case "TempAd":
						tableLayout += "<td class='alwaysBlack' style='background: lightgreen;' onclick=\"changeTable(this)\">";
						break;
						default:
						tableLayout += "<td onclick=\"changeTable(this)\">";
					}
					tableLayout += sysArrayList[i][j] + "</td>";
				}
				tableLayout += "</tr>";
			}
		}
		tableLayout += "<tr><td style='text-align: center;' onclick=\"addToTable()\">+</td></tr></table>";
	}
	document.getElementById("provisionTable").innerHTML = tableLayout;
	document.getElementById("page").style.paddingTop = getComputedStyle(document.querySelector('#header')).height;
}

function changeTable(cell) {
	switch (cell.innerText) {
		case "Add":
			cell.style.background = "yellow";
			cell.innerText = "Update";
			break;
		case "Update":
			cell.style.background = "red";
			cell.innerText = "Remove";
			break;
		case "Remove":
			cell.style.background = "salmon";
			cell.innerText = "TempDc";
			break;
		case "TempDc":
			cell.style.background = "lightgreen";
			cell.innerText = "TempAd";
			break;
		case "TempAd":
			if (cell.parentElement.cells[0].textContent == "Phone") {
				cell.style.background = "lightblue";
				cell.innerText = "DNSwap";
			} else {
				cell.classList.remove("alwaysBlack");
				cell.style.removeProperty("background");
				cell.innerText = "Ignore";
			}
			break;
		case "DNSwap":
			cell.classList.remove("alwaysBlack");
			cell.style.removeProperty("background");
			cell.innerText = "Ignore";
			break;
		case "Ignore":
			cell.innerText = "N/A";
			break;
		case "N/A":
			cell.classList.add("alwaysBlack");
			cell.style.background = "green";
			cell.innerText = "Add";
			break;
		default:
	}
}

function addToTable() {
	let sysNameList = ["Phone","█████","███████","███ ███","███ ███","███████","███","████","████","███","███████","███████","██████","█████████","█████████","██████","███ ███","███████","██████","██ ██████","███","██████","███████","███████","███████"];
	let tbleDiv = document.getElementById("provisionTable");
	let askDiv = document.createElement('div');
	let titleDiv = document.createElement('div');
	let count = 0;
	let buttonArray = [];
	askDiv.id = "tbleQuestion";
	titleDiv.textContent = "Which system?";
	for (let i=0; i<sysNameList.length; i++) {
		if (tbleDiv.innerText.indexOf(sysNameList[i]) == -1) {
			buttonArray[count] = document.createElement('button');
			buttonArray[count].textContent = sysNameList[i];
			buttonArray[count].setAttribute("onclick", "addSystem(this)");
			count++;
		}
	}
	if (count == 0) {
		document.getElementById("statusBox").innerText = "No more systems to add";
		return;
	}
	askDiv.appendChild(titleDiv);
	for (let i=0; i<buttonArray.length; i++) {
		askDiv.appendChild(buttonArray[i]);
	}
	tbleDiv.appendChild(askDiv);
}

function addSystem(bttn) {
	let sysNameList = ["Phone","█████","███████","███ ███","███ ███","███████","███","████","████","███","███████","███████","██████","█████████","█████████","██████","███ ███","███████","██████","██ ██████","███","██████","███████","███████","███████"];
	let tbleDiv = document.getElementById("provisionTable");
	let askDiv = document.getElementById("tbleQuestion");
	let tble = tbleDiv.children[0];
	let count = 1;
	tbleDiv.removeChild(askDiv);
	for (let i=0; i<sysNameList.length; i++) {
		if (tbleDiv.innerText.indexOf(sysNameList[i]) > -1) {
			count++;
		} else if (sysNameList[i] == bttn.textContent) {
			let newRow = tble.insertRow(count);
			let sysCell = newRow.insertCell(0);
			sysCell.textContent = bttn.textContent;
			for (let j=1; j<tble.rows[0].cells.length; j++) {
				let newCell = newRow.insertCell(j);
				newCell.textContent = "N/A";
				newCell.setAttribute("onclick", "changeTable(this)");
			}
		}
	}
}

function create█████(count) {
	//[71 lines redacted]
	let checkLoa███Part1 = "\
		async function part1 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (result != \"No\") {\
				output[4] = result;\
				resolve(output);\
				return;\
			}\
			if (checkName) {\
				phoneDoc.getElementById(\"████████████\").value = \"██████████████████\";\
				phoneDoc.getElementById(\"█████████████\").value = testName;\
			} else {\
				phoneDoc.getElementById(\"████████████\").value = \"███████████\";\
				phoneDoc.getElementById(\"█████████████\").value = poss███;\
			}\
			phoneDoc.getElementsByName(\"██████████\")[0].click();\
			myFrame.addEventListener(\"load\", () => {part2(resolve);}, {once: true});\
		}\
	";
	let add███Part1 = "\
		async function part1 (resolve) {\
			if (result != \"No\") {\
				resolve(result);\
				return;\
			}\
			let phoneDoc = phoneWindow.document;\
			phoneDoc.getElementById(\"████████████\").value = \"███████████\";\
			phoneDoc.getElementById(\"█████████████\").value = mirror███;\
			phoneDoc.getElementsByName(\"██████████\")[0].click();\
			myFrame.addEventListener(\"load\", () => {part2(resolve);}, {once: true});\
		}\
	";
	let delete███Part1 = "\
		async function part1 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (result != \"No\") {\
				if ((result == \"bad\")||(result == \"empty\")) {\
					output[0] = result;\
				} else if (deviceList.length > 1) {\
					output.push(deviceList);\
				}\
				resolve(output);\
				return;\
			}\
			if (checkName) {\
				phoneDoc.getElementById(\"████████████\").value = \"██████████████████\";\
				phoneDoc.getElementById(\"█████████████\").value = testName;\
			} else {\
				phoneDoc.getElementById(\"████████████\").value = \"███████████\";\
				phoneDoc.getElementById(\"█████████████\").value = poss███;\
			}\
			phoneDoc.getElementsByName(\"██████████\")[0].click();\
			myFrame.addEventListener(\"load\", () => {part2(resolve);}, {once: true});\
		}\
	";
	let swapDNPart1 = "\
		async function part1 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (result != \"No\") {\
				if (deviceList.length > 1) {\
					output.push(deviceList);\
				}\
				resolve(output);\
				return;\
			}\
			if (checkName) {\
				phoneDoc.getElementById(\"████████████\").value = \"██████████████████\";\
				phoneDoc.getElementById(\"█████████████\").value = testName;\
			} else {\
				phoneDoc.getElementById(\"████████████\").value = \"███████████\";\
				phoneDoc.getElementById(\"█████████████\").value = ███Name;\
			}\
			phoneDoc.getElementsByName(\"██████████\")[0].click();\
			myFrame.addEventListener(\"load\", () => {part2(resolve);}, {once: true});\
		}\
	";
	let phone███████████Array = "Array.from(phoneDoc.getElementById(\"█████████████████\").children[(function () {let myVar = []; Array.from(phoneDoc.getElementById(\"█████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)";
	let check███Part2 = "\
		async function part2 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (" + phone███████████Array + ".length == 1) {\
				nextCheck(resolve);\
				return;\
			}\
			for (const line of " + phone███████████Array + ") {\
				if ((line.children[2].children[0].innerText == poss███)||((line.children[2].children[0].innerText.substr(0,5) == poss███.substr(0,5))&&(line.children[2].children[0].innerText.replace(/[^0-9]/g, '') == poss███.replace(/[^0-9]/g, ''))&&(((line.children[2].children[0].innerText.substr(-2)==\"██\")&&(poss███.substr(-2)==\"██\"))||((line.children[2].children[0].innerText.substr(-2)!=\"██\")&&(poss███.substr(-2)!=\"██\"))))) {\
					output[0] = \"1\" + output[0].substr(1);\
					output[1] = line.children[2].children[0].innerText;\
					output[2] = line.children[3].innerText;\
					line.children[2].children[0].click();\
					myFrame.addEventListener(\"load\", () => {part3(resolve);}, {once: true});\
					return;\
				}\
			}\
			nextCheck(resolve);\
			return;\
		}\
	";
	let add███Part2 = "\
		async function part2 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			" + phone███████████Array + "[1].cells[12].children[0].click();\
			myFrame.addEventListener(\"load\", () => {\
				let phoneDoc = phoneWindow.document;\
				phoneDoc.getElementById(\"NAME\").value = ███Name;\
				phoneDoc.getElementById(\"████████\").click();\
				myFrame.addEventListener(\"load\", () => {\
					let phoneDoc = phoneWindow.document;\
					if (phoneDoc.getElementById(\"████████████████\")) {\
						result = phoneDoc.getElementById(\"████████████████\").textContent;\
						part1(resolve);\
						return;\
					}\
					part3(resolve);\
				}, {once: true});\
			}, {once: true});\
		}\
	";
	let delete███Part2 = "\
		async function part2 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (" + phone███████████Array + ".length == 1) {\
				nextCheck(resolve);\
				return;\
			}\
			for (const line of " + phone███████████Array + ") {\
				if ((line.children[2].children[0].innerText == poss███)||((line.children[2].children[0].innerText.substr(0,5) == poss███.substr(0,5))&&(line.children[2].children[0].innerText.replace(/[^0-9]/g, '') == poss███.replace(/[^0-9]/g, ''))&&(((line.children[2].children[0].innerText.substr(-2)==\"██\")&&(poss███.substr(-2)==\"██\"))||((line.children[2].children[0].innerText.substr(-2)!=\"██\")&&(poss███.substr(-2)!=\"██\"))))) {\
					line.children[2].children[0].click();\
					myFrame.addEventListener(\"load\", () => {part3(resolve);}, {once: true});\
					return;\
				}\
			}\
			nextCheck(resolve);\
			return;\
		}\
	";
	let loa███Part2 = "\
		async function part2 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (" + phone███████████Array + ".length == 1) {\
				nextCheck(resolve);\
				return;\
			}\
			for (const line of " + phone███████████Array + ") {\
				if ((line.children[2].children[0].innerText == poss███)||((line.children[2].children[0].innerText.substr(0,5) == poss███.substr(0,5))&&(line.children[2].children[0].innerText.replace(/[^0-9]/g, '') == poss███.replace(/[^0-9]/g, ''))&&(((line.children[2].children[0].innerText.substr(-2)==\"██\")&&(poss███.substr(-2)==\"██\"))||((line.children[2].children[0].innerText.substr(-2)!=\"██\")&&(poss███.substr(-2)!=\"██\"))))) {\
					output[0] = line.children[2].children[0].innerText;\
					if (line.children[3].innerText.toLowerCase().indexOf(\" - loa\") >= line.children[3].innerText.length-6) {\
						output[1] = line.children[3].innerText.replace(/\\s-\\s[loaLOA]{3}/g, '');\
					} else {\
						output[1] = line.children[3].innerText;\
					}\
					line.children[2].children[0].click();\
					myFrame.addEventListener(\"load\", () => {part3(resolve);}, {once: true});\
					return;\
				}\
			}\
			nextCheck(resolve);\
			return;\
		}\
	";
	let swapDNPart2 = "\
		async function part2 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if (" + phone███████████Array + ".length == 1) {\
				nextCheck(resolve);\
				return;\
			}\
			for (const line of " + phone███████████Array + ") {\
				if ((line.children[2].children[0].innerText == ███Name)||((line.children[2].children[0].innerText.substr(0,5) == ███Name.substr(0,5))&&(line.children[2].children[0].innerText.replace(/[^0-9]/g, '') == ███Name.replace(/[^0-9]/g, ''))&&(((line.children[2].children[0].innerText.substr(-2)==\"██\")&&(███Name.substr(-2)==\"██\"))||((line.children[2].children[0].innerText.substr(-2)!=\"██\")&&(███Name.substr(-2)!=\"██\"))))) {\
					output[0] = line.children[2].children[0].innerText;\
					output[1] = line.children[3].innerText;\
					line.children[2].children[0].click();\
					myFrame.addEventListener(\"load\", () => {part3(resolve);}, {once: true});\
					return;\
				}\
			}\
			nextCheck(resolve);\
			return;\
		}\
	";
	let nextCheck = "\
		function nextCheck(resolve) {\
			if (!checkName) {\
				result = \"empty\";\
			} else {\
				if (typeof nameArray === 'undefined') {\
					checkName = false;\
				} else {\
					if (nameCount >= nameArray.length) {\
						checkName = false;\
					} else {\
						testName = nameArray[nameCount];\
						nameCount++;\
					}\
				}\
			}\
			part1(resolve);\
		}\
	";
	let findUser = "\
		function findUser (findFrame) {\
			let findUserDoc = findFrame.contentDocument;\
			for (const line of Array.from(findUserDoc.getElementById(\"████████████████\").children[(function () {let myVar = []; Array.from(findUserDoc.getElementById(\"████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
				if (line.children[1].innerText == uid) {\
					███████████████(findFrame, line.children[0].children[0].name);\
					return;\
				}\
			}\
			result = \"No userid found\";\
			part1(resolve);\
			return;\
		}\
	";
	let check███Part3 = "\
		async function part3 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			" + findUser + "\
			if (phoneDoc.getElementById(\"█████████████████████\").checked) {\
				if (phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText != uid) {\
					let keepGoing = phoneWindow.confirm(\"Owner User ID \" + phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText + \" does not match provided User ID \" + uid + \"\nContinue?\");\
					if (!keepGoing) {\
						result = \"empty\";\
						part1(resolve);\
						return;\
					}\
					output[0] = output[0].substr(0,2) + \"1\" + output[0].substr(3);\
					findFrame = ████████('█████████', '████████████.do?███████████=█████████████ = 1', 'false');\
					findFrame.addEventListener(\"load\", function () {\
						let findUserDoc = findFrame.contentDocument;\
						findUserDoc.getElementById(\"████████████\").value = \"userid\";\
						findUserDoc.getElementById(\"█████████████\").value = uid;\
						findUserDoc.getElementsByName(\"██████████\")[0].click();\
						findFrame.addEventListener(\"load\", () => {\
							findUser(findFrame);\
							part3(resolve);\
						}, {once: true});\
					}, {once: true});\
					return;\
				} else {\
					if (output[0].substr(2,1) == \"0\") {\
						output[0] = output[0].substr(0,1) + \"1\" + output[0].substr(2);\
					}\
				}\
			} else {\
				let keepGoing = phoneWindow.confirm(\"Owner User ID set to Anonymous\nContinue?\");\
				if (!keepGoing) {\
					result = \"empty\";\
					part1(resolve);\
					return;\
				}\
				output[0] = output[0].substr(0,2) + \"1\" + output[0].substr(3);\
				phoneDoc.getElementById(\"█████████████████████\").click();\
				findFrame = ████████('█████████', '████████████.do?███████████=█████████████ = 1', 'false');\
				findFrame.addEventListener(\"load\", function () {\
					let findUserDoc = findFrame.contentDocument;\
					findUserDoc.getElementById(\"████████████\").value = \"userid\";\
					findUserDoc.getElementById(\"█████████████\").value = uid;\
					findUserDoc.getElementsByName(\"██████████\")[0].click();\
					findFrame.addEventListener(\"load\", () => {\
						findUser(findFrame);\
						part3(resolve);\
					}, {once: true});\
				}, {once: true});\
				return;\
			}\
			switch (locale) {\
				case \"████\":\
				case \"███████████\":\
				case \"██████ ████\":\
					if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
						output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"█████\":\
					if (isDID) {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					} else {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					}\
					break;\
				case \"█████\":\
					if (isDID) {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					} else {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					}\
					break;\
				case \"██████\":\
					if (isDID) {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					} else {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					}\
					break;\
				case \"████\":\
					if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
						output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"██\":\
					if (isDID) {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					} else {\
						if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
							output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
							phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
						}\
					}\
					break;\
				case \"███\":\
					if (phoneDoc.getElementById(\"████████████\").value != \"████████████████████████████████████\") {\
						output[0] = output[0].substr(0,3) + \"1\" + output[0].substr(4);\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				default:\
			}\
			switch (phoneProf) {\
				case \"█████████ ██████\":\
					if ((phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\")) {\
						output[0] = output[0].substr(0,4) + \"1\" + output[0].substr(5);\
						phoneDoc.getElementById(\"███████████████████\").value = \"8adb1e63-9dfd-7fc2-a078-67655067479f\";\
					}\
					break;\
				case \"█████ ██████ ███ ████████ ███\":\
					if ((phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\")) {\
						output[0] = output[0].substr(0,4) + \"1\" + output[0].substr(5);\
						phoneDoc.getElementById(\"███████████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"Default\":\
					if ((phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\") && (phoneDoc.getElementById(\"███████████████████\").value != \"████████████████████████████████████\")) {\
						output[0] = output[0].substr(0,4) + \"1\" + output[0].substr(5);\
						phoneDoc.getElementById(\"███████████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"None\":\
					result = \"empty\";\
					part1(resolve);\
					return;\
					break;\
				default:\
			}\
			if (output[0] != \"11000000\") {\
				(function() {\
				  var nativeAlert = phoneWindow.alert;\
				  phoneWindow.alert = function(message) {\
					if (!message.includes(\"█████ ██████\")) {\
					  nativeAlert(message);\
					}\
				  };\
				}());\
				phoneDoc.getElementById(\"████████\").click();\
				myFrame.addEventListener(\"load\", () => {\
					let list = [];\
					let phoneDoc = phoneWindow.document;\
					for (item of Array.from(phoneDoc.getElementById(\"█████████\").children)) {\
						list.push(item.localName);\
					}\
					phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].click();\
					myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
				}, {once: true});\
			} else {\
				let list = [];\
				for (item of Array.from(phoneDoc.getElementById(\"█████████\").children)) {\
					list.push(item.localName);\
				}\
				phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].click();\
				myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
			}\
		}\
	";
	let add███Part3 = "\
		async function part3 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			" + findUser + "\
			phoneDoc.getElementById(\"███████████\").value = name;\
			switch (locale) {\
				case \"████\":\
				case \"███████████\":\
				case \"██████ ████\":\
					phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					break;\
				case \"█████\":\
					if (isDID) {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					} else {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"█████\":\
					if (isDID) {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					} else {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"██████\":\
					if (isDID) {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					} else {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"████\":\
					phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					break;\
				case \"la\":\
					if (isDID) {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					} else {\
						phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					}\
					break;\
				case \"███\":\
					phoneDoc.getElementById(\"████████████\").value = \"████████████████████████████████████\";\
					break;\
				default:\
			}\
			switch (phoneProf) {\
				case \"█████████ ██████\":\
					phoneDoc.getElementById(\"███████████████████\").value = \"████████████████████████████████████\";\
					break;\
				case \"█████ ██████ ███ ████████ ███\":\
					phoneDoc.getElementById(\"███████████████████\").value = \"████████████████████████████████████\";\
					break;\
				case \"Default\":\
					phoneDoc.getElementById(\"███████████████████\").value = \"████████████████████████████████████\";\
					break;\
				default:\
			}\
			(function() {\
			  var nativeAlert = phoneWindow.alert;\
			  phoneWindow.alert = function(message) {\
				if (!message.includes(\"█████ ██████\")) {\
				  nativeAlert(message);\
				}\
			  };\
			}());\
			findFrame = ████████('█████████', '████████████.do?███████████=█████████████=1', 'false');\
			findFrame.addEventListener(\"load\", () => {\
				let findUserDoc = findFrame.contentDocument;\
				findUserDoc.getElementById(\"████████████\").value = \"userid\";\
				findUserDoc.getElementById(\"█████████████\").value = uid;\
				findUserDoc.getElementsByName(\"██████████\")[0].click();\
				findFrame.addEventListener(\"load\", () => {\
					findUser(findFrame);\
					if (result != \"No\") {\
						return;\
					}\
					phoneDoc.getElementById(\"████████\").click();\
					myFrame.addEventListener(\"load\", () => {\
						let list = [];\
						let phoneDoc = phoneWindow.document;\
						for (item of Array.from(phoneDoc.getElementById(\"█████████\").children)) {\
							list.push(item.localName);\
						}\
						phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].click();\
						myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
					}, {once: true});\
				}, {once: true});\
			}, {once: true});\
		}\
	";
	let delete███Part3 = "\
		async function part3 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if ((phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText != uid)&&(phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText != \"██████\")) {\
				let keepGoing = phoneWindow.confirm(\"Owner User ID \" + phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText + \" does not match provided User ID \" + uid + \"\nContinue?\");\
				if (!keepGoing) {\
					result = \"bad\";\
					part1(resolve);\
					return;\
				}\
			}\
			output[0] =  phoneDoc.getElementById(\"NAME\").value;\
			let list = [];\
			for (item of Array.from(phoneDoc.getElementById(\"█████████\").children)) {\
				list.push(item.localName);\
			}\
			if ((phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].innerText.indexOf(\"███ █ ███ ██\") < 0)&&(!((phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText == \"██████\")&&(output[0] != \"█████████\")))) {\
				phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].click();\
				myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
			} else {\
				phoneDoc.forms[0].action = \"███████████.do\";\
				phoneDoc.forms[0].submit();\
				myFrame.addEventListener(\"load\", () => {\
					result = \"complete\";\
					part1(resolve);\
				}, {once: true});\
			}\
		}\
	";
	let loa███Part3 = "\
		async function part3 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			" + findUser + "\
			if (!isFirstPart3) {\
			} else if (isLeave && (phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText == uid)) {\
				phoneDoc.getElementById(\"█████████_███████████\").click();\
			} else if (!isLeave && phoneDoc.getElementById(\"█████████_███████████\").checked) {\
				isFirstPart3 = false;\
				phoneDoc.getElementById(\"█████████████████████\").click();\
				findFrame = ████████('█████████', '████████████.do?███████████=█████████████ = 1', 'false');\
				findFrame.addEventListener(\"load\", function () {\
					let findUserDoc = findFrame.contentDocument;\
					findUserDoc.getElementById(\"████████████\").value = \"userid\";\
					findUserDoc.getElementById(\"█████████████\").value = uid;\
					findUserDoc.getElementsByName(\"██████████\")[0].click();\
					findFrame.addEventListener(\"load\", () => {\
						findUser(findFrame);\
						part3(resolve);\
					}, {once: true});\
				}, {once: true});\
				return;\
			} else if (!isLeave && phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText == uid) {\
				\
			} else {\
				let keepGoing;\
				if (isLeave) {\
					keepGoing = phoneWindow.confirm(\"Owner User ID \" + phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText + \" does not match provided User ID \" + uid + \"\nContinue?\");\
				} else {\
					keepGoing = phoneWindow.confirm(\"Owner User ID is not set to anonymous (\" + phoneDoc.getElementById(\"█████████\").children[phoneDoc.getElementById(\"█████████\").selectedIndex].innerText + \") and does not match provided User ID \" + uid + \"\nContinue?\");\
				}\
				if (!keepGoing) {\
					result = \"bad\";\
					part1(resolve);\
					return;\
				}\
				if (isLeave) {\
					phoneDoc.getElementById(\"█████████_███████████\").click();\
				} else {\
					isFirstPart3 = false;\
					findFrame = ████████('█████████', '████████████.do?███████████=█████████████ = 1', 'false');\
					findFrame.addEventListener(\"load\", function () {\
						let findUserDoc = findFrame.contentDocument;\
						findUserDoc.getElementById(\"████████████\").value = \"userid\";\
						findUserDoc.getElementById(\"█████████████\").value = uid;\
						findUserDoc.getElementsByName(\"██████████\")[0].click();\
						findFrame.addEventListener(\"load\", () => {\
							findUser(findFrame);\
							part3(resolve);\
						}, {once: true});\
					}, {once: true});\
					return;\
				}\
			}\
			phoneDoc.getElementById(\"███████████\").value = output[1];\
			(function() {\
			  var nativeAlert = phoneWindow.alert;\
			  phoneWindow.alert = function(message) {\
				if (!message.includes(\"█████ ██████\")) {\
				  nativeAlert(message);\
				}\
			  };\
			}());\
			phoneDoc.getElementById(\"████████\").click();\
			myFrame.addEventListener(\"load\", () => {\
				let list = [];\
				let phoneDoc = phoneWindow.document;\
				for (item of Array.from(phoneDoc.getElementById(\"█████████\").children)) {\
					list.push(item.localName);\
				}\
				phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].click();\
				myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
			}, {once: true});\
		}\
	";
	let swapDNPart3 = "\
		async function part3 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			(function() {\
			  var nativeAlert = phoneWindow.alert;\
			  phoneWindow.alert = function(message) {\
				if (!message.includes(\"█████ ██████\")) {\
				  nativeAlert(message);\
				}\
			  };\
			}());\
			let list = [];\
			for (item of Array.from(phoneDoc.getElementById(\"█████████\").children)) {\
				list.push(item.localName);\
			}\
			phoneDoc.getElementById(\"█████████\").children[list.indexOf(\"table\")].rows[0].cells[0].children[0].children[1].rows[1].cells[1].children[0].children[0].click();\
			myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
		}\
	";
	let check███Part4 = "\
		async function part4 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			output[3] = phoneDoc.getElementById(\"███████████\").value;\
			if (output[3].length < 10) {\
				result = \"complete\";\
				part1(resolve);\
				return;\
			} else {\
				output[0] = output[0].substr(0,5) + \"1\" + output[0].substr(6);\
				if ((isDID && (output[3].substr(0,5) == \"11111\"))||(!isDID && (output[3].substr(0,5) != \"11111\"))) {\
					result = \"complete\";\
					part1(resolve);\
					return;\
				}\
			}\
			if (is█████) {\
				if (phoneDoc.getElementById(\"█████████████████████████████████████\").value == \"████████████████████████████████████\") {\
					output[0] = output[0].substr(0,6) + \"1\" + output[0].substr(7);\
					phoneDoc.getElementById(\"█████████████████████████████████████\").value = \"████████████████████████████████████\";\
				}\
			} else {\
				if (phoneDoc.getElementById(\"█████████████████████████████████████\").value != \"████████████████████████████████████\") {\
					output[0] = output[0].substr(0,6) + \"1\" + output[0].substr(7);\
					phoneDoc.getElementById(\"█████████████████████████████████████\").value = \"████████████████████████████████████\";\
				}\
			}\
			if (mask.length == 10) {\
				if (phoneDoc.getElementById(\"████████\").value != mask) {\
					output[0] = output[0].substr(0,7) + \"1\";\
					phoneDoc.getElementById(\"████████\").value = mask;\
				}\
			} else {\
				if (phoneDoc.getElementById(\"████████\").value != \"\") {\
					output[0] = output[0].substr(0,7) + \"1\";\
					phoneDoc.getElementById(\"████████\").value = \"\";\
				}\
			}\
			if (output[0] != \"11000100\") {\
				let num = output[0].substr(6);\
				if (num == \"00\") {\
					let applyFrame = ██████████████████████████(\"numplan\", phoneDoc.forms[0].████.value, phoneDoc.forms[0].███████████████████.value);\
					applyFrame.addEventListener(\"load\", () => {\
						applyFrame.contentDocument.getElementById(\"████\").click();\
						applyFrame.addEventListener(\"load\", () => {\
							result = \"complete\";\
							part1(resolve);\
						}, {once: true});\
					}, {once: true});\
				} else {\
					phoneDoc.getElementById(\"████████\").click();\
					myFrame.addEventListener(\"load\", () => {\
						let phoneDoc = phoneWindow.document;\
						let applyFrame = ██████████████████████████(\"numplan\", phoneDoc.forms[0].████.value, phoneDoc.forms[0].███████████████████.value);\
						applyFrame.addEventListener(\"load\", () => {\
							applyFrame.contentDocument.getElementById(\"████\").click();\
							applyFrame.addEventListener(\"load\", () => {\
								result = \"complete\";\
								part1(resolve);\
							}, {once: true});\
						}, {once: true});\
					}, {once: true});\
				}\
			} else {\
				result = \"complete\";\
				part1(resolve);\
			}\
		}\
	";
	let add███Part4 = "\
		async function part4 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			phoneDoc.getElementById(\"███████████\").value = dn;\
			phoneDoc.getElementById(\"███████████\").dispatchEvent(new Event('change'));\
			myFrame.addEventListener(\"load\", () => {\
				let phoneDoc = phoneWindow.document;\
				let nameWithExt = name + \" - \" + dn.substr(5);\
				phoneDoc.getElementById(\"███████████\").value = nameWithExt;\
				phoneDoc.getElementById(\"████████████\").value = nameWithExt;\
				if (nameWithExt.length > 30) {\
					if ((nameWithExt.split(\" \").length - 1) <= 3) {\
						nameWithExt = nameWithExt.substr(0, 22) + nameWithExt.substr(-8);\
					} else {\
						let spaceBeforeLastName = 0;\
						for (let i = 1; i <= (nameWithExt.split(\" \").length - 3); i++) {\
							spaceBeforeLastName = nameWithExt.indexOf(\" \", spaceBeforeLastName + 1);\
						}\
						nameWithExt = nameWithExt.substr(0, nameWithExt.indexOf(\" \")) + nameWithExt.substr(spaceBeforeLastName);\
						if (nameWithExt.length > 30) {\
							nameWithExt = nameWithExt.substr(0, 22) + nameWithExt.substr(-8);\
						}\
					}\
				}\
				phoneDoc.getElementById(\"█████████████████\").value = nameWithExt;\
				phoneDoc.getElementById(\"███████\").value = nameWithExt;\
				phoneDoc.getElementById(\"████████████\").value = nameWithExt;\
				phoneDoc.getElementById(\"█████\").value = nameWithExt;\
				phoneDoc.getElementById(\"██████████\").checked = true;\
				phoneDoc.getElementById(\"████████████\").checked = true;\
				if (is█████) {\
					phoneDoc.getElementById(\"█████████████████████████████████████\").value = \"████████████████████████████████████\";\
				} else {\
					phoneDoc.getElementById(\"█████████████████████████████████████\").value = \"████████████████████████████████████\";\
				}\
				if (mask.length == 10) {\
					phoneDoc.getElementById(\"████████\").value = mask;\
				} else {\
					phoneDoc.getElementById(\"████████\").value = \"\";\
				}\
				phoneDoc.getElementById(\"████████\").click();\
				myFrame.addEventListener(\"load\", () => {\
					let phoneDoc = phoneWindow.document;\
					let applyFrame = ██████████████████████████(\"███████\", phoneDoc.forms[0].████.value, phoneDoc.forms[0].███████████████████.value);\
					applyFrame.addEventListener(\"load\", () => {\
						applyFrame.contentDocument.getElementById(\"████\").click();\
						applyFrame.addEventListener(\"load\", () => {\
							result = \"complete\";\
							part1(resolve);\
						}, {once: true});\
					}, {once: true});\
				}, {once: true});\
			}, {once: true});\
		}\
	";
	let delete███Part4 = "\
		async function part4 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			output[1] = phoneDoc.getElementById(\"███████████\").value;\
			if (output[1].length == 0) {\
				phoneDoc.getElementById(\"█████\").nextElementSibling.click();\
				myFrame.addEventListener(\"load\", () => {\
					let phoneDoc = phoneWindow.document;\
					phoneDoc.forms[0].action = \"███████████.do\";\
					phoneDoc.forms[0].submit();\
					myFrame.addEventListener(\"load\", () => {\
						result = \"complete\";\
						part1(resolve);\
					}, {once: true});\
				}, {once: true});\
				return;\
			}\
			let newName = \"Available - \";\
			switch (locale) {\
				case \"██████\":\
					newName = newName + \"██\";\
					break;\
				case \"████\":\
				case \"██████ ████\":\
				case \"███████████\":\
					newName = newName + \"██\";\
					break;\
				case \"la\":\
					newName = newName + \"███\";\
					break;\
				case \"███\":\
					newName = newName + \"███\";\
					break;\
				case \"█████\":\
					newName = newName + \"███\";\
					break;\
				case \"█████\":\
					newName = newName + \"███\";\
					break;\
			}\
			phoneDoc.getElementById(\"███████████\").value = newName;\
			phoneDoc.getElementById(\"████████████\").value = newName;\
			phoneDoc.getElementById(\"█████████████████\").value = newName;\
			for (const opt of Array.from(phoneDoc.getElementById(\"█████████████████████████\").options)) {\
				deviceList.push(opt.innerText);\
				opt.selected = true;\
				phoneWindow.moveSelectedItem(phoneDoc.███████████████████.█████████████████████████, phoneDoc.███████████████████.███████████████████████);\
			}\
			phoneDoc.getElementById(\"████████\").click();\
			myFrame.addEventListener(\"load\", () => {\
				let phoneDoc = phoneWindow.document;\
				phoneDoc.getElementById(\"█████\").nextElementSibling.click();\
				myFrame.addEventListener(\"load\", () => {\
					let phoneDoc = phoneWindow.document;\
					phoneDoc.forms[0].action = \"███████████.do\";\
					phoneDoc.forms[0].submit();\
					myFrame.addEventListener(\"load\", () => {\
						result = \"complete\";\
						part1(resolve);\
					}, {once: true});\
				}, {once: true});\
			}, {once: true});\
		}\
	";
	let loa███Part4 = "\
		async function part4 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			output[2] = phoneDoc.getElementById(\"███████████\").value;\
			if (isLeave) {\
				phoneDoc.getElementById(\"███████████\").value += \" - LOA\";\
				phoneDoc.getElementById(\"████████████\").value += phoneDoc.getElementById(\"████████████\").value + \" - LOA\";\
				let loaNameWithExt = phoneDoc.getElementById(\"███████████\").value;\
				if (loaNameWithExt > 30) {\
					loaNameWithExt = loaNameWithExt.substr(0, 16) + nameWithExt.substr(-14);\
				}\
				phoneDoc.getElementById(\"█████████████████\").value = loaNameWithExt;\
				phoneDoc.getElementById(\"███████\").value = loaNameWithExt;\
				phoneDoc.getElementById(\"████████████\").value = loaNameWithExt;\
				phoneDoc.getElementById(\"█████\").value = loaNameWithExt;\
			} else {\
				let nameWithExt = output[1] + \" - \" + output[2].substr(5);\
				phoneDoc.getElementById(\"███████████\").value = nameWithExt;\
				phoneDoc.getElementById(\"████████████\").value = nameWithExt;\
				if (nameWithExt.length > 30) {\
					if ((nameWithExt.split(\" \").length - 1) <= 3) {\
						nameWithExt = nameWithExt.substr(0, 22) + nameWithExt.substr(-8);\
					} else {\
						let spaceBeforeLastName = 0;\
						for (let i = 1; i <= (nameWithExt.split(\" \").length - 3); i++) {\
							spaceBeforeLastName = nameWithExt.indexOf(\" \", spaceBeforeLastName + 1);\
						}\
						nameWithExt = nameWithExt.substr(0, nameWithExt.indexOf(\" \")) + nameWithExt.substr(spaceBeforeLastName);\
						if (nameWithExt.length > 30) {\
							nameWithExt = nameWithExt.substr(0, 22) + nameWithExt.substr(-8);\
						}\
					}\
				}\
				phoneDoc.getElementById(\"█████████████████\").value = nameWithExt;\
				phoneDoc.getElementById(\"███████\").value = nameWithExt;\
				phoneDoc.getElementById(\"████████████\").value = nameWithExt;\
				phoneDoc.getElementById(\"█████\").value = nameWithExt;\
			}\
			phoneDoc.getElementById(\"████████\").click();\
			myFrame.addEventListener(\"load\", () => {\
				let phoneDoc = phoneWindow.document;\
				let applyFrame = ██████████████████████████(\"███████\", phoneDoc.forms[0].████.value, phoneDoc.forms[0].███████████████████.value);\
				applyFrame.addEventListener(\"load\", () => {\
					applyFrame.contentDocument.getElementById(\"████\").click();\
					applyFrame.addEventListener(\"load\", () => {\
						result = \"complete\";\
						part1(resolve);\
					}, {once: true});\
				}, {once: true});\
			}, {once: true});\
		}\
	";
	let swapDNPart4 = "\
		async function part4 (resolve) {\
			let phoneDoc = phoneWindow.document;\
			if ((output[2] == undefined)&&(phoneDoc.getElementById(\"███████████\").value != \"\")) {\
				output[2] = phoneDoc.getElementById(\"███████████\").value;\
				let newName = \"Available - \";\
				switch (locale) {\
					case \"██████\":\
						newName = newName + \"██\";\
						break;\
					case \"████\":\
					case \"██████ ████\":\
					case \"███████████\":\
						newName = newName + \"██\";\
						break;\
					case \"██\":\
						newName = newName + \"███\";\
						break;\
					case \"███\":\
						newName = newName + \"███\";\
						break;\
					case \"█████\":\
						newName = newName + \"███\";\
						break;\
					case \"█████\":\
						newName = newName + \"███\";\
						break;\
				}\
				phoneDoc.getElementById(\"███████████\").value = newName;\
				phoneDoc.getElementById(\"████████████\").value = newName;\
				phoneDoc.getElementById(\"█████████████████\").value = newName;\
				for (const opt of Array.from(phoneDoc.getElementById(\"█████████████████████████\").options)) {\
					deviceList.push(opt.innerText);\
					opt.selected = true;\
					phoneWindow.moveSelectedItem(phoneDoc.███████████████████.█████████████████████████, phoneDoc.███████████████████.███████████████████████);\
				}\
				phoneDoc.getElementById(\"████████\").click();\
				myFrame.addEventListener(\"load\", () => {\
					let phoneDoc = phoneWindow.document;\
					phoneDoc.getElementById(\"█████\").nextElementSibling.click();\
					myFrame.addEventListener(\"load\", () => {\
						part3 (resolve);\
					}, {once: true});\
				}, {once: true});\
			} else {\
				if (output[2] == undefined) {\
					output[2] = \"\";\
				}\
				phoneDoc.getElementById(\"███████████\").value = newDn;\
				phoneDoc.getElementById(\"███████████\").dispatchEvent(new Event('change'));\
				myFrame.addEventListener(\"load\", () => {\
					let phoneDoc = phoneWindow.document;\
					phoneDoc.getElementById(\"████████████████\").value = \"████████████████████████████████████\";\
					phoneDoc.getElementById(\"████████████████\").dispatchEvent(new Event('change'));\
					phoneWindow.refreshOnPartition(phoneDoc.getElementById(\"████████████████\"));\
					myFrame.addEventListener(\"load\", () => {\
						let phoneDoc = phoneWindow.document;\
						let nameWithExt = name + \" - \" + newDn.substr(5);\
						phoneDoc.getElementById(\"███████████\").value = nameWithExt;\
						phoneDoc.getElementById(\"████████████\").value = nameWithExt;\
						if (nameWithExt.length > 30) {\
							if ((nameWithExt.split(\" \").length - 1) <= 3) {\
								nameWithExt = nameWithExt.substr(0, 22) + nameWithExt.substr(-8);\
							} else {\
								let spaceBeforeLastName = 0;\
								for (let i = 1; i <= (nameWithExt.split(\" \").length - 3); i++) {\
									spaceBeforeLastName = nameWithExt.indexOf(\" \", spaceBeforeLastName + 1);\
								}\
								nameWithExt = nameWithExt.substr(0, nameWithExt.indexOf(\" \")) + nameWithExt.substr(spaceBeforeLastName);\
								if (nameWithExt.length > 30) {\
									nameWithExt = nameWithExt.substr(0, 22) + nameWithExt.substr(-8);\
								}\
							}\
						}\
						phoneDoc.getElementById(\"█████████████████\").value = nameWithExt;\
						phoneDoc.getElementById(\"███████\").value = nameWithExt;\
						phoneDoc.getElementById(\"████████████\").value = nameWithExt;\
						phoneDoc.getElementById(\"█████\").value = nameWithExt;\
						phoneDoc.getElementById(\"██████████\").checked = true;\
						phoneDoc.getElementById(\"████████████\").checked = true;\
						if (is█████) {\
							phoneDoc.getElementById(\"█████████████████████████████████████\").value = \"████████████████████████████████████\";\
						} else {\
							phoneDoc.getElementById(\"█████████████████████████████████████\").value = \"████████████████████████████████████\";\
						}\
						if (mask.length == 10) {\
							phoneDoc.getElementById(\"████████\").value = mask;\
						} else {\
							phoneDoc.getElementById(\"████████\").value = \"\";\
						}\
						phoneDoc.getElementById(\"████████\").click();\
						myFrame.addEventListener(\"load\", () => {\
							let phoneDoc = phoneWindow.document;\
							let applyFrame = ██████████████████████████(\"███████\", phoneDoc.forms[0].████.value, phoneDoc.forms[0].███████████████████.value);\
							applyFrame.addEventListener(\"load\", () => {\
								applyFrame.contentDocument.getElementById(\"████\").click();\
								applyFrame.addEventListener(\"load\", () => {\
									result = \"complete\";\
									part1(resolve);\
								}, {once: true});\
							}, {once: true});\
						}, {once: true});\
					}, {once: true});\
				}, {once: true});\
			}\
		}\
	";
	let nameArray = "\
		if (name.indexOf(\" \", name.indexOf(\" \") + 1) != -1) {\
			let nameArray = name.split(\" \");\
			if (nameArray.length == 3) {\
				let names = [nameArray[0].concat(\" \", nameArray[1]), nameArray[0].concat(\" \", nameArray[2]), nameArray[1].concat(\" \", nameArray[2])];\
			} else if (nameArray.length == 4) {\
				let names = [nameArray[0].concat(\" \", nameArray[1], \" \", nameArray[2]), nameArray[0].concat(\" \", nameArray[1], \" \", nameArray[3]), nameArray[0].concat(\" \", nameArray[2], \" \", nameArray[3]), nameArray[0].concat(\" \", nameArray[1]), nameArray[0].concat(\" \", nameArray[2]), nameArray[0].concat(\" \", nameArray[3]), nameArray[1].concat(\" \", nameArray[2], \" \", nameArray[3]), nameArray[1].concat(\" \", nameArray[2]), nameArray[1].concat(\" \", nameArray[3]), nameArray[2].concat(\" \", nameArray[3])];\
			}\
		}\
	";
	let ███MyFrameSetup = "\
		let myFrame = document.createElement(\"iframe\");\
		myFrame.id = \"myFrame1\";\
		document.body.appendChild(myFrame);\
		myFrame.src = \"https://████-█████.█████████████████.com:████/████████/█████████████.do\";\
		const phoneWindow = myFrame.contentWindow;\
		const myPromise = new Promise((resolve) => {myFrame.addEventListener(\"load\", () => {part1(resolve);}, {once: true})});\
		await myPromise.then((value) => {\
			document.body.removeChild(myFrame);\
			if (document.getElementById(\"myFrame2\") != null) {\
				document.body.removeChild(document.getElementById(\"myFrame2\"));\
			}\
			if (document.getElementById(\"myFrame3\") != null) {\
				document.body.removeChild(document.getElementById(\"myFrame3\"));\
			}\
			return value;\
		});\
		return ";
	let check███ = "\
		async function check███ (name, uid, poss███, locale, is█████, phoneProf, mask, isDID) {\
			" + ██████████████████████████ + ████████ + ███████████████ + ██████████████████████ + checkLoa███Part1 + check███Part2 + nextCheck + check███Part3 + check███Part4 + "\
			let testName = name, checkName = true, nameCount = 0, result = \"No\", output = [\"00000000\", undefined, undefined, undefined];\
			" + nameArray + ███MyFrameSetup + "output;\
		}\
	";
	let add███ = "\
		async function add███ (name, uid, ███Name, locale, is█████, phoneProf, mask, dn) {\
			" + ██████████████████████████ + ████████ + ███████████████ + ██████████████████████ + add███Part1 + add███Part2 + add███Part3 + add███Part4 + "\
			let isDID, mirror███ = \"█████████\", result = \"No\";\
			if (dn.substr(0, 5) == \"11111\") {\
				isDID = false;\
			} else {\
				isDID = true;\
			}\
			" + ███MyFrameSetup + "result;\
		}\
	";
	let delete███ = "\
		async function delete███ (name, uid, poss███, locale) {\
			" + delete███Part1 + delete███Part2 + nextCheck + delete███Part3 + delete███Part4 + "\
			let testName = name, checkName = true, nameCount = 0, result = \"No\", output = [undefined, undefined], deviceList = [];\
			" + nameArray + "\
			let myFrame = document.createElement(\"iframe\");\
			myFrame.id = \"myFrame1\";\
			document.body.appendChild(myFrame);\
			myFrame.src = \"https://████-█████.█████████████████.com:████/████████/█████████████.do\";\
			const phoneWindow = myFrame.contentWindow;\
			const myPromise = new Promise((resolve) => {myFrame.addEventListener(\"load\", () => {part1(resolve);}, {once: true})});\
			await myPromise.then((value) => {document.body.removeChild(myFrame); return value;});\
			return output;\
		}\
	";
	let loa███ = "\
		async function loa███ (name, uid, poss███, isLeave) {\
			" + ██████████████████████████ + ████████ + ███████████████ + ██████████████████████ + checkLoa███Part1 + loa███Part2 + nextCheck + loa███Part3 + loa███Part4 + "\
			let testName = name, checkName = true, nameCount = 0, isFirstPart3 = true, result = \"No\", output = [undefined, undefined, undefined];\
			" + nameArray + ███MyFrameSetup + "output;\
		}\
	";
	let swapDN = "\
		async function swapDN (name, uid, ███Name, newDn, locale, is█████, mask) {\
			" + ██████████████████████████ + swapDNPart1 + swapDNPart2 + nextCheck + swapDNPart3 + swapDNPart4 + "\
			let testName = name, checkName = true, nameCount = 0, result = \"No\", output = [undefined, undefined, undefined], deviceList = [];\
			" + nameArray + ███MyFrameSetup + "output;\
		}\
	";
	let getAvailableDN = "\
		async function getAvailableDN (isDID, locale) {\
			async function part1 (resolve) {\
				if (firstPass) {\
					let dnDoc = dnWindow.document;\
					dnDoc.getElementById(\"████████████\").value = \"numplan.███████████\";\
					dnDoc.getElementById(\"█████████████\").value = \"Available\";\
					dnDoc.getElementsByName(\"██████████\")[0].click();\
					firstPass = false;\
				} else {\
					part2(resolve);\
					if (goodDN != \"No\") {\
						resolve(goodDN);\
					}\
				}\
			}\
			async function part2 (resolve) {\
				let dnDoc = dnWindow.document;\
				let initials;\
				switch (locale) {\
					case \"████\":\
					case \"███████████\":\
					case \"██████ ████\":\
						initials = \"██\";\
						break;\
					case \"█████\":\
						initials = \"███\";\
						break;\
					case \"█████\":\
						initials = \"███\";\
						break;\
					case \"██████\":\
						initials = \"AH\";\
						break;\
					case \"████\":\
						initials = \"████\";\
						break;\
					case \"la\":\
						initials = \"███\";\
						break;\
					case \"███\":\
						initials = \"███\";\
						break;\
					default:\
				}\
				for (const line of Array.from(dnDoc.getElementById(\"███████████████████████████\").children[(function () {let myVar = []; Array.from(dnDoc.getElementById(\"███████████████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
					if (((line.cells[3].innerText.indexOf(initials) >= 0)||((line.cells[3].innerText.indexOf(\"██\") == -1)&&(line.cells[3].innerText.indexOf(\"███\") == -1)&&(line.cells[3].innerText.indexOf(\"███\") == -1)&&(line.cells[3].innerText.indexOf(\"██\") == -1)&&(line.cells[3].innerText.indexOf(\"████\") == -1)&&(line.cells[3].innerText.indexOf(\"███\") == -1)&&(line.cells[3].innerText.indexOf(\"███\") == -1)))&&(line.cells[1].innerText.length == 10)) {\
						if (isDID) {\
							if (line.cells[1].innerText.substr(0, 5) != \"11111\") {\
								goodDN = line.cells[1].innerText;\
								break;\
							}\
						} else {\
							if (line.cells[1].innerText.substr(0, 5) == \"11111\") {\
								goodDN = line.cells[1].innerText;\
								break;\
							}\
						}\
					}\
				}\
				if (goodDN == \"No\") {\
					if(dnDoc.getElementsByName(\"██████ ████████\")[0].parentElement.parentElement.children[1].innerText == \"\") {\
						goodDN = 0;\
					} else if (dnDoc.getElementsByName(\"██████ ████████\")[0].parentElement.parentElement.children[1].innerText.substr(11, dnDoc.getElementsByName(\"██████ ████████\")[0].parentElement.parentElement.children[1].innerText.length - 12) <= pageNum) {\
						goodDN = 0;\
					} else {\
						pageNum++;\
						dnWindow.document.getElementsByName(\"██████ ████████\")[0].parentElement.parentElement.children[1].children[5].click();\
					}\
				}\
				if (goodDN != \"No\") {\
					return goodDN;\
				}\
			}\
			let goodDN = \"No\", pageNum = 1, firstPass = true;\
			let myFrame = document.createElement(\"iframe\");\
			myFrame.id = \"myFrame1\";\
			document.body.appendChild(myFrame);\
			myFrame.src = \"https://████-█████.█████████████████.com:████/████████/███████████████████████.do\";\
			const dnWindow = myFrame.contentWindow;\
			const myPromise = new Promise((resolve) => {myFrame.addEventListener(\"load\", () => {part1(resolve);})});\
			await myPromise.then((value) => {document.body.removeChild(myFrame); return value;});\
			return goodDN;\
		}\
	";
	let add████ = "\
		async function add████ (███Name) {\
			async function part1 (resolve) {\
				if (result != \"No\") {\
					resolve(result);\
					return;\
				}\
				let ████Doc = ████Window.document;\
				████Doc.getElementById(\"██████████\").cells[6].children[0].click();\
				myFrame.addEventListener(\"load\", () => {part2(resolve);}, {once: true});\
			}\
			async function part2 (resolve) {\
				let ████Doc = ████Window.document;\
				for (const line of Array.from(████Doc.getElementById(\"███████████████████\").children[(function () {let myVar = []; Array.from(████Doc.getElementById(\"███████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
					if (line.cells[1].innerText == \"████\") {\
						line.cells[1].children[0].click();\
						myFrame.addEventListener(\"load\", () => {████████████████(resolve);}, {once: true});\
						return;\
					}\
				}\
			}\
			function ████████████████ (resolve) {\
				let ████Doc = ████Window.document;\
				████Doc.getElementsByName(\"██████ ███████████\")[0].click();\
				myFrame.addEventListener(\"load\", () => {part3(resolve);}, {once: true});\
			}\
			async function part3 (resolve) {\
				let ████Doc = ████Window.document;\
				████Doc.getElementById(\"████████████\").value = \"███████████\";\
				████Doc.getElementById(\"█████████████\").value = ███Name;\
				████Doc.getElementById(\"██████████\").cells[6].children[0].click();\
				myFrame.addEventListener(\"load\", () => {part4(resolve);}, {once: true});\
			}\
			async function part4 (resolve) {\
				let ████Doc = ████Window.document;\
				for (const line of Array.from(████Doc.getElementById(\"████████████████\").children[(function () {let myVar = []; Array.from(████Doc.getElementById(\"████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
					if (line.cells[2].innerText == ███Name) {\
						line.cells[0].children[0].checked = true;\
						████Doc.getElementById(\"████████\").click();\
						myFrame.addEventListener(\"load\", () => {\
							result = \"complete\";\
							part1(resolve);\
						}, {once: true});\
						break;\
					}\
				}\
			}\
			let result = \"No\";\
			let myFrame = document.createElement(\"iframe\");\
			myFrame.id = \"myFrame1\";\
			document.body.appendChild(myFrame);\
			myFrame.src = \"https://████-█████.█████████████████.com:████/████████/app████████████.do\";\
			const ████Window = myFrame.contentWindow;\
			const myPromise = new Promise((resolve) => {myFrame.addEventListener(\"load\", () => {part1(resolve);}, {once: true})});\
			await myPromise.then((value) => {document.body.removeChild(myFrame); return value;});\
			return result;\
		}\
	";
	let check███████ = "\
		async function check███████ (uid, is████, ███Name) {\
			async function part1 (resolve) {\
				if (result != \"No\") {\
					resolve(output);\
					return;\
				}\
				let userDoc = userWindow.document;\
				userDoc.getElementById(\"████████████\").value = \"userid\";\
				userDoc.getElementById(\"█████████████\").value = uid;\
				userDoc.getElementById(\"██████████\").cells[6].children[0].click();\
				myFrame.addEventListener(\"load\", () => {part2(resolve);}, {once: true});\
			}\
			async function part2 (resolve) {\
				let userDoc = userWindow.document;\
				for (const line of Array.from(userDoc.getElementById(\"████████████████\").children[(function () {let myVar = []; Array.from(userDoc.getElementById(\"████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
					if (line.cells[1].innerText == uid) {\
						line.cells[1].children[0].click();\
						myFrame.addEventListener(\"load\", () => {\
							part3(resolve);\
						}, {once: true});\
						return;\
					}\
				}\
			}\
			async function part3 (resolve) {\
				let userDoc = userWindow.document;\
				if (!userDoc.getElementById(\"███████████\").checked) {\
					output = \"11\" + output.substr(2);\
					userDoc.getElementById(\"███████████\").click();\
					userDoc.getElementById(\"██████████\").click();\
				} else if (!userDoc.getElementById(\"██████████\").checked) {\
					output = \"01\" + output.substr(2);\
					userDoc.getElementById(\"██████████\").click();\
				}\
				if (is████) {\
					if ((userDoc.getElementById(\"██████████████████\").value == \"████████████████████████████████████\")||(userDoc.getElementById(\"██████████████████\").value == \"████████████████████████████████████\")) {\
						output = output.substr(0, 2) + \"1\" + output.substr(3);\
						userDoc.getElementById(\"██████████████████\").value = \"████████████████████████████████████\";\
					}\
				} else {\
					if ((userDoc.getElementById(\"██████████████████\").value != \"████████████████████████████████████\")&&(userDoc.getElementById(\"██████████████████\").value != \"████████████████████████████████████\")&&(userDoc.getElementById(\"██████████████████\").value != \"████████████████████████████████████\")) {\
						output = output.substr(0, 2) + \"1\" + output.substr(3);\
						userDoc.getElementById(\"██████████████████\").value = \"████████████████████████████████████\";\
					}\
				}\
				if (output != \"0000\") {\
					if (userDoc.getElementById(\"█████████████████\").innerText.indexOf(███Name) > -1) {\
						userDoc.getElementById(\"████████\").click();\
						myFrame.addEventListener(\"load\", () => {\
							result = \"complete\";\
							part1(resolve);\
						}, {once: true});\
					} else {\
						output = output.substr(0, 3) + \"1\";\
						userDoc.getElementById(\"████████\").click();\
						myFrame.addEventListener(\"load\", () => {\
							let userDoc = userWindow.document;\
							userDoc.getElementsByName(\"██████ ███████████\")[0].click();\
							myFrame.addEventListener(\"load\", () => {\
								part4(resolve);\
							}, {once: true});\
						}, {once: true});\
					}\
				} else {\
					if (userDoc.getElementById(\"█████████████████\").innerText.indexOf(███Name) > -1) {\
						result = \"complete\";\
						part1(resolve);\
					} else {\
						output = output.substr(0, 3) + \"1\";\
						let userDoc = userWindow.document;\
						userDoc.getElementsByName(\"██████ ███████████\")[0].click();\
						myFrame.addEventListener(\"load\", () => {\
							part4(resolve);\
						}, {once: true});\
					}\
				}\
			}\
			async function part4 (resolve) {\
				let userDoc = userWindow.document;\
				userDoc.getElementById(\"████████████\").value = \"███████████\";\
				userDoc.getElementById(\"█████████████\").value = ███Name;\
				userDoc.getElementsByName(\"██████████\")[0].click();\
				myFrame.addEventListener(\"load\", () => {\
					let userDoc = userWindow.document;\
					for (const line of Array.from(userDoc.getElementById(\"████████████████\").children[(function () {let myVar = []; Array.from(userDoc.getElementById(\"████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
						if (line.cells[2].innerText == ███Name) {\
							line.cells[0].children[0].checked = true;\
							userDoc.getElementById(\"████████\").click();\
							myFrame.addEventListener(\"load\", () => {\
								result = \"complete\";\
								part1(resolve);\
							}, {once: true});\
							return;\
						}\
					}\
				}, {once: true});\
			}\
			let output = \"0000\";\
			let result = \"No\";\
			let myFrame = document.createElement(\"iframe\");\
			myFrame.id = \"myFrame1\";\
			document.body.appendChild(myFrame);\
			myFrame.src = \"https://████-█████.█████████████████.com:████/████████/████████████.do\";\
			const userWindow = myFrame.contentWindow;\
			const myPromise = new Promise((resolve) => {myFrame.addEventListener(\"load\", () => {part1(resolve);}, {once: true})});\
			await myPromise.then((value) => {document.body.removeChild(myFrame); return value;});\
			return output;\
		}\
	";
	let add███████ = "\
		async function add███████ (uid, is████, ███Name) {\
			async function part1 (resolve) {\
				if (result != \"No\") {\
					resolve(result);\
					return;\
				}\
				let userDoc = userWindow.document;\
				userDoc.getElementById(\"████████████\").value = \"userid\";\
				userDoc.getElementById(\"█████████████\").value = uid;\
				userDoc.getElementById(\"██████████\").cells[6].children[0].click();\
				myFrame.addEventListener(\"load\", () => {\
					part2(resolve);\
				}, {once: true});\
			}\
			async function part2 (resolve) {\
				let userDoc = userWindow.document;\
				for (const line of Array.from(userDoc.getElementById(\"████████████████\").children[(function () {let myVar = []; Array.from(userDoc.getElementById(\"████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
					if (line.cells[1].innerText == uid) {\
						line.cells[1].children[0].click();\
						myFrame.addEventListener(\"load\", () => {\
							part3(resolve);\
						}, {once: true});\
						return;\
					}\
				}\
			}\
			async function part3 (resolve) {\
				let userDoc = userWindow.document;\
				if (!userDoc.getElementById(\"███████████\").checked) {\
					userDoc.getElementById(\"███████████\").click();\
					userDoc.getElementById(\"██████████\").click();\
				} else if (!userDoc.getElementById(\"██████████\").checked) {\
					userDoc.getElementById(\"██████████\").click();\
				}\
				if (is████) {\
					userDoc.getElementById(\"██████████████████\").value = \"████████████████████████████████████\";\
				} else {\
					userDoc.getElementById(\"██████████████████\").value = \"████████████████████████████████████\";\
				}\
				userDoc.getElementById(\"████████\").click();\
				myFrame.addEventListener(\"load\", () => {\
					let userDoc = userWindow.document;\
					userDoc.getElementsByName(\"██████ ███████████\")[0].click();\
					myFrame.addEventListener(\"load\", () => {\
						part4(resolve);\
					}, {once: true});\
				}, {once: true});\
			}\
			async function part4 (resolve) {\
				let userDoc = userWindow.document;\
				userDoc.getElementById(\"████████████\").value = \"███████████\";\
				userDoc.getElementById(\"█████████████\").value = ███Name;\
				userDoc.getElementsByName(\"██████████\")[0].click();\
				myFrame.addEventListener(\"load\", () => {\
					let userDoc = userWindow.document;\
					for (const line of Array.from(userDoc.getElementById(\"████████████████\").children[(function () {let myVar = []; Array.from(userDoc.getElementById(\"████████████████\").children).forEach(function(item) {myVar.push(Array.from(item.classList)[0]);}); return myVar;})().indexOf(\"███████████\")].rows)) {\
						if (line.cells[2].innerText == ███Name) {\
							line.cells[0].children[0].checked = true;\
							userDoc.getElementById(\"████████\").click();\
							myFrame.addEventListener(\"load\", () => {\
								result = \"complete\";\
								part1(resolve);\
							}, {once: true});\
							return;\
						}\
					}\
				}, {once: true});\
			}\
			let result = \"No\";\
			let myFrame = document.createElement(\"iframe\");\
			myFrame.id = \"myFrame1\";\
			document.body.appendChild(myFrame);\
			myFrame.src = \"https://████-█████.█████████████████.com:████/████████/████████████.do\";\
			const userWindow = myFrame.contentWindow;\
			const myPromise = new Promise((resolve) => {myFrame.addEventListener(\"load\", () => {part1(resolve);}, {once: true})});\
			await myPromise.then((value) => {document.body.removeChild(myFrame); return value;});\
			return result;\
		}\
	";
	/*
	TODO
	When checking for ███ profiles, check each individual name as well (in case name is weird on ticket)
	*/
	if (count >= numOfAccts) {
		return;
	}
	for (let i=count; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			let name = document.getElementById(fullNameList[i]).value, uid = document.getElementById(userNameList[i]).value, ███Name, poss███, locale = document.getElementById(localeList[i]).value, is█████, phoneProf, mask, isDID, is████, isLeave;
			if (name == "") {
				document.getElementById("statusBox").innerText = "Full name is blank for Account " + (i + 1);
				count++;
				continue;
			}
			if (document.getElementById(███NameList[i]).value == "") {
				generate███(███NameList[i]);
				if (document.getElementById(███NameList[i]).value == "") {
					count++;
					continue;
				}
			}
			███Name = document.getElementById(███NameList[i]).value;
			poss███ = document.getElementById(███NameList[i]).value;
			if (document.getElementById(infoList[i]).value == "") {
				document.getElementById("statusBox").innerText = "No info for Account " + (i + 1);
				document.getElementById(███NameList[i]).value = "";
				count++;
				continue;
			} else if ((document.getElementById(infoList[i]).value.toLowerCase().indexOf("no phone") >= 0)||(document.getElementById(infoList[i]).value.toLowerCase().indexOf("no setup") >= 0)||(document.getElementById(infoList[i]).value.toLowerCase().indexOf("no █████ setup") >= 0)||(document.getElementById(infoList[i]).value.toLowerCase().indexOf("███████ ████") == -1)) {
				//No █████ setup
				is█████ = undefined;
				phoneProf = "None";
				isDID = undefined;
				is████ = undefined;
			} else {
				if (document.getElementById(infoList[i]).value.toLowerCase().indexOf("no █████") >= 0) {
					is█████ = false;
				} else if (document.getElementById(infoList[i]).value.toLowerCase().indexOf("█████") >= 0) {
					is█████ = true;
				} else {
					document.getElementById("statusBox").innerText = "Cannot retrieve █████ status of Account " + (i + 1);
					document.getElementById(███NameList[i]).value = "";
					count++;
					continue;
				}
				phoneProf = document.getElementById(infoList[i]).value.match(/(?<=███ ██████ █████ ███████:\n)(.+)/g);
				if (phoneProf == "") {
					document.getElementById("statusBox").innerText = "Cannot retrieve █████ ███████ status of Account " + (i + 1);
					document.getElementById(███NameList[i]).value = "";
					count++;
					continue;
				}
				mask = document.getElementById(infoList[i]).value.match(/(?<=Masking Number:\n)(.+)/g);
				if (document.getElementById(infoList[i]).value.toLowerCase().indexOf("non-did") >= 0) {
					isDID = false;
				} else if (document.getElementById(infoList[i]).value.toLowerCase().indexOf("did") >= 0) {
					isDID = true;
				} else {
					document.getElementById("statusBox").innerText = "Cannot retrieve DID status of Account " + (i + 1);
					document.getElementById(███NameList[i]).value = "";
					count++;
					continue;
				}
				if (document.getElementById(infoList[i]).value.match(/(?<=████ Feature:\n)(.+)/g) == "Yes") {
					is████ = true;
				} else {
					is████ = false;
				}
			}
			switch (document.getElementById(tickTypeList[i]).value) {
				case "newHire":
					if (phoneProf == "None") {
						document.getElementById("statusBox").innerText = "No █████ setup for Account " + (i + 1);
						document.getElementById(███NameList[i]).value = "";
						checkNoteAddSpace(i);
						document.getElementById(notesList[i]).value += "This job title does not require a ███ device.";
						count++;
						continue;
					}
					document.getElementById("codeForPages").innerText = getAvailableDN + add███ + add████ + add███████ + delete███ + "\
						let dn, response = [];\
						let prom = getAvailableDN(" + isDID + ", \"" + locale + "\")\
						.then((value) => {\
							dn = value;\
							if (dn.length == 10) {\
								let add███Info;\
								let add███Prom = add███(\"" + name + "\", \"" + uid + "\", \"" + ███Name + "\", \"" + locale + "\", " + is█████ + ", \"" + phoneProf + "\", \"" + mask + "\", dn)\
									.then((value) => {\
										add███Info = value;\
										if (add███Info == \"complete\") {\
											let add████Info;\
											let add████Prom = add████(\"" + ███Name + "\")\
												.then((value) => {\
													add████Info = value;\
													if (add████Info == \"complete\") {\
														let add███████Info;\
														let add███████Prom = add███████(\"" + uid + "\", " + is████ + ", \"" + ███Name + "\")\
															.then((value) => {\
																add███████Info = value;\
																if (add███████Info == \"complete\") {\
																	response[0] = \"notefield\";\
																	response[1] = \"Built device " + ███Name + "\\nAssigned DN \" + dn + \" to " + name + "\\nAdded " + ███Name + " to ████ and " + uid + " users\";\
																	response[2] = {phoneNumList: dn};\
																	console.log(response);\
																	console.log(add███████Info, dn);\
																} else {\
																	console.log(\"Issue encountered while setting up ███ ████ for new ███ profile\");\
																	console.log(add███████Info, dn);\
																}\
															});\
														console.log(add████Info);\
													} else {\
														console.log(\"Issue encountered while setting up ████ for new ███ profile\");\
														console.log(add████Info, dn);\
													}\
												});\
										} else {\
											if (add███Info == \"No userid found\") {\
												let delete███Info;\
												let delete███Prom = delete███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\")\
													.then(async (value) => {\
														delete███Info = value;\
														console.log(\"No userid found while setting up new ███ profile\");\
														if (delete███Info[0] == \"empty\") {\
															console.log(\"Attempted to delete partial ███ profile but was unable to find it\");\
														} else if (delete███Info[0] == \"bad\") {\
															console.log(\"Attempted to delete partial ███ profile but ███ profile found but did not match/was set to Anonymous\");\
														} else if (delete███Info.length == 2) {\
															console.log(\"Partial ███ profile removed\");\
														} else {\
															const deleteRepeat = {\
																async *[Symbol.asyncIterator]() {\
																	for (const other███ of delete███Info[2]) {\
																		yield new Promise((resolve)=>{\
																			delete███(\"" + name + "\", \"" + uid + "\", other███, \"" + locale + "\")\
																				.then((value) => {\
																					resolve(value);\
																				});\
																		});\
																	}\
																}\
															};\
															(async () => {\
																for await (const cycle of deleteRepeat) {\
																	console.log(cycle);\
																}\
																console.log(\"Somehow multiple ███ profiles were found. ███ profiles removed.\");\
															})();\
														}\
														console.log(delete███Info);\
													});\
											}\
											console.log(add███Info);\
										}\
									});\
							} else {\
								console.log(\"No DN currently available\");\
							}\
						});\
					";
					addToClipboard("codeForPages");
					break;
				case "transfer":
					document.getElementById("codeForPages").innerText = check███ + delete███ + getAvailableDN + add███ + add████ + add███████ + swapDN + "\
						let check███Info, response = [];\
						let check███Prom = check███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\", " + is█████ + ", \"" + phoneProf + "\", \"" + mask + "\", " + isDID + ")\
							.then((value) => {\
								check███Info = value;\
								if (check███Info[0].substr(0,3) == \"100\") {\
									console.log(\"███ profile found but did not match/was set to Anonymous and function was exited\");\
								} else if (\"" + phoneProf + "\" == \"None\" && check███Info[0].substr(0,1) == \"0\") {\
									response[0] = \"notefield\";\
									response[1] = \"No ███ profile found and no ███ profile needed\";\
									response[2] = {███NameList: \"\"};\
									console.log(response);\
								} else if (\"" + phoneProf + "\" == \"None\" && (check███Info[0].substr(0,3) == \"101\" || check███Info[0].substr(0,3) == \"110\")) {\
									let delete███Info;\
									let delete███Prom = delete███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\")\
										.then(async (value) => {\
											delete███Info = value;\
											if (delete███Info.length == 2) {\
												response[0] = \"notetablefield\";\
												response[2] = [\"Phone\", \"Remove\"];\
												if (delete███Info[1] == undefined) {\
													response[1] = \"Deleted device \" + delete███Info[0];\
													response[3] = {███NameList: delete███Info[0]};\
												} else {\
													response[1] = \"Deleted device \" + delete███Info[0] + \"\\nSet DN \" + delete███Info[1] + \" to Available\";\
													response[3] = {███NameList: delete███Info[0], phoneNumList: delete███Info[1]};\
												}\
												console.log(response);\
												console.log(delete███Info);\
											} else {\
												const deleteRepeat = {\
													async *[Symbol.asyncIterator]() {\
														for (const other███ of delete███Info[2]) {\
															yield new Promise((resolve)=>{\
																delete███(\"" + name + "\", \"" + uid + "\", other███, \"" + locale + "\")\
																	.then((value) => {\
																		resolve(value);\
																	});\
															});\
														}\
													}\
												};\
												(async () => {\
													for await (const cycle of deleteRepeat) {\
														console.log(cycle);\
													}\
													response[0] = \"notetablefield\";\
													response[1] = \"Deleted device \" + delete███Info[0];\
													response[2] = [\"Phone\", \"Remove\"];\
													for (let i = 1; i < delete███Info[2].length; i++) {\
														response[1] += \"Deleted device \"+ delete███Info[2][i];\
													}\
													response[1] += \"\\nSet DN \" + delete███Info[1] + \" to Available\";\
													response[3] = {███NameList: delete███Info[0], phoneNumList: delete███Info[1]};\
													console.log(response);\
													console.log(delete███Info);\
												})();\
											}\
										});\
								} else if (\"" + phoneProf + "\" == \"None\") {\
									console.log(\"Unexpected situation where no ███ profile was expected\");\
								} else if (check███Info[0].substr(0,1) == \"0\") {\
									let dn;\
									let prom = getAvailableDN(" + isDID + ", \"" + locale + "\")\
									.then((value) => {\
										dn = value;\
										if (dn.length == 10) {\
											let add███Info;\
											let add███Prom = add███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\", " + is█████ + ", \"" + phoneProf + "\", \"" + mask + "\", dn)\
												.then((value) => {\
													add███Info = value;\
													if (add███Info == \"complete\") {\
														let add████Info;\
														let add████Prom = add████(\"" + poss███ + "\")\
															.then((value) => {\
																add████Info = value;\
																if (add████Info == \"complete\") {\
																	let add███████Info;\
																	let add███████Prom = add███████(\"" + uid + "\", " + is████ + ", \"" + poss███ + "\")\
																		.then((value) => {\
																			add███████Info = value;\
																			if (add███████Info == \"complete\") {\
																				response[0] = \"notetablefield\";\
																				response[1] = \"Built device " + poss███ + "\\nAssigned DN \" + dn + \" to " + name + "\\nAdded " + poss███ + " to ████ and " + uid + " users\";\
																				response[2] =  [\"Phone\", \"Add\"];\
																				response[3] = {phoneNumList: dn};\
																				console.log(response);\
																				console.log(add███████Info, dn);\
																			} else {\
																				console.log(\"Issue encountered while setting up ███ ████ for new ███ profile\");\
																				console.log(add███████Info, dn);\
																			}\
																		});\
																} else {\
																	console.log(\"No ███ profile found when ███ profile was expected. Attempted to add ███ profile, however, there was an issue adding to ████.\");\
																	console.log(add████Info);\
																}\
															});\
													} else {\
														if (add███Info = \"No userid found\") {\
															/*Currently do nothing, can remove start of ███ profile for clean re-add*/\
															/*In this situation, this is coming from a transfer ticket and the userid should definitely be found*/\
															console.log(\"No ███ profile found when ███ profile was expected. Attempted to add ███ profile, however, userid could not be found.\");\
														} else {\
															console.log(\"No ███ profile found when ███ profile was expected. Attempted to add ███ profile, however, there was an issue adding the ███ profile.\");\
															console.log(add███Info);\
														}\
													}\
												});\
										} else {\
											console.log(\"No ███ profile found when ███ profile was expected. Attempted to add ███ profile, however, no DNs are currently available.\");\
										}\
									});\
								} else if ((" + isDID + " && check███Info[3].substr(0, 5) == \"11111\")||(!" + isDID + " && check███Info[3].substr(0, 5) != \"11111\")||(check███Info[1].substr(5, 1) == \"0\")) {\
									let newDn;\
									let getAvailableDNProm = getAvailableDN(" + isDID + ", \"" + locale + "\")\
										.then((value) => {\
											newDn = value;\
											if (newDn.length == 10) {\
												let swapDNInfo;\
												let swapDNProm = swapDN(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", newDn, \"" + locale + "\", " + is█████ + ", \"" + mask + "\")\
													.then(async (value) => {\
														swapDNInfo = value;\
														if (swapDNInfo.length == 3) {\
															response[0] = \"notetablefield\";\
															if (swapDNInfo[2] == undefined) {\
																response[1] = \"\";\
															} else {\
																response[1] = \"Set DN \" + swapDNInfo[2] + \" to Available\\n\";\
															}\
															response[1] += \"Assigned DN \" + newDn + \" to " + name + "\";\
															response[2] = [\"Phone\", \"DNSwap\"];\
															response[3] = {phoneNumList: newDn, oldPhoneNumList: swapDNInfo[2], ███NameList: swapDNInfo[0]};\
															console.log(response);\
															console.log(\"New DN: \" + newDn, swapDNInfo);\
														} else {\
															const swapRepeat = {\
																async *[Symbol.asyncIterator]() {\
																	for (const other███ of swapDNInfo[3]) {\
																		yield new Promise((resolve)=>{\
																			swapDN(\"" + name + "\", \"" + uid + "\", other███, newDn, \"" + locale + "\", " + is█████ + ", \"" + mask + "\")\
																				.then((value) => {\
																					resolve(value);\
																				});\
																		});\
																	}\
																}\
															};\
															(async () => {\
																for await (const cycle of swapRepeat) {\
																	console.log(cycle);\
																}\
																response[0] = \"notetablefield\";\
																response[1] = \"Set DN \" + swapDNInfo[2] + \" to Available\\nAssigned DN \" + newDn + \" to " + name + "\";\
																response[2] = [\"Phone\", \"DNSwap\"];\
																response[3] = {phoneNumList: newDn, oldPhoneNumList: swapDNInfo[2], ███NameList: swapDNInfo[0]};\
																console.log(response);\
																console.log(\"New DN: \" + newDn, swapDNInfo);\
															})();\
														}\
													});\
											} else {\
												console.log(\"DN is empty or incorrect type for DID/Non-DID. Attempted to swap DN with correct type, however, there were no available DNs of the correct type.\");\
												console.log(newDn);\
											}\
										});\
								} else {\
									response[0] = \"notefield\";\
									response[2] = {phoneNumList: check███Info[3], ███NameList: check███Info[1]};\
									response[1] = \"\";\
									if (check███Info[0].substr(0,3) == \"101\") {\
										response[1] = \"UserId corrected;\";\
									}\
									if (check███Info[0].substr(3,1) == \"1\") {\
										response[1] += \"██████ ████ updated;\";\
									}\
									if (check███Info[0].substr(4,1) == \"1\") {\
										response[1] += \"██████ █████ ███████ updated;\";\
									}\
									if (check███Info[0].substr(6,1) == \"1\") {\
										response[1] += \"███████ ██████ █████ updated;\";\
									}\
									if (check███Info[0].substr(7,1) == \"1\") {\
										response[1] += \"External Phone Number Mask updated\";\
									}\
									if (check███Info[0] == \"11000100\") {\
										response[1] = \"No changes made to █████ profile\";\
									}\
									if (response[1] == \"\") {\
										console.log(\"Nothing to report\");\
									} else {\
										if (response[1].substr(-1) == \";\") {\
											response[1] = response[1].substr(0, response[1].length-1);\
										}\
										for (let i=0; i<response[1].length; i++) {\
											if (response[1][i] == \";\") {\
												response[1] = response[1].substr(0, i) + \"\\n\" + response[1].substr(i+1);\
											}\
										}\
										console.log(response);\
									}\
								}\
								console.log(check███Info);\
							});\
					";
					addToClipboard("codeForPages");
					break;
				case "reactivate":
					isLeave = false;
					document.getElementById("codeForPages").innerText = loa███ + "\
						let loa███Info, response = [];\
						let loa███Prom = loa███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", " + isLeave + ")\
							.then((value) => {\
								loa███Info = value;\
								if (loa███Info[4] == \"complete\") {\
									response[0] = \"notefield\";\
									response[1] = \"Removed LOA from ███████████ of DN \" + loa███Info[2] + \"\\nSet Owner of \" + loa███Info[0] + \" to " + uid + "\";\
									response[2] = {███NameList: loa███Info[0], phoneNumList: loa███Info[2]};\
									console.log(response);\
								} else {\
									console.log(loa███Info);\
								}\
							});\
					";
					addToClipboard("codeForPages");
					break;
				case "term":
					document.getElementById("codeForPages").innerText = delete███ + "\
						let delete███Info, response = [];\
						let delete███Prom = delete███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\")\
							.then(async (value) => {\
								delete███Info = value;\
								if (delete███Info[0] == \"empty\") {\
									response[0] = \"notefield\";\
									response[1] = \"No ███ profile to delete\";\
									response[2] = {███NameList: \"\"};\
									console.log(response);\
								} else if (delete███Info[0] == \"bad\") {\
									console.log(\"███ profile found but did not match/was set to Anonymous\");\
								} else if (delete███Info.length == 2) {\
									response[0] = \"notefield\";\
									if (delete███Info[1] == undefined) {\
										response[1] = \"Deleted device \" + delete███Info[0];\
										response[2] = {███NameList: delete███Info[0]};\
									} else {\
										response[1] = \"Deleted device \" + delete███Info[0] + \"\\nSet DN \" + delete███Info[1] + \" to Available\";\
										response[2] = {███NameList: delete███Info[0], phoneNumList: delete███Info[1]};\
									}\
									console.log(response);\
								} else {\
									const deleteRepeat = {\
										async *[Symbol.asyncIterator]() {\
											for (const other███ of delete███Info[2]) {\
												yield new Promise((resolve)=>{\
													delete███(\"" + name + "\", \"" + uid + "\", other███, \"" + locale + "\")\
														.then((value) => {\
															resolve(value);\
														});\
												});\
											}\
										}\
									};\
									(async () => {\
										for await (const cycle of deleteRepeat) {\
											console.log(cycle);\
										}\
										response[0] = \"notefield\";\
										response[1] = \"Deleted device \" + delete███Info[0];\
										for (let i = 1; i < delete███Info[2].length; i++) {\
											response[1] += \"Deleted device \"+ delete███Info[2][i];\
										}\
										response[1] += \"\\nSet DN \" + delete███Info[1] + \" to Available\";\
										response[2] = {███NameList: delete███Info[0], phoneNumList: delete███Info[1]};\
										console.log(response);\
										console.log(delete███Info);\
									})();\
								}\
							});\
					";
					addToClipboard("codeForPages");
					break;
				case "tempTerm":
					isLeave = true;
					document.getElementById("codeForPages").innerText = loa███ + "\
						let loa███Info, response = [];\
						let loa███Prom = loa███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", " + isLeave + ")\
							.then((value) => {\
								loa███Info = value;\
								if (loa███Info[3] == \"complete\") {\
									response[0] = \"notefield\";\
									response[1] = \"Added LOA to ███████████ of DN \" + loa███Info[2] + \"\\nSet Owner of \" + loa███Info[0] + \" to Anonymous\";\
									response[2] = {███NameList: loa███Info[0], phoneNumList: loa███Info[2]};\
									console.log(response);\
								} else {\
									console.log(loa███Info);\
								}\
							});\
					";
					addToClipboard("codeForPages");
					break;
				case "dnSwap":
					document.getElementById("statusBox").innerText = "Really?";
					break;
			}
			count++;
			document.getElementById("consoleReplyButton").setAttribute('onclick', "nextAccount(" + count + ")");
			document.getElementById("nextDiv").style.display = "block";
			return;
		} else {
			count++;
		}
	}
	//Function names and params
	/*
	check███ (name, uid, poss███, locale, is█████, phoneProf, mask, isDID)
		
		check███ + "\
			let check███Info;\
			let check███Prom = check███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\", " + is█████ + ", \"" + phoneProf + "\", \"" + mask + "\", " + isDID + ")\
				.then((value) => {\
					check███Info = value;\
					console.log(check███Info);\
				});\
		";
		
					0 1 2 3 4 5 6 7		1			 2			   3	4
		Output:		1 2 3 4 5 6 7 8		9			 10			   11	12
				["	0 0 0 0 0 0 0 0	", found███Name, found███Desc, dn, "complete"/"bad"/"empty"]
		
		1. 0 = No ███ profile found / 1 = Found ███ profile with provided info
		2. 0 = UserID on ███ profile does not match provided userID / 1 = UserID on profile matches
		3. If 2 was 0, 0 = function was exited after lack of match / 1 = function continued after lack of match
		4. 0 = ██████ ████ unchanged / 1 = ██████ ████ changed
		5. 0 = ██████ █████ ███████ unchanged / 1 = ██████ █████ ███████ changed
		6. 0 = No DN on ███ profile / 1 = DN retrieved
		7. 0 = ███████ ██████ █████ unchanged / 1 = ███████ ██████ █████ changed	
		8. 0 = External Phone Number Mask unchanged / 1 = External Phone Number Mask changed
		
		NOTE:**calling function needs to verify that dn returned is for correct DID/Non-DID**
		
	add███ (name, uid, ███Name, locale, is█████, phoneProf, mask, dn)
		
		add███ + "\
			let add███Info;\
			let add███Prom = add███(\"" + name + "\", \"" + uid + "\", \"" + ███Name + "\", \"" + locale + "\", " + is█████ + ", \"" + phoneProf + "\", \"" + mask + "\", dn)\
				.then((value) => {\
					add███Info = value;\
					console.log(add███Info);\
				});\
		";
		
		Output: complete - if no issue
				No userid found - findUser did not find uid
		
	delete███ (name, uid, poss███, locale)
		
		delete███ + "\
			let delete███Info;\
			let delete███Prom = delete███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", \"" + locale + "\")\
				.then(async (value) => {\
					delete███Info = value;\
					if (delete███Info.length == 2) {\
						console.log(delete███Info);\
					} else {\
						const deleteRepeat = {\
							async *[Symbol.asyncIterator]() {\
								for (const other███ of delete███Info[2]) {\
									yield new Promise((resolve)=>{\
										delete███(\"" + name + "\", \"" + uid + "\", other███, \"" + locale + "\")\
											.then((value) => {\
												resolve(value);\
											});\
									});\
								}\
							}\
						};\
						(async () => {\
							for await (const cycle of deleteRepeat) {\
								console.log(cycle);\
							}\
							console.log(delete███Info);\
						})();\
					}\
				});\
		";
		
		Output: [███Name, dn, ??deviceList]
				███Name = bad - if uid does not match userid on ███ profile
						= empty - if no ███ profile found
		
	loa███ (name, uid, poss███, isLeave)
		
		loa███ + "\
			let loa███Info;\
			let loa███Prom = loa███(\"" + name + "\", \"" + uid + "\", \"" + poss███ + "\", " + isLeave + ")\
				.then((value) => {\
					loa███Info = value;\
					console.log(loa███Info);\
				});\
		";
		
		Output: [███Name, nameOfUser, dn, empty, "complete"/"bad"]
		
	swapDN (name, uid, ███Name, newDn, locale, is█████, mask)
		
		swapDN + "\
			let swapDNInfo;\
			let swapDNProm = swapDN(\"" + name + "\", \"" + uid + "\", \"" + ███Name + "\", newDn, \"" + locale + "\", " + is█████ + ", \"" + mask + "\")\
				.then(async (value) => {\
					swapDNInfo = value;\
					if (swapDNInfo.length == 2) {\
						console.log(\"New DN: \" + newDN, swapDNInfo);\
					} else {\
						const swapRepeat = {\
							async *[Symbol.asyncIterator]() {\
								for (const other███ of swapDNInfo[2]) {\
									yield new Promise((resolve)=>{\
										swapDN(\"" + name + "\", \"" + uid + "\", other███, newDn, \"" + locale + "\", " + is█████ + ", \"" + mask + "\")\
											.then((value) => {\
												resolve(value);\
											});\
									});\
								}\
							}\
						};\
						(async () => {\
							for await (const cycle of swapRepeat) {\
								console.log(cycle);\
							}\
							console.log(\"New DN: \" + newDN, swapDNInfo);\
						})();\
					}\
				});\
		";
		
		Output: [███Name, nameOfUser, oldDn, ??deviceList]
		
	getAvailableDN (isDID, locale)
		
		getAvailableDN + "\
			let dn/newDn;\
			let getAvailableDNProm = getAvailableDN(" + isDID + ", \"" + locale + "\")\
				.then((value) => {\
					dn/newDn = value;\
					if (dn/newDn.length == 10) {\
						\
					} else {\
						console.log(dn/newDn);\\
					}\
				});\
		";
		
		Output: dn/newDn
		
	add████ (███Name)
		
		add████ + "\
			let add████Info;\
			let add████Prom = add████(\"" + ███Name + "\")\
				.then((value) => {\
					add████Info = value;\
					if (add████Info == \"complete\") {\
						\
					} else {\
						console.log(add████Info);\
					}\
				});\
		";
		
		Output: complete
		
	check███████ (uid, is████, ███Name)
		
		check███████ + "\
			let check███████Info;\
			let check███████Prom = check███████(\"" + uid + "\", " + is████ + ", \"" + ███Name + "\")\
				.then((value) => {\
					check███████Info = value;\
					console.log(check███████Info);\
				});\
		";
		
				 0 1 2 3
		output = 1 2 3 4
				"0 0 0 0"
				
		1. 0 = ████ ███████ was checked / 1 = ████ ███████ needed to be checked
		2. 0 = ██ ██ ███ ████████ was checked / 1 = ██ ██ ███ ████████ needed to be checked
		3. 0 = ████ profile unchanged / 1 = ████ profile changed
		4. 0 = ███ profile was linked / 1 = ███ profile needed to be linked
		
	add███████ (uid, is████, ███Name)
		
		add███████ + "\
			let add███████Info;\
			let add███████Prom = add███████(\"" + uid + "\", " + is████ + ", \"" + ███Name + "\")\
				.then((value) => {\
					add███████Info = value;\
					if (add████Info == \"complete\") {\
						\
					} else {\
						console.log(add███████Info);\
					}\
				});\
		";
		
		Output: complete
	
	[1 line redacted]
	*/
};

function nextAccount(count) {
	function updateNotes(notes) {
		checkNoteAddSpace(currAcct);
		document.getElementById(notesList[currAcct]).value += notes;
	}
	function updateTable(info) {
		//info = [system name, value for cell]
		if (!((document.getElementById("provisionTable").innerText != "") && (document.getElementById("provisionTable").innerText != "undefined") && (document.getElementById("provisionTable").children[0].rows[0].cells.length-1 > currAcct))) {
			return;
		}
		let cell;
		for (const row of document.getElementById("provisionTable").children[0].rows) {
			if (row.cells[0].innerText == info[0]) {
				cell = row.cells[currAcct + 1];
			}
		}
		if (cell.innerText != info[1]) {
			switch (info[1]) {
				case "Add":
					cell.classList.add("alwaysBlack");
					cell.style = "background: green";
					cell.innerText = "Add";
					break;
				case "Update":
					cell.classList.add("alwaysBlack");
					cell.style = "background: yellow";
					cell.innerText = "Update";
					break;
				case "Remove":
					cell.classList.add("alwaysBlack");
					cell.style = "background: red";
					cell.innerText = "Remove";
					break;
				case "TempDc":
					cell.classList.add("alwaysBlack");
					cell.style = "background: salmon";
					cell.innerText = "TempDc";
					break;
				case "TempAd":
					cell.classList.add("alwaysBlack");
					cell.style = "background: lightgreen";
					cell.innerText = "TempAd";
					break;
				case "DNSwap":
					cell.classList.add("alwaysBlack");
					cell.style = "background: lightblue";
					cell.innerText = "DNSwap";
					break;
				case "Ignore":
					cell.classList.remove("alwaysBlack");
					cell.style.removeProperty("background");
					cell.innerText = "Ignore";
					break;
			}
		}
	}
	function updateField(details) {
		for (const field in details) {
			document.getElementById(Function("return " + field)()[currAcct]).value = details[field];
		}
	}
	let currAcct = count-1;
	document.getElementById("consoleReplyButton").setAttribute('onclick', "");
	document.getElementById("nextDiv").style = "display: hidden";
	if (document.getElementById("consoleReply").value == "") {
		create█████(count);
	} else {
		//Parse reply
		let reply = JSON.parse(document.getElementById("consoleReply").value);
		switch (reply[0]) {
			case "note":
				updateNotes(reply[1]);
				break;
			case "table":
				updateTable(reply[1]);
				break;
			case "field":
				updateField(reply[1]);
				break;
			case "notetable":
				updateNotes(reply[1]);
				updateTable(reply[2]);
				break;
			case "notefield":
				updateNotes(reply[1]);
				updateField(reply[2]);
				break;
			case "tablefield":
				updateTable(reply[1]);
				updateField(reply[2]);
				break;
			case "notetablefield":
				updateNotes(reply[1]);
				updateTable(reply[2]);
				updateField(reply[3]);
				break;
		}
		document.getElementById("consoleReply").value = "";
		create█████(count);
	}
}

function create█████() {
	document.getElementById("statusBox").innerText = "";
	if (█████Page === undefined) {
		document.getElementById("statusBox").innerText = "Please open █████ window and login before attempting to create account";
	//} else if() { //check if login has been completed
		
	} else {
		█████Page.document.getElementById("██████████████").click();
	}
	/*
	█████: **Have to refresh the page after each user or IDs will change**
	[5 lines redacted]
	*/
};

function create██████() {
	document.getElementById("statusBox").innerText = "";
	if (██████Page === undefined) {
		document.getElementById("statusBox").innerText = "Please open ███ ███ window and login before attempting to create account";
	} else if (██████Page.document.getElementsByName("newLogin") == undefined) {
		document.getElementById("statusBox").innerText = "Please make sure you are on the new user creation page to make ███ ███ account";
	} else {
		for (let i=0; i<numOfAccts; i++) {
			if (document.getElementById(checkboxList[i]).checked) {
				██████Page.document.getElementsByName("newLogin")[0].value = document.getElementById(███NameList[i]).value
				██████Page.document.getElementsByName("firstName")[0].value = document.getElementById(firstNameList[i]).value
				██████Page.document.getElementsByName("lastName")[0].value = document.getElementById(lastNameList[i]).value
				██████Page.document.getElementsByName("emailAddress")[0].value = document.getElementById(emailList[i]).value
				██████Page.document.getElementsByName("teamName")[0].value = "███/ ███/ ███ Blend"
				
			}
		}
	}
	//<input type="checkbox" name="roles" value="███/███/███ Blend">
}

function create██████() {
	document.getElementById("statusBox").innerText = "";
	if (██████Page === undefined) {
		document.getElementById("statusBox").innerText = "Please open ███ ███ window and login before attempting to create account";
	} else if (██████Page.document.getElementsByName("newLogin") == undefined) {
		document.getElementById("statusBox").innerText = "Please make sure you are on the new user creation page to make ███ ███ account";
	} else {
		for (let i=0; i<numOfAccts; i++) {
			if (document.getElementById(checkboxList[i]).checked) {
				██████Page.document.getElementsByName("newLogin").value = document.getElementById(███NameList[i]).value
				██████Page.document.getElementsByName("firstName").value = document.getElementById(firstNameList[i]).value
				██████Page.document.getElementsByName("lastName").value = document.getElementById(lastNameList[i]).value
				██████Page.document.getElementsByName("emailAddress").value = document.getElementById(emailList[i]).value
				██████Page.document.getElementsByName("teamName").value = "███/ ███/ ███ Blend"
				
			}
		}
	}
}

function create████() { //Make ████████ csv file for bulk import
	let ████List = "FirstName,LastName,UserEmail,█████████████,█████,█████,███████████,███ █████,AddressLine1,AddressLine2,City,StateRegionProvince,PostalCode,Phone,Language\n"; //First line
	for (let i=0; i<numOfAccts; i++) { //cycle through accounts
		if (document.getElementById(checkboxList[i]).checked) { //only if checked
			████List = ████List + document.getElementById(firstNameList[i]).value + "," + document.getElementById(lastNameList[i]).value + "," + document.getElementById(emailList[i]).value + ",██ ██████,████████,████████ ███████,,,,,,,,,en\n";
		}
	}
	//The following downloads the file as a CSV
	let file = new Blob([docuList], {
		type: 'text/csv;encoding:utf-8'
	});
	let downloadDiv = document.createElement('a');
	downloadDiv.href = URL.createObjectURL(file);
	downloadDiv.setAttribute('download', '████████addusers.csv');
	document.body.appendChild(downloadDiv);
    downloadDiv.click();
    document.body.removeChild(downloadDiv);
}

function create███() { //Make ███ csv file for bulk add
	let ███List = "Name,Email,Categories\n"; //First line
	for (let i=0; i<numOfAccts; i++) { //cycle through accounts
		if (document.getElementById(checkboxList[i]).checked) { //only if checked
			███List = ███List + document.getElementById(fullNameList[i]).value + "," + document.getElementById(emailList[i]).value + ",\n";
		}
	}
	//The following downloads the file as a CSV
	let file = new Blob([███List], {
		type: 'text/csv;encoding:utf-8'
	});
	let downloadDiv = document.createElement('a');
	downloadDiv.href = URL.createObjectURL(file);
	downloadDiv.setAttribute('download', '█████████addusers.csv');
	document.body.appendChild(downloadDiv);
    downloadDiv.click();
    document.body.removeChild(downloadDiv);
}

function checkNoteAddSpace(num) {
	if (document.getElementById(notesList[num]).value != "") {
		document.getElementById(notesList[num]).value += "\n\n";
	}
}

function notateNothing() {
	//No █████ or Access template for <role>.
}

function notate█████() {
	for (let i=0; i<numOfAccts; i++) { //Cycle through each account
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				if (document.getElementById(phoneNumList[i]).value == "" && document.getElementById(███NameList[i]).value == "") {
					document.getElementById(notesList[i]).value += "This job title does not require a ███ device.";
				} else {
					document.getElementById(notesList[i]).value += "Built device " + document.getElementById(███NameList[i]).value + "\nAssigned DN " + document.getElementById(phoneNumList[i]).value + " to " + document.getElementById(fullNameList[i]).value + "\nAdded " + document.getElementById(███NameList[i]).value + " to ████ and " + document.getElementById(userNameList[i]).value + " users";
				}
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				if (document.getElementById(phoneNumList[i]).value == "" && document.getElementById(███NameList[i]).value == "") {
					document.getElementById(notesList[i]).value += "No ███ profile to delete";
				} else {
					document.getElementById(notesList[i]).value += "Deleted device " + document.getElementById(███NameList[i]).value + "\nSet DN " + document.getElementById(phoneNumList[i]).value + " to Available";
				}
			} else if (document.getElementById(tickTypeList[i]).value == "tempTerm") {
				if (document.getElementById(phoneNumList[i]).value == "" && document.getElementById(███NameList[i]).value == "") {
					document.getElementById(notesList[i]).value += "No ███ profile";
				} else {
					document.getElementById(notesList[i]).value += "Added LOA to ███████████ of DN " + document.getElementById(phoneNumList[i]).value + "\nSet Owner of " + document.getElementById(███NameList[i]).value + " to Anonymous";
				}
			} else if (document.getElementById(tickTypeList[i]).value == "reactivate") {
				if (document.getElementById(phoneNumList[i]).value == "" && document.getElementById(███NameList[i]).value == "") {
					document.getElementById(notesList[i]).value += "No ███ profile";
				} else {
					document.getElementById(notesList[i]).value += "Removed LOA from ███████████ of DN " + document.getElementById(phoneNumList[i]).value + "\nSet Owner of " + document.getElementById(███NameList[i]).value + " to " + document.getElementById(userNameList[i]).value;
				}
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				if ((document.getElementById(phoneNumList[i]).value != "")&&(document.getElementById(███NameList[i]).value != "")) {
					document.getElementById(notesList[i]).value += "Verifed/updated profile in █████ Administration, including ███████ ██████ █████ and Masking Number on DN " + document.getElementById(phoneNumList[i]).value + " and ██████ █████ ███████ on " + document.getElementById(███NameList[i]).value;
				} else {
					document.getElementById(notesList[i]).value += "No change needed in █████";
				}
			} else if (document.getElementById(tickTypeList[i]).value == "dnSwap") {
				if (document.getElementById(phoneNumList[i]).value == "") {
					document.getElementById("statusBox").value = "No phone number for DN swap notes for Account " + i.toString();
					if (document.getElementById(notesList[0]).value.substr(-2) == "\n\n") {
						document.getElementById(notesList[0]).value = document.getElementById(notesList[0]).value.substr(0, document.getElementById(notesList[0]).value.length - 2);
					}
				} else if (document.getElementById(oldPhoneNumList[i]).value == "") {
					document.getElementById(notesList[i]).value += "Assigned DN " + document.getElementById(phoneNumList[i]).value + " to " + document.getElementById(fullNameList[i]).value;
				} else {
					document.getElementById(notesList[i]).value += "Set DN " + document.getElementById(oldPhoneNumList[i]).value + " to Available\nAssigned DN " + document.getElementById(phoneNumList[i]).value + " to " + document.getElementById(fullNameList[i]).value;
				}
			}
		}
	}
}

function notate█████() {
	for (let i=0; i<numOfAccts; i++) { //Cycle through each account
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in █████\nUsername: " + document.getElementById(userNameList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term" || document.getElementById(tickTypeList[i]).value == "tempTerm") {
				document.getElementById(notesList[i]).value += "Disabled user in █████";
			} else if (document.getElementById(tickTypeList[i]).value == "reactivate") {
				document.getElementById(notesList[i]).value += "Enabled user in █████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verifed/updated profile in █████";
			}
		}
	}
}

function notate███████in() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███/██████████ ███\nUsername: " + document.getElementById(emailList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in ██████████ ███";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in █████████ Administration";
			}
		}
	}
}

function notate██████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███\\███\\███ ███\nUsername: " + document.getElementById(███NameList[i]).value + "\nCheck email for password";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Removed user in ███\\███\\███ ███";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███\\███\\███ ███";
			}
		}
	}
}

function notate██████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███ ███\nUsername: " + document.getElementById(███NameList[i]).value + "\nCheck email for password";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Removed user in ███ ███";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███ ███";
			}
		}
	}
}

function notate████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ████████\nUsername: " + document.getElementById(emailList[i]).value + "\nCheck email for password";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Removed user in ████████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ████████";
			}
		}
	}
}

function notate███() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in █████████\nUsername: " + document.getElementById(emailList[i]).value + "\nCheck email for password";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in █████████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in █████████";
			}
		}
	}
}

function notate████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ████\nUsername: " + document.getElementById(userNameList[i]).value + "\nPassword: ███████1";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Removed user in ████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ████";
			}
		}
	}
}

function notate███() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███\nUsername: " + document.getElementById(userNameList[i]).value + "\nID: " + document.getElementById(███IdList[i]).value + "\nCheck email for password";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in ███";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███";
			}
		}
	}
}

function notate██() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in █████████\nAccount is SSO Enabled";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in █████████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in █████████";
			}
		}
	}
}

function notate█████████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ████████ ██████████s\nUsername: " + █████intUsernameCheck(i) + "\nPassword: ████████1";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Suspended user in ████████ ██████████s";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ████████ ██████████s";
			}
		}
	}
}

function notate█████████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ██████/███████\nUsername: " + document.getElementById(emailList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term" || document.getElementById(tickTypeList[i]).value == "tempTerm") {
				document.getElementById(notesList[i]).value += "Disabled in █████████/████████████ ███";
			} else if (document.getElementById(tickTypeList[i]).value == "reactivate") {
				document.getElementById(notesList[i]).value += "Activated in ████████ Administration";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ████████ █████";
			}
		}
	}
}

function notate███████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███████\nUsername: " + document.getElementById(userNameList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled in ███████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███████";
			}
		}
	}
}

function notate█████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in █████\nUsername: " + document.getElementById(emailList[i]).value + "\nDomain: ████████████████.█████.com\nAccount is SSO Enabled";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled in █████";
			}
		}
	}
}

function notate██████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Added to █████ ███ █████████";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled in █████ ███ █████████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in █████ ███ █████████";
			}
		}
	}
}

function notate████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ████\nUsername: " + document.getElementById(userNameList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in ████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ████";
			}
		}
	}
}

function notate███████████() {
	for (let i=0; i<numOfAccts; i++) { //Cycle through each account
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███████████\nUsername: " + document.getElementById(userNameList[i]).value + "\nCheck email for passphrase";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in ███████████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███████████";
			}
		}
	}
}

function notate███() {
	for (let i=0; i<numOfAccts; i++) { //Cycle through each account
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███\nUsername: " + document.getElementById(userNameList[i]).value + "\nCheck email for password";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in ███";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███";
			}
		}
	}
}

function notate██████() {

}

function notate███████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ████ █████\nUsername: " + document.getElementById(emailList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Disabled user in ████ █████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				if (document.getElementById(notesList[i]).value.indexOf("Verified/updated profile in █████████ Administration") == -1) {
					document.getElementById(notesList[i]).value += "Verified/updated profile in █████████ Administration";
				} else {
					if (document.getElementById(notesList[0]).value.substr(-2) == "\n\n") {
						document.getElementById(notesList[0]).value = document.getElementById(notesList[0]).value.substr(0, document.getElementById(notesList[0]).value.length - 2);
					}
				}
			}
		}
	}
}

function notate█████████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ████████ ████\nUsername: " + █████intUsernameCheck(i) + "\nPassword: ████████1";
			} else if (document.getElementById(tickTypeList[i]).value == "term") {
				document.getElementById(notesList[i]).value += "Suspended user in ████████ ████";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ████████ ████";
			}
		}
	}
}

function notate███████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Ticket submitted to ███ Dev team for access to ███ █████████";
			}
			
		}
	}
	//████████ █████: please submit a ticket to DEV team for the user to have access to this internal webapp: http://███████.█████████████████.com/████/███_███████_███/
}

function notate████████() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			checkNoteAddSpace(i);
			if (document.getElementById(tickTypeList[i]).value == "newHire") {
				document.getElementById(notesList[i]).value += "Built in ███ ██████/███████\nUsername: " + document.getElementById(emailList[i]).value + "\nPassword same as Windows login";
			} else if (document.getElementById(tickTypeList[i]).value == "term" || document.getElementById(tickTypeList[i]).value == "tempTerm") {
				document.getElementById(notesList[i]).value += "Disabled in ███ █████████/████████████ ███";
			} else if (document.getElementById(tickTypeList[i]).value == "reactivate") {
				document.getElementById(notesList[i]).value += "Activated in ███ Administration";
			} else if (document.getElementById(tickTypeList[i]).value == "transfer") {
				document.getElementById(notesList[i]).value += "Verified/updated profile in ███ █████";
			}
		}
	}
}

function notate█████████() {
	
}

function notate████████████() {
	
}

function notate███████████() {
	
}

function notateAll(part) { //Notates all accounts for all systems based on table layout
	if (document.getElementById("provisionTable").innerText == "" || document.getElementById("provisionTable").innerText == "undefined") {
		document.getElementById("statusBox").innerText = "Cannot notate accounts without provisioning table";
		return;
	}
	let tableContents = document.getElementById("provisionTable").children[0].children[0].children;
	if (part == "one") {
		let tableRow = tableContents[1].children;
		clearCheckBoxes();
		if (tableRow[0].innerText == "Phone") {
			let prevState = [];
			for (let i=1;i<tableRow.length;i++) {
				prevState[i-1] = document.getElementById(tickTypeList[i-1]).value;
				let isGo = true;
				switch (tableRow[i].innerText) {
					case "Add":
						document.getElementById(tickTypeList[i-1]).value = "newHire";
						break;
					case "Update":
						document.getElementById(tickTypeList[i-1]).value = "transfer";
						break;
					case "Remove":
						document.getElementById(tickTypeList[i-1]).value = "term";
						break;
					case "TempDc":
						document.getElementById(tickTypeList[i-1]).value = "tempTerm";
						break;
					case "TempAd":
						document.getElementById(tickTypeList[i-1]).value = "reactivate";
						break;
					case "DNSwap":
						document.getElementById(tickTypeList[i-1]).value = "dnSwap";
						break;
					case "Ignore":
						//System is phone, tickType should remain unchanged as it should be original, but notes still need to be made
						break;
					default:
						isGo = false;
				}
				document.getElementById(checkboxList[i-1]).checked = isGo;
			}
			notate█████();
			for (let i=0; i<prevState.length; i++) {
				document.getElementById(tickTypeList[i]).value = prevState[i];
			}
		}
	} else if (part == "two") {
		let num;
		if (tableContents[1].children[0].innerText == "Phone") {
			num = 2;
		} else {
			num = 1;
		}
		for (let i=num;i<tableContents.length-1;i++) {
			let prevState = [];
			let tableRow = tableContents[i].children;
			let currentSys = tableRow[0].innerText;
			clearCheckBoxes();
			for (let j=1;j<tableRow.length;j++) {
				let isGo = true;
				prevState[j-1] = document.getElementById(tickTypeList[j-1]).value;
				switch (tableRow[j].innerText) {
					case "Add":
						document.getElementById(tickTypeList[j-1]).value = "newHire";
						break;
					case "Update":
						document.getElementById(tickTypeList[j-1]).value = "transfer";
						break;
					case "Remove":
						document.getElementById(tickTypeList[j-1]).value = "term";
						break;
					case "TempDc":
						document.getElementById(tickTypeList[j-1]).value = "tempTerm";
						break;
					case "TempAd":
						document.getElementById(tickTypeList[j-1]).value = "reactivate";
						break;
					case "Ignore":
						isGo = false;
						break;
					default:
						isGo = false;
				}
				document.getElementById(checkboxList[j-1]).checked = isGo;
			}
			switch (currentSys) {
				case "█████":
					notate█████();
					break;
				case "███████":
					notate█████████();
					break;
				case "███ ███":
					notate██████();
					break;
				case "███ ███":
					notate██████();
					break;
				case "███████":
					notate████();
					break;
				case "███":
					notate███();
					break;
				case "████":
					notate████();
					break;
				case "████":
					notate████();
					break;
				case "███":
					notate███();
					break;
				case "███████":
					notate███████();
					break;
				case "███████":
					notate███████();
					break;
				case "██████":
					notate██();
					break;
				case "█████████":
					notate█████████();
					break;
				case "█████████":
					notate█████████();
					break;
				case "██████":
					notate█████████();
					break;
				case "███ ███":
					notate████████();
					break;
				case "███████":
					notate███████();
					break;
				case "██████":
					notate██████();
					break;
				case "██ ██████":
					notate███████████();
					break;
				case "███":
					notate███();
					break;
				case "██████":
					notate██████();
					break;
				case "███████":
					notate█████████();
					break;
				case "███████":
					notate████████████();
					break;
				case "███████":
					notate███████████();
					break;
				default:
			}
			for (let j=0; j<prevState.length; j++) {
				document.getElementById(tickTypeList[j]).value = prevState[j];
			}
		}
		for (let i=0; i<numOfAccts; i++) {
			if (document.getElementById(notesList[i]).value == "") { //If an account has no notes after everything, it needs a special note
				switch (document.getElementById(tickTypeList[i]).value) {
					case "newHire":
						document.getElementById(notesList[i]).value = "No ████████ system access provisioned";
						break;
					case "transfer":
						document.getElementById(notesList[i]).value = "No ████████ system access changes needed";
						break;
					case "term":
						document.getElementById(notesList[i]).value = "No ████████ system access to remove";
						break;
					case "tempTerm":
						document.getElementById(notesList[i]).value = "No ████████ system access to disable";
						break;
					case "reactivate":
						document.getElementById(notesList[i]).value = "No ████████ system access to enable";
						break;
					default:
				}
			}
		}
		addSpaces();
	}
}

function █████intUsernameCheck(acctNum) {
	if (document.getElementById(████UNameList[acctNum]).value != "") {
		return document.getElementById(████UNameList[acctNum]).value;
	} else {
		return document.getElementById(userNameList[acctNum]).value;
	}
}

function clearAll() {
	if (document.getElementById(revealerList[0]).innerText == ">") {
		hideMoreAcct(0);
	}
	document.getElementById(tickListList[0]).value = "";
	document.getElementById(tickTypeList[0]).value = "";
	document.getElementById(itemNumList[0]).value = "";
	document.getElementById(phoneNumList[0]).value = "";
	document.getElementById(oldPhoneNumList[0]).value = "";
	document.getElementById(███NameList[0]).value = "";
	document.getElementById(userNameList[0]).value = "";
	document.getElementById(firstNameList[0]).value = "";
	document.getElementById(lastNameList[0]).value = "";
	document.getElementById(fullNameList[0]).value = "";
	document.getElementById(emailList[0]).value = "";
	document.getElementById(███NameList[0]).value = "";
	document.getElementById(███IdList[0]).value = "";
	document.getElementById(████UNameList[0]).value = "";
	document.getElementById(roleList[0]).value = "";
	document.getElementById(localeList[0]).value = "";
	document.getElementById(managerList[0]).value = "";
	document.getElementById(departmentList[0]).value = "";
	document.getElementById(mirrorUserList[0]).value = "";
	document.getElementById(dateList[0]).value = "";
	document.getElementById(infoList[0]).value = "";
	document.getElementById(notesList[0]).value = "";
	document.getElementById(codeForAcctList[0]).value = "";
	document.getElementById(checkboxList[0]).checked = false;
	document.getElementById("numAcct").value = 1;
	document.getElementById("numAcct").dispatchEvent(new Event('change'));
	document.getElementById("statusBox").innerText = "";
	document.getElementById("provisionTable").innerHTML = "";
	document.getElementById("page").style.paddingTop = "122px";
}

function checkAllBoxes() {
	for (let i=0; i<=document.getElementById("numAcct").value-1; i++) {
		document.getElementById(checkboxList[i]).checked = true;
	}
}

function clearCheckBoxes() {
	for (let i=0; i<numOfAccts; i++) {
		document.getElementById(checkboxList[i]).checked = false;
	}
}

function clearAccount() {
	for (let i=0; i<numOfAccts; i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			document.getElementById(tickListList[i]).value = "";
			document.getElementById(tickTypeList[i]).value = "";
			document.getElementById(itemNumList[i]).value = "";
			document.getElementById(phoneNumList[i]).value = "";
			document.getElementById(oldPhoneNumList[i]).value = "";
			document.getElementById(███NameList[i]).value = "";
			document.getElementById(userNameList[i]).value = "";
			document.getElementById(firstNameList[i]).value = "";
			document.getElementById(lastNameList[i]).value = "";
			document.getElementById(fullNameList[i]).value = "";
			document.getElementById(emailList[i]).value = "";
			document.getElementById(███NameList[i]).value = "";
			document.getElementById(███IdList[i]).value = "";
			document.getElementById(████UNameList[i]).value = "";
			document.getElementById(roleList[i]).value = "";
			document.getElementById(localeList[i]).value = "";
			document.getElementById(managerList[i]).value = "";
			document.getElementById(departmentList[i]).value = "";
			document.getElementById(mirrorUserList[i]).value = "";
			document.getElementById(dateList[i]).value = "";
			document.getElementById(infoList[i]).value = "";
			document.getElementById(notesList[i]).value = "";
			document.getElementById(codeForAcctList[i]).value = "";
			if ((document.getElementById("provisionTable").innerText != "") && (document.getElementById("provisionTable").innerText != "undefined") && (document.getElementById("provisionTable").children[0].rows[0].cells.length > i)) {
				let tableContents = document.getElementById("provisionTable").children[0].children[0].children;
				for (let j=1; j<tableContents.length-1; j++) {
					tableContents[j].children[i+1].outerHTML = "<td onclick=\"changeTable(this)\">N/A</td>";
				}
			}
		}
	}
}

function removeAccount() {
	let count = 0;
	for (let i=0; i<(numOfAccts-count); i++) {
		if (document.getElementById(checkboxList[i]).checked) {
			let oldDiv = document.getElementById(acctDetailList[i]);
			let oldDiv2 = document.getElementById(checkDivList[i]);
			oldDiv.remove();
			oldDiv2.remove();
			if ((document.getElementById("provisionTable").innerText != "") && (document.getElementById("provisionTable").innerText != "undefined") && (document.getElementById("provisionTable").children[0].rows[0].cells.length-1 > i)) {
				let table = document.getElementById("provisionTable").children[0];
				for (let k=0; k<table.rows.length-1; k++) {
					table.rows[k].cells[i+1].remove();
				}
			}
			for (let j=i+1; j<(numOfAccts-count); j++) { //change accounts after removed account to new number
				document.getElementById("generate███" + (j+1).toString()).setAttribute("name", "generate███" + j.toString());
				document.getElementById("generate███" + (j+1).toString()).setAttribute("onclick", "generate███('███Name" + j.toString() + "')");
				document.getElementById("generate███" + (j+1).toString()).id = "generate███" + j.toString();
				document.getElementById("generate███" + (j+1).toString()).setAttribute("name", "generate███" + j.toString());
				document.getElementById("generate███" + (j+1).toString()).setAttribute("onclick", "generate███('███uname" + j.toString() + "')");
				document.getElementById("generate███" + (j+1).toString()).id = "generate███" + j.toString();
				document.getElementById("clearNote" + (j+1).toString()).setAttribute("name", "clearNote" + j.toString());
				document.getElementById("clearNote" + (j+1).toString()).setAttribute("onclick", "clearNotes('notes" + j.toString() + "')");
				document.getElementById("clearNote" + (j+1).toString()).id = "clearNote" + j.toString();
				
				document.getElementById("copy" + (j+1).toString() + "8").setAttribute("name", "copy" + j.toString() + "8");
				document.getElementById("copy" + (j+1).toString() + "8").setAttribute("onclick", "addToClipboard('manager" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "8").id = "copy" + j.toString() + "8";
				document.getElementById("copy" + (j+1).toString() + "7").setAttribute("name", "copy" + j.toString() + "7");
				document.getElementById("copy" + (j+1).toString() + "7").setAttribute("onclick", "addToClipboard('locale" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "7").id = "copy" + j.toString() + "7";
				document.getElementById("copy" + (j+1).toString() + "e").setAttribute("name", "copy" + j.toString() + "e");
				document.getElementById("copy" + (j+1).toString() + "e").setAttribute("onclick", "addToClipboard('████uname" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "e").id = "copy" + j.toString() + "e";
				document.getElementById("copy" + (j+1).toString() + "d").setAttribute("name", "copy" + j.toString() + "d");
				document.getElementById("copy" + (j+1).toString() + "d").setAttribute("onclick", "addToClipboard('███id" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "d").id = "copy" + j.toString() + "d";
				document.getElementById("copy" + (j+1).toString() + "5").setAttribute("name", "copy" + j.toString() + "5");
				document.getElementById("copy" + (j+1).toString() + "5").setAttribute("onclick", "addToClipboard('███uname" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "5").id = "copy" + j.toString() + "5";
				document.getElementById("copy" + (j+1).toString() + "f").setAttribute("name", "copy" + j.toString() + "f");
				document.getElementById("copy" + (j+1).toString() + "f").setAttribute("onclick", "addToClipboard('oldPhoneNum" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "f").id = "copy" + j.toString() + "f";
				document.getElementById("copy" + (j+1).toString() + "g").setAttribute("name", "copy" + j.toString() + "g");
				document.getElementById("copy" + (j+1).toString() + "g").setAttribute("onclick", "addToClipboard('department" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "g").id = "copy" + j.toString() + "g";
				document.getElementById("copy" + (j+1).toString() + "b").setAttribute("name", "copy" + j.toString() + "b");
				document.getElementById("copy" + (j+1).toString() + "b").setAttribute("onclick", "addToClipboard('███Name" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "b").id = "copy" + j.toString() + "b";
				document.getElementById("copy" + (j+1).toString() + "a").setAttribute("name", "copy" + j.toString() + "a");
				document.getElementById("copy" + (j+1).toString() + "a").setAttribute("onclick", "addToClipboard('notes" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "a").id = "copy" + j.toString() + "a";
				document.getElementById("copy" + (j+1).toString() + "9").setAttribute("name", "copy" + j.toString() + "9");
				document.getElementById("copy" + (j+1).toString() + "9").setAttribute("onclick", "addToClipboard('startDate" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "9").id = "copy" + j.toString() + "9";
				document.getElementById("copy" + (j+1).toString() + "6").setAttribute("name", "copy" + j.toString() + "6");
				document.getElementById("copy" + (j+1).toString() + "6").setAttribute("onclick", "addToClipboard('role" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "6").id = "copy" + j.toString() + "6";
				document.getElementById("copy" + (j+1).toString() + "4").setAttribute("name", "copy" + j.toString() + "4");
				document.getElementById("copy" + (j+1).toString() + "4").setAttribute("onclick", "addToClipboard('eaddy" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "4").id = "copy" + j.toString() + "4";
				document.getElementById("copy" + (j+1).toString() + "3").setAttribute("name", "copy" + j.toString() + "3");
				document.getElementById("copy" + (j+1).toString() + "3").setAttribute("onclick", "addToClipboard('fullname" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "3").id = "copy" + j.toString() + "3";
				document.getElementById("copy" + (j+1).toString() + "2").setAttribute("name", "copy" + j.toString() + "2");
				document.getElementById("copy" + (j+1).toString() + "2").setAttribute("onclick", "addToClipboard('lname" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "2").id = "copy" + j.toString() + "2";
				document.getElementById("copy" + (j+1).toString() + "1").setAttribute("name", "copy" + j.toString() + "1");
				document.getElementById("copy" + (j+1).toString() + "1").setAttribute("onclick", "addToClipboard('fname" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "1").id = "copy" + j.toString() + "1";
				document.getElementById("copy" + (j+1).toString() + "0").setAttribute("name", "copy" + j.toString() + "0");
				document.getElementById("copy" + (j+1).toString() + "0").setAttribute("onclick", "addToClipboard('uname" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "0").id = "copy" + j.toString() + "0";
				document.getElementById("copy" + (j+1).toString() + "c").setAttribute("name", "copy" + j.toString() + "c");
				document.getElementById("copy" + (j+1).toString() + "c").setAttribute("onclick", "addToClipboard('phoneNum" + j.toString() + "')");
				document.getElementById("copy" + (j+1).toString() + "c").id = "copy" + j.toString() + "c";
				document.getElementById("parse" + (j+1).toString()).setAttribute("name", "parse" + j.toString());
				document.getElementById("parse" + (j+1).toString()).setAttribute("onclick", "parseInput(" + (j-1).toString() + ")");
				document.getElementById("parse" + (j+1).toString()).id = "parse" + j.toString();
				for (const section of document.getElementById(acctDetailList[j]).children) {
					for (const item of section.children) {
						if (item.nodeName == "LABEL") {
							item.htmlFor = item.htmlFor.replace(/\d/g, "") + j.toString();
						} else if (item.nodeName == "INPUT" || item.nodeName == "SELECT" || item.nodeName == "TEXTAREA") {
							item.name = item.name.replace(/\d/g, "") + j.toString();
							item.id = item.id.replace(/\d/g, "") + j.toString();
						}
						/*
						else if (item.nodeName == "BUTTON") {
							if (item.id.indexOf("copy") == 0) {
								
							} else {
								item.name = item.name.replace(/\d/g, "") + j.toString();
								item.setAttribute("onclick", item.id = item.id.replace(/\d/g, "") + ());
								item.id = item.id.replace(/\d/g, "") + j.toString();
								document.getElementById("generate███" + (j+1).toString()).setAttribute("name", "generate███" + j.toString());
								document.getElementById("generate███" + (j+1).toString()).setAttribute("onclick", "generate███('███Name" + j.toString() + "')");
								document.getElementById("generate███" + (j+1).toString()).id = "generate███" + j.toString();
							}
						}
						*/
					}
				}
				document.getElementById(checkDivList[j]).children[1].htmlFor = "check" + j.toString();
				document.getElementById(checkDivList[j]).children[1].innerText = j.toString();
				document.getElementById(checkDivList[j]).children[0].value = j;
				document.getElementById(acctDetailList[j]).setAttribute("name", "acct" + j.toString());
				document.getElementById(acctDetailList[j]).id = "acct" + j.toString();
				document.getElementById(acctNameList[j]).setAttribute("name", "acctName" + j.toString());
				document.getElementById(acctNameList[j]).innerHTML = "\n<b>Account " + j.toString() + ":</b>\n";
				document.getElementById(acctNameList[j]).id = "acctName" + j.toString();
				document.getElementById(toggleAcctList[j]).setAttribute("name", "toggleAcct" + j.toString());
				document.getElementById(toggleAcctList[j]).id = "toggleAcct" + j.toString();
				if (document.getElementById(revealerList[j]).getAttribute("onclick").indexOf("reveal") != -1) {
					document.getElementById(revealerList[j]).setAttribute("onclick", "revealMoreAcct(" + (j-1).toString() + ")");
				} else {
					document.getElementById(revealerList[j]).setAttribute("onclick", "hideMoreAcct(" + (j-1).toString() + ")");
				}
				document.getElementById(revealerList[j]).setAttribute("name", "revealer" + j.toString());
				document.getElementById(revealerList[j]).id = "revealer" + j.toString();
				document.getElementById(notesList[j]).labels[0].htmlFor = "notes" + j.toString();
				document.getElementById(notesList[j]).setAttribute("name", "notes" + j.toString());
				document.getElementById(notesList[j]).id = "notes" + j.toString();
				document.getElementById(checkboxList[j]).setAttribute("name", "check" + j.toString());
				document.getElementById(checkDivList[j]).setAttribute("name", "checkDiv" + j.toString());
				document.getElementById(checkboxList[j]).id = "check" + j.toString();
				document.getElementById(checkDivList[j]).id = "checkDiv" + j.toString();
				if ((document.getElementById("provisionTable").innerText != "") && (document.getElementById("provisionTable").innerText != "undefined") && (document.getElementById("provisionTable").children[0].rows[0].cells.length > j)) {
					let table = document.getElementById("provisionTable").children[0];
					table.rows[0].cells[j].textContent = j.toString();
				}
			}
			acctDetailList.pop();
			acctNameList.pop();
			revealerList.pop();
			tickListList.pop();
			tickTypeList.pop();
			itemNumList.pop();
			phoneNumList.pop();
			oldPhoneNumList.pop();
			███NameList.pop();
			userNameList.pop();
			firstNameList.pop();
			lastNameList.pop();
			fullNameList.pop();
			emailList.pop();
			███NameList.pop();
			███IdList.pop();
			████UNameList.pop();
			roleList.pop();
			localeList.pop();
			managerList.pop();
			dateList.pop();
			infoList.pop();
			notesList.pop();
			toggleAcctList.pop();
			checkboxList.pop();
			checkDivList.pop();
			i--;
			count++;
		}
	}
	numOfAccts = numOfAccts - count;
	document.getElementById("numAcct").value = numOfAccts;
}

function addToClipboard(field) { //Pulled from outside source
	// Get the text field
	let copyText = document.getElementById(field);

	// Select the text field
	if (!field.includes("locale")) {
		copyText.select();
	}
	//!!!Add if statement to not run if date input!!!
	if (!field.includes("startDate") && !field.includes("locale")) {
		copyText.setSelectionRange(0, 99999); // For mobile devices
	}
	
	// Copy the text inside the text field
	navigator.clipboard.writeText(copyText.value);

}

function clearNotes(field) {
	//Clears notes for selected account
	if (field == "All") {
		for (let i=0; i<numOfAccts; i++) {
			document.getElementById(notesList[i]).value = "";
		}
	} else {
		document.getElementById(field).value = "";
	}
}

function addSpaces() {
	for (let i=0; i<numOfAccts; i++) {
		document.getElementById(notesList[i]).value = "\n\n" + document.getElementById(notesList[i]).value;
	}
}

function jumpToTop() {
	window.scroll(0, 0)
}

function revealMoreAcct(num) {
	document.getElementById(toggleAcctList[num]).style.display = "block";
	document.getElementById(revealerList[num]).setAttribute('onclick', "hideMoreAcct(" + num + ")");
	document.getElementById(revealerList[num]).innerText = ">"
}

function hideMoreAcct(num) {
	document.getElementById(toggleAcctList[num]).style.display = "none";
	document.getElementById(revealerList[num]).setAttribute('onclick', "revealMoreAcct(" + num + ")");
	document.getElementById(revealerList[num]).innerText = "v"
}

async function getCsv(name) { //pretty much entire function pulled from https://developer.mozilla.org/
	let csvFile
	csvFile = await fetch("./"+name+'?v='+Date.now())
		.then((response) => response.body)
	  .then((rb) => {
		const reader = rb.getReader();

		return new ReadableStream({
		  start(controller) {
			// The following function handles each data chunk
			function push() {
			  // "done" is a Boolean and value a "Uint8Array"
			  reader.read().then(({ done, value }) => {
				// If there is no more data to read
				if (done) {
				  controller.close();
				  return;
				}
				// Get the data and send it to the browser via the controller
				controller.enqueue(value);
				push();
			  });
			}
			push();
		  },
		});
	  })
	  .then((stream) =>
		// Respond with our stream
		new Response(stream, { headers: { "Content-Type": "text/csv" } }).text(),
	  )
	  .then((result) => {
		return result;
	  });
	return csvFile
}

function parseCsv(stringy) {
	//Some local variables
	let csvArray = []; //Array of arrays
	let countBig = 0;
	let countSmall = 0;
	csvArray[0] = []; //Initialize first array
	for (let i=0;i>=0;) { //i is going to bounce all over, but when it hits -1, loop stops. Essentially, as long as there is still unchecked characters in stringy, loop continues
		if (stringy.indexOf(",",i) > 0) { //make sure there is a next comma
			if (stringy.indexOf(",",i)>stringy.indexOf("\r",i)) { //check if a new line tried to start
				if ((stringy.indexOf(":",i)<stringy.indexOf("\r",i))&&(stringy.indexOf(":",i)!=-1)) { //check if current part contains a note
					csvArray[countBig][countSmall] = stringy.substr(stringy.indexOf(":",i)+1,stringy.indexOf("\r",i)-(stringy.indexOf(":",i)+1)).replace(/\n|"/g,"");
				} else {
					csvArray[countBig][countSmall] = stringy.substr(i,stringy.indexOf("\r",i)-i);
				}
				countBig++;
				countSmall = 0;
				csvArray[countBig] = [];
				csvArray[countBig][countSmall] = stringy.substr(stringy.indexOf("\r",i)+2,stringy.indexOf(",",i)-(stringy.indexOf("\r",i)+2));
			} else {
				if ((stringy.indexOf(":",i)<stringy.indexOf(",",i))&&(stringy.indexOf(":",i)!=-1)) {
					csvArray[countBig][countSmall] = stringy.substr(stringy.indexOf(":",i)+1,stringy.indexOf(",",i)-(stringy.indexOf(":",i)+1)).replace(/\n|"/g,"");
				} else {
					csvArray[countBig][countSmall] = stringy.substr(i,stringy.indexOf(",",i)-i);
				}
			}
		} else {
			csvArray[countBig][countSmall] = stringy.substr(i,(stringy.length-2)-i);
		}
		i = stringy.indexOf(",",i)+1;
		if (i==0) {i--;}
		countSmall++;
	}
	return csvArray
}

function startCsv() {
		//Grab csv files for job roles then turn into usable arrays
	let prom1, prom2, prom3;
	prom1 = getCsv("████-███ Template.csv").then((csvFile) => {
		████████sv = parseCsv(csvFile);
	});
	prom2 = getCsv("███ Access DB.csv").then((csvFile) => {
		███DbCsv = parseCsv(csvFile);
	});
	prom3 = getCsv("Custom links.csv").then((csvFile) => {
		customLinksCsv = parseCsv(csvFile);
	});
	Promise.all([prom1, prom2, prom3])
		.then((result) => {
			document.getElementById("statusBox").innerText = "Ready";
		}); 
}

function startFunc() { //Runs when page finishes loading
	//Adds listener to show the number of accounts selected by numAcct
	//numOfAccts
	document.getElementById("numAcct").addEventListener("change", function (event) {
		let diff = parseInt(event.target.value) - numOfAccts;
		let newDiv, newDiv2;
		if (diff>0) { //Add accounts
			for (let i=numOfAccts; i<parseInt(event.target.value); i++) {
				newDiv = document.createElement("div");
				document.getElementById("allAccounts").appendChild(newDiv);
				newDiv2 = document.createElement("div");
				document.getElementById("divForChecks").appendChild(newDiv2);
				acctDetailList[i] = "acct" + (i+1).toString();
				acctNameList[i] = "acctName" + (i+1).toString();
				revealerList[i] = "revealer" + (i+1).toString();
				tickListList[i] = "tickList" + (i+1).toString();
				tickTypeList[i] = "tickType" + (i+1).toString();
				itemNumList[i] = "itemNum" + (i+1).toString();
				phoneNumList[i] = "phoneNum" + (i+1).toString();
				oldPhoneNumList[i] = "oldPhoneNum" + (i+1).toString();
				███NameList[i] = "███Name" + (i+1).toString();
				userNameList[i] = "uname" + (i+1).toString();
				firstNameList[i] = "fname" + (i+1).toString();
				lastNameList[i] = "lname" + (i+1).toString();
				fullNameList[i] = "fullname" + (i+1).toString();
				emailList[i] = "eaddy" + (i+1).toString();
				███NameList[i] = "███uname" + (i+1).toString();
				███IdList[i] = "███id" + (i+1).toString();
				████UNameList[i] = "████uname" + (i+1).toString();
				roleList[i] = "role" + (i+1).toString();
				localeList[i] = "locale" + (i+1).toString();
				managerList[i] = "manager" + (i+1).toString();
				departmentList[i] = "department" + (i+1).toString();
				mirrorUserList[i] = "mirrorUser" + (i+1).toString();
				dateList[i] = "startDate" + (i+1).toString();
				infoList[i] = "info" + (i+1).toString();
				notesList[i] = "notes" + (i+1).toString();
				codeForAcctList[i] = "codeForAcct" + (i+1).toString();
				toggleAcctList[i] = "toggleAcct" + (i+1).toString();
				checkboxList[i] = "check" + (i+1).toString();
				checkDivList[i] = "checkDiv" + (i+1).toString();
				newDiv.outerHTML = "\
				<div class=\"accounts\" id=\"acct" + (i+1).toString() + "\" name=\"acct" + (i+1).toString() + "\">\n\
				<div class=\"acctTopHalf nopadding\">\n\
				<div class=\"nopadding blocky flex-row truelongboy\">\n\
				<div class=\"nopadding longishboy\" id=\"acctName" + (i+1).toString() + "\" name=\"acctName" + (i+1).toString() + "\">\n\
				<b>Account " + (i+1).toString() + ":</b>\n\
				</div>\n\
				<div class=\"nopadding\" id=\"revealer" + (i+1).toString() + "\" name=\"revealer" + (i+1).toString() + "\" onclick=\"revealMoreAcct(" + i.toString() + ")\">v</div>\n\
				</div><br><br>\n\
				<label for=\"tickList" + (i+1).toString() + "\">Paste</label>\n\
				<input type=\"text\" class=\"thinnerboy\" id=\"tickList" + (i+1).toString() + "\" name=\"tickList" + (i+1).toString() + "\" autocomplete=\"off\">\n\
				<button type=\"button\" id=\"parse" + (i+1).toString() + "\" name=\"parse" + (i+1).toString() + "\" onclick=\"parseInput(" + i.toString() + ")\">Parse</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"tickType" + (i+1).toString() + "\">Ticket Type</label>\n\
				<select name=\"tickType" + (i+1).toString() + "\" id=\"tickType" + (i+1).toString() + "\">\n\
				\t<option hidden disabled selected value> </option>\n\
				\t<option value=\"newHire\">New Hire</option>\n\
				\t<option value=\"transfer\">Transfer</option>\n\
				\t<option value=\"reactivate\">Reactivation</option>\n\
				\t<option value=\"term\">Termination</option>\n\
				\t<option value=\"tempTerm\">Termination - Temp</option>\n\
				<option value=\"dnSwap\">DID<==>Non-DID</option>\n\
				</select>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"itemNum" + (i+1).toString() + "\">Item Number:</label><br>\n\
				<input type=\"text\" id=\"itemNum" + (i+1).toString() + "\" name=\"itemNum" + (i+1).toString() + "\">\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"phoneNum" + (i+1).toString() + "\">Phone Number:</label><br>\n\
				<input type=\"text\" id=\"phoneNum" + (i+1).toString() + "\" name=\"phoneNum" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "c\" name=\"copy" + (i+1).toString() + "c\" onclick=\"addToClipboard('phoneNum" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"uname" + (i+1).toString() + "\">Username:</label><br>\n\
				<input type=\"text\" id=\"uname" + (i+1).toString() + "\" name=\"uname" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "0\" name=\"copy" + (i+1).toString() + "0\" onclick=\"addToClipboard('uname" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"fname" + (i+1).toString() + "\">First name:</label><br>\n\
				<input type=\"text\" id=\"fname" + (i+1).toString() + "\" name=\"fname" + (i+1).toString() + "\" class=\"firstName\"><button type=\"button\" id=\"copy" + (i+1).toString() + "1\" name=\"copy" + (i+1).toString() + "1\" onclick=\"addToClipboard('fname" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"lname" + (i+1).toString() + "\">Last name:</label><br>\n\
				<input type=\"text\" id=\"lname" + (i+1).toString() + "\" name=\"lname" + (i+1).toString() + "\" class=\"lastName\"><button type=\"button\" id=\"copy" + (i+1).toString() + "2\" name=\"copy" + (i+1).toString() + "" + (i+1).toString() + "\" onclick=\"addToClipboard('lname" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"fullname" + (i+1).toString() + "\">Full name:</label><br>\n\
				<input type=\"text\" readonly id=\"fullname" + (i+1).toString() + "\" name=\"fullname" + (i+1).toString() + "\" class=\"fullName\"><button type=\"button\" id=\"copy" + (i+1).toString() + "3\" name=\"copy" + (i+1).toString() + "3\" onclick=\"addToClipboard('fullname" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"eaddy" + (i+1).toString() + "\">Email address:</label><br>\n\
				<input type=\"text\" id=\"eaddy" + (i+1).toString() + "\" name=\"eaddy" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "4\" name=\"copy" + (i+1).toString() + "4\" onclick=\"addToClipboard('eaddy" + (i+1).toString() + "')\">Copy</button>\n\
				</div>\n\
				<div class=\"acctBotHalf nopadding\">\n\
				<label for=\"role" + (i+1).toString() + "\">Role:</label><br>\n\
				<input type=\"text\" id=\"role" + (i+1).toString() + "\" name=\"role" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "6\" name=\"copy" + (i+1).toString() + "6\" onclick=\"addToClipboard('role" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"startDate" + (i+1).toString() + "\">Effective Date:</label><br>\n\
				<input type=\"Date\" id=\"startDate" + (i+1).toString() + "\" name=\"startDate" + (i+1).toString() + "\">\n\
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n\
				<button type=\"button\" id=\"copy" + (i+1).toString() + "9\" name=\"copy" + (i+1).toString() + "9\" onclick=\"addToClipboard('startDate" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"info" + (i+1).toString() + "\">Info:</label><br>\n\
				<textarea id=\"info" + (i+1).toString() + "\" name=\"info" + (i+1).toString() + "\" class=\"infobox\" readonly></textarea>\n\
				<br><p class=\"spacer\"></p>\n\
				<div class=\"noteAndButtons nopadding\">\n\
				<div class=\"closer noteDiv\">\n\
				<label for=\"notes" + (i+1).toString() + "\">Notes:</label><br>\n\
				<textarea id=\"notes" + (i+1).toString() + "\" name=\"notes" + (i+1).toString() + "\" class=\"notes\" readonly></textarea>\n\
				</div>\n\
				<div class=\"floater moveDown closer\"></div>\n\
				<div class=\"floater closer\">\n\
				<button type=\"button\" id=\"copy" + (i+1).toString() + "a\" name=\"copy" + (i+1).toString() + "a\" onclick=\"addToClipboard('notes" + (i+1).toString() + "')\">Copy</button>\n\
				</div>\n\
				<div class=\"floater closer\">\n\
				<button type=\"button\" id=\"clearNote" + (i+1).toString() + "\" name=\"clearNote" + (i+1).toString() + "\" onclick=\"clearNotes('notes" + (i+1).toString() + "')\">Clear</button>\n\
				</div>\n\
				</div>\n\
				</div>\n\
				<div class=\"startHidden nopadding sidePad\" id=\"toggleAcct" + (i+1).toString() + "\" name=\"toggleAcct" + (i+1).toString() + "\"><label for=\"███Name" + (i+1).toString() + "\">███ Profile Name:</label>\n\
				<button type=\"button\" class=\"thinboy\" id=\"generate███" + (i+1).toString() + "\" name=\"generate███" + (i+1).toString() + "\" onclick=\"generate███('███Name" + (i+1).toString() + "')\">Generate</button>\n\
				<br>\n\
				<input type=\"text\" id=\"███Name" + (i+1).toString() + "\" name=\"███Name" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "b\" name=\"copy" + (i+1).toString() + "b\" onclick=\"addToClipboard('███Name" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"oldPhoneNum" + (i+1).toString() + "\">Old Phone Number:</label><br>\n\
				<input type=\"text\" id=\"oldPhoneNum" + (i+1).toString() + "\" name=\"oldPhoneNum" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "f\" name=\"copy" + (i+1).toString() + "f\" onclick=\"addToClipboard('oldPhoneNum" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p><label for=\"███uname" + (i+1).toString() + "\">Valid ███ Username:</label>\n\
				<button type=\"button\" class=\"thinboy\" id=\"generate███" + (i+1).toString() + "\" name=\"generate███" + (i+1).toString() + "\" onclick=\"generate███('███uname" + (i+1).toString() + "')\">Generate</button>\n\
				<br>\n\
				<input type=\"text\" id=\"███uname" + (i+1).toString() + "\" name=\"███uname" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "5\" name=\"copy" + (i+1).toString() + "5\" onclick=\"addToClipboard('███uname" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"███id" + (i+1).toString() + "\">███ ID#:</label><br>\n\
				<input type=\"text\" id=\"███id" + (i+1).toString() + "\" name=\"███id" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "d\" name=\"copy" + (i+1).toString() + "d\" onclick=\"addToClipboard('███id" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"████uname" + (i+1).toString() + "\">█████int Username (if different):</label><br>\n\
				<input type=\"text\" id=\"████uname" + (i+1).toString() + "\" name=\"████uname" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "e\" name=\"copy" + (i+1).toString() + "e\" onclick=\"addToClipboard('████uname" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"locale" + (i+1).toString() + "\">Location:</label><br>\n\
				<select id=\"locale" + (i+1).toString() + "\" name=\"locale" + (i+1).toString() + "\">\n\
				\t<option hidden disabled selected value> </option>\n\
				\t<option value=\"██████\">██████</option>\n\
				\t<option value=\"████\">████</option>\n\
				\t<option value=\"███████████\">███████████</option>\n\
				\t<option value=\"la\">LA</option>\n\
				\t<option value=\"██████ ████\">██████ ████</option>\n\
				\t<option value=\"███\">███</option>\n\
				\t<option value=\"█████\">█████</option>\n\
				\t<option value=\"█████\">█████</option>\n\
				</select>\n\
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n\
				<button type=\"button\" id=\"copy" + (i+1).toString() + "7\" name=\"copy" + (i+1).toString() + "7\" onclick=\"addToClipboard('locale" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\n\
				<label for=\"manager" + (i+1).toString() + "\">Manager:</label><br>\n\
				<input type=\"text\" id=\"manager" + (i+1).toString() + "\" name=\"manager" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "8\" name=\"copy" + (i+1).toString() + "8\" onclick=\"addToClipboard('manager" + (i+1).toString() + "')\">Copy</button>\n\
				<br><p class=\"spacer\"></p>\
				<label for=\"department" + (i+1).toString() + "\">Department:</label><br>\
				<input type=\"text\" id=\"department" + (i+1).toString() + "\" name=\"department" + (i+1).toString() + "\"><button type=\"button\" id=\"copy" + (i+1).toString() + "g\" name=\"copy" + (i+1).toString() + "g\" onclick=\"addToClipboard('department" + (i+1).toString() + "')\">Copy</button>\
				</div>\n\
				<div class=\"startHidden nopadding\">\
					<input class=\"startHidden\" type=\"text\" id=\"mirrorUser" + (i+1).toString() + "\" name=\"mirrorUser" + (i+1).toString() + "\">\
					<input class=\"startHidden\" type=\"text\" id=\"codeForAcct" + (i+1).toString() + "\" name=\"codeForAcct" + (i+1).toString() + "\">\
				</div>\
				</div>\n\
				";
				newDiv2.outerHTML = "\
				<div class=\"closer\" id=\"checkDiv" + (i+1).toString() + "\" name=\"checkDiv" + (i+1).toString() + "\">\n\
				<input type=\"checkbox\" id=\"check" + (i+1).toString() + "\" name=\"check" + (i+1).toString() + "\" value=\"" + (i+1).toString() + "\">\n\
				<label for=\"check" + (i+1).toString() + "\">" + (i+1).toString() + "</label>\n\
				</div>\n\
				";
				document.getElementById(firstNameList[i]).addEventListener("change", function (event) {
					event.target.value = removeSpaces(event.target.value);
					document.getElementById("fullname" + event.target.id.replace(/[^0-9]/g, '')).value = event.target.value.concat(" ", document.getElementById("lname" + event.target.id.replace(/[^0-9]/g, '')).value);
				});
				document.getElementById(lastNameList[i]).addEventListener("change", function (event) {
					event.target.value = removeSpaces(event.target.value);
					document.getElementById("fullname" + event.target.id.replace(/[^0-9]/g, '')).value = document.getElementById("fname" + event.target.id.replace(/[^0-9]/g, '')).value.concat(" ", event.target.value);
				});
			}
			
		} else if (diff<0) { //Subtract accounts
			for (let i=numOfAccts; i>parseInt(event.target.value); i--) {
				let oldDiv = document.getElementById(acctDetailList[i-1]);
				let oldDiv2 = document.getElementById(checkDivList[i-1]);
				acctDetailList.pop();
				acctNameList.pop();
				revealerList.pop();
				tickListList.pop();
				tickTypeList.pop();
				itemNumList.pop();
				phoneNumList.pop();
				oldPhoneNumList.pop();
				███NameList.pop();
				userNameList.pop();
				firstNameList.pop();
				lastNameList.pop();
				fullNameList.pop();
				emailList.pop();
				███NameList.pop();
				███IdList.pop();
				████UNameList.pop();
				roleList.pop();
				localeList.pop();
				managerList.pop();
				dateList.pop();
				infoList.pop();
				notesList.pop();
				toggleAcctList.pop();
				checkboxList.pop();
				checkDivList.pop();
				oldDiv.remove();
				oldDiv2.remove();
			}
		}
		numOfAccts = parseInt(event.target.value);
	});
	//Adds listener to update Full name field when First name changes
	document.getElementById("fname1").addEventListener("change", function (event) {
		document.getElementById(firstNameList[0]).value = removeSpaces(document.getElementById(firstNameList[0]).value);
		document.getElementById(fullNameList[0]).value = document.getElementById(firstNameList[0]).value.concat(" ", document.getElementById(lastNameList[0]).value);
	});
	//Adds listener to update Full name field when Last name changes
	document.getElementById("lname1").addEventListener("change", function (event) {
		document.getElementById(lastNameList[0]).value = removeSpaces(document.getElementById(lastNameList[0]).value);
		document.getElementById(fullNameList[0]).value = document.getElementById(firstNameList[0]).value.concat(" ", document.getElementById(lastNameList[0]).value);
	});
	startCsv(); //Load CSV files for █████ and system provisioning info
	document.getElementById("darkButton").click(); //Start in dark mode
}