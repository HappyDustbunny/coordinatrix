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

let weekDays = ['Søn', 'Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør'];

let userID = '';
let eventID = '';
let myID = '';
let myIDName = '';
let changeHasOccured = false;
let uniqueIdList = []; // Used by the class DateSuggestion only
let currentEvent;
let suggestedDateList = [];
let listOfEventsIFollow = {};


// ToDo: Empty suggestedDateList when making new event? And set currentEvent
// ToDo: Allow deletion of events by owner

document.getElementById('whoami').addEventListener('click', whoami);
document.getElementById('lookAtEvents').addEventListener('click', lookAtEvents);

document.getElementById('howToUse').addEventListener('click', function(event) {unfold(event); }, true);
document.getElementById('pris').addEventListener('click', function(event) {unfold(event); }, true);
document.getElementById('cookies').addEventListener('click', function(event) {unfold(event); }, true);

document.getElementById('inviteOthers').addEventListener('click', inviteOthers);

document.getElementById('dates').addEventListener('click', function(event) { dateHasBeenClicked(event); }, true);

document.getElementById('suggestEventDate').addEventListener('click', suggestDate);
document.getElementById('newDates').addEventListener('click', function(event) { newDateHasBeenClicked(event); }, true);
document.getElementById('makeEvent').addEventListener('click', makeEvent);


document.getElementById('datePicker').addEventListener('change', function() { changeHasOccured = true; });
document.getElementById('timePicker').addEventListener('change', function() { changeHasOccured = true; });
document.getElementById('location').addEventListener('change', function() { changeHasOccured = true; });

document.getElementById('eventSelector').addEventListener('change', function(event) { showDifferentEvent(event); });

document.getElementById('newEvent').addEventListener('click', newEventSuggestion);
document.getElementById('makeYourOwnEvent').addEventListener('click', newEventSuggestion);


class Event {
  constructor(eventID, eventName, suggestedDateList) {
    this.eventID = eventID;
    this.eventName = eventName;
    this.suggestedDateList = suggestedDateList;
  }
}


class Datesuggestion {
  constructor(date, location, participants, nonparticipants) {
    this.date = date;
    this.location = location;
    this.participants = participants;
    this.nonparticipants = nonparticipants;
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
  if (localStorage.myIDName === undefined) {
    document.getElementById('lookAtEvents').disabled = true;
    document.getElementById('newEvent').disabled = true;
  } else {
    document.getElementById('myIDName').value = localStorage.myIDName;
    document.getElementById('lookAtEvents').disabled = false;
    document.getElementById('newEvent').disabled = false;
  }
  resetEvent();
  checkLocalStorageAndChooseWelcome();
}


function whoami() {
  let myIDNameElement = document.getElementById('myIDName');

  if (2 < myIDNameElement.value.length) {
    myIDName = myIDNameElement.value;
    myIDName = myIDName.replace(/[^a-zA-Z0-9 æøåÆØÅ]/g, '');
    myIDNameElement.value = myIDName;
    localStorage.myIDName = myIDName;
    
    if (localStorage.myID === undefined) {  // Using a new browser on a device creates one unique ID (myID) and asks for a possible tag-change prompting last used name
      myID = myIDName.substring(0, 2).trim() + new Date().getTime(); // The ID will randomly contain the first two characters of the first chosen tag. Trim will remove spaces, but that another dumbass starts his tag with a double space at the exact same microsecond is minuscule
      localStorage.myID = myID;
    } else {
      myID = localStorage.myID;
    }
    
    document.getElementById('lookAtEvents').disabled = false;
    document.getElementById('newEvent').disabled = false;

  } else {
    alert('Skriv venligst et tag (navn)\nBrug venligst kun bogstaver og tal\nog mindst tre karakterer')
  }
}


function lookAtEvents() {
  hideAll();
  document.getElementById('dateContainer').hidden = false;
  fillInEvents();
}


function hideAll() {
  document.getElementById('frontpageDiv').hidden = true;
  document.getElementById('dateContainer').hidden = true;
  document.getElementById('eventSelectorDiv').hidden = true;
  document.getElementById('newEventContainer').hidden = true;
}


function resetEvent() {
  document.getElementById('eventName').value = '';
  document.getElementById('datePicker').value = '';
  document.getElementById('timePicker').value = '12:00';
  document.getElementById('location').value = '';
  document.getElementById('makeEvent').disabled = true;
}


function checkLocalStorageAndChooseWelcome() {
if (location.hash || localStorage.listOfEventsIFollow) {  // ToDo: Should this be two checks? Or is last check superflous?
  listOfEventsIFollow = JSON.parse(localStorage.listOfEventsIFollow) ;
  myIDName = localStorage.myIDName;
  
  hideAll();
  document.getElementById('dateContainer').hidden = false;
  
  getMyEventsFromServer(location.hash);
  
  fillInEvents();
  } else {
    hideAll();
    document.getElementById('frontpageDiv').hidden = false;
  }
}


function getMyEventsFromServer(hash) {
  // debugExample(hash);  // ToDo: Fix real function
  for (const [index, eventIFollow] of Object.entries(listOfEventsIFollow)) {
    if (index === 'ID' + Number(hash.replace('#', ''))) {
      currentEvent = listOfEventsIFollow[index];
    } else {  // Chose the first random entry in the dictionary
      let myKeys = [];
      Object.entries(listOfEventsIFollow).forEach(key => myKeys.push(key[0]));
      currentEvent = listOfEventsIFollow[myKeys[0]];
    }
  }
}

function fillInEvents() {
  if (1 < Object.keys(listOfEventsIFollow).length) {
    document.getElementById('eventSelectorDiv').hidden = false;
    for (const [index, eventIFollow] of Object.entries(listOfEventsIFollow)) {
      let newNode = document.createElement('option');
      newNode.name = eventIFollow.eventName;
      newNode.setAttribute('id', eventIFollow.eventID);
      let textNode = document.createTextNode(eventIFollow.eventName);
      newNode.appendChild(textNode);
      document.getElementById('eventSelector').insertAdjacentElement('beforeend', newNode);
    }
  }

  fillInDates();
}


function fillInDates() {

  // Insert eventname as header
  let headerText = document.createTextNode(currentEvent.eventName);
  let element = document.getElementById('dateHeader');
  stripChilds(element);
  element.appendChild(headerText);
  
  // Fill in dates and participants
  stripChilds(document.getElementById('dates'));

  for (const [index, dateSuggestion] of currentEvent['suggestedDateList'].entries()) {
    let newNode = document.createElement('div');
    newNode.classList.add('suggestedDate');
    
    let newButton = document.createElement('button');
    newButton.setAttribute('id', dateSuggestion.uniqueID);
    newButton.classList.add('date');
    
    let thisDate = new Date(dateSuggestion.date);
    let dateText = weekDays[thisDate.getDay()] + ' ' + thisDate.getDate() + '/' + (thisDate.getMonth() + 1) + 
    ' kl ' + thisDate.getHours();
    let textNode = document.createTextNode(dateText);
    newButton.appendChild(textNode);
    newNode.appendChild(newButton);
    
    let noButton = document.createElement('button');
    noButton.setAttribute('id', 'n' + dateSuggestion.uniqueID);
    noButton.classList.add('lightRed');
    if (dateSuggestion.nonparticipants.includes(myIDName)) {
      noButton.classList.add('red');
    }
    noButton.classList.add(dateSuggestion.uniqueID);
    let yesText = document.createTextNode('Deltager ikke');
    noButton.appendChild(yesText);
    newNode.appendChild(noButton);
    
    let yesButton = document.createElement('button');
    yesButton.setAttribute('id', 'y' + dateSuggestion.uniqueID);
    yesButton.classList.add('lightGreen');
    if (dateSuggestion.participants.includes(myIDName)) {
      yesButton.classList.add('green');
    }
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
    for (const [index, dateSuggestion] of currentEvent.suggestedDateList.entries()) {
        if (dateSuggestion.uniqueID === Number(myDateID.substring(1, 10)) && firstCharInID === 'y') {
          dateSuggestion.participants.push(myIDName);
          let index = dateSuggestion.nonparticipants.indexOf(myIDName);
          if (-1 < index) {
            dateSuggestion.nonparticipants.splice(index, 1);
          }
          document.getElementById(myDateID).classList.add('green');
          document.getElementById('n' + myDateID.substring(1, 10)).classList.remove('red');
          console.log('Yes');
        } else if (dateSuggestion.uniqueID === Number(myDateID.substring(1, 10)) && firstCharInID === 'n') {
          dateSuggestion.nonparticipants.push(myIDName);
          let index = dateSuggestion.participants.indexOf(myIDName);
          if (-1 < index) {
            dateSuggestion.participants.splice(index, 1);
          }
          document.getElementById(myDateID).classList.add('red');
          document.getElementById('y' + myDateID.substring(1, 10)).classList.remove('green');
          console.log('No');
        }
    }

    localStorage.listOfEventsIFollow = JSON.stringify(listOfEventsIFollow);
    // TODO: Close participantlist when pressing a Deltager/Deltager ikke button - or remove/add participation dynamically
  }  else {
    showParticipants(myDateID);
  }
}

function stripChilds(element) {
  while (element.hasChildNodes()) {
    element.removeChild(element.firstChild);
  }
}
  
  
function showParticipants(myDateID) {
  let element = document.getElementById('part' + myDateID);
  if (element.hasChildNodes()) {
    stripChilds(element);
  } else {
    for (const [index, dateSuggestion] of currentEvent.suggestedDateList.entries()) {
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


function showDifferentEvent(event) {
  console.log(document.getElementById('eventSelector').value);
  console.log(event.currentTarget.selectedOptions[0].id);
  currentEvent = listOfEventsIFollow[event.currentTarget.selectedOptions[0].id];
  fillInDates();
}



function newEventSuggestion() {
  resetEvent();  // Set the value of date and place to '' and the value of time to 12:00
  hideAll();
  document.getElementById('newEventContainer').hidden = false;
}


function makeEvent() {  // ToDo: Give options to allow participants to invite others OR propose new dates OR neither
  let name = document.getElementById('eventName').value;
  name = name.replace(/[^a-zA-Z0-9 ]/g, '');
  if (name && suggestedDateList) {
    let thisID = 'ID' + new Date().getTime();
    let eventName = document.getElementById('eventName').value;
    let location = document.getElementById('location').value;
    location = location.charAt(0).toUpperCase() + location.slice(1);  // Make first letter uppercase
    let thisEvent = new Event(thisID, eventName, suggestedDateList);
    currentEvent = thisEvent;
    listOfEventsIFollow[thisID] = thisEvent;
    localStorage.listOfEventsIFollow = JSON.stringify(listOfEventsIFollow);
  
    sendToServerAndUpdateLocalStorage();

    let element = document.getElementById('newDates');
    if (element.hasChildNodes()) {
      while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
      }
    }

    hideAll();
    suggestedDateList = [];
    document.getElementById('dateContainer').hidden = false; 
    fillInEvents();
  } else {
    alert('Tilføj datoforslag og navn før du opretter en begivenhed')
  }
}


function suggestDate() {  // ToDo: Check if the date is in current year. If not, add full year to button showing suggestion
  if (document.getElementById('eventName').value === '') {
    alert('Giv begivenheden et navn');
    return;
  }

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
      thisDate.getHours(), thisDate.getMinutes()), location, [], []));
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

    document.getElementById('makeEvent').disabled = false;
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
    suggestedDateList.push(new Datesuggestion(new Date(2023, 10, 10, 13, 0), 'Bøgevangen 42', ['Karen', 'Kurt', 'Kamilla', 'Knud'], ['Børge', 'Birger']));
    suggestedDateList.push(new Datesuggestion(new Date(2023, 10, 11, 13, 0), 'Bøgevangen 42', ['Karen', 'Kurt', 'Knud'], ['Børge', 'Birger']));
    currentEvent = new Event('XYZ', 'Dronninglund Brætspilsklub', suggestedDateList);
  } else {
    suggestedDateList.push(new Datesuggestion(new Date(2023, 11, 8, 14, 0), 'Skovbrynet', ['Ada', 'Adam', 'Amanda'], ['Børge', 'Birger']));
    suggestedDateList.push(new Datesuggestion(new Date(2023, 11, 11, 14, 0), 'Skovbrynet', ['Adam', 'Amanda'], ['Børge', 'Birger']));
    currentEvent = new Event('abc', 'Dronninglund Nye Brætspilsklub', suggestedDateList);
  }
}


function sayRap() {console.log('Rap')}