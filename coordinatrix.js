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
let uniqueIdList = []; // Used by the class DateSuggestion only
let suggestedDateList = [];

let weekDays = ['Søn', 'Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør'];
let debugVar1;


document.getElementById('inviteOthers').addEventListener('click', inviteOthers);
document.getElementById('dates').addEventListener('click', function(event) { dateHasBeenClicked(event); }, true);
document.getElementById('suggestDate').addEventListener('click', suggestDate);
document.getElementById('newEvent').addEventListener('click', newDateSuggestion);


class Event {
  constructor(eventID, name, participants, suggestedDateList) {
    this.eventID = eventID;
    this.name = name;
    this.participants = participants;
    this.suggestedDateList = suggestedDateList;
  }
}


class Datesuggestion {
    constructor(date, location, cakeProvider) {
        this.date = date;
        this.location = location;
        this.cakeProvider = cakeProvider;
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

  fillInDates();
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

    let yesButton = document.createElement('button');
    yesButton.classList.add('red');
    let yesText = document.createTextNode('Kan ikke');
    yesButton.appendChild(yesText);
    newNode.appendChild(yesButton);
    
    let maybeButton = document.createElement('button');
    maybeButton.classList.add('yellow');
    let maybeText = document.createTextNode('Kan måske');
    maybeButton.appendChild(maybeText);
    newNode.appendChild(maybeButton);

    let noButton = document.createElement('button');
    noButton.classList.add('green');
    let noText = document.createTextNode('Kan godt');
    noButton.appendChild(noText);
    newNode.appendChild(noButton);

    document.getElementById('dates').insertAdjacentElement('beforeend', newNode);
  }
}


function inviteOthers() {
}


function dateHasBeenClicked(event) {
    let myDateID = event.target.id;
    console.log(myDateID);
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