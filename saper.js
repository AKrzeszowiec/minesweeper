//form check
var width
var height
var bombs
var bool=true; //stating if all values are correct
var focus; //where the focus is directed

function onSubmit() {
    var width=document.parameters.width.value;
    var height=document.parameters.height.value;
    var bombs=document.parameters.bombs.value;
    if (!bool) {
    }
    else {
    var area=width*height;
    if (area<=bombs) {
        alert("Too many bombs you dumb fuck!");
        document.parameters.bombs.focus();
    }
    var gameMatrix=tableCreation(height,width,bombs); // if all is fine then we can proceed to generating the table
    onClick(gameMatrix,height,width);
    }
    
}

function widthOnChange() {
    var width=document.parameters.width.value;
    var regExp=/\b\d\d\b|\b\d\b/;
    var twoDigits=regExp.test(width);
    if (isNaN(width) || !twoDigits || width<8 || width>30) {
        alert("It's not a number between 8 and 30!");
        focus=document.parameters.width;
        focus.focus(); // we focus on the width cell 
        bool=false; // because now we have invalid value
    }
    else {
        bool=true; // now the value is correct
    }
}


function heightOnChange() {
    var height=document.parameters.height.value;
    var regExp=/\b\d\d\b|\b\d\b/;
    var twoDigits=regExp.test(height);
    if (isNaN(height) || !twoDigits || height<8 || height>24) {
        alert("It's not a number between 8 and 24!");
        focus=document.parameters.height;
        focus.focus();
        bool=false; 
    }
    else {
        bool=true;
    }
}

function bombsOnChange() {
    var bombs=document.parameters.bombs.value;
    var regExp=/\b\d\d\b|\b\d\b|\b\d\d\d\b/;
    var twoDigits=regExp.test(bombs);
    if (isNaN(bombs) || !twoDigits || bombs<10 || bombs>667) {
        alert("It's not a number between 10 and 667!");
        focus=document.parameters.bombs;
        focus.focus();
        bool=false;
    }
     else {
        bool=true;
    }
}

//if some moron puts invalid data, don't let the dumb fuck move to a different cell!
function onBlur() {
    if (!bool)
    {
        focus.focus();
        }
}

//form check end

//generating table
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


                var fieldNeighbourhood=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
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

function onClick(gameMatrix,height,width) {
    var td=document.querySelectorAll("td");
    for (i=0; i<td.length; i++) {
        td[i].onclick=function() {
            var id=this.id;
            id=id.split(".");
            if (this.className=="") {
                this.className="clicked";
                if (gameMatrix[id[0]][id[1]]=="0") {
                    revealingZeros(id[0],id[1],gameMatrix,height,width);
                }
            }

            if (gameMatrix[id[0]][id[1]]=="B") {
                alert("oh crap");
            }
         
        }
        td[i].oncontextmenu=function() {
            alert("right key!");
            return false;
        }
    }
}

function revealingZeros(xcord,ycord,gameMatrix,height,width){
    var fieldNeighbourhood=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (var field=0; field<8; field++) {
    var x=parseInt(xcord)+parseInt(fieldNeighbourhood[field][0]);
    var y=parseInt(ycord)+parseInt(fieldNeighbourhood[field][1]);
    if(x>=0 && x<height && y>=0 && y<width) {
        newId=x+"."+y;
        if (gameMatrix[x][y]=="0" && document.getElementById(newId).className==""){
            document.getElementById(newId).className="clicked";
            revealingZeros(x,y,gameMatrix,height,width);
            }
        else {
            document.getElementById(newId).className="clicked";
        }
        }
    }
}
