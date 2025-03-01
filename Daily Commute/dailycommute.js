//Daily Commute attempt in javascript
//This version was started on Thursday, ‎January ‎19, ‎2017
//Notes
/*
3 Lanes
5% buffer either side
90% drivable space
Lane lines at 35% and 65% gives 30% space for each lane
Middle of the lanes would be at 20% 50% 80%
with the current width of 700px vs 50px
(50/2) / 700 = offset of 3.5%
Cars should be placed at 16.5% 46.5% 76.5%
====================
Things to do:
Reposition everything if window size is changed
Make lane lines move
Continue building the car engine
Gradual braking and gas, how long it takes should depend on how hard they are braking/gassing - introduce jerk and snap
Build the driver - risk potential, turn signal usage (and aptitude at turning off when done), potential for missed observations, which exit they are taking, friendliness (for allowing other cars into their lane), etc
Continue building sense others function to perform more reactions
^-> Bulid out reacting to turn signals
Include a very small chance a car may attempt to get off the freeway at the wrong exit
Extend brake lights for a few frames after to avoid super fast brake tapping
Use suspendEngineAsWell to make a pause button
Spawning speed should be based somehow on the current average speed of the freeway and in front or in back should be based on the maxSpeed of the new car vs the the maxSpeed of the player car
Any time laneChange.leavingLane is used, a check should be performed to determine if the car leaving has already cleared the lane
==================
Lane Changing changes needed:
*Have cars wait for gap instead of slowing down while changing lanes
Get cars to change lanes because other cars are passing them
Make it possible for a car to change lanes to simply pass the car in front of them if the gap is large enough (both other lanes are slower)
Even if laneThree is faster, car should be able to jump into laneOne if big enough gap and the car is risky enough
If a car is in lane 3 and decides lane 1 is better, won't it just go back to lane 3 after getting to lane 2?
Find out how much faster the other lanes are going so that risk vs reward can be calculated
Base current frame lane changing speed off of current frame vertical speed
-> If a car changes its acceleration due to carTwo, it should pick it's acceleration back up after clearing
Check if the way minGap is calculated for braking might help out for lane changing
Cars are still accelerating to speeds higher than the car in front of them when changing lanes when that car in front is close
============================================================
*Changes required to incorporate more involved car modeling*
*equations:                                                *
*Add reaction time to the driver stat on every car         *
*Add reaction time as a frameCounter stat                  *
*Build a new function for handling accel/decel             *
*Create a frameCounter for the entire program, keep track  *
*of it for all time-based related actions                  *
*Introduce fuzziness between other cars' data and how this *
*car interprets the data                                   *
============================================================


Update 4/23/2018: spawning and despawning are completely broken somehow
Update 2/8/2019: normal and lane change braking having issues; same with lane changes intersecting cars

*/

"use strict";

//Initiate global variables
var carList = Array(); //This will hold all the cars for easy access
var numNPCs = 0; //variable to keep track of the cars on the road other than the player car
var carHeight = 90; //Size of cars from front to back bumper in pixels
var carWidth = 50; //Size of cars from left to right sides in pixels
var semiHeight = 135; //Size of semis from front to back bumper in pixels
var isStarted = false; //Global variable checking if the cars should be moving yet
var framesPerSecond = 20; //The number of times the game's engine is called per second
var maxNPCs = 25; //The most cars allowed to be spawned at one time
var globalFrameCounter = 0; //Variable to keep track of how many frames have past
var laneLinesLeftOvers = 0; //Variable to keep track of where the lane lines are between frames

//Troubleshooting variables, might be needed in the actual finished product
var suspendRemoveNPC = false;
var suspendEngine = false;
var suspendEngineAsWell = false;

//Determine lane positions based on window width
function whereAreLanes() {
  var playWidth = document.getElementById("drivingSpace").clientWidth;
  var offset = (carWidth / 2) / playWidth;
  var windowWidth = $(window).width();
  var laneSpots = Array(3);
  for (var i = 0; i < laneSpots.length; i++) {
    switch (i) {
      case 0:
        var laneMultiplier = .80;
        break;
      case 1:
        laneMultiplier = .50;
        break;
      case 2:
        laneMultiplier = .20;
    }
    if (windowWidth >= playWidth) {
      laneSpots[i] = playWidth * (laneMultiplier - offset);
      laneSpots[i] = Math.floor(laneSpots[i] + (windowWidth - playWidth) / 2);
    } else {
      laneSpots[i] = Math.floor(windowWidth * (laneMultiplier - offset));
      offset = (laneMultiplier - offset) * 100;
    }
  }
  window.laneOne = laneSpots[0];
  window.laneTwo = laneSpots[1];
  window.laneThree = laneSpots[2];
}

//Function to facilitate changing positioning variables on cars
function swapStat(oldStat, oldValues, newValues) {
  var newStat;
  switch (stat) {
    
    
    
  }
  return newStat;
}

//Function to update positioning of everything when window is resized
window.onresize = function() {
  //Got a "laneOne not defined" error when page was loading, run check to kick out of function if that is the case
  
  
  //Stop processing frames for the duration of this function so as to not mess anything up
  suspendEngine = true;
  //Grab an original lane vaule to calculate horizontal difference
  var oldLane = laneOne;
  //Grab the new lane vaules
  whereAreLanes();
  //Calculate how far lanes moved
  var horizDifference = oldLane - laneOne;
  //var newLaneSpots = [laneOne, laneTwo, laneThree];
  
  //Current attempt is assuming no cars are changing lanes when resize happens - obviously not reliable
  //There should be a set amount that everything can shift over
  //var horizDifference = [oldLaneSpots[0]-newLaneSpots[0], oldLaneSpots[1]-newLaneSpots[1], oldLaneSpots[2]-newLaneSpots[2]];
  //console.log(difference);
  
  /* stats related to horizontal positioning
  body.style.left (px) (doesn't update)
  horizontal (no px)
  laneChange (could be zero)
    .canChangeToLane (no px)
    .leavingLane (no px)
    .wantsToBeInLane (no px)
  */
  
  //Determine vertical differnce by recalculating playerCar's position with the new window size
  var verticalPosition = Math.floor($(window).height() * .8);
  var vertDifference = verticalPosition - carList[0].vertical;
  
  //Loop through all the cars
  carList.forEach(function (thatCar, carNumber, carList) {
    //Obligitory undefined car check
    if (thatCar == undefined)
      return;
    //Adjust horizontal stats
    thatCar.horizontal -= horizDifference;
    if (thatCar.laneChange.canChangeToLane != 0)
      thatCar.laneChange.canChangeToLane -= horizDifference;
    if (thatCar.laneChange.leavingLane != 0)
      thatCar.laneChange.leavingLane -= horizDifference;
    if (thatCar.laneChange.wantsToBeInLane != 0)
      thatCar.laneChange.wantsToBeInLane -= horizDifference;
    //thatCar.horizontal = swapStat(thatCar.horizontal, oldLaneSpots, newLaneSpots);
    
    //Adjust vertical stat
    thatCar.vertical -= vertDifference;
    //Need to redraw all the vehicles
    $("#" + thatCar.name).css("top", thatCar.vertical);
    $("#" + thatCar.name).css("left", thatCar.horizontal);
  });
  
  //Need to redraw lane lines too
  
  
  
  //Resume processing now that changes have been made
  suspendEngine = false;
}



//Random number generator, requires min/max to be specified
function getRandom(min, max) {
  var num = Math.floor(Math.random() * (max - (min - 1))) + min;
  if (num > max)
    num = max;
  return num;
}

//Function used to determine horizontal positioning based on lane number, window size, sprite size and freeway size
function lanePosition(laneNumber) {
  var leftOffset = 0;
  var horizontalPosition = "";
  //Moved this code to whereAreLanes function
  /*
  var offset = (carWidth / 2) / playWidth;
  var windowWidth = $(window).width();
  var carSpace = document.getElementById("drivingSpace");
  */
  //Set return variables based on laneNumber provided
  //This function is much simpler since whereAreLanes took over
  switch (laneNumber) {
    case 1:
    //Lane 1 = slow lane, most right
        leftOffset = laneOne;
        horizontalPosition = laneOne.toString() + "px";
      break;
    case 2:
    //Lane 2 = middle lane
      leftOffset = laneTwo;
      horizontalPosition = laneTwo.toString() + "px";
      //Holding onto a block of the old code in case working in the else part becomes important again
      /*
      if (windowWidth >= playWidth) {
        var horizontalPosition = playWidth * (.50 - offset);
        horizontalPosition = Math.floor(horizontalPosition + (windowWidth - playWidth) / 2);
        leftOffset = horizontalPosition;
        horizontalPosition = horizontalPosition.toString() + "px";
      } else {
        leftOffset = Math.floor(windowWidth * (.50 - offset));
        offset = (.50 - offset) * 100;
        var horizontalPosition =  offset.toString();
        if (horizontalPosition.length > 5)
          horizontalPosition =  horizontalPosition.substr(0, 5);
        horizontalPosition = horizontalPosition + "%";
      }
      */
      break;
    case 3:
    //Lane 3: fast lane, most left
      leftOffset = laneThree;
      horizontalPosition = laneThree.toString() + "px";
      break;
    default:
    //with only 3 lanes, a car should not reach this section
    //including it however, in case it becomes useful for cars spawning on onramps
      console.log("Lane Position Function had incorrect laneNumber given");
  }
  //Pass back the information that the car spawning will use
  return [horizontalPosition, leftOffset];
}


//Function to determine vertical positioning based on lots of factors
function determineVerticalPosition(isInFront, thisCar) {
  //Initialize local variables
  var whatIsInLane = Array();
  var whatIsInLaneVertPositions = Array();
  var mostInFront = 0;
  var carInFront = {};
  var mostInBack = 0;
  var carInBack = {};
  var speedDifference = 0;
  var verticalPosition = 0;
  //Make a list of the cars in the new car's lane
  carList.forEach(function (thatCar, carNumber, carList) {
    if (thatCar == undefined) //Skip if car does not exist
      return;
    if (this.name == thatCar.name || thatCar.name == undefined) //Skip if car is this car
      return;
    if(thatCar.horizontal == this.horizontal || (thatCar.laneChange.leavingLane == this.horizontal) || (thatCar.laneChange.canChangeToLane == this.horizontal))
      //If car is in/coming/leaving the same lane, put car in list
      whatIsInLane.push(thatCar);
  }, thisCar);
  //Grab the vertical positions of the cars in this lane
  whatIsInLaneVertPositions = dumpStat("vertical", whatIsInLane)
  //Is the car going to be in front of the player car?
  if (isInFront) {
    //Check if there are any cars in the lane
    if (whatIsInLaneVertPositions.length == 0) {
      //Set carInFront to undefined
      carInFront = undefined;
    } else {
      //Determine which car is leading (lowest value is furthest in front)
      mostInFront = Math.min(...whatIsInLaneVertPositions);
      carInFront = whatIsInLane[whatIsInLaneVertPositions.indexOf(mostInFront)];
    }
    //Has the game started yet
    if (isStarted) {
      if (carInFront == undefined) {
        //If there is no car in the lane, spawn above viewable area
        verticalPosition = getRandom(-((document.scrollingElement.scrollTop * 2) + thisCar.height), -(document.scrollingElement.scrollTop + thisCar.height));
      } else {
        //Spawn in front of leading car
        if (carInFront.speed <= thisCar.speed) { //New car is faster or same speed, just put it a safe gap ahead
          verticalPosition = carInFront.vertical - (thisCar.height + ((((32.5 * carInFront.driver.risk) + (2.5 * carInFront.speed)) * ((carInFront.height + thisCar.height) / 2)) / 65));
        } else { //Existing car is faster, put this new car far enough ahead to give the existing car time to slow down without hitting the brakes
          speedDifference = carInFront.speed - thisCar.speed;
          //This equation is the existing car's vertical minus new car's height, C and the safe gap
          //Where C is from the equation C = ((B * T) - (0.5 * A * T^2)) * (1 + A); A = accel of 0.1, B = speedDifference, T = B / A ***was previously 0 = B^2 - 4 * A * C***
          verticalPosition = carInFront.vertical - (thisCar.height + (((Math.pow(speedDifference, 2) / 0.1) - (0.05 * Math.pow(speedDifference / 0.1, 2))) * 1.1) + ((((32.5 * carInFront.driver.risk) + (2.5 * carInFront.speed)) * ((carInFront.height + thisCar.height) / 2)) / 65));
        }
        //Make sure the new car is outside the viewable area
        if (verticalPosition > -(document.scrollingElement.scrollTop + thisCar.height))
          verticalPosition = getRandom(-((document.scrollingElement.scrollTop * 2) + thisCar.height), -(document.scrollingElement.scrollTop + thisCar.height));
      }
    } else { //Game hasn't started, still safe to spawn in viewable area
      if (carInFront == undefined) {
        //Spawn in viewable area in front of the playerCar
        verticalPosition = getRandom(0, carList[0].vertical);
      } else {
        //Spawn in front of leading car
        if (carInFront.speed <= thisCar.speed) { //New car is faster or same speed, just put it a safe gap ahead
          verticalPosition = carInFront.vertical - (thisCar.height + ((((32.5 * carInFront.driver.risk) + (2.5 * carInFront.speed)) * ((carInFront.height + thisCar.height) / 2)) / 65));
        } else { //Existing car is faster, put this new car far enough ahead to give the existing car time to slow down without hitting the brakes
          speedDifference = carInFront.speed - thisCar.speed
          //This equation is the existing car's vertical minus new car's height, C and the safe gap
          //Where C is from the equation C = ((B * T) - (0.5 * A * T^2)} * (1 + A); A = accel of 0.1, B = speedDifference, T = B / A ***was previously 0 = B^2 - 4 * A * C***
          verticalPosition = carInFront.vertical - (thisCar.height + (((Math.pow(speedDifference, 2) / 0.1) - (0.05 * Math.pow(speedDifference / 0.1, 2))) * 1.1) + ((((32.5 * carInFront.driver.risk) + (2.5 * carInFront.speed)) * ((carInFront.height + thisCar.height) / 2)) / 65));
        }
        //Make sure the new car is in front of the playerCar
        if (verticalPosition > carList[0].vertical)
          verticalPosition = getRandom(0, carList[0].vertical);
      }
    }
  } else { //New car is behind the playerCar
    //Check if there are any cars in the lane
    if (whatIsInLaneVertPositions.length == 0) {
      //Set carInBack to undefined
      carInBack = undefined;
    } else {
      //Determine which car is trailing (highest value is furthest in back)
      mostInBack = Math.max(...whatIsInLaneVertPositions);
      carInBack = whatIsInLane[whatIsInLaneVertPositions.indexOf(mostInBack)];
    }
    //Has the game started yet
    if (isStarted) {
      if (carInBack == undefined) {
        //If there is no car in the lane, spawn below viewable area
        verticalPosition = getRandom((document.scrollingElement.clientHeight - document.scrollingElement.scrollTop) + thisCar.height, ((document.scrollingElement.clientHeight * 2) - document.scrollingElement.scrollTop) + thisCar.height);
      } else {
        //Spawn behind the trailing car
        if (carInBack.speed >= thisCar.speed) { //New car is slower or same speed, just put it a safe gap ahead
          verticalPosition = carInBack.vertical + carInBack.height + ((((32.5 * thisCar.driver.risk) + (2.5 * thisCar.speed)) * ((carInBack.height + thisCar.height) / 2)) / 65);
        } else { //Existing car is slower, put this new car far enough behind to give the new car time to slow down without hitting the brakes
          speedDifference = thisCar.speed - carInBack.speed;
          //This equation is the existing car's vertical minus new car's height, C and the safe gap
          //Where C is from the equation C = ((B * T) - (0.5 * A * T^2)) * (1 + A); A = accel of 0.1, B = speedDifference, T = B / A ***was previously 0 = B^2 - 4 * A * C***
          verticalPosition = carInBack.vertical + carInBack.height + ((((Math.pow(speedDifference, 2) / 0.1) - (0.05 * Math.pow(speedDifference / 0.1, 2))) * 1.1) + ((((32.5 * thisCar.driver.risk) + (2.5 * thisCar.speed)) * ((carInBack.height + thisCar.height) / 2)) / 65));
        }
        //Make sure the new car is outside the viewable area
        if (verticalPosition < ((document.scrollingElement.clientHeight - document.scrollingElement.scrollTop) + thisCar.height))
          verticalPosition = getRandom((document.scrollingElement.clientHeight - document.scrollingElement.scrollTop) + thisCar.height, ((document.scrollingElement.clientHeight * 2) - document.scrollingElement.scrollTop) + thisCar.height);
      }
    } else { //Game hasn't started, still safe to spawn in viewable area
      if (carInBack == undefined) {
        //Spawn in viewable area in behind of the playerCar
        verticalPosition = getRandom(carList[0].vertical, (document.scrollingElement.clientHeight - document.scrollingElement.scrollTop));
      } else {
        //Spawn behind the trailing car
        if (carInBack.speed >= thisCar.speed) { //New car is slower or same speed, just put it a safe gap ahead
          verticalPosition = carInBack.vertical + carInBack.height + ((((32.5 * thisCar.driver.risk) + (2.5 * thisCar.speed)) * ((carInBack.height + thisCar.height) / 2)) / 65);
        } else { //Existing car is slower, put this new car far enough behind to give the new car time to slow down without hitting the brakes
          speedDifference = thisCar.speed - carInBack.speed;
          //This equation is the existing car's vertical minus new car's height, C and the safe gap
          //Where C is from the equation C = ((B * T) - (0.5 * A * T^2)) * (1 + A); A = accel of 0.1, B = speedDifference, T = B / A ***was previously 0 = B^2 - 4 * A * C***
          verticalPosition = carInBack.vertical + carInBack.height + ((((Math.pow(speedDifference, 2) / 0.1) - (0.05 * Math.pow(speedDifference / 0.1, 2))) * 1.1) + ((((32.5 * thisCar.driver.risk) + (2.5 * thisCar.speed)) * ((carInBack.height + thisCar.height) / 2)) / 65));
        }
        //Make sure the new car is behind the playerCar
        if (verticalPosition < carList[0].vertical)
          verticalPosition = getRandom(carList[0].vertical, (document.scrollingElement.clientHeight - document.scrollingElement.scrollTop));
      }
    }
  }
  /* Now that vertical positions are based on speed and not arbitrary, this section should no longer been needed
  //Make sure cars are not spawning on top of one another
  verticalSpawnCheck();
  function verticalSpawnCheck () {
    //Reset repositioned flag to retrip if needed
    thisCar.isRepositioned = false;
    //Cycle through the cars to verify that this new car isn't touching one
    carList.forEach(function (thatCar, carNumber, carList) {
      //If there is no car there, skip it
      if (thatCar == undefined)
        return;
      //If the car that is being checked is the car we are adjusting, skip the car
      if (this.name == thatCar.name || thatCar.name == undefined)
        return;
      //If the car that is being checked is not in the same lane or is not close, skip the car
      if ((this.horizontal != thatCar.horizontal && (this.horizontal != thatCar.laneChange.canChangeToLane) && (this.horizontal != thatCar.laneChange.leavingLane)) || (verticalPosition > (thatCar.vertical + (thatCar.height * 2.5)) || (verticalPosition < (thatCar.vertical - (this.height * 2.5)))))
        return;
      //Assumption: Getting to this point in the loop means the car is in the same lane and is too close
      //If the car is supposed to be behind, push it further back
      if (verticalPosition > carList[0].vertical) {
        verticalPosition = thatCar.vertical + ((thatCar.height + 1) * 2.5);
        //If this car is going faster than the car it is now behind, set this car's speed to that of the car in front
        //if (this.speed > thatCar.speed)
          //this.speed = thatCar.speed;
      } else { //If the car is supposed to be in front, push it further forward
        verticalPosition = thatCar.vertical - ((this.height + 1) * 2.5);
        //If the car that is now behind this car is going faster than this car, set that car's speed to that of this car
        //if (this.speed < thatCar.speed)
          //thatCar.speed = this.speed;
      }
      //Flag this car as respositioned so that it can be checked again to make sure that it isn't too close to another car now
      this.isRepositioned = true;
    }, thisCar);
    if (thisCar.isRepositioned == true) {
      verticalSpawnCheck();
    }
  }
  */
  if (verticalPosition < -10000) {
    debugger;
  }
  //Save some details for troubleshooting
  thisCar.spawnInfo = {
    carInBack: carInBack,
    carInFront: carInFront,
    isInFront: isInFront,
    speedDifference: speedDifference,
    verticalPosition: verticalPosition
  }
  //Assign vertical position to the car
  thisCar.vertical = Math.floor(verticalPosition);
  verticalPosition = thisCar.vertical.toString() + "px";
  return verticalPosition;
}

//Function to compile a array of a specific stat on an array of cars
function dumpStat(whichStat, whichArray) {
  //whichStat should be a string in the format car.whichStat
  //i.e. speed or driver.risk
  //whichArray will be optional, carList will be assumed
  whichArray = whichArray || carList;
  //Check if array has anything in it
  if (whichArray.length == 0) {
    //Return an empty array
    return [];
  } else {
    //Create array to send back to calling function
    var returnArray = Array(whichArray.length);
    //Cycle through the cars to pull the requested stat
    whichArray.forEach(function (thatCar, carNumber, whichArray) {
      //If there is no car, mark undefined in the new array and move on
      if (thatCar == undefined) {
        returnArray[carNumber] = undefined;
        return;
      }
      //Check if whichStat has 2 dimensions
      if (whichStat.indexOf(".") > 0) {
        //Save where the period is to a variable
        var whereIsPeriod = whichStat.indexOf(".");
        //Check if whichStat has 3 dimensions
        if (whichStat.indexOf(".", whichStat.indexOf(".") + 1) > 0) {
          //Save where the 2nd period is
          var whereIsSecondPeriod = whichStat.indexOf(".", whichStat.indexOf(".") + 1);
          //Transfer 3rd dimension car stat into array
          returnArray[carNumber] = thatCar[whichStat.substr(0, whereIsPeriod)][whichStat.substr(whereIsPeriod + 1, whereIsSecondPeriod - (whereIsPeriod + 1))][whichStat.substr(whereIsSecondPeriod + 1)];
        } else {
          //Transfer 2nd dimension car stat into array
          returnArray[carNumber] = thatCar[whichStat.substr(0, whereIsPeriod)][whichStat.substr(whereIsPeriod + 1)];
        }
      } else {
        //Transfer car stat into array
        returnArray[carNumber] = thatCar[whichStat];
      }
    });
    //Send back the created array
    return returnArray;
  }
}

//Need to specify what a car is
function Car(name, type) {
  //Car function for seeing what is in front of this car
  //This function needs to be defined as soon as possible to be useable to assist with spawning
  this.checkSameLane = function (frontOrBack) {
    //frontOrBack will be optional; front is assumed
    var frontOrBack = frontOrBack || "front";
    var carsInLane = new Array();
    carList.forEach(function (thatCar, carNumber, carList) {
      //If the new car doesn't exist, skip it
      if (thatCar == undefined)
        return;
      //If the car that is being checked is the car we are checking, skip the car
      if (this.name == thatCar.name || thatCar.name == undefined)
        return;
      //If the car that is being checked is not in the same lane, skip the car
      if ((this.horizontal < (thatCar.horizontal - thatCar.width) || this.horizontal > (thatCar.horizontal + thatCar.width)) && (this.horizontal != thatCar.laneChange.canChangeToLane) && (this.horizontal != thatCar.laneChange.leavingLane))
        return;
      //Depends on which direction is being checked
      if (frontOrBack == "front") {
        //Filter out the cars behind
        if (this.vertical < thatCar.vertical)
          return;
      } else if (frontOrBack == "back") {
        //Filter out the cars in front
        if (this.vertical > thatCar.vertical)
          return;
      }
      //Any cars reaching this section should be in the appropriate direction and in the same lane
      carsInLane.push(thatCar);
    }, this);
    //If there are no cars in the appropriate direction, then return that information
    if (carsInLane.length == 0)
      return [undefined, 9999];
    //Take the list of cars in the appropriate direction and determine their distance from this car
    var distance = new Array(carsInLane.length);
    carsInLane.forEach(function (thatCar, carNumber, carsInLane) {
      //Need to take into account the length of the car
      if (frontOrBack == "front") {
        distance[carNumber] = (this.vertical - thatCar.vertical) - thatCar.height;
      } else if (frontOrBack == "back") {
        distance[carNumber] = (thatCar.vertical - this.vertical) - this.height;
      }
    }, this);
    
    //Determine which car is closest and report back with that information
    var shortestDistance = Math.min(...distance);
    var whichCar = distance.indexOf(shortestDistance);
    //If shortestDistance is negative, the cars are overlapping
    //This shouldn't take place, but until all situations that cause it are resolved
    if (shortestDistance < 0) {
      //Set the distance to be 1
      distance[whichCar] = 1;
    }
    return [carsInLane[whichCar], distance[whichCar]];
  }
  //Locally make the variable for the space the cars go in on the page
  var carSpace = document.getElementById("drivingSpace");
  //Name the new car
  this.name = name;
  //Assign the type of the new car
  this.type = type;
  //Assign a driver to the car
  this.driver = new Object();
  //Place the new car on the page by giving it a div of its own
  carSpace.innerHTML += '<div id="' + this.name + '"></div>';
  //Take the new div and make it part of the car (doesn't work all that well)
  this.body = document.getElementById(this.name);
  //Add brake lights and turn signals to the car
  this.body.innerHTML = '<div class="turnSignalLight" id="turnSignalLightLeft' + this.name + '" style="left: 0px;"></div>';
  this.body.innerHTML += '<div class="brakeLight" id="brakeLightLeft' + this.name + '" style="left: 8px;"></div>';
  this.body.innerHTML += '<div class="brakeLight" id="brakeLightRight' + this.name + '" style="left: 34px;"></div>';
  this.body.innerHTML += '<div class="turnSignalLight" id="turnSignalLightRight' + this.name + '" style="left: 42px;"></div>';
  
  //Fixed positions allow for the cars to be whereever they need to go
  this.body.style.position = "fixed";
  //Set depth of cars to ensure they are on top of the road
  this.body.style.zIndex = "1";
  //This is a placeholder for various car functions so that checks are not being done every single frame
  this.frameCounter = {
    brake: 0,
    gas: 0,
    turnSignal: 0
  };
  //Sometimes this car might have to ignore parts of its coding
  this.exemptions = {
    braking: false,
    gas: false,
    laneChange: false
  }
  //Currently, give all drivers a reaction time of 1 second (will be variable later)
  this.driver.reactT = Math.floor(framesPerSecond * 1);
  //Set a variable for temporary storage of this car's x-position
  this.horizStatic = 0;
  //Set a variable for temporary storage of this car's lane changing speed
  this.horizSpeedStatic = 0;
  this.isHorizSpeedAdjusted = false;
  //Set the car's width
  this.width = carWidth;
  this.body.style.width = carWidth.toString() + "px";
  //Depending on the type of car, certain variables will change
  switch (this.type) {
    //This section is great for making a test car for troubleshooting
    /*
    default:
      this.body.style.backgroundColor = "blue";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      this.driver.maxSpeed = 55;
      var horizPosi = [laneTwo.toString() + "px", laneTwo];
      this.driver.attentive = 0.8;
      this.driver.risk = 1;
      break;
      */
    case "Normal":
      this.body.style.backgroundColor = "blue";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      //Set turn signal usage:
      //0 = No turn signal at all
      //1 = Perfect turn signal usage
      //2 = High turn signal usage, perfect at turning off
      //3 = Medium turn signal usage, occasionally forget to turn off
      this.driver.turnSignalUsage = getRandom(0, 3);
      //Set the speed, lane, attentiveness and risk values off of random percentages
      //also set reaction time
      var speedRandomizer = getRandom(1, 100);
      var laneRandomizer = getRandom(1, 100);
      if (speedRandomizer < 3) { //2%
        //This is the slowest I want to make a normal car currently
        this.driver.maxSpeed = 55;
        if (laneRandomizer < 3) { //2% of 2%
          //This is like that old person that goes really slow in the fast lane
          //Doesn't pay any attention to all of the cars passing them
          var horizPosi = lanePosition(3);
          this.driver.attentive = 0.1;
          this.driver.risk = 1.5;
        } else { //98% of 2%
          //Really slow cars in the slow lane, where they should be
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.5;
          this.driver.risk = 1.5;
        }
      } else if (speedRandomizer < 10) { //7%
        //These cars are still pretty darn slow
        this.driver.maxSpeed = getRandom(56, 60);
        if (laneRandomizer < 10) { //9% of 7%
          //Occasionally, cars going this slow do get themselves in the middle lane
          //3 levels of attentiveness and lower than normal risk values are provided
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.3;
          this.driver.risk = 1.3;
        } else if (laneRandomizer < 20) { //10% of 7%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.9;
          this.driver.risk = 1.1;
        } else if (laneRandomizer < 30) { //10% of 7%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.5;
          this.driver.risk = 1.2;
        } else if (laneRandomizer < 40) { //10% of 7%
          //Remaining cars at this speed will be spawning in the slow lane
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.5;
          this.driver.risk = 1.2;
        } else if (laneRandomizer < 70) { //30% of 7%
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.7;
          this.driver.risk = 1.1;
        } else { //31%% of 7%
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.9;
          this.driver.risk = 1;
        }
      } else if (speedRandomizer < 30) { //20%
        //These cars are still not quite meeting the speed limit, but they aren't as much of a hinderance to normal traffic
        this.driver.maxSpeed = getRandom(61, 64);
        //Most cars this speed are going to be sticking to the slow lane, and all should still be lower then average on risk
        if (laneRandomizer < 30) { //29% of 20%
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.6;
          this.driver.risk = 1.3;
        } else if (laneRandomizer < 60) { //30% of 20%
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.8;
          this.driver.risk = 1.2;
        } else if (laneRandomizer < 90) { //30% of 20%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.9;
          this.driver.risk = 1.2;
        } else { //11% of 20%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.8;
          this.driver.risk = 1.1;
        }
      } else if (speedRandomizer < 70) { //40%
        //Suprisingly, a large percentage of cars are going the speed limit
        this.driver.maxSpeed = 65;
        //
        if (laneRandomizer < 20) { //19% of 40%
          var horizPosi = lanePosition(1);
          this.driver.attentive = 0.8;
          this.driver.risk = 1;
        } else if (laneRandomizer < 40) { //20% of 40%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.7;
          this.driver.risk = 1.1;
        } else if (laneRandomizer < 60) { //20% of 40%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.8;
          this.driver.risk = 1;
        } else if (laneRandomizer < 80) { //20% of 40%
          var horizPosi = lanePosition(3);
          this.driver.attentive = 0.8;
          this.driver.risk = 0.9;
        } else { //21% of 40%
          var horizPosi = lanePosition(3);
          this.driver.attentive = 0.6;
          this.driver.risk = 1;
        }
      } else { // 31%
        //Here are the faster normal cars. Nothing too serious speed wise, just cars in a little bit of a hurry
        this.driver.maxSpeed = getRandom(66, 69);
        if (laneRandomizer < 30) { //29% of 31%
          var horizPosi = lanePosition(3);
          this.driver.attentive = 0.8;
          this.driver.risk = 0.86;
        } else if (laneRandomizer < 70) { //40% of 31%
          var horizPosi = lanePosition(3);
          this.driver.attentive = 0.9;
          this.driver.risk = 0.82;
        } else { //31% of 31%
          var horizPosi = lanePosition(2);
          this.driver.attentive = 0.8;
          this.driver.risk = 0.9;
        }
      }
      break;
    case "Fast":
      //Fast cars and red just seem to go together so well
      this.body.style.backgroundColor = "red";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      var speedRandomizer = getRandom(1, 100);
      //Fast cars need to be pretty attentive, but drive risky
      //Also they are often terrible with turn signals but not all are
      if (speedRandomizer < 30) { //29%
        this.driver.maxSpeed = getRandom(70, 75);
        var horizPosi = lanePosition(3);
        this.driver.attentive = 0.8;
        this.driver.risk = 0.7;
        this.driver.turnSignalUsage = 0;
      } else if (speedRandomizer < 60) { //30%
        this.driver.maxSpeed = getRandom(70, 75);
        var horizPosi = lanePosition(3);
        this.driver.attentive = 0.9;
        this.driver.risk = 0.58;
        this.driver.turnSignalUsage = 0;
      } else if (speedRandomizer < 80) { //20%
        this.driver.maxSpeed = getRandom(76, 80);
        var horizPosi = lanePosition(3);
        this.driver.attentive = 0.9;
        this.driver.risk = 0.42;
        this.driver.turnSignalUsage = 2;
      } else { //21%
        this.driver.maxSpeed = getRandom(76, 80);
        var horizPosi = lanePosition(2);
        this.driver.attentive = 0.9;
        this.driver.risk = 0.42;
        this.driver.turnSignalUsage = 2;
      }
      break;
    case "Semi":
      this.body.style.backgroundColor = "yellow";
      //A semi is typically longer then an average car
      this.height = semiHeight;
      this.body.style.height = semiHeight.toString() + "px";
      this.driver.maxSpeed = getRandom(53, 60);
      //Semi drivers seem to be very aware of the other cars around them. Must be all the mirrors.
      this.driver.attentive = 1;
      //Semis tend to drive pretty safetly since it's their job
      this.driver.risk = 1.2;
      //Semis need to be good at turn signal use if they want to keep their jobs
      this.driver.turnSignalUsage = 1;
      //Semis will not appear in the fast lane
      var horizPosi = lanePosition(getRandom(1, 2));
      break;
    case "Cop":
      //Cop car is black for right now, which might make it harder to see on the gray
      this.body.style.backgroundColor = "black";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      //Cops have to be very aware of everything around them
      this.driver.attentive = 1;
      //Cops tend to drive riskier than normal drivers
      this.driver.risk = 0.6;
      //Giving cops the benefit of the doubt for turn signals, I think I've seen them not use it
      this.driver.turnSignalUsage = 1;
      this.driver.maxSpeed = getRandom(65, 68);
      var horizPosi = lanePosition(getRandom(1, 3));
      break;
    case "Player":
      //The main car is green because green is a nice color. Stands out pretty well
      this.body.style.backgroundColor = "green";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      //Currently the main car will start at a comfortable speed
      this.driver.maxSpeed = getRandom(64, 66);
      //Currently the main car will start in the middle lane
      //Later this will be changed for the more preferred option of the main car starting on an onramp
      //Of course this will not be until onramps and offramps are built
      var horizPosi = lanePosition(2);
      //The main car will have normal risk and attentive values
      this.driver.attentive = 0.9;
      this.driver.risk = 1;
      //The main car will always be perfect with turn signal use, at least by default. currently
      this.driver.turnSignalUsage = 1;
      break;
    case "Test1":
      //This is for setting up specific senarios for testing purposes
      this.body.style.backgroundColor = "white";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      this.driver.maxSpeed = 0;
      var horizPosi = lanePosition(1);
      this.driver.attentive = 1;
      this.driver.risk = 1;
      this.driver.turnSignalUsage = 0;
      break;
    case "Test2":
      //This is for setting up specific senarios for testing purposes
      this.body.style.backgroundColor = "white";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      this.driver.maxSpeed = 0;
      var horizPosi = lanePosition(2);
      this.driver.attentive = 1;
      this.driver.risk = 1;
      this.driver.turnSignalUsage = 0;
      break;
    case "Test3":
      //This is for setting up specific senarios for testing purposes
      this.body.style.backgroundColor = "white";
      this.height = carHeight;
      this.body.style.height = carHeight.toString() + "px";
      this.driver.maxSpeed = 0;
      var horizPosi = lanePosition(3);
      this.driver.attentive = 1;
      this.driver.risk = 1;
      this.driver.turnSignalUsage = 0;
  }
  //Set Horizontal and Vertical positions and speed based of variables set during the previous section
  this.body.style.left = horizPosi[0];
  this.horizontal = horizPosi[1];
  //Currently set speed to max speed, eventually they should/could be based
  this.speed = this.driver.maxSpeed;
  //If this is the player car, we will need to handle the vertical positioning differently
  if (this.type == "Player") {
    //Need to calculate vertical position based on window size
    var verticalPosition = Math.floor($(window).height() * .8);
    this.vertical = verticalPosition;
    this.body.style.top = verticalPosition.toString() + "px";
    this.verticalStatic = this.vertical
  } else if (this.type.indexOf("Test") >= 0) {
    //For the current test cars, they will be spawned way out in front
    this.vertical = -9000;
    this.body.style.top = this.vertical.toString() + "px";
  } else {
    //Vertical positioning of spawn is based on how fast the new car is going in relation to the player car
    if (this.driver.maxSpeed > carList[0].speed) {
      //If new car is faster, place it behind the player car
      this.body.style.top = determineVerticalPosition(false, this);
    } else {
      //If new car is slower or the same speed, place it in front
      this.body.style.top = determineVerticalPosition(true, this);
    }
  }
  /* Now that vertical positions are based on speed and not arbitrary, this section should no longer been needed
  //Set the speed of this car based on the speed of the car in front of it
  var carInFront = this.checkSameLane();
  if (carInFront[0] == undefined) {
    this.speed = this.driver.maxSpeed; //No car in front = full speed ahead
  } else {
    var carInFrontSpeed = carInFront[0].speed;
    var distance = carInFront[1] / this.height;
    this.speed = carInFrontSpeed + ((distance - 2.25) * 0.75);
    if (this.speed > this.driver.maxSpeed) {
      this.speed = this.driver.maxSpeed;
    }
  }
  //Set the speed of the car behind this one if it needs to be adjusted
  var carInBack = this.checkSameLane("back");
  if (carInBack[0] != undefined) {
    //Create variables similar to the braking function
    var testHeight = (this.height + carInBack[0].height) / 2;
    var distanceInBack = (carInBack[1] / testHeight) - ((carInBack[0].speed + (32.5 * carInBack[0].driver.risk)) / 65);
    var speedDifference = carInBack[0].speed - this.speed;
    //Check if the carInBack is going too fast
    if (speedDifference > Math.sqrt(0.4 * distanceInBack * testHeight)) {
      carInBack[0].speed = this.speed + Math.sqrt(0.4 * distanceInBack * testHeight);
    }
  }
  */
  //Make an object for storing variables related to braking
  this.braking = {
    isBraking: false,
    wasBraking: false,
    brakingAccel: 0
  };
  //Set the car to not following by default
  this.isBehindACar = false;
  //Make an object for storing variables related to lane changing
  this.laneChange = {
    mayWantToChangeLanes: false,
    willWantToChangeAt: 99999999999,
    wantsToChangeLanes: false,
    canChangeLanes: false,
    canChangeToLane: 0,
    carFour: undefined,
    carTwo: undefined,
    wantsToBeInLane: 0,
    leavingLane: 0,
    horizSpeed: (2.5 * this.driver.risk)  //Set lane changing speed based on risk, 2.5 = just under 5 secs at 20 fps
  };
  //Set variables to make turn signals work
  this.laneChange.turnSignal = {
    isActive: false,
    blink: "off",
    side: ""
  }
  //This object will contain cars that will not get factored into this car's decisions normally
  this.carX = {
    braking: Array(),
    laneChanging: Array()
  };
  //Set variables that will be used for isolating problems (informational only)
  this.info = {
    canChangeToLane: 0,
    wantsToBeInLane: 0,
    leavingLane: 0,
    laneChangeType: "",
    note: "",
    spawnedAt: globalFrameCounter,
    startedLaneChangeAt: 0,
    brakingAccel: 0
  }
  //Car Engine *vroom vroom*
  this.carEngine = function () {
    //Great code for stopping execution at a specific car
    /*
    if (this.speed.toString().indexOf("00000") >= 2)
      debugger;
    
    if (this.type == "Player")
      debugger;
    */
    //Increment this car's frameCounters
    this.frameCounter.brake++;
    this.frameCounter.turnSignal++;
    this.frameCounter.gas++;
    //Check to see if this car needs to brake due to something in front of it
    //unless there is a qualified exception
    if (!this.exemptions.braking) {
      this.checkBraking();
    } else {
      //Reset exemption to attempt to start checking braking again on next frame
      this.exemptions.braking = false;
    }
    //Check to see if this car wants to step on the gas
    //unless there is a qualified exception
    if (!this.exemptions.gas) {
      this.checkGasPedal();
    } else {
      //Reset exemption to attempt to start checking braking again on next frame
      this.exemptions.gas = false;
    }
    //Check to see if this car wants to change lanes
    //unless there is a qualified exception
    if (!this.exemptions.laneChange) {
      this.checkLaneChange();
    } else {
      //Reset exemption to attempt to start checking braking again on next frame
      this.exemptions.laneChange = false;
    }
    //Check if any actions need to be taken by this car as reactions
    this.senseOthers();
    //See if the brake lights and turn signals should be on or off
    this.handleBrakeLights();
    this.handleTurnSignalLights();
    //If there ever is a situation where a car tries to decelerate beyond a full stop
    //reset its speed to 0
    if (this.speed < 0)
      this.speed = 0;
    //The following sections are for troubleshooting purposes
    //Throw up a debugger if a car manages to get a speed or vertical atrribute to be NaN
    if (this.speed !== this.speed || (this.vertical !== this.vertical)) {
      debugger;
    }
    carList.forEach(function (thatCar, carNumber, carList) {
      //Currently cars are ignoring each other on occasion
      //If the new car doesn't exist, skip it
      if (thatCar == undefined)
        return;
      //If the car that is being checked is the car we are checking, skip the car
      if (this.name == thatCar.name || thatCar.name == undefined)
        return;
      //If the car that is being checked is not in the same lane, skip the car
      if (this.horizontal < (thatCar.horizontal - thatCar.width) || this.horizontal > (thatCar.horizontal + thatCar.width))// || (this.vertical > (thatCar.vertical + (testHeight * (3 * this.driver.risk)))) || (this.vertical < thatCar.vertical))
        return;
      //If a remaining car is intersecting with this car, stop the execution for troubleshooting
      if (this.vertical > thatCar.vertical && (this.vertical < thatCar.vertical + thatCar.height)) {
        console.log("Cars making contact");
        console.log(this);
        console.log(thatCar);
        //debugger;
      }
    }, this);
  }
  
  //Car function for determining if brakes need to be applied
  this.checkBraking = function () {
    /* There are going to be a lot of exceptions to this entire braking section
    Anything from trying to pass someone in appropriately tight spaces
    to merging(?), to braking more/less to change lanes
    They may all need to be handled individually,
    or it may be possible to group them together in another function
    One thing is for sure, these exceptions will not be handled here.
    */
    //Reset braking variables, will retrip if needed
    this.braking.isBraking = false;
    this.isBehindACar = false;
    this.braking.brakingAccel = 0;
    var mayBrakeHarder = false;
    //Determine what car needs to be checked against
    if (this.carX.braking.length >= 1 && (this.carX.braking[0].vertical < this.vertical)/* && (this.carX.braking[0].horizontal + this.carX.braking[0].width >= this.horizontal) && (this.horizontal + this.width >= this.carX.braking[0].horizontal)*/) {
      var carInFront = [this.carX.braking[0], (this.vertical - this.carX.braking[0].vertical) - this.carX.braking[0].height];
    } else {
      var carInFront = this.checkSameLane();
    }
    //If no one is in front, forget about braking
    if (carInFront[0] == undefined) {
      //return;
    } else {
      //If one of the 2 cars is a semi, then add some distance to the equations for safety
      var testHeight = (this.height + carInFront[0].height) / 2;
      //People brake harder when there is less space in front and they are going much faster
      //braking hardness = speed difference / distance
      //speed difference in mph or ppf, distance in car lengths
      var speedDifference = this.speed - carInFront[0].speed;
      //Factoring in current speed, since the slower a car is going, the less of a gap it needs
      var thisSpeedModifier = 0;
      if (this.speed / 65 < 0.5) {
        thisSpeedModifier = 0.5;
      } else if (this.speed / 65 > 1.3) {
        thisSpeedModifier = 1.3;
      } else {
        thisSpeedModifier = this.speed / 65;
      }
      //Dividing by risk should make the distanceInFront a bigger number when the driver is riskier
      //bigger distanceInFront means less slowing which is appropriate for increased risk
      //Need a minimum gap as well so that cars aren't touching if they do come to a stop
      //distanceInFront = totalDistance - gap; gap is variable but totalDistance is not
      var distanceInFront = (carInFront[1] / testHeight) - ((this.speed + (32.5 * this.driver.risk)) / 65);
      //var distanceInFront = (((carInFront[1] / testHeight) / this.driver.risk) / thisSpeedModifier);
      //distanceInFront is no longer also equal to ((((2 * this.speed) * (this.vertical - carInFront[0].vertical - carInFront[0].height)) / ((65 * this.driver.risk) * (carInFront[0].height + this.height))) + ((40 * this.driver.risk) / (carInFront[0].height + this.height)))
      //If the car in front is going comfortably faster
      if (speedDifference <= -3) {
        //No need to check further
        //return;
      } else if (distanceInFront < 0) {
        //This car is within the gap of the carInFront, likely because the other car is changing lanes
        //Check if this car is actually behind the car it is braking for
        if ((!(this.horizontal < (carInFront[0].horizontal - carInFront[0].width) || (this.horizontal > (carInFront[0].horizontal + carInFront[0].width))) && (carInFront[0].horizStatic == 0 || (!(this.horizontal < (carInFront[0].horizStatic - carInFront[0].width) || (this.horizontal > (carInFront[0].horizStatic + carInFront[0].width)))))) && (this.horizStatic == 0 || (!(this.horizStatic < (carInFront[0].horizontal - carInFront[0].width) || (this.horizStatic > (carInFront[0].horizontal + carInFront[0].width)))))) {
          //carInFront is physically in front of this car
          
          //Solve for the time it will take for this car to get too close to the car ahead
          //and how quickly the car will need to decelerate to match speeds by that time
          //If the deceleration is too much, this car may need to jump out of the lane
          
          
          
          
          
          
          
        }
        //This car needs to get clear of the other car before it gets to this lane
        //Currently going to set braking to just under max, later calculate based on equation similar to finding gap
        
        this.braking.brakingAccel = 0.45;
        //this.applyBrakes(0.45);
      } else if (distanceInFront <= (1.5 * (this.speed / 65))) { //previously 2
        //At this short of a distance, every effort needs to be made to ensure a collision does not occur
        //This car is not going faster and the car in front is not slowing down hard enough for brake lights
        if (speedDifference <= 0 && !carInFront[0].braking.isBraking) {
          //Don't hit the brakes too hard
          this.braking.brakingAccel = 0.1;
          //this.applyBrakes(0.1); was 0.05);
        } else if (speedDifference > 0 && !carInFront[0].braking.isBraking) {
          //Hit the breaks harder then normal
          this.braking.brakingAccel = Math.pow(1.75, speedDifference - 3);
          mayBrakeHarder = true;
          //this.applyBrakes(Math.pow(1.75, speedDifference - 3), true);
        } else if (speedDifference <= 0 && carInFront[0].braking.isBraking) {
          //Maintain braking hard enough to have brake lights on
          //Currently removed braking hard enough for brake lights, but this car need to figure out
          //how much the car in front is slowing down somehow
          this.braking.brakingAccel = 0.1;
          //this.applyBrakes(0.1); was 0.12);
        } else {
          //Brake hard enough for lights + the amount factored by speed difference)
          this.braking.brakingAccel = Math.pow(1.75, speedDifference - 3);
          mayBrakeHarder = true;
          //this.applyBrakes(Math.pow(1.75, speedDifference - 3)/* + 0.12*/, true);
        }
      } else if (distanceInFront <= 3.2) {
        //This car is at a comfortable distance, but is it going a comfortable speed?
        if (speedDifference <= 0 && carInFront[0].braking.isBraking) {
          //This car is going the same speed or slower but the car in front is slowing
          //Maintain minimum brake light triggering deceleration
          this.braking.brakingAccel = 0.05;
          //this.applyBrakes(0.05); was 0.12);
        } else if (speedDifference == 0) {
          //Speed is comfortable, don't change it
          this.exemptions.gas = true;
        } else if (speedDifference < 0 && distanceInFront <= 2) {
          //Need a patch where this car is completely comfortable not doing anything
          this.exemptions.gas = true;
        } else if (speedDifference < 0) {
          //If the speedDifference is negligible, set it to 0
          if (!(speedDifference > Math.sqrt(0.01 * distanceInFront * testHeight) || (speedDifference < -Math.sqrt(0.01 * distanceInFront * testHeight)))) {
            this.speed = carInFront[0].speed;
            this.exemptions.gas = true; //currently throwing in gas exemption for fun
          }
          //Going slower, may want to bump that back up
          //return;
        } else if (speedDifference > 0 && !carInFront[0].braking.isBraking) {
          //Standard braking applies
          this.braking.brakingAccel = Math.pow(speedDifference, 2) / (distanceInFront * testHeight);
          //this.applyBrakes(Math.pow(speedDifference, 2) / (distanceInFront * testHeight));
        } else {
          //This car is going faster then the car ahead and that car is slowing down
          this.braking.brakingAccel = Math.pow(speedDifference, 2) / (distanceInFront * testHeight);
          //Standard braking plus minimum brake light triggering
          //this.applyBrakes(Math.pow(speedDifference, 2) / (distanceInFront * testHeight)/* + 0.12*/);
        }
      } else if (speedDifference <= 0) {
        //This car is not too close for comfort, and is not going faster than the car in front
        //No need to brake really
        //return;
      } else {
        //Got some distance to the next car, allow for some closure to occur if appropriate
        if (speedDifference <= 0) { //This line is currently negated by the prior outside else if
          //No need to keep checking, ok to use gas
          //return;
        } else {
          //Need to slow down, standard braking applies
          //Base deceleration strictly on the appropriate factors
          this.braking.brakingAccel = Math.pow(speedDifference, 2) / (distanceInFront * testHeight);
          //Only perform deceleration if the accel and speedDifference meet certain thresholds
          if (!(this.braking.brakingAccel >= 0.01 && (speedDifference > 2))) {
            //Set accel to 0
            this.braking.brakingAccel = 0;
          }
        }
      }
      //Apply the brakes if a deceleration was decided upon
      if (this.braking.brakingAccel > 0) {
        //Skip the next part if the carInFront is going faster or the same speed
        if (speedDifference > 0) {
          //Verify that this car is braking hard enough by ensuring c >= (v * t) - (0.5 * a * t^2); a = this.braking.brakingAccel, v = speedDifference, t = v / a
          //equation should be c > (1 / (2 * a)) * (this.speed^2 - carInFront[0].speed^2) 
		  if (distanceInFront * testHeight < ((Math.pow(speedDifference, 2) / this.braking.brakingAccel) - (0.5 * this.braking.brakingAccel * Math.pow(speedDifference / this.braking.brakingAccel, 2)))) {
            //debugger;
          }
          //Verify that this car is braking hard enough by checking b^2 - 4 * a * c >= 0
          if (Math.pow(speedDifference, 2) - (4 * this.braking.brakingAccel * (distanceInFront * testHeight)) > 0 && (Math.pow(speedDifference, 2) - (4 * this.braking.brakingAccel * carInFront[1]) >= 0)) {
            //debugger;
          } else if (Math.pow(speedDifference, 2) - (4 * this.braking.brakingAccel * (distanceInFront * testHeight)) > 0) {
            //debugger;
          }
        }
        this.applyBrakes(this.braking.brakingAccel);
      }
      //This is hopefully temporary to ensure cars don't hit each other
      //It is entirely unrealistic but needed until it is determined how to better handle braking as a whole
      if (this.vertical < (carInFront[0].vertical + (testHeight * 1.2)) && (!(this.horizontal < (carInFront[0].horizontal - carInFront[0].width) || (this.horizontal > (carInFront[0].horizontal + carInFront[0].width))) && (carInFront[0].horizStatic == 0 || (!(this.horizontal < (carInFront[0].horizStatic - carInFront[0].width) || (this.horizontal > (carInFront[0].horizStatic + carInFront[0].width)))))) && (this.horizStatic == 0 || (!(this.horizStatic < (carInFront[0].horizontal - carInFront[0].width) || (this.horizStatic > (carInFront[0].horizontal + carInFront[0].width)))))) {
        //debugger;
        this.speed = carInFront[0].speed - 1;
      }
    }
    //Special case where checkBraking finds that this car is above it's max speed
    //and this car didn't find a reason to slow down
    //(this.braking.brakingAccel == 0) was previously !this.exemption.gas but that would allow this car 
    //to maintain a speed higher than max if certain difficult conditions were meet (maybe not a bad thing)
    if (this.speed > this.driver.maxSpeed && (this.braking.brakingAccel == 0)) { 
      //This may occur if an exemption allowed this car to go faster than it's top speed
      //Rather than have the gas function reset the speed
      this.exemptions.gas = true;
      //Slow the car down gradually
      /*
      speedDifference = this.speed - this.driver.maxSpeed;
      if (speedDifference > 1.9)
        speedDifference = 1.9;
      this.applyBrakes(speedDifference);
      */
      this.applyBrakes(0.05);
    }
  }
  
  //Separate car function for just applying the brakes, should be able to be called anytime
  //braking is needed, regardless of the motive. Just needs how hard the brake is pressed.
  this.applyBrakes = function (hardness, waiveMaxBrake) {
    //Initialize optional variable
    waiveMaxBrake = waiveMaxBrake || false;
    //Lower hardness values will be akin to not pressing on the gas as hard
    //or taking the foot off the gas entirely but not pressing the brake
    //As such, the isBraking variable should only be triggered if braking speed is above a certain value
    if (hardness >= 0.12) //if (hardness > 1.2)
      this.braking.isBraking = true;
    //Even if this car is not braking hard, any braking speed should negate checking the gas
    this.exemptions.gas = true;
    //Also flag the car as tailing
    this.isBehindACar = true;
    //Set a maximum to hardness, cars can only slow down so fast irl
    if (!waiveMaxBrake) {
      if (hardness > 0.5) //if (hardness > 7)
        hardness = 0.5; //hardness = 7;
    } else {
      if (hardness > 2)
        hardness = 2;
    }
    //Calculate speed change, handle semis differently from the rest of the cars
    if (this.type == "Semi") {
      var accel = hardness * 0.8; //var accel = Math.pow(1.75, hardness - 5.5); 
    } else {
      var accel = hardness; //var accel = Math.pow(1.75, hardness - 5);
    }
    //Apply speed change
    this.speed -= accel;
    //Save variable in info for troubleshooting
    this.info.brakingAccel = -accel;
  }
  
  //Function for stepping on the accelerator
  this.applyGas = function () {
    this.speed += this.accel;
  }
  
  //Function for appling jerk (first integral of acceleration)
  //Actually this function is just changing the acceleration during lane changes
  this.adjustAcceleration = function () {
    /*
    Need a few things to make this work:
    An equation for jerk,
    Where the acceleration is along that equation
    
    And now for a pretty ASCII drawing
    
           -x ————————————————————————————————————————————————————————————————————————————————> +x
                                                                                              -y  
                                                                                                  
                                                                                              |   
                                                    |                                         |   
                                                                                              |   
                                    ^               |                                         |   
                                    |                                                         |   
                                 |¯¯¯¯¯¯|           |                                         |   
                                 |      |                                                     |   
                                 |      |           |                                         |   
                                 |      |                                                     |   
                                 |      |           |                                         |   
                                 |______|                                                     |   
                                                    |                                         |   
                                                                                              |   
                                                    |                                         |   
                                                                                              |   
                                                    |                                         |   
                                                                                              |   
                                                    |                                         |   
                                                                                              V   
                                                    |                                             
                                                                                              +y  
                                                                                                  
    */
    //Didn't really feel like completing it yet
    
    //Currently this function is going to used for determining if changes need to be made to a car
    //that is already in the processes of changing lanes
    this.horizStatic = this.horizontal;
    //Grab horizontal distance remaining in the lane change
    var remainingDistance = Math.abs(this.horizontal - this.laneChange.canChangeToLane);
    //Check to see if this car has already cleared carTwo, if not then define it
    if (Math.abs(this.horizontal - this.laneChange.leavingLane) < this.width) {
      this.horizontal = this.laneChange.leavingLane;
      var carInFront = this.checkSameLane("front");
      var carTwo = carInFront[0];
    }
    //Define cars Three and Four as the cars currently in front and behind this car in the target lane
    this.horizontal = this.laneChange.canChangeToLane;
    var carInFront = this.checkSameLane("front");
    var carInBack = this.checkSameLane("back");
    var carThree = carInFront[0];
    var carFour = carInBack[0];
    //Set this car's horizontal back to what it actually is
    this.horizontal = this.horizStatic;
    this.horizStatic = 0; //Reset horizStatic
    //Find this car's average speed over the remaining distance
    var currentAvgSpeed = this.speed + (0.5 * (this.accel * ((remainingDistance - (this.width)) / this.laneChange.horizSpeed)));
    //First check if getting carThree and carFour with this method at this time produced different
    //results from when the lane change started
    if (carThree != undefined) {
      if (this.info.carThree == undefined) {
        //debugger;
        this.info.carThree = carThree;
      } else if (carThree.name != this.info.carThree.name) {
        //debugger;
        this.info.carThree = carThree;
      }
    }
    if (carFour != undefined) {
      if (this.laneChange.carFour == undefined) {
        //debugger;
        this.laneChange.carFour = carFour;
      } else if (carFour.name != this.laneChange.carFour.name) {
        //debugger;
        this.laneChange.carFour = carFour;
      }
    }
    //Secondly check if the original equations are still true
    if (carTwo != undefined) {
      var maxExitSpeed = carTwo.speed + (this.laneChange.horizSpeed * ((this.vertical - carTwo.vertical - (carTwo.height * (1 + this.driver.risk))) / ((carTwo.width * (1 + this.driver.risk)) - Math.abs(this.horizontal - this.laneChange.leavingLane))));
      var currentExitSpeed = this.speed + (this.accel * ((carTwo.width - Math.abs(this.horizontal - this.laneChange.leavingLane)) / this.laneChange.horizSpeed));
      //var maxAccel = (2 * this.laneChange.horizSpeed) * ((maxExitSpeed - this.speed) / (carTwo.width * (1 + this.driver.risk)));
      if (currentExitSpeed > maxExitSpeed) {
        var maxAccel = (2 * this.laneChange.horizSpeed) * ((maxExitSpeed - this.speed) / ((carTwo.width * (1 + this.driver.risk)) - Math.abs(this.horizontal - this.laneChange.leavingLane)));
        //Verify maxAccel is within reasonable parameters
        if (maxAccel > 0.3) {
          this.accel = 0.27;
        } else if (maxAccel < -0.5) {
          //If this car can't slow down fast enough, have it dodge out of the way instead
          this.isHorizSpeedAdjusted = true;
          this.horizSpeedStatic = this.laneChange.horizSpeed;
          //Solve for what horizSpeed would get this car safely out of the way
          this.info.hadToDodge = true;
          //Vf = Vi + A * T
          //T = (sqrt((4 * A * D) + (Vi ^ 2))-Vi) / (2 * A)
          //also
          //T = (sqrt((4 * A * D) + (Vi ^ 2))+Vi) / (2 * A)
          var newHorizSpeed = (Math.sqrt((-2 * (this.vertical - (carTwo.vertical * (1 + this.driver.risk)))) + Math.pow(this.speed, 2)) - this.speed) / ((carTwo.width * (1 + this.driver.risk)) - Math.abs(this.horizontal - this.laneChange.leavingLane));
          var otherNewHorizSpeed = (Math.sqrt((-2 * (this.vertical - (carTwo.vertical * (1 + this.driver.risk)))) + Math.pow(this.speed, 2)) + this.speed) / ((carTwo.width * (1 + this.driver.risk)) - Math.abs(this.horizontal - this.laneChange.leavingLane));
          //This section needs further work, but currently the unrealistic deceleration will be used
          this.accel = maxAccel + (maxAccel * 0.1);;
          
          
          
          //debugger;
          
        } else if (maxAccel > 0) {
          this.accel = maxAccel - (maxAccel * 0.1);
        } else {
          this.accel = maxAccel + (maxAccel * 0.1);
        }
      }
    }
    //Check carThree
    if (carThree != undefined && (remainingDistance > (carThree.width))) {
      var carThreeVertPosiAfter = carThree.vertical + (-carThree.speed * ((remainingDistance - (carThree.width)) / this.laneChange.horizSpeed));
      var isCarThreeGapCurrentSpeed = ((this.vertical + (-currentAvgSpeed * ((remainingDistance - (carThree.width)) / this.laneChange.horizSpeed))) > (carThreeVertPosiAfter + (carThree.height * (1 + (1.75 * this.driver.risk)))));
      //If isCarThreeGapCurrentSpeed is not true, something may have changed during this car's lane change
      if (!isCarThreeGapCurrentSpeed) {
        
        //debugger;
        //this.accel -= this.accel * 0.1;
        //Solve for what speed would make isCarThreeGap true
        this.accel = (this.laneChange.horizSpeed * (carThree.speed - this.speed)) / (remainingDistance - (carThree.width));
        //Check if accel is too high or low
        if (this.accel > 0.3) {
          this.accel = 0.27;
        } else if (this.accel < -0.5) {
          this.accel = -0.5;
        } else if (this.accel > 0) {
          this.accel -= this.accel * 0.1;
        } else {
          this.accel += this.accel * 0.1;
        }
        var newAvgSpeed = this.speed + ((this.accel * (remainingDistance - (carThree.width)) / this.laneChange.horizSpeed) / 2);
        var isCarThreeGapNewSpeed = ((this.vertical + (-newAvgSpeed * ((remainingDistance - (carThree.width)) / this.laneChange.horizSpeed))) > (carThreeVertPosiAfter + (carThree.height * (1 + (1.75 * this.driver.risk)))));
        //Verify new speed is true
        if (!isCarThreeGapNewSpeed) {
          //If it still doesn't work, let the checkBraking function take over handling this car's acceleration
          this.horizStatic = this.horizontal;
          this.horizontal = this.laneChange.canChangeToLane;
          this.checkBraking();
          this.horizontal = this.horizStatic;
          this.horizStatic = 0; //Reset horizStatic
          this.accel = 0;
        }
      }
    } else if (carThree != undefined) {
      //If this car is within carThree's width of completing the lane change, it still needs to be checked
      var carThreeVertPosiAfter = carThree.vertical + (-carThree.speed * ((remainingDistance) / this.laneChange.horizSpeed));
      var isCarThreeGapCurrentSpeed = ((this.vertical + (-currentAvgSpeed * ((remainingDistance) / this.laneChange.horizSpeed))) > (carThreeVertPosiAfter + (carThree.height * (1 + (1.75 * this.driver.risk)))));
      //If isCarThreeGapCurrentSpeed is not true, carThree is decelerating
      if (!isCarThreeGapCurrentSpeed) {
        //let the checkBraking function take over handling this car's acceleration
        this.horizStatic = this.horizontal;
        this.horizontal = this.laneChange.canChangeToLane;
        this.checkBraking();
        this.horizontal = this.horizStatic;
        this.horizStatic = 0; //Reset horizStatic
        this.accel = 0;
      }
    }
    //Check carFour
    if (carFour != undefined) {
      var carFourVertPosiAfter = carFour.vertical + (-carFour.speed * ((remainingDistance - (carFour.width)) / this.laneChange.horizSpeed));
      var isCarFourGapCurrentSpeed = ((this.vertical + (-currentAvgSpeed * ((remainingDistance - (carFour.width)) / this.laneChange.horizSpeed)) + (this.height * (1 + (1.75 * this.driver.risk)))) < carFourVertPosiAfter);
      //If isCarFourGapCurrentSpeed is not true, something may have changed during this car's lane change
      if (!isCarFourGapCurrentSpeed) {
        //debugger;
      }
    }
  }
  
  //This function handles the decision making for if another lane is better and which lane (Part 2 of Lane Changing)
  this.checkOtherLanesSpeeds = function (firstLaneCarList, secondLaneCarList, firstLanePosition, secondLanePosition) {
    //Variable for keeping track of whether other lanes are better choices to be in
    var isLaneSlower = false;
    //Variable for keeping track of which lane is faster
    var fasterLane = 0;
    
    //Cycle through the cars in the lane that first needs to be checked
    firstLaneCarList.forEach(function (thatCar, carNumber, firstLaneCarList) {
      //if the car is really far behind, then we are likely not concerned about it
      if (this.vertical < (thatCar.vertical - (thatCar.height * 3)))
        return;
      //Cars that get to here are either close enough to be a concern or are ahead of our car
      //If this car is a semi, use its own speed to calculate
      if (this.type == "Semi") {
        var carInFront = [this];
      } else {
        //Otherwise grab the car in front of this car for comparison
        var carInFront = this.checkSameLane();
      }
      //Occasionally the car in front of this car despawns before the other lanes are checked
      //No need to try to change lanes if there is no car in front anymore
      if (carInFront[0] == undefined) {
        this.laneChange.wantsToChangeLanes = false;
        this.laneChange.turnSignal.isActive = false;
        return;
      }
      //Use the speed of the car in front of this car to determine if the other lane is faster
      var carInFrontSpeed = carInFront[0].speed;
      if (carInFrontSpeed < thatCar.speed) {
        //This means at least one car in the other lane is going faster
        //Which doesn't mean much to this checking currently
        
      } else {
        //At least 1 car in the other lane is going slower or the same speed
        isLaneSlower = true;
      }
    }, this);
    
    //If first checked lane had a slower car, check the other one
    if (isLaneSlower && !(secondLaneCarList == undefined)) {
      //Reset the slower lane variable, so this lane can trip it again if need be
      isLaneSlower = false;
      secondLaneCarList.forEach(function (thatCar, carNumber, secondLaneCarList) {
        //if the car is really far behind, then we are likely not concerned about it
        //need to check further behind then other lane because it may take some time to get over
        if (this.vertical < (thatCar.vertical - (thatCar.height * 4)))
          return;
        //Grab the car in front of this car for comparison
        var carInFront = this.checkSameLane();
        if (carInFront[0] == undefined && !(this.type == "Semi")) {
          this.laneChange.wantsToChangeLanes = false;
          this.laneChange.turnSignal.isActive = false;
          return;
        }
        //Use the speed of the car in front of this car to determine if the other lane is faster
        var carInFrontSpeed = carInFront[0].speed;
        if (carInFrontSpeed < thatCar.speed) {
          //This means at least one car in the other lane is going faster
          //Still doesn't really mean anything to this function currently
          
        } else {
          //At least 1 car in the other lane is going slower or the same speed
          isLaneSlower = true;
        }
        
      }, this);
    } else if (!isLaneSlower) {
      //The first (or only) checked lane was faster, flag it as such
      fasterLane = firstLanePosition;
    }
    //If 2nd lane checked was also slow (or only lane checked was slow)
    if (isLaneSlower) {
      //This car doesn't want to change lanes
      this.laneChange.wantsToChangeLanes = false;
      this.laneChange.turnSignal.isActive = false;
    } else {
      //Otherwise, it wants to be in the first lane checked that was faster
      if (fasterLane == 0) {
        fasterLane = secondLanePosition;
      }
      this.laneChange.wantsToBeInLane = fasterLane
    }
  }
  
  //This function handles determining if there is an acceptable gap for this car to fit into (Part 3 of Lane Changing)
  this.gapAcceptance = function (carsInTargetLane) {
    this.laneChange.canChangeLanes = false; //Assuming false so that car doesn't try to change lanes yet
    var brakingHardness = 0; //Variable for if this car needs to slow down before it can change lanes
    //Work out where this car is and where it is going
    if (this.horizontal == laneThree || (this.horizontal == laneOne)) {
      var laneChangeDistance = this.horizontal - laneTwo;
      var canChangeToLane = laneTwo;
    } else if (this.horizontal == laneTwo) {
      var laneChangeDistance = this.horizontal - this.laneChange.wantsToBeInLane;
      var canChangeToLane = this.laneChange.wantsToBeInLane;
    } else {
      console.log("This car is not in a lane for laneChangeDistance");
    }
    //Need to make sure laneChangeDistance is always positive
    laneChangeDistance = Math.abs(laneChangeDistance);
    //Determine if a lane change can be executed, is there space in lane 2?
    //How much space does a car need to change lanes?
    //Per http://www.drivingtips.org/changing_lanes.html 
    //3 to 4 car lengths at freeway speed for the car behind (to be safe)
    //It also should depend on the type of car, and how risky the driver is
    //The speed of behind car needs to be taken into account
    //The goal is to match speeds before changing lanes
    //Need to make sure that isn't going to cause this car to hit the one in front of it
    
    //Let's paint a picture of how the next lane over looks
    var carPositions = dumpStat("vertical", carsInTargetLane);
    //Copy this array as the original will be used to reference the cars
    var carPositionsSorted = carPositions.slice().sort(function (a, b) {return a - b});
    //If there are no cars in the list, then the lane is clear
    if (carPositions.length == 0) {
      this.laneChange.canChangeLanes = true;
      this.accel = 0;
      this.laneChange.carFour = undefined;
      var carInFront = this.checkSameLane();
      this.laneChange.carTwo = carInFront[0];
      this.info.laneChangeType = "No cars in target lane";
      this.info.carThree = undefined;
    } else if (carsInTargetLane[carPositions.indexOf(carPositionsSorted[carPositionsSorted.length - 1])] == undefined) {
      debugger;
    } else if (/*(carPositionsSorted[carPositionsSorted.length - 1] + carsInTargetLane[carPositions.indexOf(carPositionsSorted[carPositionsSorted.length - 1])].height + (this.height * this.driver.risk * this.speed / 65))*/carPositionsSorted[carPositionsSorted.length - 1] < this.vertical) {
      //If the last car in the list is above this car, the gap is infinite
      //Reject lane change if the closest car is too close
      if ((carPositionsSorted[carPositionsSorted.length - 1] + carsInTargetLane[carPositions.indexOf(carPositionsSorted[carPositionsSorted.length - 1])].height + (this.height * (this.speed + (32.5 * this.driver.risk)) / 65)) > this.vertical) {
        return;
      }
      //In this situation, carThree is the last car in carPositionsSorted
      var carThree = carsInTargetLane[carPositions.indexOf(carPositionsSorted[carPositionsSorted.length - 1])];
      //Handle semis separately
      if (!(this.type == "Semi")) {
        //Determine which distance is longer, vertical between cars or horizontal between lanes
        var verticalDistance = (this.vertical - carThree.vertical - carThree.height - (this.height * (this.speed + (32.5 * this.driver.risk)) / 65));
        //Take into account carThree's speed in case this car needs to slow down
        if (verticalDistance > laneChangeDistance) {
          this.accel = ((this.speed + carThree.speed) * (carThree.speed - this.speed)) / (2 * verticalDistance);
        } else {
          this.accel = (this.laneChange.horizSpeed * (carThree.speed - this.speed)) / laneChangeDistance;
        }
        //Introduce carTwo into the mix
        var carInFront = this.checkSameLane();
        var carTwo = carInFront[0];
        //Calculate the maximum average lane exit velocity for this car
        var maxExitSpeed = carTwo.speed + (this.laneChange.horizSpeed * ((this.vertical - carTwo.vertical - (carTwo.height * (1 + this.driver.risk))) / (carTwo.width * (1 + this.driver.risk))));
        //Calculate maximum acceleration to achieve maxExitSpeed as an average
        var maxAccel = (2 * this.laneChange.horizSpeed) * ((maxExitSpeed - this.speed) / (carTwo.width * (1 + this.driver.risk)));
        //Check the final speed and verify it is not too fast
        var finalSpeed = this.speed + (this.accel * (laneChangeDistance / this.laneChange.horizSpeed));
        if (finalSpeed > (this.driver.maxSpeed + 3)) {
          //Being a little over the max speed isn't too bad
          finalSpeed = this.driver.maxSpeed + 3;
          this.accel = this.laneChange.horizSpeed * (finalSpeed - this.speed) / laneChangeDistance
        }
        //Verify acceleration is not exceeding safe boundaries
        if ((this.accel < maxAccel) && (this.accel > -maxAccel) && (this.accel < 0.3) && (this.accel > -0.5)) {
          //Accept the gap
          this.laneChange.canChangeLanes = true;
          this.laneChange.carFour = undefined;
          this.laneChange.carTwo = carTwo;
          this.info.laneChangeType = "No car behind, initial calculated acceleration worked";
          this.info.carThree = carThree;
        } else if (this.accel > 0) {
          //If the acceleration is postive the lane change should still be doable
          //just need to ramp down the acceleration
          if (maxAccel < 0.3) {
            //If maxAccel was "safe", make sure this car won't go way faster than it wants to
            var speedAfterChange = this.speed + (maxAccel * (laneChangeDistance / this.laneChange.horizSpeed));
            if (speedAfterChange > (this.driver.maxSpeed + 3)) {
              this.accel = (this.driver.maxSpeed + 3 - this.speed) / (laneChangeDistance / this.laneChange.horizSpeed)
            } else {
              this.accel = maxAccel;
            }
          } else {
            //If maxAccel was "unsafe", make sure this car won't go way faster than it wants to
            var speedAfterChange = this.speed + (0.3 * (laneChangeDistance / this.laneChange.horizSpeed));
            if (speedAfterChange > (this.driver.maxSpeed + 3)) {
              this.accel = (this.driver.maxSpeed + 3 - this.speed) / (laneChangeDistance / this.laneChange.horizSpeed)
            } else {
              this.accel = 0.3;
            }
          }
          //Accept the gap
          this.laneChange.canChangeLanes = true;
          this.laneChange.carFour = undefined;
          this.laneChange.carTwo = carTwo;
          this.info.laneChangeType = "No car behind, recalculated positive acceleration worked";
          this.info.carThree = carThree;
        }
      } else {
        //This car is a Semi and just needs to make sure it isn't going to hit carThree
        if (this.speed < carThree.speed) {
          this.accel = 0;
          this.laneChange.canChangeLanes = true;
          this.laneChange.carFour = undefined;
          var carInFront = this.checkSameLane();
          this.laneChange.carTwo = carInFront[0];
          this.info.laneChangeType = "Semi - no car behind";
          this.info.carThree = carThree;
        }
      }
    } else if (carPositionsSorted[0] > /*(this.height + (this.height * this.driver.risk * this.speed / 65) + */this.vertical) {
      //Handle situation where all the cars in the next lane are below this car (no carThree)
      //If the car is too close, reject the lane change
      if (carPositionsSorted[0] < (this.height + (this.height * (this.speed + (32.5 * this.driver.risk)) / 65) + this.vertical)) {
        return;
      }
      var carFour = carsInTargetLane[carPositions.indexOf(carPositionsSorted[0])];
      //Determine where carFour will be after the lane change
      var carFourVertPosiAtClipTime = carFour.vertical + (-carFour.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed));
      //Determine what acceleration this car would need to attain to be safely in front of carFour
      var safeSpot = carFourVertPosiAtClipTime - (this.height * (this.speed + (32.5 * this.driver.risk))/*(1 + (1.75 * this.driver.risk * this.speed*/ / 65);
      var avgSpeed = (this.vertical - safeSpot) / ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed);
      this.accel = ((2 * avgSpeed) - this.speed) / ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed);
      //Determine maxAccel (if applicable)
      var carInFront = this.checkSameLane();
      var carTwo = carInFront[0];
      if (carTwo != undefined) {
        //Calculate the maximum average lane exit velocity for this car
        var maxExitSpeed = carTwo.speed + (this.laneChange.horizSpeed * ((this.vertical - carTwo.vertical - (carTwo.height * (1 + this.driver.risk))) / (carTwo.width * (1 + this.driver.risk))));
        //Calculate maximum acceleration to achieve maxExitSpeed as an average
        var maxAccel = (2 * this.laneChange.horizSpeed) * ((maxExitSpeed - this.speed) / (carTwo.width * (1 + this.driver.risk)));
      } else {
        //maxAccel is not applicable, just set to 0.3
        var maxAccel = 0.3
      }
      //If that acceleration is negative, zero it out
      if (this.accel < 0) {
        this.accel = 0
      }
      if (this.accel < 0.3 && (this.accel < maxAccel)) {
        //Verify that the acceleration is "safe" (not above maxAccel, not above 0.3), then check against this.driver.maxSpeed
        var finalSpeed = this.speed + (this.accel * (laneChangeDistance / this.laneChange.horizSpeed));
        if (finalSpeed < (this.driver.maxSpeed + 3)) {
          //Accept this gap
          this.laneChange.canChangeLanes = true;
          this.laneChange.carFour = carFour;
          this.laneChange.carTwo = carTwo;
          this.info.laneChangeType = "No car in front in target lane, able to beat out carFour";
          this.info.carThree = undefined;
        }
      }
    } else {
      //Need to check for gap acceptance as at least one car is ahead and one car is behind this car in the target lane
      if (!(this.type == "Semi")) { //Handle semis separately
        //There are 4 cars involved in gap acceptance, this car, the car in front of this car,
        //and the 2 cars creating the gap in the target lane
        //For now, carTwo can be identified
        var carInFront = this.checkSameLane();
        var carTwo = carInFront[0];
        //Calculate the maximum average lane exit velocity for this car
        var maxExitSpeed = carTwo.speed + (this.laneChange.horizSpeed * ((this.vertical - carTwo.vertical - (carTwo.height * (1 + this.driver.risk))) / (carTwo.width * (1 + this.driver.risk))));
        //Calculate maximum acceleration to achieve maxExitSpeed as an average
        var maxAccel = (2 * this.laneChange.horizSpeed) * ((maxExitSpeed - this.speed) / (carTwo.width * (1 + this.driver.risk)));
        this.accel = maxAccel;
        //If this car kept this accel for the entire lane change, it would have what speed
        var finalSpeed = this.speed + (this.accel * laneChangeDistance / this.laneChange.horizSpeed);
        //There is a good chance that this finalSpeed is actually much higher then this car's maxSpeed
        if (finalSpeed > (this.driver.maxSpeed + 3)) {
          //Being a little over the max speed isn't too bad
          finalSpeed = this.driver.maxSpeed + 3;
          this.accel = this.laneChange.horizSpeed * (finalSpeed - this.speed) / laneChangeDistance
        }
        //So over the course of the total lane change, the max average velocity would be
        var maxAverageSpeed = (this.speed + finalSpeed) / 2;
        //Dump the variables from the previous calcuations into this car's info
        this.info.maxExitSpeed = maxExitSpeed;
        this.info.maxAccel = maxAccel;
        this.info.maxFinalSpeed = finalSpeed;
        this.info.laneChangeStartHoriz = this.horizontal;
        this.info.laneChangeStartVert = this.vertical;
        //Change this car's horizontal so that checkSameLane can be used to get carThree and carFour
        this.horizStatic = this.horizontal;
        this.horizontal = canChangeToLane;
        //Identify the remaining 2 cars involved in the gap
        carInFront = this.checkSameLane("front");
        var carThree = carInFront[0];
        var carInBack = this.checkSameLane("back");
        var carFour = carInBack[0];
        this.horizontal = this.horizStatic;
        this.horizStatic = 0; //Reset horizStatic
        //Currently check against the new cars being undefined, even tho they shouldn't be
        if (carThree == undefined || carFour == undefined) {
          debugger;
        }
        //If carTwo and carThree are the same car, currently toss out the potential lane change
        //Later a check can be added to ensure that car is far enough ahead
        if (carTwo.name == carThree.name) {
          //Also, make sure that car has the canChangeLanes flag set
          if (!carTwo.laneChange.canChangeLanes)
            debugger;
          return;
        }
        
        
        //With all 4 cars identified, check against the cars to see if an acceptable gap is found
        //y1 + (vy1 * ((x1 - x4) / vx1)) + h1 + g4 < y4 + (vy4 * ((x1 - x4) / vx1))
        //y1 + (vy1 * ((x1 - x3) / vx1)) > y3 + (vy3 * ((x1 - x3) / vx1)) + h3 + g1
        //y1 + (vy1 * ((w2 + g1) / vx1)) > y2 + (vy2 * ((w2 + g1) / vx1)) + h2 + g1
        //While these equations are nice and fancy, they do not take into account
        //speed changes over the course of the lane change
        //vx1 should not be changing, and changes in vy for cars 2, 3 and 4
        //are not normally noticable by this car
        //However, this car will very likely need to change it's own speed to fit in the new lane
        var speedDifference = carFour.speed - this.speed;
        //Start eliminating obvious choices with simple equations
        
        //If the gap is too small, move on to the next
        var minGap = this.height + (2 * this.height * (this.speed + (32.5 * this.driver.risk)) / 65)
        //var minGap = this.height + (1.75 * this.driver.risk * (carThree.height + this.height));
        var currentGap = carFour.vertical - (carThree.vertical + carThree.height);
        if (currentGap < minGap) {
          return;
        }
        
        //Work out some variables for the later equations
        var carFourVertPosiAfter = carFour.vertical + (-carFour.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed));
        var carThreeVertPosiAfter = carThree.vertical + (-carThree.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed));
        
        
        //Special exceptions:
        //The gap is large enough currently, but will it still be after the lane change?
        if ((carFourVertPosiAfter - (carThreeVertPosiAfter + carThree.height)) < minGap) {
          //I'm pretty sure this will get handled some way or another, but I'd like it to spit something out for now
          //after running with this console logging for a bit, the situation was being handled
          //commenting it out currently, but will keep it around as lane changing develops
          //console.log("Gap closing in lane change gap acceptance");
          //console.log([this, carTwo, carThree, carFour]);
        }
        
        //If carThree is slower and carFour is above this car
        if (carThree.speed < this.speed && (carFour.vertical < (this.vertical + this.height))) {
          //This car should just slow down to attempt to match speed so that it lines up with the gap
          //This requires exempting it from the normal proceedings until either it gets lined up or the gap closes
          
          this.exemptions.braking = true;
          this.exemptions.gas = true;
          var speedDifference = this.speed - carThree.speed;
          var distanceInFront = ((((this.vertical - carThree.vertical - carThree.height) / ((this.height + carThree.height) / 2)) / this.driver.risk) * (this.speed / 65)) + ((20 / ((this.height + carThree.height) / 2)) * this.driver.risk);
          brakingHardness = speedDifference / (distanceInFront * this.driver.risk);
          
        }
        
        //Back to general case senario
        //Set results of above equations to boolean variables at first
        var isCarFourGapCurrentSpeed = ((this.vertical + (-this.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed)) + (this.height * (1 + (1.75 * this.driver.risk)))) < carFourVertPosiAfter);
        var isCarFourGapMaxSpeed = ((this.vertical + (-maxAverageSpeed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed)) + (this.height * (1 + (1.75 * this.driver.risk)))) < carFourVertPosiAfter);
        var isCarThreeGapCurrentSpeed = ((this.vertical + (-this.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed))) > (carThreeVertPosiAfter + (carThree.height * (1 + (1.75 * this.driver.risk)))));
        var isCarThreeGapMaxSpeed = ((this.vertical + (-maxAverageSpeed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed))) > (carThreeVertPosiAfter + (carThree.height * (1 + (1.75 * this.driver.risk)))));
        //Determine if the car can possibly fit in the gap at all
        if ((isCarFourGapCurrentSpeed || isCarFourGapMaxSpeed) && (isCarThreeGapCurrentSpeed || isCarThreeGapMaxSpeed)) {
          //If both of those cars have at least 1 true, this car should have a speed that fits nicely
          //To determine what speed (and therefore acceleration) this car should change lanes at
          //a general equation should be used
          //Until that is available, several situations will be checked to see if this car fits one
          
          //If the max acceleration is ideal, no further adjustments are needed
          if (!((finalSpeed <= carThree.speed) && isCarFourGapMaxSpeed && isCarThreeGapMaxSpeed && (this.accel < 0.3) && (this.vertical > carThree.vertical))) {
            //Otherwise, the ideal accel would need to be calculated
            //First solve for the average speed that would place this car right behind carThree
            var snugFitSpeed = (this.laneChange.horizSpeed * (carThree.vertical + (carThree.speed * ((laneChangeDistance - (carThree.width)) / this.laneChange.horizSpeed)) + (carThree.height * (1 + (1.75 * this.driver.risk))))) / (laneChangeDistance - (carThree.width));
            //Verify that this new speed will still fit into the gap in front of carFour
            if ((this.vertical + (-snugFitSpeed * ((laneChangeDistance - (carThree.width)) / this.laneChange.horizSpeed)) + (this.height * (1 + (1.75 * this.driver.risk)))) < carFourVertPosiAfter) {
              //Since it will fit fine, calculate the new acceleration
              var snugFitAccel = (2 * this.laneChange.horizSpeed) * ((snugFitSpeed - this.speed) / (laneChangeDistance - (carThree.width)));
              //If the acceleration is negative, come up with something else
              if (snugFitAccel < 0) {
                //Currently, it may be best to reject the lane change outright
                //There isn't going to be a faster linear acceleration
                return;
              }
              
              
              //Verify the new accel is not higher than the accel calculated earlier
              //and new speed isn't too fast
              if (snugFitAccel < this.accel && ((2 * snugFitSpeed) - this.speed < carThree.speed) && (this.vertical > carThree.vertical)) {
                //Gap works for calculated acceleration
                this.accel = snugFitAccel;
                this.laneChange.canChangeLanes = true;
                this.laneChange.carFour = carFour;
                this.laneChange.carTwo = carTwo;
                this.info.laneChangeType = "Had to check gap, snugFit worked";
                this.info.carThree = carThree;
              } else {
                //snugFit didn't work, try more general approaches, starting with speed matching
                var verticalDistance = (this.vertical - carThree.vertical - carThree.height - (this.height * (this.speed + (32.5 * this.driver.risk)) / 65));
                //Determine acceleration for matching speed of carThree
                if (verticalDistance > laneChangeDistance) {
                  var speedMatchAccel = ((this.speed + carThree.speed) * (carThree.speed - this.speed)) / (2 * verticalDistance);
                } else {
                  var speedMatchAccel = (this.laneChange.horizSpeed * (carThree.speed - this.speed)) / (laneChangeDistance - (carThree.width));
                }
                //Calculate average speed during the lane change with the given acceleration
                var speedMatchAvgSpeed = this.speed + ((speedMatchAccel * (laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed) / 2);
                //Calculate final speed and verify that it is within reason for this car
                var speedMatchFinalSpeed = (2 * speedMatchAvgSpeed) - this.speed;
                //Verify this new average speed will fit between the cars and is "safe"
                var isCarFourGapSpeedMatch = ((this.vertical + (-speedMatchAvgSpeed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed)) + (this.height * (1 + (1.75 * this.driver.risk)))) < carFourVertPosiAfter);
                var isCarThreeGapSpeedMatch = ((this.vertical + (-speedMatchAvgSpeed * ((laneChangeDistance - (carThree.width)) / this.laneChange.horizSpeed))) > (carThreeVertPosiAfter + (carThree.height * (1 + (1.75 * this.driver.risk)))));
                if (speedMatchFinalSpeed > (this.driver.maxSpeed + 3) || (speedMatchFinalSpeed > carThree.speed)) {
                  //Currently, reject this gap. This should change the speedMatchAvgSpeed to be more appropriate
                  
                  
                } else if (isCarFourGapSpeedMatch && isCarThreeGapSpeedMatch && (speedMatchAccel < 0.3) && (speedMatchAccel > -0.5) && (speedMatchAccel < maxAccel) && (this.vertical > carThree.vertical)) {
                  this.accel = speedMatchAccel
                  this.laneChange.canChangeLanes = true;
                  this.laneChange.carFour = carFour;
                  this.laneChange.carTwo = carTwo;
                  this.info.laneChangeType = "had to check gap, speedMatch worked";
                  this.info.carThree = carThree;
                  this.info.verticalDistance = verticalDistance;
                  this.info.speedMatchAccel = speedMatchAccel;
                  this.info.speedMatchAvgSpeed = speedMatchAvgSpeed;
                  this.info.speedMatchFinalSpeed = speedMatchFinalSpeed;
                } else if (isCarFourGapCurrentSpeed && isCarThreeGapCurrentSpeed && (maxAccel > 0)) {
                  //If not changing speed would work, accept the gap with 0 acceleration
                  this.accel = 0;
                  this.laneChange.canChangeLanes = true;
                  this.laneChange.carFour = carFour;
                  this.laneChange.carTwo = carTwo;
                  this.info.laneChangeType = "had to check gap, current speed worked";
                  this.info.carThree = carThree;
                } //Additional senarios can go here with an else
              }
            }
          } else {
            //this.accel has already been set, just need to flag this.laneChange.canChangeLanes
            this.laneChange.canChangeLanes = true;
            this.laneChange.carFour = carFour;
            this.laneChange.carTwo = carTwo;
            this.info.laneChangeType = "had to check gap, maxAccel worked";
            this.info.carThree = carThree;
          }
        }
      } else {
        //Gap acceptance for Semis
        
        //Change this car's horizontal so that checkSameLane can be used to get carThree and carFour
        this.horizStatic = this.horizontal;
        this.horizontal = canChangeToLane;
        //Identify the 2 cars involved in the gap
        carInFront = this.checkSameLane("front");
        var carThree = carInFront[0];
        var carInBack = this.checkSameLane("back");
        var carFour = carInBack[0];
        this.horizontal = this.horizStatic;
        this.horizStatic = 0; //Reset horizStatic
        
        //Currently check against the new cars being undefined, even tho they shouldn't be
        if (carThree == undefined || carFour == undefined) {
          debugger;
        }
        //If carTwo and carThree are the same car, currently toss out the potential lane change
        //Later a check can be added to ensure that car is far enough ahead
        if (carTwo != undefined) {
          if (carTwo.name == carThree.name) {
            //Also, make sure that car has the canChangeLanes flag set
            if (!carTwo.laneChange.canChangeLanes)
              debugger;
            return;
          }
        }
        //A Semi just needs a sizable gap to fit its fat self into
        var carFourVertPosiAfter = carFour.vertical + (-carFour.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed));
        var isCarFourGapCurrentSpeed = ((this.vertical + (-this.speed * ((laneChangeDistance - (carFour.width)) / this.laneChange.horizSpeed)) + (this.height * (1 + (2 * this.driver.risk)))) < carFourVertPosiAfter);
        if ((carThree.vertical + carThree.height + (this.height * (this.speed + (32.5 * this.driver.risk)) / 65) < this.vertical) && (this.speed <= carThree.speed) && (isCarFourGapCurrentSpeed) && (this.vertical > (carThree.vertical + (carThree.height * 2)))) {
          this.accel = 0;
          this.laneChange.canChangeLanes = true;
          this.laneChange.carFour = carFour;
          var carInFront = this.checkSameLane();
          this.laneChange.carTwo = carInFront[0];
          this.info.laneChangeType = "Semi - had to check gap";
          this.info.carThree = carThree;
        }
      }
    }
    //If this car decided it needs to slow down in order to make a lane change, slow it down here
    if (brakingHardness > 0 && !this.laneChange.canChangeLanes) {
      this.applyBrakes(brakingHardness);
    }
    //If this car is able to change lanes, then a few more variables need to be set
    if (this.laneChange.canChangeLanes) {
      //Spit out some info to help troubleshoot any issues
      console.log("Car will now change lanes");
      console.log(this);
      this.info.startedLaneChangeAt = globalFrameCounter;
      //Throw in a debugger in case an unsafe acceleration got through somehow
      if (this.accel > 0.3 || (this.accel < -0.5)) {
        debugger;
      }
      //In case the lane this car wants to be in
      //is different from the lane it can physically change to
      //Set the lane this car can change
      this.laneChange.canChangeToLane = canChangeToLane;
      //Set where this car is coming from
      this.laneChange.leavingLane = this.horizontal;
      //Verify this.laneChange.leavingLane is being assigned an actual lane number
      if (!(this.laneChange.leavingLane == laneOne || (this.laneChange.leavingLane == laneTwo) || (this.laneChange.leavingLane == laneThree))) {
        debugger;
      }
      //Throw in a debugger so that details can be grabbed at the start of a lane change
      //debugger
    }
  }
  
  //Car Function to check the status of the other lanes (Shell for Lane Changing)
  this.checkOtherLanes = function () {
    //What lane is this car in? What even are the other lanes?
    //Make some arrays to sort cars by lane
    var whatIsInLaneOne = Array();
    var whatIsInLaneTwo = Array();
    var whatIsInLaneThree = Array();
    carList.forEach(function (thatCar, carNumber, carList) {
      if (thatCar == undefined)
        return;
      
      //Split up all the cars by lane
      if(thatCar.horizontal == laneOne || (thatCar.laneChange.leavingLane == laneOne) || (thatCar.laneChange.canChangeToLane == laneOne))
        whatIsInLaneOne.push(thatCar);
      if(thatCar.horizontal == laneTwo || (thatCar.laneChange.leavingLane == laneTwo) || (thatCar.laneChange.canChangeToLane == laneTwo))
        whatIsInLaneTwo.push(thatCar);
      if(thatCar.horizontal == laneThree || (thatCar.laneChange.leavingLane == laneThree) || (thatCar.laneChange.canChangeToLane == laneThree))
        whatIsInLaneThree.push(thatCar);
      
    }, this);
    
    //Throw in cars that are changing lanes
    if (this.carX.laneChanging.length > 0) {
      
      
      
      
      
    }
    
    
    
    if (this.horizontal == laneOne) {
      //Our car is in the slow lane, need to hard check middle, but give a fair shake to the fast lane
      //A lot of cars prefer the fast lane, so we don't want to glance at it too lightly
      //If this car is a semi however, it should completely ignore the fast lane
      if (this.type == "Semi") {
        this.checkOtherLanesSpeeds(whatIsInLaneTwo, undefined, laneTwo, undefined);
      } else {
        this.checkOtherLanesSpeeds(whatIsInLaneTwo, whatIsInLaneThree, laneTwo, laneThree);
      }
      
      
      //If one of the lanes was faster than the current lane, this car will want to make
      //a discretionary lane change
      if (this.laneChange.wantsToChangeLanes) {
        this.gapAcceptance(whatIsInLaneTwo);
      }
      
      
    } else if (this.horizontal == laneTwo) {
      //Our car is in the middle lane, need to check fast and slow lanes somewhat equally
      //Weight of each lane will be dependent on what we are passing
      //Passing a semi on the right is bad so we should leave it for the more risky drivers
      //However, a semi should only look at the right most lane
      if (this.type == "Semi") {
        this.checkOtherLanesSpeeds(whatIsInLaneOne, undefined, laneOne, undefined);
      } else {
        this.checkOtherLanesSpeeds(whatIsInLaneThree, whatIsInLaneOne, laneThree, laneOne);
      }
      
      
      
      //Middle lane gap acceptance
      if (this.laneChange.wantsToChangeLanes) {
        //Figure out which lane the car wants to be in and run gap acceptance for that lane
        if (this.laneChange.wantsToBeInLane == laneThree) {
          this.gapAcceptance(whatIsInLaneThree);
        } else if (this.laneChange.wantsToBeInLane == laneOne) {
          this.gapAcceptance(whatIsInLaneOne);
        } else {
          console.log("Middle lane gap acceptance has incorrect lane")
        }
      }
    } else if (this.horizontal == laneThree) {
      //Our car is in the fast lane, need to hard check middle, and glance at slow lane
      this.checkOtherLanesSpeeds(whatIsInLaneTwo, whatIsInLaneOne, laneTwo, laneOne);
      
      
      //Fast lane gap acceptance
      if (this.laneChange.wantsToChangeLanes) {
        this.gapAcceptance(whatIsInLaneTwo);
      }
      
    } else {
      //Our car is not in a lane, maybe on/offramp? or between lanes?
      //If the car is changing lanes, it should not reach this section
      //Looks like it may be suitable for on/offramp merging
      console.log("Car not in a lane for checking other lanes");
      console.log(this);
      return;
    }
  }
  
  //Car function for checking if this car wants to accelerate
  this.checkGasPedal = function () {
    //Set the tailgate flag to false so it can trigger again on it's own if need be
    this.isBehindACar = false;
    //Cycle through the cars to see if any are close enough that we might not want to step on the gas
    var carInFront = this.checkSameLane();
    //If there is no car in front, set distanceInFront to a max amount
    if (carInFront[0] == undefined) {
      var distanceInFront = 10;
    } else {
      //Add some distance if 1 of the cars is a semi
      var testHeight = (this.height + carInFront[0].height) / 2;
      //Make distance a function of car lengths and risk
      var distanceInFront = (carInFront[1] / testHeight) / this.driver.risk;
      //determine if car is comfortably behind a car or not
      if (distanceInFront <= 3.2) {
        this.isBehindACar = true;
      } else if (distanceInFront > 10) {
        //If the car has plenty of space ahead, cap off distance's contribution to acceleration
        distanceInFront = 10;
      }
    }
    //Determine how much faster this car wants to go
    var topSpeedDifference = this.driver.maxSpeed - this.speed
    //Set speed difference to a maximum if it is too high
    if (topSpeedDifference > 5) {
      topSpeedDifference = 5;
    }
    //If this car isn't going top speed, speed it up
    if ((topSpeedDifference > 0) && !this.isBehindACar) {
      //Accel will be different for cars versus semis regardless of risk
      if (this.type == "Semi") {
        this.speed += (distanceInFront + topSpeedDifference) / 20;
      } else {
        this.speed += (distanceInFront + topSpeedDifference) / 15;
      }
      /*
      if (this.frameCounter.gas >= 8) {
        this.speed++;
        this.frameCounter.gas = 0;
      }
      */
    }
    
    //If the calculations put the cars speed over it's max, set it to the max now
    if (this.speed > this.driver.maxSpeed)
      this.speed = this.driver.maxSpeed;
    
  }
  
  //Car function for determining if lane changes need to occur (Shell for Lane Changing)
  this.checkLaneChange = function () {
    //Need to check to see if this car is already somewhere in the process of changing lanes
    //this.laneChange.wantsToChangeLanes being false means starting from the beginning is good
    if (!this.laneChange.wantsToChangeLanes) {
      //For this section to work properly, it needs to be broken up into 3 parts
      //Part 1: Does the car want to change lanes? If yes, we move to part 2
      //Part 2: Is there another lane that is more favorable? If yes, we move to part 3
      //Part 3: Is the car able to change lanes? If yes, we move to part 3
      //Part 4: The actual process of getting the car from 1 lane to another
      //If part 2 is yes but part 3 is no, the car should want to keep wanting to
      //change lanes unless conditions get modified
      
      //Part 1: Does the car want to change lanes?
      
      //Currently, if a car is going the speed it wants to go, they *might* want to change lanes if they feel like they are impeding traffic
      //Later, factors such as wanting to get off the freeway will be included
      if (this.speed == this.driver.maxSpeed) {
        //Handle semis separately
        if (this.type == "Semi" && (this.horizontal == laneTwo)) {
          this.laneChange.wantsToChangeLanes = true;
        } else if (this.horizontal == laneOne) {
          //This car is driving comfortably in the slow lane, let it be for now
          
          this.laneChange.wantsToChangeLanes = false;
          this.laneChange.turnSignal.isActive = false;
        } else {
          //This is where checking for factors like this car impeding traffic would go
          
          
          this.laneChange.wantsToChangeLanes = false;
          this.laneChange.turnSignal.isActive = false;
        }
      } else {
        //So far, our car *might* want to change lanes because something in slowing them down
        if (this.isBehindACar) {
          //Check if this car feels the need to hop over a lane
          this.laneChangePressure();
        } else {
          //For now, we'll assume that since our car is not behind a car, it's comfortably accelerating
          //and doesn't need to change lanes. Later, we still need to check for the offramp
          this.laneChange.wantsToChangeLanes = false;
          this.laneChange.turnSignal.isActive = false;
          
          
          
        }
      }
      
      //Parts 2 & 3: Is there a more favorable lane and is it possible to change lanes
      if (!this.laneChange.wantsToChangeLanes) {
      //If our car doesn't want to change lanes, we aren't going to check if they can
        return;
      } else {
        //We need to check if there is a suitable other lane to change to
        //What defines a suitable lane?
        //Preferrably that would be a lane that going faster than the current one
        this.checkOtherLanes();
        
        
        //Now it may be possible that there is no suitable lane,
        //in which case our car would decide not to change lanes
        //so we need to check if made that decision as well as if the lane change is possible
        if (!this.laneChange.wantsToChangeLanes) {
          return;
        } else if (!this.laneChange.canChangeLanes) {
          //This car checked and still wants to change lanes, but can't find an opening yet
          return;
        } else {
          //Lastly should be the cars that want to and can change lanes
          //This is where
          //Part 3: Actually moving the div into the other lane
          //begins
          //Let the executeLaneChange function handle the movement
          this.executeLaneChange();
          
          
          
          
        }
      }
      //This car already wants to change lanes, did it already decide it could?
    } else if (this.laneChange.canChangeLanes) {
      //Let the executeLaneChange function continue to handle the movement
      this.executeLaneChange();
    } else {
      //This car wants to change lanes, but wasn't able to previously
      //Check to make sure that conditions didn't become favorable enough in
      //this car's original lane (unless an exemption applies, like semis)
      if (this.type != "Semi")
        this.laneChangePressure();
      //If conditions are still unfavorable in this lane, check for an opening again
      if (this.laneChange.wantsToChangeLanes)
        this.checkOtherLanes();
      
      
    }
    
  }
  
  //Function for calculating how complacent this car is in its own lane (Part 1 of Lane Changing)
  this.laneChangePressure = function () {
    //Determine the pressure to go faster by the speed difference and how risky our driver is
    var carInFront = this.checkSameLane();
    //Set 1st test pass flag
    var isNotYetPassed = false;
    //Check if this car has passed the speed pressure test already
    if (!this.laneChange.mayWantToChangeLanes) {
      isNotYetPassed = true;
      this.laneChange.willWantToChangeAt = 99999999;
    }
    
    //Make sure there actually is a car in front of this car
    if (carInFront[0] != undefined) {
      var speedDifference = this.driver.maxSpeed - carInFront[0].speed;
      //The higher the risk value the less likely our car wants to change lanes
      var riskFactor = Math.floor(this.driver.risk * 4);
      var pressure = speedDifference - riskFactor;
      //If this number we just came up with is positive, then there is enough pressure to change lanes
      if (pressure > 0) {
        this.laneChange.mayWantToChangeLanes = true;
      } else {
        this.laneChange.mayWantToChangeLanes = false;
        this.laneChange.wantsToChangeLanes = false;
        this.laneChange.turnSignal.isActive = false;
      }
    } else {
      //No more car in front, no more wanting to change lanes due to pressure
      this.laneChange.mayWantToChangeLanes = false;
      this.laneChange.wantsToChangeLanes = false;
      this.laneChange.turnSignal.isActive = false;
    }
    //If this car just passed the speed pressure test, have it start the time pressure test
    if (isNotYetPassed && this.laneChange.mayWantToChangeLanes) {
      this.laneChange.willWantToChangeAt = globalFrameCounter + Math.floor(framesPerSecond * this.driver.risk);
    } else if (!isNotYetPassed && this.laneChange.mayWantToChangeLanes && (this.laneChange.willWantToChangeAt < globalFrameCounter)) {
      //If it did pass the speed pressure test and time is up on the time pressure test
      //Allow lane change to start
      this.laneChange.wantsToChangeLanes = true;
    }
  }
  
  //Function for handling the actual moving of this car from one lane to another (Part 4 of Lane Changing)
  this.executeLaneChange = function () {
    //Exempt this car from the normal braking and gas functions
    this.exemptions.braking = true;
    this.exemptions.gas = true;
    //Currently this function is purely for troubleshooting
    this.adjustAcceleration();
    //Determine which direction is the car going to be moving
    if ((this.horizontal - this.laneChange.canChangeToLane) > 0) {
      //this.horizontal has a higher numerical value, move to the left by subtracting
      this.horizontal = this.horizontal - this.laneChange.horizSpeed;
      //If this car is going too far or just far enough, reset the variables
      if (this.horizontal <= this.laneChange.canChangeToLane) {
        this.horizontal = this.laneChange.canChangeToLane;
        //Maybe this wasn't the lane that the car wanted to be in
        if (this.laneChange.wantsToBeInLane == this.laneChange.canChangeToLane) {
          //This car wanted to be in this lane and is happy now
          //Archive info for troubleshooting
          this.info.wantsToBeInLane = this.laneChange.wantsToBeInLane;
          this.info.canChangeToLane = this.laneChange.canChangeToLane;
          this.info.leavingLane = this.laneChange.leavingLane;
          //Reset variables
          this.laneChange.wantsToBeInLane = 0;
          this.laneChange.canChangeToLane = 0;
          this.laneChange.leavingLane = 0;
          this.laneChange.canChangeLanes = false;
          //this.accel = undefined;
          //this.laneChange.carFour = undefined;
          //this.laneChange.carTwo = undefined;
          this.laneChange.wantsToChangeLanes = false;
          this.laneChange.mayWantToChangeLanes = false;
          this.exemptions.braking = false;
          this.exemptions.gas = false;
          this.laneChange.turnSignal.isActive = false;
          if (this.isHorizSpeedAdjusted) {
            this.laneChange.horizSpeed = this.horizSpeedStatic;
            this.isHorizSpeedAdjusted = false;
          }
        } else {
          //This car wants to continue changing lanes, but will need to check if there is an opening again
          //Archive info for troubleshooting
          this.info.canChangeToLane = this.laneChange.canChangeToLane;
          this.info.leavingLane = this.laneChange.leavingLane;
          //Reset variables
          this.laneChange.canChangeToLane = 0;
          this.laneChange.leavingLane = 0;
          //this.accel = undefined;
          //this.laneChange.carFour = undefined;
          //this.laneChange.carTwo = undefined;
          this.laneChange.canChangeLanes = false;
          this.exemptions.braking = false;
          this.exemptions.gas = false;
          if (this.isHorizSpeedAdjusted) {
            this.laneChange.horizSpeed = this.horizSpeedStatic;
            this.isHorizSpeedAdjusted = false;
          }
        }
      } else {
        //This car is still in the process of changing lanes
        if (this.accel > 0) { //Handle accel or decel
          //Run applyGas function to maintain lane changing acceleration
          this.applyGas();
        } else if (this.accel < 0) {
          //If this car is slowing down, use applyBrakes
          this.applyBrakes(this.accel);
        }
      }
    } else {
      //this.horizontal has a lower numerical value, move to the right by adding
      this.horizontal = this.horizontal + this.laneChange.horizSpeed;
      if (this.horizontal >= this.laneChange.canChangeToLane) {
        this.horizontal = this.laneChange.canChangeToLane;
        //Maybe this wasn't the lane that the car wanted to be in
        if (this.laneChange.wantsToBeInLane == this.laneChange.canChangeToLane) {
          //This car wanted to be in this lane and is happy now
          //Archive info for troubleshooting
          this.info.wantsToBeInLane = this.laneChange.wantsToBeInLane;
          this.info.canChangeToLane = this.laneChange.canChangeToLane;
          this.info.leavingLane = this.laneChange.leavingLane;
          //Reset variables
          this.laneChange.wantsToBeInLane = 0;
          this.laneChange.canChangeToLane = 0;
          this.laneChange.leavingLane = 0;
          this.laneChange.canChangeLanes = false;
          //this.accel = undefined;
          //this.laneChange.carFour = undefined;
          //this.laneChange.carTwo = undefined;
          this.laneChange.wantsToChangeLanes = false;
          this.laneChange.mayWantToChangeLanes = false;
          this.exemptions.braking = false;
          this.exemptions.gas = false;
          this.laneChange.turnSignal.isActive = false;
          if (this.isHorizSpeedAdjusted) {
            this.laneChange.horizSpeed = this.horizSpeedStatic;
            this.isHorizSpeedAdjusted = false;
          }
        } else {
          //This car wants to continue changing lanes, but will need to check if there is an opening again
          //Archive info for troubleshooting
          this.info.canChangeToLane = this.laneChange.canChangeToLane;
          this.info.leavingLane = this.laneChange.leavingLane;
          //Reset variables
          this.laneChange.canChangeToLane = 0;
          this.laneChange.leavingLane = 0;
          //this.accel = undefined;
          //this.laneChange.carFour = undefined;
          //this.laneChange.carTwo = undefined;
          this.laneChange.canChangeLanes = false;
          this.exemptions.braking = false;
          this.exemptions.gas = false;
          if (this.isHorizSpeedAdjusted) {
            this.laneChange.horizSpeed = this.horizSpeedStatic;
            this.isHorizSpeedAdjusted = false;
          }
        }
      } else {
        //This car is still in the process of changing lanes
        //Run applyGas function to maintain lane changing acceleration
        this.applyGas();
        
        
      }
    }
    if (this.name == "playerCar")
      $("#" + this.name).animate({left: this.horizontal}, 1000 / framesPerSecond, "linear");
    
  }
  
  //Function to turn brake lights on and off
  this.handleBrakeLights = function () {
    //If the car is using the brake pedal, turn the brake lights on
    if (this.braking.isBraking || (this.speed <= 0)) {
      //Trip wasBraking to catch when this car first stops braking hard enough for lights
      this.braking.wasBraking = true;
      //Acquire brake lights as variables
      var brakeLight1 = document.getElementById("brakeLightLeft" + this.name);
      var brakeLight2 = document.getElementById("brakeLightRight" + this.name);
      //Change brake lights to red to indicate that they are on
      brakeLight1.style.backgroundColor = "red";
      brakeLight2.style.backgroundColor = "red";
    } else if (!this.braking.isBraking && this.braking.wasBraking){
      //Reset frameCounter to capture time and wasBraking variable
      this.frameCounter.brake = 0;
      this.braking.wasBraking = false;
    } else {
      //If the car isn't using the brake pedal for long enough, turn the brake lights off
      if (this.frameCounter.brake > 3) {
        //Acquire brake lights as variables
        var brakeLight1 = document.getElementById("brakeLightLeft" + this.name);
        var brakeLight2 = document.getElementById("brakeLightRight" + this.name);
        //Change brake lights to black to indicate that they are off
        brakeLight1.style.backgroundColor = "black";
        brakeLight2.style.backgroundColor = "black";
      }
    }
  }
  
  //Function to handle turn signal lighting
  this.handleTurnSignalLights = function () {
    //On and off dependent on this.driver.turnSignalUsage and this.laneChange.wantsToChangeLanes
    //If the car has a turnSignalUsage of 0, this function has no purpose
    if (this.driver.turnSignalUsage == 0)
      return;
    //Check to see this car is currently in the middle of using the turn signals
    if (this.laneChange.turnSignal.isActive === "failed") {
      //Last time turn signal could have turned on it didn't
      //Could set up a rountine to occasionally check again, however
      //currently leaving it alone, turn signal will stay dark for this event
      
    } else if (this.laneChange.turnSignal.isActive) {
      //Since turn signal is already running, check for blink
      if (this.frameCounter.turnSignal >= (framesPerSecond * .60)) {
        //60% of a second have past since last blink, time to switch
        if (this.laneChange.turnSignal.blink == "off") {
          //If off, turn on
          this.laneChange.turnSignal.blink = "on";
        } else if (this.laneChange.turnSignal.blink == "on") {
          //If on, turn off
          this.laneChange.turnSignal.blink = "off";
        } else {
          //If neither on or off, report an error
          console.log("Invalid blink state detected");
        }
        //Reset frameCounter
        this.frameCounter.turnSignal = 0;
      }
    } else if (!this.laneChange.turnSignal.isActive) {
      //Make sure blink is off
      this.laneChange.turnSignal.blink = "off";
      //Turn signal not currently active, check to see if it needs to be turned on
      if (this.laneChange.wantsToChangeLanes) {
        //Set probability of use
        var probability = 0;
        //turnSignalUsage of 1 is perfect use
        if (this.driver.turnSignalUsage == 1) {
          probability = 10;
        } else if (this.driver.turnSignalUsage == 2) {
          //2 is high chance of use
          probability = 8;
        } else if (this.driver.turnSignalUsage == 3) {
          //3 is medium chance of use
          probability = 5;
        } else {
          //No other choices are currently set up, throw up an error
          console.log("Invalid turnSignalUsage detected");
        }
        //Make a random number to see if the turn signal is going to be used
        var chance = getRandom(1, 10)
        //Check if turn signal was successful
        if (probability >= chance) {
          //Success! Activate the turn signal
          this.laneChange.turnSignal.isActive = true;
          //Determine which side needs to be blinking
          if ((this.horizontal - this.laneChange.wantsToBeInLane) > 0) {
            //this.horizontal has a higher numerical value, left light needs to blink
            this.laneChange.turnSignal.side = "left";
          } else if ((this.horizontal - this.laneChange.wantsToBeInLane) < 0) {
            //this.horizontal has a lower numerical value, right light needs to blink
            this.laneChange.turnSignal.side = "right";
          } else {
            //No other valid situations should exist, throw an error
            console.log("Invalid this.horizontal to this.laneChange.wantsToBeInLane ratio in turn signal");
          }
        } else if (probability < chance) {
          //Fail out the turn signal
          this.laneChange.turnSignal.isActive = "failed";
        } else {
          //No other options should be valid, throw an error
          console.log("Invalid probability vs chance result in turn signal");
        }
      }
    } else {
      //this.laneChange.turnSignal.isActive can't be anything else, throw an error
      console.log("Invalid this.laneChange.turnSignal.isActive state");
    }
    //Actually handle turn signal light color, depending on blink state
    if (this.laneChange.turnSignal.blink == "off") {
      //Since blink is off, the side blinking doesn't matter
      var turnLight1 = document.getElementById("turnSignalLightLeft" + this.name);
      var turnLight2 = document.getElementById("turnSignalLightRight" + this.name);
      //Change turn signal lights to black to indicate that they are off
      turnLight1.style.backgroundColor = "black";
      turnLight2.style.backgroundColor = "black";
    } else if (this.laneChange.turnSignal.blink == "on") {
      //Check which side needs to light up
      if (this.laneChange.turnSignal.side == "left") {
        //Left side light turns on (yellow)
        var turnLight1 = document.getElementById("turnSignalLightLeft" + this.name);
        turnLight1.style.backgroundColor = "yellow";
      } else if (this.laneChange.turnSignal.side == "right") {
        //Right side light turns on (yellow)
        var turnLight2 = document.getElementById("turnSignalLightRight" + this.name);
        turnLight2.style.backgroundColor = "yellow";
      } else {
        //Side is neither left nor right, spit out an error
        console.log("Invalid side detected for turn signal light");
      }
    } else {
      console.log("Invalid blink state detected 2");
    }
    
  }
  
  //Sense other cars and actions started by them and react to them if needed
  this.senseOthers = function () {
    //New variables to track reactions, reset to allow tripping again
    this.isReacting = false;
    this.reactionType = 0;
    /*
    This function is likely to pull a lot of different duties
    Likely duties include: turn signal detection, lane changing detection,
    cop car detection (both of cops and for cops), general locations of surrounding vehicles,
    merging detection, etc.
    The driver.attentive variable should play into how successful this function is
    */
    //Start off with lane changing detection
    //See if any cars are changing lanes
    var isAnyoneChangingLanes = dumpStat("laneChange.canChangeLanes");
    if (isAnyoneChangingLanes.indexOf(true) >= 0) {
      //============================================================
      //Note: there may be more than 1 car changing lanes at a time
      //============================================================
      //Some car is changing lanes, cycle through the new array to check
      isAnyoneChangingLanes.forEach(function (thatCar, carNumber, isAnyoneChangingLanes) {
        //The code in those loop should only be triggered by a true
        if (thatCar) {
          thatCar = carList[carNumber];
          //If the car being checked is the one that triggered this function, no need to continue
          if (this.name == thatCar.name)
            return;
          
          //Sometimes carFour is not defined in the lane change
          if (!(thatCar.laneChange.carFour == undefined)) {
            //Otherwise, check if the new car is in a position where a reaction needs to take place
            //The car changing lanes also already labelled 2 cars as being in the need-to-know category
            if (this.name == thatCar.laneChange.carFour.name) {
              //This car will end up behind the car changing lanes once it is done
              //Let the braking function handle the transition as a carX
              this.carX.braking[0] = thatCar;
              this.isReacting = true;
              this.wasReacting = true;
              
              /*
              //Another check needs to be done to see if this car needs to make any changes
              if (false) {
                
                //At this point, the car is going to react, prevent normal brake/gas handling
                
                
                this.exemptions.braking = true;
                this.exemptions.gas = true;
                
                //Reaction should vary depending on exact positioning and speeds
                //Car1 = this, Car2 = thatCar
                //Factors: Car1's speed and vertical position, 
                //Car2's vertical and horizontal positions, vertical and horizontal speeds
                //Turn it into a word problem
                //Car1 is at y vertical position in its lane w going j ppf,
                //Car2 is coming into Car1's lane, and is currently at x horizontal position
                //and z vertical position. Car2 is going k ppf down the freeway and moving l ppf horizontally
                //How does Car1 need to adjust it's speed to ensure Car2 does not hit it?
                //
                if (this.vertical < (carList[carNumber] )) {
                  
                }
              }
              */
              
            }
          } else if ((this.horizontal == thatCar.laneChange.canChangeToLane && (this.vertical > thatCar.vertical)) ) {
            //In the event that this car is going to be right behind the car changing lanes
            //but it didn't get flagged as carFour, a manual check needs to be done
            var carInFront = this.checkSameLane();
            if (carInFront[1] > (this.vertical - thatCar.vertical - (thatCar.height * (this.speed + (32.5 * this.driver.risk))/*(1 + (1.75 * this.driver.risk * this.speed*/ / 65))) {
              this.carX.braking[0] = thatCar;
              this.isReacting = true;
              this.wasReacting = true;
            }
          }
          //Sometimes carTwo is undefined as well
          if (!(thatCar.laneChange.carTwo == undefined)) {
            if (this.name == thatCar.laneChange.carTwo.name) {
              //This car is in front of the car changing lanes in the original lane
              
              //Currently, this car should not try to also change lanes if it was thinking about it
              if (this.laneChange.canChangeLanes == false) {
                //This car is not already changing lanes
                this.isReacting = true;
                this.wasReacting = true;
                this.reactionType = 3;
                this.laneChange.wantsToChangeLanes = false;
                this.exemptions.laneChange = true;
              }
            }
          }
          //Determine if this car needs to take the changing lanes car into account despite not being identified
          //this.carX.laneChanging.push(thatCar);
          //this.carX.laneChanging.push(thatCar.laneChange.canChangeToLane);
          
          
          
          
          
          
        }
      }, this);
      
      
    }
    //Check for cars that have their turn signal on to see if allowing them entry into the lane is worthwhile
    var isAnyoneTurnSignalOn = dumpStat("laneChange.turnSignal.isActive");
    if (isAnyoneTurnSignalOn.indexOf(true) >= 0) {
      isAnyoneTurnSignalOn.forEach(function (thatCar, carNumber, isAnyoneTurnSignalOn) {
        //The follow section should only trigger if a turn signal is on, but that car hasn't started changing lanes yet
        if (thatCar && !isAnyoneChangingLanes[carNumber]) {
          thatCar = carList[carNumber];
          //If the car being checked is the one that triggered this function, no need to continue
          if (this.name == thatCar.name)
            return;
          //Set the car being checked to the lane it want to move to
          thatCar.horizStatic = thatCar.horizontal;
          if (thatCar.horizontal == laneTwo) {
            thatCar.horizontal = thatCar.laneChange.wantsToBeInLane;
          } else {
            thatCar.horizontal = laneTwo;
          }
          //Determine what car is 
          var carInBack = thatCar.checkSameLane("back");
          var affectedCar = carInBack[0];
          //Set thatCar's horizontal back to what it actually is
          thatCar.horizontal = thatCar.horizStatic;
          this.horizStatic = 0; //Reset horizStatic
          //Check if there is an affected car
          if (affectedCar == undefined) {
            //Skip this car
            return;
          }
          if (this.name == affectedCar.name) {
            //Check if this is the affected car
            //Code for reacting to turn signals goes here
            
            /*This car could react in 4 different ways
            No reaction - this car completely ignores the other car and keeps going normally
            Speed up - this car increases its speed to ensure getting in front of the other car
            Slow down - this car decreases its speed to allow the other car to get in front of it
            Change lanes - this car may not be able to get past the other car but doesn't want to
            remain behind it so this car tries to jump into the next lane
            */
            
            
          }
          
        }
      }, this);
    }
    
    
    
    
    
    
    //Check to see if this car was reacting to something but no longer is
    if (this.wasReacting && !this.isReacting) {
      //Reset possible affected variables
      this.wasReacting = false;
      this.exemptions.braking = false;
      this.exemptions.gas = false;
      this.exemptions.laneChange = false;
      this.carX.braking = [];
      this.carX.laneChanging = [];
    } else if (this.isReacting) {
      //This car is still reacting, make sure exemptions are still in place
      if (this.reactionType == 0) {
        //0 = no reaction type set, throw a console message
        //console.log(this.name + " is reacting with no reactionType set")
      } else if (this.reactionType == 1) {
        
      } else if (this.reactionType == 3) {
        //3 = laneChange exemption
        this.exemptions.laneChange = true;
      }
      
    }
  }
  
}




$(document).ready(function() {
  //Initiate variables
  var carSpace = this.getElementById("drivingSpace"); //This is where all the cars will go on the page
  //Set the view to the middle of the playable area
  function setScroll() {
    window.scrollTo(0, (carSpace.clientHeight - window.innerHeight) / 2);
  }
  //Draw the lane lines whenever they need to be drawn
  function drawLaneLines(movement) {
    movement = 0 || Math.floor(movement);
    var freewaySpace = document.getElementById("freeway");
    //Variable for how long the white lines are
    var laneLineHeight = 10;
    if (document.getElementById("lanelines") == undefined) {
      //Variables to change how and where the lines appear
      var laneWidth = freewaySpace.clientWidth * .3;
      var laneShoulderWidth = freewaySpace.clientWidth * .05;
      var laneLineDivHeight = window.innerHeight + (laneLineHeight * 12);
      //The Lines will be set up in this variable to ensure they are fully set up prior to adding to the freeway
      var theLines = '<div id="lanelines" style="position: fixed;top: ' + (- (laneLineHeight * 10)) + 'px;width: ';
      theLines += freewaySpace.clientWidth + 'px;height: ';
      theLines += laneLineDivHeight + 'px;"><table>';
      //This for loop makes lines from just above the viewable area to just below it
      for (var i = 1; i < (laneLineDivHeight / (laneLineHeight * 2)); i++) {
        //First row in loop has a right white border on every cell (except for the last one)
        theLines += '<tr style="height: ' + laneLineHeight + 'px;"><td style="width: ';
        theLines += laneShoulderWidth + 'px;border-right-width: 2px;border-style: none;border-right-style: solid;border-color: white;"></td><td style="width: ';
        theLines += laneWidth + 'px;border-right-width: 2px;border-style: none;border-right-style: solid;border-color: white;"></td><td style="width: ';
        theLines += laneWidth + 'px;border-right-width: 2px;border-style: none;border-right-style: solid;border-color: white;"></td><td style="width: ';
        theLines += laneWidth + 'px;border-right-width: 2px;border-style: none;border-right-style: solid;border-color: white;"></td><td style="width: ';
        theLines += laneShoulderWidth + 'px;"></td></tr>';
        //Second row in loop has a right white border only for the shoulders of the freeway
        theLines += '<tr style="height: ' + laneLineHeight + 'px;"><td style="width: ';
        theLines += laneShoulderWidth + 'px;border-right-width: 2px;border-style: none;border-right-style: solid;border-color: white;"></td><td style="width: ';
        theLines += laneWidth + 'px;"></td><td style="width: ';
        theLines += laneWidth + 'px;"></td><td style="width: ';
        theLines += laneWidth + 'px;border-right-width: 2px;border-style: none;border-right-style: solid;border-color: white;"></td><td style=width: ';
        theLines += laneShoulderWidth + 'px;"></td></tr>'
      }
      theLines += '</table></div>'
      freewaySpace.innerHTML = theLines;
    } else {
      
      //Commenting out the lane line movement section for now, will need rework later
      //If there is no movement then we aren't moving the lane lines
      if (movement <= 0)
        return;
      /*
      //Init some variables to assist with facilitating moving the lane lines
      var laneLinesDiv = document.getElementById("lanelines");
      var laneLinesDivTop = laneLinesDiv.offsetTop;
      var remainder = Math.abs(((-(laneLineHeight * 10)) + laneLinesLeftOvers) - laneLinesDivTop);
      //Determine how much the lane lines need to be off to keep them looking the same
      remainder = Math.round(/*(laneLineHeight * 2) - *//*(remainder % (laneLineHeight * 2));
      if (remainder == 20) {
        remainder = 0;
      }
      var currentLaneLinesDivTop = -(laneLineHeight * 10) + remainder;
      //Set the place the lane lines will move to on this frame
      var nextLaneLinesDivTop = currentLaneLinesDivTop + movement;
      currentLaneLinesDivTop = currentLaneLinesDivTop.toString() + "px";
      nextLaneLinesDivTop = nextLaneLinesDivTop.toString() + "px";
      //Set the left over variable for the next frame
      laneLinesLeftOvers = remainder;
      //Reset the lane line div to the original starting location minus the offset
      $("#lanelines").css("top", currentLaneLinesDivTop);
      
      //Move the lane lines the requested number of pixels
      $("#lanelines").animate({top: nextLaneLinesDivTop}, 1000 / framesPerSecond, "linear");
      */
      
      //Make the lane lines move 1 pixel per ms
      var laneLineMovement = (-(laneLineHeight * 10) + framesPerSecond)
      if ((globalFrameCounter % 2) != 0) {
        $("#lanelines").css("top", -(laneLineHeight * 10));
      } else {
        $("#lanelines").animate({top: laneLineMovement}, 1000 / framesPerSecond, "linear");
      }
      
    }
  }
  
  setScroll();
  drawLaneLines();
  //Determine current lane position values
  whereAreLanes();
  
  //Need to spawn cars
  //Start with making the player car
  var playerCar = new Car("playerCar", "Player");
  //Add the player car to the list of cars in the first position
  carList[0] = playerCar;
  
  //Function checks to see if cars need to be removed or added
  function checkNPC() {
    //Goes through each of the cars to see if they are too far ahead or behind
    carList.forEach(function (thisCar, carNumber, carList) {
      if (carNumber == 0 || thisCar == undefined) {
        return;
      }
      if ((((thisCar.vertical < - (document.scrollingElement.scrollTop + thisCar.height)) && (thisCar.speed > carList[0].speed)) || ((thisCar.vertical > ((document.scrollingElement.clientHeight + document.scrollingElement.scrollTop) + thisCar.height)) && (thisCar.speed < carList[0].speed))) && !suspendRemoveNPC) {
        removeNPC(carNumber);
      }
    });
    //If there are too few cars, definately spawn one
    if (numNPCs < 5) {
      spawnNPC();
    } else if (numNPCs < maxNPCs) {
      //If there are some cars, maybe spawn another
      var spawnChance = getRandom(1, numNPCs);
      if (spawnChance < 3)
        spawnNPC();
    }
  }
  //Function to remove defunct cars
  function removeNPC(whichCar) {
    //Reduce number of NPCs on the field by 1
    numNPCs--;
    //Delete the graphical represation of the car
    carSpace.removeChild(document.getElementById(carList[whichCar].name));
    //Delete the rest of the car from the list
    carList[whichCar] = undefined;
  }
  //Make more cars
  function spawnNPC () {
    //Increase the number of NPCs by 1
    numNPCs++;
    //Init variable to hold which spot the new NPC will go
    var nextNPC = 0;
    //See if there is maybe a free spot available in the list to put this car in
    for (var i = 1; i < carList.length; i++) {
      if (carList[i] == undefined) {
        nextNPC = i;
        break;
      }
    }
    //If no spots were available, then the car is going at the end of the list
    if (nextNPC == 0)
      nextNPC = carList.length;
    //Start making the car
    carList[nextNPC] = "Car" + nextNPC;
    //Determine the type of car to make
    var typeDecider = getRandom(1, 100);
    if (typeDecider <= 92) {
      //Make a Normal Car
      carList[nextNPC] = new Car(carList[nextNPC], "Normal");
    } else if (typeDecider <= 94) {
      //Make a Fast Car
      carList[nextNPC] = new Car(carList[nextNPC], "Fast");
    } else if (typeDecider <= 99) {
      //Make a Semi
      carList[nextNPC] = new Car(carList[nextNPC], "Semi");
    } else if (typeDecider == 100) {
      //Make a Cop Car
      carList[nextNPC] = new Car(carList[nextNPC], "Cop");
    }
    
  }
  checkNPC();
  //This is the function designed to keep everything going, this game's literal engine
  function engine() {
    //If the game hasn't started yet and there are less than 6 cars on the road, make more cars
    if (!isStarted && carList.length < 6) {
      checkNPC();
    } else if (!isStarted && carList.length >= 6) {
      //If the game hasn't started yet and there are at least 6 cars on the road, start the game
      isStarted = true;
    }
    //If the game has started, then it's time to do engine things
    if (isStarted && !suspendEngine && !suspendEngineAsWell) {
      //Add 1 to the globalFrameCounter
      globalFrameCounter++;
      //Still need to see if NPCs need to be removed or added
      checkNPC();
      //Need to run through each of the cars and let them do their things
      carList.forEach(function (thisCar, carNumber, carList) {
        //If empty, skip
        if (thisCar == undefined)
          return;
        //Invoke the car's individual engine
        thisCar.carEngine();
        //Need to move all the cars based their speed in relation to the player car
        //Skip the player car because it doesn't move vertically
        if (carNumber == 0)
          return;
        var speedDifference = thisCar.speed - carList[0].speed;
        thisCar.vertical = thisCar.vertical - speedDifference;
        $("#" + thisCar.name).animate({top: thisCar.vertical, left: thisCar.horizontal}, 1000 / framesPerSecond, "linear");
      });
      //Move the lane lines here
      drawLaneLines(carList[0].speed);
    }
    //With this function being the engine and all, it needs to be able to keep itself running
    setTimeout(engine, 1000 / framesPerSecond);
  }
  engine();
  
  //Setting up some crude user interaction for troubleshooting purposes
  window.onkeydown = function (e) {
    //Set up a handler for the down and up arrows
    //keycodes: up = 38; down = 40
    if (e.keyCode == 40) {
      //When the down arrow is pressed, shift everything up so that what is going on
      //below the player car can be seen
      //Suspend the game engine until the adjustments to positions are made
      suspendEngine = true;
      //If the player car is in the normal position, proceed with moving all the cars
      if (carList[0].vertical == carList[0].verticalStatic) {
        //Cycle through all the cars
        carList.forEach(function (thisCar, carNumber, carList) {
          //Ignore cars that don't exist
          if (thisCar == undefined)
            return;
          thisCar.vertical = thisCar.vertical - window.innerHeight;
          $("#" + thisCar.name).css("top", thisCar.vertical);
        });
      }
      //Change window position and prevent cars from being removed for the duration of the button being held down
      window.scrollTo(0, ((carSpace.clientHeight - window.innerHeight) / 2) - window.innerHeight);
      suspendRemoveNPC = true;
      //Renable the game engine
      suspendEngine = false;
    } else if (e.keyCode == 38) {
      //When the up arrow is pressed, shift everything down so that what is going on
      //above the player car can be seen
      //Suspend the game engine until the adjustments to positions are made
      suspendEngine = true;
      //If the player car is in the normal position, proceed with moving all the cars
      if (carList[0].vertical == carList[0].verticalStatic) {
        //Cycle through all the cars
        carList.forEach(function (thisCar, carNumber, carList) {
          //Ignore cars that don't exist
          if (thisCar == undefined)
            return;
          thisCar.vertical = thisCar.vertical + window.innerHeight;
          $("#" + thisCar.name).css("top", thisCar.vertical);
        });
      }
      //Change window position and prevent cars from being removed for the duration of the button being held down
      window.scrollTo(0, ((carSpace.clientHeight - window.innerHeight) / 2) + window.innerHeight);
      suspendRemoveNPC = true;
      //Renable the game engine
      suspendEngine = false;
    } else if (e.keyCode == 83) {
      //When "s" is pressed, set up a wall of stopped cars up ahead
      for (var i = 1; i <= 3; i++) {
        carList.push("CarTest" + i.toString());
        carList[carList.length - 1] = new Car(carList[carList.length - 1], "Test" + i.toString());
      }
    } else if (e.keyCode == 71) {
      //When "g" is pressed, remove the wall of cars (if it was previously set up)
      if (carList[carList.length -1] != undefined) {
        if (carList[carList.length -1].name == "CarTest3") {
          carList.pop();
          carSpace.removeChild(document.getElementById("CarTest3"));
          carList.pop();
          carSpace.removeChild(document.getElementById("CarTest2"));
          carList.pop();
          carSpace.removeChild(document.getElementById("CarTest1"));
        }
      }
    } else if (e.keyCode == 80) {
      //When "p" is pressed, pause/unpause the engine
      suspendEngineAsWell = !suspendEngineAsWell;
    }
  }
  window.onkeyup = function (e) {
    //Set up handlers to undo what onkeydown does
    if (e.keyCode == 40) {
      //down arrow released, move everything back down
      //Suspend the game engine until the adjustments to positions are made
      suspendEngine = true;
      //If the player car is not in the normal position, proceed with moving all the cars
      if (!(carList[0].vertical == carList[0].verticalStatic)) {
        //Cycle through all the cars
        carList.forEach(function (thisCar, carNumber, carList) {
          //Ignore cars that don't exist
          if (thisCar == undefined)
            return;
          thisCar.vertical = thisCar.vertical + window.innerHeight;
          $("#" + thisCar.name).css("top", thisCar.vertical);
        });
      }
      //Change window position and prevent cars from being removed for the duration of the button being held down
      window.scrollTo(0, (carSpace.clientHeight - window.innerHeight) / 2);
      suspendRemoveNPC = false;
      //Renable the game engine
      suspendEngine = false;
    } else if (e.keyCode == 38) {
      //up arrow released, move everything back up
      //Suspend the game engine until the adjustments to positions are made
      suspendEngine = true;
      //If the player car is not in the normal position, proceed with moving all the cars
      if (!(carList[0].vertical == carList[0].verticalStatic)) {
        //Cycle through all the cars
        carList.forEach(function (thisCar, carNumber, carList) {
          //Ignore cars that don't exist
          if (thisCar == undefined)
            return;
          thisCar.vertical = thisCar.vertical - window.innerHeight;
          $("#" + thisCar.name).css("top", thisCar.vertical);
        });
      }
      //Change window position and prevent cars from being removed for the duration of the button being held down
      window.scrollTo(0, (carSpace.clientHeight - window.innerHeight) / 2);
      suspendRemoveNPC = false;
      //Renable the game engine
      suspendEngine = false;
    }
  }
  
});


