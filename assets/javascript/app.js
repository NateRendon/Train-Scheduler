$(document).ready(function(){

const firebaseConfig = {
    apiKey: "AIzaSyDzk0gIInZcAQ-bx2g7qItDp_nYQh7_xX0",
    authDomain: "train-scheduler-bac0e.firebaseapp.com",
    databaseURL: "https://train-scheduler-bac0e.firebaseio.com",
    projectId: "train-scheduler-bac0e",
    storageBucket: "train-scheduler-bac0e.appspot.com",
    messagingSenderId: "743089567427",
    appId: "1:743089567427:web:024103fa03a70e0d1c9476",
    measurementId: "G-TQ53PZM2XS"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Variables
  let database= firebase.database();

$("#submit").on("click", function() {

// variables for html
    let name = $('nameInput').val().trim();
    let dest = $('destInput').val().trim();
    let time = $('timeInput').val().trim();
    let freq = $('freqInput').val().trim(); 

// pushes new entry to firebase
    database.ref().push({
        name: name,
        dest: dest,
        time: time,
        freq: freq,
        timeAdded: firebase.database.ServerValue.TIMESTAMP
    });
    // NO REFRESH
    $("input").val('');
    return false;
});

//ON CLICK FOR CHILD FUNCTION
database.ref().on("child_added", function(childSnapshot){
    let name = childSnapshot.val().name;
    let dest = childSnapshot.val().dest;
    let time = childSnapshot.val().time;
    let freq = childSnapshot.val().freq;

    console.log("Name: " + name);
    console.log("Destination: " + dest);
    console.log("Time: " + time);
    console.log("Frequency: " + freq);

    //TRAIN TIME CONVERSION
    let freq = parseInt(freq);
	//CURRENT TIME
	let currentTime = moment();
    console.log("CURRENT TIME: " + moment().format('HH:mm'));
    //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
	let dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("DATE CONVERTED: " + dConverted);
	let trainTime = moment(dConverted).format('HH:mm');
	console.log("TRAIN TIME : " + trainTime);
	
	//DIFFERENCE B/T THE TIMES 
	let tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	let tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	//REMAINDER 
	let tRemainder = tDifference % freq;
	console.log("TIME REMAINING: " + tRemainder);
	//MINUTES UNTIL NEXT TRAIN
	let minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	//NEXT TRAIN
	let nextTrain = moment().add(minsAway, 'minutes');
    console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
    
    //TABLE DATA
     //APPEND TO DISPLAY IN TRAIN TABLE
$('#currentTime').text(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
});

});