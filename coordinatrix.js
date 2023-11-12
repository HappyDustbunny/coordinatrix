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
let changeHasOccured = false;
let eventsIFollow = [];
let uniqueIdList = []; // Used by the class DateSuggestion only
let suggestedDateList = [];

let weekDays = ['Søn', 'Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør'];
let currentEvent;


document.getElementById('howToUse').addEventListener('click', function(event) {unfold(event); }, true);
document.getElementById('pris').addEventListener('click', function(event) {unfold(event); }, true);
document.getElementById('cookies').addEventListener('click', function(event) {unfold(event); }, true);

document.getElementById('inviteOthers').addEventListener('click', inviteOthers);

document.getElementById('dates').addEventListener('click', function(event) { dateHasBeenClicked(event); }, true);

// document.getElementById('suggestDate').addEventListener('click', suggestDate);
document.getElementById('suggestEventDate').addEventListener('click', suggestDate);
document.getElementById('newDates').addEventListener('click', function(event) { newDateHasBeenClicked(event); }, true);
document.getElementById('makeEvent').addEventListener('click', makeEvent)


document.getElementById('datePicker').addEventListener('change', function() { changeHasOccured = true; })
document.getElementById('timePicker').addEventListener('change', function() { changeHasOccured = true; })
document.getElementById('location').addEventListener('change', function() { changeHasOccured = true; })

document.getElementById('newEvent').addEventListener('click', newEventSuggestion);
document.getElementById('makeYourOwnEvent').addEventListener('click', newEventSuggestion);


class Event {
  constructor(eventID, eventName, location, participants, suggestedDateList) {
    this.eventID = eventID;
    this.eventName = eventName;
    this.location = location;
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
    document.getElementById('datePicker').value = '';
    document.getElementById('timePicker').value = '12:00';
    document.getElementById('location').value = '';
    checkLocalStorageAndChooseWelcome();
}


function checkLocalStorageAndChooseWelcome() {
  if (location.hash || localStorage.eventsIFollow) {  // ToDo: Should this be two checks? Or is last check superflous?
    eventsIFollow = localStorage.eventsIFollow;
    myID = localStorage.myID;
    
    document.getElementById('frontPage').hidden = true;
    document.getElementById('dateContainer').hidden = false;
    
    getMyEventsFromServer(location.hash);
    
    fillInDates();
  } else {
    document.getElementById('frontPage').hidden = false;
    document.getElementById('dateContainer').hidden = true;
  }
}


function getMyEventsFromServer(hash) {
  debugExample(hash);  // ToDo: Fix real function
}

function fillInDates() {
  // Insert eventname as header
  let headerText = document.createTextNode(currentEvent.eventName);
  document.getElementById('dateHeader').appendChild(headerText);
  
  // Fill in dates and participants
  for (const [index, dateSuggestion] of suggestedDateList.entries()) {
    let newNode = document.createElement('div');
    newNode.classList.add('suggestedDate');
    
    let newButton = document.createElement('button');
    newButton.setAttribute('id', dateSuggestion.uniqueID);
    newButton.classList.add('date');
    
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
    
    let participantList = document.createElement('div');
    participantList.classList.add('participantList');
    participantList.setAttribute('id', 'part' + dateSuggestion.uniqueID);
    
    document.getElementById('dates').insertAdjacentElement('beforeend', newNode);
    document.getElementById('dates').insertAdjacentElement('beforeend', participantList);
  }
}


function inviteOthers() {
}


function unfold(event) {  // Toggle button visibility on Frontpage
  let buttonID = event.target.id;
  
  document.getElementById(buttonID + 'Text').hidden = !(document.getElementById(buttonID + 'Text').hidden);
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
      showParticipants(myDateID);
    }
  }
  
  
  function showParticipants(myDateID) {
    if (document.getElementById('part' + myDateID).hasChildNodes()) {
      let element = document.getElementById('part' + myDateID);
      while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
      }
    } else {
      for (const [index, dateSuggestion] of suggestedDateList.entries()) {
      if (dateSuggestion.uniqueID === Number(myDateID)) {
        let myParticipantList = dateSuggestion.participants;
        for (const [index, participant] of myParticipantList.entries()) {
          let newNode = document.createElement('p');
          let thisText = document.createTextNode(participant);
          newNode.appendChild(thisText);
          
          document.getElementById('part' + myDateID).insertAdjacentElement('beforeend', newNode);
        }
        console.log('Show participants');
        break;
      }
    }
  }
}



function newEventSuggestion() {
  document.getElementById('frontPage').hidden = true;
  document.getElementById('newEventContainer').hidden = false;
}


function makeEvent() {  // ToDo: Give options to allow participants to invite others OR propose new dates OR neither
  let name = document.getElementById('eventName').value;
  if (name && suggestedDateList) {
    let thisID = new Date().getTime();
    let eventName = document.getElementById('eventName').value;
    let location = document.getElementById('location').value;
    location = location.charAt(0).toUpperCase() + location.slice(1);  // Make first letter uppercase
    let thisEvent = new Event(thisID, eventName, location, [], suggestedDateList);
    eventsIFollow.push(thisEvent);
  
    sendToServerAndUpdateLocalStorage();

    document.getElementById('newEventContainer').hidden = true;
    document.getElementById('dateContainer').hidden = false;  // ToDo: Update dateContainer-view to show all events and move the invite-others-button to each event
  } else {
    alert('Tilføj datoforslag og navn før du opretter en begivenhed')
  }


}


function suggestDate() {
  let dateValue = document.getElementById('datePicker').value;
  if (dateValue && changeHasOccured) {
    let now = new Date();
    
    let timeValue = document.getElementById('timePicker').value;
    let thisDate = new Date(dateValue.replace(/-/g, ',') + ' T ' + timeValue);
    
    if (thisDate < now) {
      alert('Vælg en tidspunkt i fremtiden');
      return;
    }
    
    let thisID = new Date().getTime();
    let dateText = '';
    let location = document.getElementById('location').value;
    location = location.charAt(0).toUpperCase() + location.slice(1);  // Make first letter uppercase

    suggestedDateList.push(new Datesuggestion(new Date(thisDate.getFullYear(), thisDate.getDate(), thisDate.getDay(), 
      thisDate.getHours(), thisDate.getMinutes()), location, []));
    console.log(suggestedDateList);

    let newNode = document.createElement('div');
    newNode.setAttribute('id', 'a' + thisID);
    newNode.classList.add('suggestedDate');
  
    let newButton = document.createElement('button');
    newButton.setAttribute('id', 'd' + thisID);
    newButton.classList.add('date');
    if (location) {
        dateText = location + ',   ' + 
        weekDays[thisDate.getDay()] + ' ' + thisDate.getDate() + '/' + (thisDate.getMonth() + 1) + 
        ' kl ' + timeValue;
      } else {
        dateText = weekDays[thisDate.getDay()] + ' ' + thisDate.getDate() + '/' + (thisDate.getMonth() + 1) + 
          ' kl ' + timeValue;
      }
    
    let textNode = document.createTextNode(dateText);
    newButton.appendChild(textNode);
    newNode.appendChild(newButton);

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('id', 'x' + thisID)
    deleteButton.classList.add('deleteButton');
    let myText = '\u00D7';
    let deleteTextNode = document.createTextNode(myText)
    deleteButton.appendChild(deleteTextNode);

    newNode.appendChild(deleteButton);

    document.getElementById('newDates').insertAdjacentElement('beforeend', newNode);

    changeHasOccured = false;
  } else {
    if (!dateValue) {
      alert('Vælg en dato\n\n... Og overvej at sætte et nyt tidspunkt')
    } else {
      alert('Der skal vælges en ny dato, tid eller sted for at tilføje et nyt datoforslag')
    }
      
  }
}

function newDateHasBeenClicked(event) {
  let thisDateID = event.target.id;
  if (thisDateID.substring(0,1) === 'x') {
    let currentElement = document.getElementById('a' + thisDateID.replace('x', ''));
    while (currentElement.hasChildNodes()) {
      currentElement.removeChild(currentElement.firstChild);
    }
  }
}


function sendToServerAndUpdateLocalStorage() {

}


// ****************  Debugging tools  ***************

function debugExample(hash) {
  if (hash === '#XYZ') {
    suggestedDateList.push(new Datesuggestion(new Date(2023, 10, 10, 13, 0), 'Bøgevangen 42', ['Karen', 'Kurt', 'Kamilla', 'Knud']));
    suggestedDateList.push(new Datesuggestion(new Date(2023, 10, 11, 13, 0), 'Bøgevangen 42', ['Karen', 'Kurt', 'Knud']));
    currentEvent = new Event('XYZ', 'Dronninglund Brætspilsklub', ['Karen', 'Kurt', 'Kamilla', 'Knud'], suggestedDateList);
  } else {
    suggestedDateList.push(new Datesuggestion(new Date(2023, 11, 8, 14, 0), 'Skovbrynet', ['Ada', 'Adam', 'Amanda']));
    suggestedDateList.push(new Datesuggestion(new Date(2023, 11, 11, 14, 0), 'Skovbrynet', ['Adam', 'Amanda']));
    currentEvent = new Event('abc', 'Dronninglund Nye Brætspilsklub', ['Ada', 'Adam', 'Amanda'], suggestedDateList);
  }
}


function sayRap() {console.log('Rap')}