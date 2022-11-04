
class BusinessHelper {
    constructor() {

    }

    getRequiredExitSeperation(floorPlan, diagonalDistance){
        
        if (floorPlan.buildingCode.code == "IBC2018") {
            if (floorPlan.isHighRise) {
                diagonalDistance = diagonalDistance / 4;
            } else {
              if (floorPlan.isSprinkleredBuilding)
              diagonalDistance = diagonalDistance / 3;
              else diagonalDistance = diagonalDistance / 2;
            }
          }
          return Math.round(diagonalDistance * 100) / 100;
  
    }

    isRoomDoorSwingComply(floorPlan, room) {
        try {
            console.log("isRoomDoorSwingComply");
            switch (floorPlan.buildingCode.code) {
                case "IBC2018":
                    {
                        if (room.totalDoorProvided == 0)
                            return false;
                        if (room.occupantNumber <= 50) {
                            return true;
                        }
                        else {
                            if (room.totalDoorSwingIn > 0)
                                return false;
                            else
                                return true;

                        }
                    }
                    break;
                case "NFPA2018":
                    {
                        if (room.totalDoorProvided == 0)
                            return false;
                        if (room.occupantNumber <= 50) {
                            return true;
                        }
                        else {
                            if (room.totalDoorSwingIn > 0)
                                return false;
                            else
                                return true;

                        }
                    }
                    break;
                case "UBBL1984":
                    {
                        if (room.totalDoorProvided == 0)
                            return false;
                        if (room.occupantNumber <= 60) {
                            return true;
                        }
                        else {
                            if (room.totalDoorSwingIn > 0)
                                return false;
                            else
                                return true;

                        }
                    }
                    break;
                case "BCA2015":
                    {
                        if (room.totalDoorProvided == 0)
                            return false;
                        if (room.area <= 200) {
                            return true;
                        }
                        else {
                            if (room.totalDoorSwingIn > 0)
                                return false;
                            else
                                return true;

                        }
                    }
                    break;
                default:
                    break;
            }
        } catch (error) { }
        return false;
    };

}

export default BusinessHelper;