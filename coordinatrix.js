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
let uniqueIdList = []; // Used by the class Event only
let eventList = [];


document.getElementById('inviteOthers').addEventListener('click', inviteOthers);
document.getElementById('dates').addEventListener('click', function(event) { dateHasBeenClicked(event); }, true);
document.getElementById('suggestDate').addEventListener('click', suggestDate);
document.getElementById('newEvent').addEventListener('click', newEvent);


class Event {
    constructor(event, date, location, cakeProvider) {
        this.event;
        this.date;
        this.location;
        this.cakeProvider;
        this.uniqueID = this.giveAUniqueID();
    }

    giveAUniqueId() {
        let tryAgain = false;
        let uniqueId = 0;
        do {
          tryAgain = false;
          uniqueId = Math.floor(Math.random() * 10000);
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
}


function inviteOthers() {
}


function dateHasBeenClicked(event) {
    let myDateID = event.target.id;
    console.log(myDateID);
}


function suggestDate() {
}


function newEvent() {
}
