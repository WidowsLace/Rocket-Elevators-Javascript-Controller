class Column {
    constructor(_id, _amountOfFloors, _amountOfElevators) {
        this.ID = _id;
        this.status = "online";
        this.numOfFloors = _amountOfFloors;
        this.numOfElevators = _amountOfElevators;
        this.elevatorList = [];
        this.callButtonList = [];

        this.populateElevatorList(this.numOfElevators, this.numOfFloors);
        this.populateCallButtonList(this.numOfFloors);
    };
    populateElevatorList(numOfElevators, numOfFloors) {
        let elevId = 1;
        for (let i = 0; i < numOfElevators; i++) {
            let elevator = new Elevator(elevId, numOfFloors);
            this.elevatorList.push(elevator);
            elevId++;
        }
    }

    populateCallButtonList(numOfFloors) {
        let buttonId = 1
        let floor = 1;
        for (let i = 0; i < numOfFloors; i++) {
            if (floor === 1) {this.callButtonList.push(new CallButton(buttonId, floor, "up"));}
            else if (floor < numOfFloors && floor !== 1) {
                this.callButtonList.push(new CallButton(buttonId, floor, "up"));
                buttonId++;
                this.callButtonList.push(new CallButton(buttonId, floor, "down"));
            }
            else {this.callButtonList.push(new CallButton(buttonId, floor, "down"));}
            buttonId++;
            floor++;
        }
    }
    requestElevator(requestedFloor, direction) {
        let chosenElevator = this.findBestElevator(requestedFloor, direction);
        chosenElevator.floorRequestList.push(requestedFloor);
        chosenElevator.move();
        chosenElevator.door.status = "opened";
        return chosenElevator;
    }

    findBestElevator(requestedFloor, requestedDirection) {
        let bestElevator;
        let bestScore = 100;
        let referenceGap = 100000;
        let bestElevatorInformation;
        this.elevatorList.forEach(elev => {
            if (requestedFloor === elev.currentFloor && elev.status === "stopped" && requestedDirection === elev.direction)
                bestElevatorInformation = this.checkIfElevatorIsBetter(1, elev, bestScore, referenceGap, bestElevator, requestedFloor);
            else if (elev.currentFloor > requestedFloor && elev.direction === "down" && requestedDirection === elev.direction)
                bestElevatorInformation = this.checkIfElevatorIsBetter(2, elev, bestScore, referenceGap, bestElevator, requestedFloor);
            else if (elev.currentFloor < requestedFloor && elev.direction === "up" && requestedDirection === elev.direction)
                bestElevatorInformation = this.checkIfElevatorIsBetter(2, elev, bestScore, referenceGap, bestElevator, requestedFloor);
            else if (elev.status === "idle")
                bestElevatorInformation = this.checkIfElevatorIsBetter(3, elev, bestScore, referenceGap, bestElevator, requestedFloor);
            else {
                bestElevatorInformation = this.checkIfElevatorIsBetter(4, elev, bestScore, referenceGap, bestElevator, requestedFloor);
            }

            bestElevator = bestElevatorInformation.bestElevator;
            bestScore = bestElevatorInformation.bestScore;
            referenceGap = bestElevatorInformation.referenceGap;
        });
        return bestElevator;
    }

    checkIfElevatorIsBetter(scoreToCheck, newElevator, bestScore, referenceGap, bestElevator, floor) {
        if (scoreToCheck < bestScore) {
            bestScore = scoreToCheck;
            bestElevator = newElevator;
            referenceGap = Math.abs((newElevator.currentFloor - floor));
        } else if (bestScore === scoreToCheck) {
            let gap = Math.abs((newElevator.currentFloor - floor));
            if (referenceGap > gap) {
                bestElevator = newElevator;
                referenceGap = gap;
            }
        }
        return {
            bestElevator: bestElevator, 
            bestScore: bestScore, 
            referenceGap: referenceGap
        };
    }
}

class Elevator {
    constructor(_id, _amountOfFloors) {
        this.ID = _id;
        this.amountOfFloors = _amountOfFloors;
        this.status = "idle"; 
        this.currentFloor = 1;
        this.direction = null;
        this.door = new Door(_id, "closed");
        this.floorRequestList = [];
        this.floorRequestButtonList = [];

        this.createFloorRequestButtons(this.amountOfFloors);
    }

    createFloorRequestButtons(_amountOfFloors) {
        let buttonFloor = 1;
        let buttonId = 1;

        for (let i = 0; i < _amountOfFloors; i++) {
            let floorRequestButton = new FloorRequestButton(buttonId, buttonFloor);
            this.floorRequestButtonList.push(floorRequestButton);
            buttonFloor++;
            buttonId++;
        }
    }

    requestFloor(requestedFloor) {
        this.floorRequestList.push(requestedFloor);
        this.move();
        this.door.status = "opened";
        //console.log("floor requested...");
    }

    move() {
        while (this.floorRequestList.length !== 0) {
            this.floorRequestList.forEach(element => {
                if (this.currentFloor < element){
                    this.direction = "going up"; 
                    if (this.door.status === "opened") {this.door.status = "door opened, then closed....";}
                    this.status = "moving"; 
                while (this.currentFloor < element) {
                        this.currentFloor++;
                    }this.status = "stopped";
                } 
                else if (this.currentFloor > element) {
                    this.direction = "going down";                  
                    if (this.door.status === "opened") {this.door.status = "door opened, then closed...";}
                    this.status = "moving";
                while (this.currentFloor > element) {
                        this.currentFloor--;
                    }this.status = "stopped";
                }                
                this.floorRequestList.shift();
            });
        }
        this.status = "idle";
        console.log(this.door.status, "floor", this.currentFloor, this.direction)}
    
}

class CallButton {
    constructor(_id, _floor, _direction) {
        this.ID = _id;
        this.status = "off";
        this.floor = _floor;
        this.direction = _direction;
    }
}

class FloorRequestButton {
    constructor(_id, _floor) {
        this.ID = _id;
        this.status = "off";
        this.floor = _floor;
    }
}

class Door {
    constructor(_id, _status) {
        this.ID = _id;
        this.status = _status;
    }
}

//===================================================//
//                   JS SCENARIOS                    //
//===================================================//

const column = new Column(1, 10, 2);
scenario1()
scenario2()
// ================ Scenario 1 =====================
function scenario1(){
  console.log("======= SCENARIO 1 START =======");
  column.elevatorList[0].currentFloor = 2;
  column.elevatorList[1].currentFloor = 6;

  let elevator = column.requestElevator(3, "up");
  elevator.requestFloor(7)
  console.log("======= SCENARIO 1 END =======");
}
//scenerio1();
// ============== END Scenario 1 ===================


// ================ Scenario 2 =====================
function scenario2(){
  console.log("======= SCENARIO 2 START =======");
  column.elevatorList[0].currentFloor = 10;
  column.elevatorList[1].currentFloor = 3;

  let elevator = column.requestElevator(1, "up");
  elevator.requestFloor(6);
  elevator = column.requestElevator(3, "up");
  elevator.requestFloor(5);
  elevator = column.requestElevator(9, "down");
  elevator.requestFloor(2);
  console.log("======= SCENARIO 2 END =======");
}
// scenerio2();
// ============== END Scenario 2 ===================
// ================ Scenario 3 =====================
console.log("========= SCENARIO 3 START =========");
column.elevatorList[0].currentFloor = 10;
column.elevatorList[1].currentFloor = 3;

let elevator = column.requestElevator(3, "down");
elevator.requestFloor(2);
elevator = column.requestFloor(10, "down");
elevator.requestElevator(3);
console.log("=======END SCENARIO 3=======");
module.exports = { Column, Elevator, CallButton, FloorRequestButton, Door }