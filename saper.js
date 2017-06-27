//  ------------- checking the form and storing important data   ---------
var width;
var height;
var bombs;
var skillLevel;
var allFine=true; //stating if all values are correct
var focus; //where the focus is directed
var fieldNeighbourhood=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
var fieldsToReveal; // will count how many fields we still have to reveal before the game is finished
var bombsCounter //for displaying how many bombs to flag we have left
var startTime; //the time of the first click
var endTime; //the time of the last click
var firstClick=true; //checking if we clicked for the first time
var skills=["beginner","intermediate","expert","custom"];

function onSubmit() {
    width=document.parameters.width.value
    height=document.parameters.height.value;
    bombs=document.parameters.bombs.value;
    fieldsToReveal=(height*width)-bombs;
    bombsCounter=bombs;
    if (allFine) {
        var area=width*height;
        if (area<=bombs) {
            alert("Too many bombs you dumb fuck!");
            document.parameters.bombs.focus();
        }
        for (var i=0; i<4; i++) {
            if(document.parameters.skill_level[i].checked) {
                skillLevel=skills[i];
            }
        }
        alert (skillLevel);
        var gameMatrix=tableCreation(height,width,bombs); // if all is fine then we can proceed to generating the table
        onClicking(gameMatrix,height,width);
    }
}

function skill_levelOnClick() {
    var defaultValues=[[8,8,10],[16,16,40],[30,16,99],[8,8,10]];
    for (var i=0; i<4; i++) {
        if(document.parameters.skill_level[i].checked) {
            document.parameters.width.value=defaultValues[i][0];
            document.parameters.height.value=defaultValues[i][1];
            document.parameters.bombs.value=defaultValues[i][2];
            skillLevel=skills[i];
            if(i==3) { //we allow putting custom parameters for the custom type
                document.parameters.width.removeAttribute("readonly");
                document.parameters.height.removeAttribute("readonly");
                document.parameters.bombs.removeAttribute("readonly");    
            }
            if(i!=3) { //so we can't change the default parameters
                document.parameters.width.setAttribute("readonly","true");
                document.parameters.height.setAttribute("readonly","true");
                document.parameters.bombs.setAttribute("readonly","true");               
            }
        }
    }
}

// in the functions below the validation is added in case the browser doesn't support HTML5

function widthOnChange() {
    width=document.parameters.width.value;
    var regExp=/\b\d\d\b|\b\d\b/;
    var twoDigits=regExp.test(width);
    if (isNaN(width) || !twoDigits || width<8 || width>30) {
        alert("It's not a number between 8 and 30!");
        focus=document.parameters.width;
        focus.focus(); // we focus on the width cell 
        allFine=false; // because now we have invalid value
    }
    else {
        allFine=true; // now the value is correct
    }
}


function heightOnChange() {
    height=document.parameters.height.value;
    var regExp=/\b\d\d\b|\b\d\b/;
    var twoDigits=regExp.test(height);
    if (isNaN(height) || !twoDigits || height<8 || height>24) {
        alert("It's not a number between 8 and 24!");
        focus=document.parameters.height;
        focus.focus();
        allFine=false; 
    }
    else {
        allFine=true;
    }
}

function bombsOnChange() {
    bombs=document.parameters.bombs.value;
    var regExp=/\b\d\d\b|\b\d\b|\b\d\d\d\b/;
    var twoDigits=regExp.test(bombs);
    if (isNaN(bombs) || !twoDigits || bombs<10 || bombs>667) {
        alert("It's not a number between 10 and 667!");
        focus=document.parameters.bombs;
        focus.focus();
        allFine=false;
    }
     else {
        allFine=true;
    }
}

//if some moron puts invalid data, don't let the dumb fuck move to a different cell!
function onBlur() {
    if (!allFine)
    {
        focus.focus();
        }
}

//form check end



// ----------------------- function generating the game table ---------------------
function tableCreation(height, width, bombs) {
    
    //create a matrix the size of the game area
    var gameMatrix=new Array(height);
    for (var i=0; i<height; i++) {
        gameMatrix[i]=new Array(width);
    }
    //fill it with 0
    
    for (var i=0; i<height; i++) {
        for (var j=0; j<width; j++) {
        gameMatrix[i][j]=0;
        }
    }
    
    //randomly choose where to put bombs and mark them as B
    var placedBombs=0;
    while (placedBombs<bombs) {
        var x=Math.floor(height*Math.random()); //picking x coordinate
        var y=Math.floor(width*Math.random()); //picking y coordinate
      //if there is no bomb at (x,y), then place one and iterate placed bombs
        if (gameMatrix[x][y]!="B") { 
       gameMatrix[x][y]="B";
            placedBombs++;
        }
    }

    // how many bombs are in the neighbourhood of a field?
   for (var i=0; i<height; i++) {        
        for (var j=0; j<width; j++) {
            var amountOfBombs=0;
            if (gameMatrix[i][j]!="B") {
                for (var field=0; field<8; field++) {
                    var testx=i+parseInt(fieldNeighbourhood[field][0]);
                    var testy=j+parseInt(fieldNeighbourhood[field][1]);
                    if(testx>=0 && testx<height && testy>=0 && testy<width && gameMatrix[testx][testy]=="B") {
                        amountOfBombs=amountOfBombs+1;
                    }
                }
                gameMatrix[i][j]=amountOfBombs;
            }
        }
    }

    // printing out the table
    var table=document.createElement("table");
    for (var i=0; i<height; i++) {
        var row=document.createElement("tr");
        var id="row"+i;
        row.setAttribute("id", id);
        for (var j=0; j<width; j++){
            var cell=document.createElement("td");
            var id2=i+"."+j;
            cell.setAttribute("id",id2);
            var text=document.createTextNode(gameMatrix[i][j]);
            cell.appendChild(text);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    var gameContainer=document.getElementById("gameContainer");
    gameContainer.innerHTML="";
    gameContainer.appendChild(table);
    return gameMatrix;
}



// ---------- Function handling clicks on the game area  ------------------


function onClicking(gameMatrix,height,width) {
    var td=document.querySelectorAll("td"); // we take all the cells
    for (i=0; i<td.length; i++) {
        td[i].oncontextmenu=function() { //we don't want context menu to show
            return false;
        }
        var id;
        var whichButton
        td[i].onmousedown=function(e) {
            if (e.buttons==3 || e.buttons==4) { //both clicked
                whichButton=3;
            }
            else if (e.buttons==1) { //left clicked
                whichButton=1;
            }
            else if (e.buttons==2) { //right cliked
                whichButton=2;
            }
            if(firstClick==true){
                firstClick=false;
                startTime=Date.now();
            }
        }
        td[i].onmouseup=function(e) {

            id=this.id;
            id=id.split("."); //we retrive which row and column we're at
    
            if (whichButton==3) { //both cliked
                //we want to reveal all the adjacent fields
                if(this.className=="clicked") {
                    var flagCounter=0;
                    var newId
                    for (var field=0; field<8; field++) { //we count flags around the field
                        var x=parseInt(id[0])+parseInt(fieldNeighbourhood[field][0]);
                        var y=parseInt(id[1])+parseInt(fieldNeighbourhood[field][1]);
                        if(x>=0 && x<height && y>=0 && y<width) {
                            newId=x+"."+y
                            if (document.getElementById(newId).className=="flag") {
                                flagCounter++;
                            }
                        }
                    }
                    if(flagCounter==gameMatrix[id[0]][id[1]]) { //we check if there are as many flags around as the cell says
                        for (var field=0; field<8; field++) {
                            var x=parseInt(id[0])+parseInt(fieldNeighbourhood[field][0]);
                            var y=parseInt(id[1])+parseInt(fieldNeighbourhood[field][1]);
                            if(x>=0 && x<height && y>=0 && y<width) {
                                newId=x+"."+y; //for the sake of changing class of revealed cells
                                if (gameMatrix[x][y]=="0" && document.getElementById(newId).className==""){ // zero in the field
                                document.getElementById(newId).className="clicked";
                                fieldsToReveal--;
                                revealingZeros(x,y,gameMatrix,height,width); // if we run into a zero, then we run the function again
                                }
                                else if (gameMatrix[x][y]=="B" && document.getElementById(newId).className==""){ //bomb in the field
                                    alert("Oh crap!");
                                }
                                else if (document.getElementById(newId).className=="") { // other cases
                                document.getElementById(newId).className="clicked";
                                fieldsToReveal--;
                                }
                            }
                        }
                    }
                }
            } 
            else if(whichButton==1){ //left click
                
                if (this.className=="") { //we change the class to "clicked"
                    this.className="clicked";
                    fieldsToReveal--;
                    if (gameMatrix[id[0]][id[1]]=="0") { //if we clicked on 0, we reveal all the adjacent cells
                        revealingZeros(id[0],id[1],gameMatrix,height,width);
                    }
                }

                if (gameMatrix[id[0]][id[1]]=="B") {
                    alert("oh crap");  
                }
            }
            else if (whichButton==2){ //right click
                if (this.className=="clicked") {
                    alert("you can't place a flag here you dumb ass!");
                }
                else if (this.className=="flag") {
                    this.className="";
                    bombsCounter++;
                }
                else {
                    this.className="flag";
                    bombsCounter--;
                }
            }
            

            if (fieldsToReveal==0) {
                endTime=Date.now();
                var gameTime=endTime-startTime;
                gameTime=gameTime/10;
                gameTime=Math.ceil(gameTime);
                gameTime=gameTime/100;
                alert("You won!");
                alert(gameTime);
                var nick=prompt("Enter your nick", "Anon");
// contacting with database
                get("saper.php?nick="+nick+"&time="+gameTime+"&skillLevel="+skillLevel).then(function(phpresult){document.getElementById("highscores").innerHTML = phpresult;
                }).catch(function(err){
                alert(err);
  })
            }
        }
    }
}
// function which will reveal all the adjacent cells to a cliked zero 
// (and to all the zeroes in the neighbourhood) and changes their class to "clicked"
function revealingZeros(xcord,ycord,gameMatrix,height,width){
    
    for (var field=0; field<8; field++) {
    var x=parseInt(xcord)+parseInt(fieldNeighbourhood[field][0]);
    var y=parseInt(ycord)+parseInt(fieldNeighbourhood[field][1]);
        if(x>=0 && x<height && y>=0 && y<width) {
            newId=x+"."+y; //for the sake of changing class of revealed cells
            if (gameMatrix[x][y]=="0" && document.getElementById(newId).className==""){
                document.getElementById(newId).className="clicked";
                fieldsToReveal--;
                revealingZeros(x,y,gameMatrix,height,width); // if we run into a zero, then we run the function again
                }
            else if (document.getElementById(newId).className=="") {
                document.getElementById(newId).className="clicked";
                fieldsToReveal--;
            }
        }
    }
}

// Promises

function get(url) {
  
  var spinner=document.getElementById("spinner");
  spinner.style.visibility="visible";
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url, true);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        setTimeout(function(){
          // Resolve the promise with the response text
          resolve(req.response);
          spinner.style.visibility="hidden";
        }, 500); //setTimeout simulating server delay
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
        spinner.style.visibility="hidden";
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
      spinner.style.visibility="hidden";
    };
    
    
    // Make the request
    req.send();
  });
}

// function for printing out highscores
function highscores(nick,gameTime,skillLevel) {
  get("saper.php?nick="+nick+"&time="+gameTime+"&skillLevel="+skillLevel).then(function(phpresult){document.getElementById("highscores").innerHTML = phpresult;
  }).catch(function(err){
    alert(err);
  })
}
