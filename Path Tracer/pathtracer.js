/* Lets declare all the variables used here*/
let canvas=document.getElementById("container");  //creates canvas 
let ctx=canvas.getContext("2d");                  //creates context  
let src_x=-1;
let src_y=-1;
let des_x=-1;
let des_y=-1;
let prev_src_x=-1;
let prev_src_y=-1;
let prev_des_x=-1;
let prev_des_y=-1;
let WIDTH=960;       //canvas width
let HEIGHT=600;      //canvas height
tileW=20;
tileH=20;
let tileRowCount=26; //max rows
let tileColCount=41; //max columns (we add 1 to compensate 1-indexing instead of 0-indexed matrix)
boundX=0;
boundY=0;
let tiles=[];
let output;


// Initalise all tiles empty before running
for(c=0;c<tileColCount;c++){
    tiles[c]=[];
    for(r=0;r<tileRowCount;r++){
        tiles[c][r]={x:c*(tileW+3), y:r*(tileH+3), state: 'e'};
    }
}

// Finds the path from source to the destination using BFS algorithm
function solveMaze(){
    var Xqueue=[parseInt(src_x)];   
    var Yqueue=[parseInt(src_y)];  
    let pathFound=false;
    var xLoc;
    var yLoc;

    while(Xqueue.length>0 &&  !pathFound){
        xLoc=Xqueue.shift();
        yLoc=Yqueue.shift();
        if(xLoc>1){
            if(tiles[xLoc-1][yLoc].state=='f'){
                pathFound=true;
            }
        }
        if(xLoc<tileColCount-1){
            if(tiles[xLoc+1][yLoc].state=='f'){
                pathFound=true;
            }
        }
        if(yLoc>1){
            if(tiles[xLoc][yLoc-1].state=='f'){
                pathFound=true;
            }
        }
        
        if(yLoc<tileRowCount-1){
            if(tiles[xLoc][yLoc+1].state=='f'){
                pathFound=true;
            }
        }
        if(xLoc>1){
            if(tiles[xLoc-1][yLoc].state=='e'){
                Xqueue.push(xLoc-1);
                Yqueue.push(yLoc);
                tiles[xLoc-1][yLoc].state=tiles[xLoc][yLoc].state+'l';
               // rect(xloc-1,yLoc,tileW,tileH,tiles[xLoc-1][yLoc].state);
            }
        }
        if(xLoc<tileColCount-1){
            if(tiles[xLoc+1][yLoc].state=='e'){
                Xqueue.push(xLoc+1);
                Yqueue.push(yLoc);
                tiles[xLoc+1][yLoc].state=tiles[xLoc][yLoc].state+'r';
                //rect(xloc+1,yLoc,tileW,tileH,tiles[xLoc+1][yLoc].state);
            }
        }
        if(yLoc>1){
            if(tiles[xLoc][yLoc-1].state=='e'){
                Xqueue.push(xLoc);
                Yqueue.push(yLoc-1);
                tiles[xLoc][yLoc-1].state=tiles[xLoc][yLoc].state+'u';
               // rect(xloc,yLoc-1,tileW,tileH,tiles[xLoc][yLoc-1].state);
            }
        }
        if(yLoc<tileRowCount-1){
            if(tiles[xLoc][yLoc+1].state=='e'){
                Xqueue.push(xLoc);
                Yqueue.push(yLoc+1);
                tiles[xLoc][yLoc+1].state=tiles[xLoc][yLoc].state+'d';
               // rect(xloc,yLoc+1,tileW,tileH,tiles[xLoc][yLoc+1].state);
            }
        }
        //setInterval(draw(),100);
    }
    if(!pathFound){
        output.innerHTML="No Solution";
    }
    else{
        output.innerHTML="Solved";
        let path=tiles[xLoc][yLoc].state;   
        let pathLength=path.length;
        let currX=parseInt(src_x);  
        let currY=parseInt(src_y);  
        for(let i=0;i<pathLength-1;i++){
            if(path.charAt(i+1)=='u'){
                currY-=1;
            }
            if(path.charAt(i+1)=='d'){
                currY+=1;
            }
            if(path.charAt(i+1)=='l'){
                currX-=1;
            }
            if(path.charAt(i+1)=='r'){
                currX+=1;
            }
            tiles[currX][currY].state='p';
        }
    }
}

//Takes input of source and destination and allocate its positions on the canvas
function values_of_src_dest(){
    if(prev_src_x!=-1 && prev_src_y!=-1){
        tiles[prev_src_x][prev_src_y].state='e';
    }
    if(prev_des_x!=-1&&prev_des_y!=-1){
        tiles[prev_des_x][prev_des_y].state='e';
    }
    src_x=document.getElementById("source_y").value;
    src_y=document.getElementById("source_x").value;
    des_x=document.getElementById("dest_y").value;
    des_y=document.getElementById("dest_x").value;
    if(src_x==0 || src_y==0) return;
    if(des_x==0 || des_y==0) return;

    tiles[src_x][src_y].state='s';
    tiles[des_x][des_y].state='f';
    prev_src_x=src_x;
    prev_src_y=src_y;
    prev_des_x=des_x;
    prev_des_y=des_y;
}

/*  
    Legend for each cell's state:

    s=source
    f=destination(final)
    w=walls
    p=path
    e=empty

*/

// This marks each cell with its respective state as per input from the user
function rect(x,y,w,h,state,r,c){
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    if(state=='s'){
        ctx.fillStyle='green';
        ctx.fill();
    }
    else if(state=='f'){
        ctx.fillStyle='red';
        ctx.fill();
    }
    else if(state=='w'){
        ctx.fillStyle='black';
        ctx.fill();
    } 
    else if(state=='e'){
        ctx.fillStyle='honeydew';
        ctx.fill();
    }
    else if(state=='p'){
        ctx.fillStyle='cyan';
        ctx.fill();
    }
    else{
        ctx.fillStyle='gold';
        ctx.fill();
    }
}

//Resets the entire canvas when called
function clear(){
    ctx.clearRect(0,0,WIDTH,HEIGHT);
}

//This is used to redraw the canvas for a given interval of time to identify changes
function draw(){
    clear();
    numbers();
    //The below if condition checks that walls cannot be drawn without giving a valid source and destination
    if(src_x!=-1 && src_y!=-1 && des_x!=-1 && des_y!=-1){
        canvas.onmousedown=myDown;
        canvas.onmouseup=myUp;
    }

    for(c=1;c<tileColCount;c++){
        for(r=1;r<tileRowCount;r++){
            rect(tiles[c][r].x,tiles[c][r].y,tileW,tileH,tiles[c][r].state,r,c);
        }
    }
    
}

// Used to draw walls while hovering over cells
function myMove(e){
    x=e.pageX-canvas.offsetLeft;
    y=e.pageY-canvas.offsetTop;
    for(c=1;c<tileColCount;c++){
        for(r=1;r<tileRowCount;r++){
            if(c*(tileW+3)<x && x<c*(tileW+3)+tileW && r*(tileH+3)<y && y<r*(tileH+3)+tileH){
                if(tiles[c][r].state=='e'&&(c!=boundX||r!=boundY)){
                    tiles[c][r].state='w';
                    boundX=c;
                    boundY=r;
                }
                else if(tiles[c][r].state=='w'&&(c!=boundX||r!=boundY)){
                    tiles[c][r].state='e';
                    boundX=c;
                    boundY=r;
                }
            }
        }
    }
}

// Used to draw walls by clicking over the individual cells
function myDown(e){
    canvas.onmousemove=myMove;
    x=e.pageX-canvas.offsetLeft;
    y=e.pageY-canvas.offsetTop;
    for(c=1;c<tileColCount;c++){
        for(r=1;r<tileRowCount;r++){
            if(c*(tileW+3)<x && x<c*(tileW+3)+tileW && r*(tileH+3)<y && y<r*(tileH+3)+tileH){
                if(tiles[c][r].state=='e'){
                    tiles[c][r].state='w';
                    boundX=c;
                    boundY=r;
                }
                else if(tiles[c][r].state=='w'){
                    tiles[c][r].state='e';
                    boundX=c;
                    boundY=r;
                }
            }
        }
    }
}

// To check walls are not being drawn when mouse button is released
function myUp(){
    canvas.onmousemove=null;
}

// Initializes the canvas and draw grid
function initialize(){
    output=document.getElementById("outcome");
    return setInterval(draw,10);
}

// To show the Rows and Columns Index
function numbers(){
    for(let i=1;i<tileColCount;i++)
    {
        let tmpx= i*(tileW+3);
        let tmpy=0;
        ctx.fillStyle="black";
        ctx.font = "15px Georgia";
        ctx.fillText(i,tmpx+3,tmpy+12,20);   
    }
    for(let j=1;j<tileRowCount;j++)
    {
        let tmpy= j*(tileW+3);
        let tmpx=0;
        ctx.fillStyle="black";
        ctx.font = "15px Georgia";
        ctx.fillText(j,tmpx,tmpy+14,20);   
    }
}


//Program starts execution here

initialize();