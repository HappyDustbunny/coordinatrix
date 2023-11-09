// MIT License
//
// Copyright (c) 2022 Mads Bendix Horn
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

let userID = '';
let eventID = '';
let myID = '';
let eventsIFollow = [];
let uniqueIdList = []; // Used by the class DateSuggestion only
let suggestedDateList = [];

let weekDays = ['Søn', 'Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør'];
let debugVar1;


document.getElementById('inviteOthers').addEventListener('click', inviteOthers);
document.getElementById('dates').addEventListener('click', function(event) { dateHasBeenClicked(event); }, true);
document.getElementById('suggestDate').addEventListener('click', suggestDate);
document.getElementById('newEvent').addEventListener('click', newDateSuggestion);


class Event {
  constructor(eventID, eventName, participants, suggestedDateList) {
    this.eventID = eventID;
    this.eventName = eventName;
    this.participants = participants;
    this.suggestedDateList = suggestedDateList;
  }
}


class Datesuggestion {
    constructor(date, location, participants) {
        this.date = date;
        this.location = location;
        this.participants = participants;
        this.uniqueID = this.giveAUniqueId();
    }

    giveAUniqueId() {
      let tryAgain = false;
      let uniqueId = 0;
      do {
        tryAgain = false;
        uniqueId = Math.floor(Math.random() * 100000);
        for (const [index, id] of uniqueIdList.entries()) {
          if (uniqueId.toString() === id.toString()) {
            tryAgain = true;
            break;
          }
        }
      }
      while (tryAgain);
  
      uniqueIdList.push(uniqueId);
      return uniqueId;
    }
}


// Runs when the page is loaded:
function setUpFunc() {
  debugExample();

  checkLocalStorageAndChooseWelcome();

  getMyEventsFromServer();

  fillInDates();
}


function checkLocalStorageAndChooseWelcome() {
  if (localStorage.eventsIFollow) {
    eventsIFollow = localStorage.eventsIFollow;
    myID = localStorage.myID;
  }
}


function fillInDates() {
  for (const [index, dateSuggestion] of suggestedDateList.entries()) {
    let newNode = document.createElement('div');
    newNode.classList.add('suggestedDate')

    let newButton = document.createElement('button');
    newButton.setAttribute('id', dateSuggestion.uniqueID);
    newButton.classList.add('date')
    
    let thisDate = dateSuggestion.date;
    let dateText = weekDays[thisDate.getDay()] + ' ' + thisDate.getDate() + '/' + (thisDate.getMonth() + 1) + 
    ' kl ' + thisDate.getHours();
    let textNode = document.createTextNode(dateText);
    newButton.appendChild(textNode);
    newNode.appendChild(newButton);
    
    let noButton = document.createElement('button');
    noButton.setAttribute('id', 'n' + dateSuggestion.uniqueID);
    noButton.classList.add('red');
    noButton.classList.add(dateSuggestion.uniqueID);
    let yesText = document.createTextNode('Deltager ikke');
    noButton.appendChild(yesText);
    newNode.appendChild(noButton);
    
    // let maybeButton = document.createElement('button');
    // maybeButton.classList.add('yellow');
    // let maybeText = document.createTextNode('Kan måske');
    // maybeButton.appendChild(maybeText);
    // newNode.appendChild(maybeButton);
    
    let yesButton = document.createElement('button');
    yesButton.setAttribute('id', 'y' + dateSuggestion.uniqueID);
    yesButton.classList.add('green');
    yesButton.classList.add(dateSuggestion.uniqueID);
    let noText = document.createTextNode('Deltager');
    yesButton.appendChild(noText);
    newNode.appendChild(yesButton);

    document.getElementById('dates').insertAdjacentElement('beforeend', newNode);
  }
}


function inviteOthers() {
}


function dateHasBeenClicked(event) {
    let myDateID = event.target.id;
    console.log(myDateID);
    let firstCharInID = myDateID.substring(0, 1);
    if (isNaN(firstCharInID)) {  // If not date button (I.e. Yes or No button)
      for (const [index, dateSuggestion] of suggestedDateList.entries()) {
        if (dateSuggestion.uniqueID === Number(myDateID.substring(1, 10)) && firstCharInID === 'y') {
          dateSuggestion.participants = 'Yes';
          document.getElementById(myDateID).style.backgroundColor = 'green';
          document.getElementById('n' + myDateID.substring(1, 10)).style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
          console.log('Yes');
        } else if (dateSuggestion.uniqueID === Number(myDateID.substring(1, 10)) && firstCharInID === 'n') {
          dateSuggestion.participants = 'No';
          document.getElementById(myDateID).style.backgroundColor = 'red';
          document.getElementById('y' + myDateID.substring(1, 10)).style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
          console.log('No');
        }
      }
    }  else {
      showParticipants();
    }
}


function showParticipants() {
  console.log('Show participants');
}


function suggestDate() {
}


function newDateSuggestion() {
}

// ****************  Debugging tools  ***************

function debugExample() {
  suggestedDateList.push(new Datesuggestion(new Date(2023, 10, 10, 13, 0), 'Bøgevangen 42', 'Kamilla'));
  suggestedDateList.push(new Datesuggestion(new Date(2023, 10, 11, 13, 0), 'Bøgevangen 42', 'Kurt'));
  debugVar1 = new Event('SXGYDS', 'Dronninglund Brætspilsklub', ['Karen', 'Kurt', 'Kamilla', 'Knud'], suggestedDateList);
}