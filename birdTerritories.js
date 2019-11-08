let w = 20;
let h = 20;
let canvasWidth = 400;
let canvasHeight = 400;
var territories = new Array();
var birds = new Array();
var numBirds = -1, numTerritories,chanceOfStorm,chanceOfStormDecrease, daysToMigrate, numCycles;
var currentDay = 0;
var migrationCycle = 0;
var table = new Array();

class Bird{
	constructor(num,gender){
		this.num = num;
		this.date = Math.floor(random(0,daysToMigrate));
		this.gender = gender;
		this.territory = null;
		if(gender == "female"){this.date+=daysToMigrate;}
	}
}

class Territory{
	constructor(i){
		this.quality = Math.random();
		this.male = null;
		this.femaile = null;
		var row = 0;
		while(i >= canvasWidth/w){
			i-=(canvasWidth/w);
			row++;
		}
		this.x = i*w;
		this.y = row*h;
	}
	show(){
		stroke(0);
		if(this.male == null){fill(255);}else if(this.male != null && this.female != null){fill(255,0,255);}else{fill(255,0,0);}
		strokeWeight(3);
		ellipse(this.x + w/2, this.y + h/2, w/2,h/2);
	}
}

function setup(){
	createCanvas(800,600);
	background(255);
	frameRate(10);
	textSize(15);
	noStroke();
	fill(0);

	numBirdsInput = createInput().attribute('placeholder','Number of Birds');
	numBirdsInput.position(canvasWidth + 100, 100);
	numBirdsInput.size(350,15);
	numDaysInput = createInput().attribute('placeholder','How many days does each gender have to migrate?');
	numDaysInput.position(canvasWidth + 100,125);
	numDaysInput.size(350,15);
	numCyclesInput = createInput().attribute('placeholder','How many cycles do you want to go through?');
	numCyclesInput.position(canvasWidth + 100,155);
	numCyclesInput.size(350,15);
	text("Chance of Storm:",canvasWidth+75,210);
	chanceOfStormInput = createSlider(0,1,0.025,.005);
	chanceOfStormInput.position(canvasWidth + 200, 200);
	chanceOfStormInput.size(250,15);
	chanceofStormValue = createP(chanceOfStormInput.value());
	chanceofStormValue.position(canvasWidth+455,185);
	text("Amount Decrease:",canvasWidth+75,260);
	chanceOfStormDecreaseInput = createSlider(0,0.5,0.001,0.001);
	chanceOfStormDecreaseInput.position(canvasWidth + 200, 250);
	chanceOfStormDecreaseInput.size(250,15);
	chanceofStormDecreaseValue = createP(chanceOfStormDecreaseInput.value());
	chanceofStormDecreaseValue.position(canvasWidth+455,235);
	runBtn = createButton("Run");
	runBtn.position(canvasWidth+100,300);
	runBtn.mousePressed(run);
}

function draw(){
	chanceofStormDecreaseValue.html(chanceOfStormDecreaseInput.value());
	chanceofStormValue.html(chanceOfStormInput.value());
	if(migrationCycle == numCycles){
		console.table(table); 
		clear();
		noStroke();
		fill(0);
		text("Amount Decrease:",canvasWidth+75,260);
		text("Chance of Storm:",canvasWidth+75,210);
		noLoop();	
	}
	if(numBirds < 0){return;}
	migrate();
	for(var i = 0; i < numTerritories; i++){
		territories[i].show();
	}
}

function run(){
	numBirds = parseInt(numBirdsInput.value());
	numTerritories = parseInt(numBirdsInput.value());
	chanceOfStorm = parseFloat(chanceOfStormInput.value());
	chanceOfStormDecrease = parseFloat(chanceOfStormDecreaseInput.value());
	daysToMigrate = parseInt(numDaysInput.value());
	numCycles = parseInt(numCyclesInput.value());
	initializeBirdsandTerritories();
}

function initializeBirdsandTerritories(){
	table = new Array(numBirds*2);
	for(var i = 0; i < numTerritories; i++){
		var t = new Territory(i);
		territories.push(t);
		t.show();
	}
	for(var i = 0; i < numBirds; i++){
		table[i] = new Array();
		var b = new Bird(i,"male");
		birds.push(b);
		table[i].push(b.date);
	}
	for(var i = 0; i < numBirds; i++){
		table[i+numBirds] = new Array();
		var b = new Bird(i+numBirds,"female");
		birds.push(b);
		table[i+numBirds].push(b.date);
	}
}
function migrate() {
	//everyone has moved, reset.
	if(currentDay > 2 * daysToMigrate){
		for(var i = 0; i < numBirds*2; i++){
			table[birds[i].num].push(birds[i].territory.quality);
		}
		currentDay = 0;
		migrationCycle++;
		resetTerritories();
	}
	//snowstorm
	if(random() < chanceOfStorm-(chanceOfStormDecrease*currentDay)){
		console.log("STORM!!!");
		for(var i = 0; i < numBirds; i++){
			if(territories[i].male != null){
				//console.log("Bird " + territories[i].male.num + " died during cycle " + migrationCycle+"!");
				birds.splice(territories[i].male.num,1);
				territories[i].male = null;
				numBirds--;
			}
			if(territories[i].female != null){
				//console.log("Bird " + territories[i].female.num + " died during cycle " + migrationCycle+"!");
				birds.splice(territories[i].female.num,1);
				territories[i].female = null;
				numBirds--;
			}
		}
	}

	//give everyone a territory
	for(var i = 0; i < numBirds*2; i++){
		var j = 0;
		if(birds[i].date == currentDay){
			while(birds[i].territory == null){
				if(j >= numTerritories){j-=numTerritories;}
				var rand = Math.random();
				if(rand < territories[j].quality){
					if(birds[i].gender == "male" && territories[j].male == null){
						territories[j].male = birds[i];
						birds[i].territory = territories[j];
					}
					else if(birds[i].gender == "female" && territories[j].female == null){
						territories[j].female = birds[i];
						birds[i].territory = territories[j];
					}
				}
				j++;
			}
		}
	}
	currentDay++;
}

function resetTerritories(){
	for(var i = 0; i < numTerritories; i++){
		if(territories[i].male){
			territories[i].male.territory = null;
			territories[i].male = null;
		}
		if(territories[i].female){
			territories[i].female.territory =  null;
			territories[i].female = null;
		}
	}
}
