<template>
  <div>
    <CCard>
      <CCardBody>
        <CTabs tabs class="nav-underline nav-underline-primary">
          <CTab active>
            <template slot="title">
              <CImg src="icons/room.png" width="20" v-c-tooltip="'Room'"></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Rooms
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedRoomItems"
                :key="item.id"
                @click="roomClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <!-- <div>
                  Name
                  <strong>{{ item.name }}</strong>
                </div> -->
                <div>
                  <small class="text-muted mr-3">
                    Classfication &nbsp;&nbsp;{{ item.buildingCodeName }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Area(m2) &nbsp;&nbsp;{{ item.area }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/room_door_exit.png"
                v-c-tooltip="'Door'"
                width="20"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Room Door Exit
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedRoomDoorItems"
                :key="item.id"
                @click="doorClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Type &nbsp;&nbsp;{{ item.doorType }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/exit_stair_area.png"
                width="20"
                v-c-tooltip="'Exit Area'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Exit Area
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedExitStairAreaItems"
                :key="item.id"
                @click="exitAreaClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Area(m2) &nbsp;&nbsp;{{ item.area }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/exit_stair_width.png"
                width="20"
                v-c-tooltip="'Exit Stair'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Exit Stair Width
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedExitStairWidthItems"
                :key="item.id"
                @click="exitStairWidthClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/stair_exit_door.png"
                width="20"
                v-c-tooltip="'Stair Exit Door'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Stair Exit Door
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedExitStairDoorItems"
                :key="item.id"
                @click="exitDoorClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/exit_seperation.png"
                width="20"
                v-c-tooltip="'Exit Separation'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Exit Separation
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedExitSeperationItems"
                :key="item.id"
                @click="exitSeperationClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/diagonal_distance.png"
                width="20"
                v-c-tooltip="'Diagonal Distance'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Diagonal Distance
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedDiagonalDistanceItems"
                :key="item.id"
                @click="diagonalDistanceClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/travel_distance.png"
                width="20"
                v-c-tooltip="'Travel Distance'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Travel Distance
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedTravelDistanceItems"
                :key="item.id"
                @click="travelDistanceClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/common_path.png"
                width="20"
                v-c-tooltip="'Common Path'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Common Path
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedCommonPathItems"
                :key="item.id"
                @click="commonPathClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Distance(m) &nbsp;&nbsp;{{ item.distance }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CImg
                src="icons/obstacle.png"
                width="20"
                v-c-tooltip="'Obstacle'"
              ></CImg>
            </template>
            <CListGroup>
              <CListGroupItem
                class="
                  list-group-item-accent-secondary
                  bg-light
                  text-center
                  font-weight-bold
                  text-muted text-uppercase
                  small
                "
              >
                Obstacle
              </CListGroupItem>
              <CListGroupItem
                href="#"
                v-for="item in computedObstacleItems"
                :key="item.id"
                @click="obstacleClick(item)"
              >
                <div>
                  <strong>{{ item.name }}</strong>
                </div>
                <div>
                  <small class="text-muted">
                    Area(m2) &nbsp;&nbsp;{{ item.area }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
        </CTabs>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import OccupantLoadFactorApi from "@/lib/occupantLoadFactorApi";
import MinimumNumberOfExitApi from "@/lib/minimumNumberOfExitApi";
import ParamEgressApi from "@/lib/paramEgressApi";
export default {
  name: "WorkComponents",
  data() {
    return {
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      minimumNumberOfExitApi: new MinimumNumberOfExitApi(),
      paramEgressApi: new ParamEgressApi(),
    };
  },
  props: {
    obj: {},
  },
  watch: {
    obj(newVal, oldVal) {
      this.obj = newVal;
      this.refreshCalculation();
    },
  },
  computed: {
    isStairExitWidthComplied() {
      if (this.totalStairExitWidthProvided >= this.totalStairExitWidthRequired)
        return "YES";
      else return "NO";

      return "N/A";
    },
    totalStairExitWidthRequired() {
      try {
        return this.exitStairWidthParameter * this.totalOccupantLoad;
      } catch (error) {}
      return "N/A";
    },

    exitStairWidthParameter() {
      try {
        return this.paramExitStairWidth.paramExitStairWidthItems[0]
          .widthPerPersonInMm;
      } catch (error) {}
      return "N/A";
    },
    exitStairWidthBuildingRule() {
      try {
        return this.paramExitStairWidth.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    totalOccupantLoad() {
      var total = 0;
      for (let i = 0; i < this.computedRoomItems.length; i++) {
        try {
          if (!Number.isNaN(this.computedRoomItems[i].occupantNumber)) {
            if (Number.isInteger(this.computedRoomItems[i].occupantNumber))
              total += this.computedRoomItems[i].occupantNumber;
          }
        } catch (error) {}
      }
      return total;
    },
    totalStairExitWidthProvided() {
      var total = 0;
      for (let i = 0; i < this.computedExitStairWidthItems.length; i++) {
        try {
          // if(this.computedExitStairWidthItems[i].distance )
          if (!Number.isNaN(this.computedExitStairWidthItems[i].distance))
            total += this.computedExitStairWidthItems[i].distance;
        } catch (error) {}
      }
      return Math.round(total * 1000);
    },
    roomItems() {
      return this.obj.rooms;
    },
    roomDoorItems() {
      return this.obj.doors;
    },
    exitStairAreaItems() {
      return this.obj.exitStairAreas;
    },
    exitStairWidthItems() {
      return this.obj.exitStairWidths;
    },
    exitStairDoorItems() {
      return this.obj.exitStairDoors;
    },
    exitSeperationItems() {
      return this.obj.exitSeperations;
    },
    diagonalDistanceItems() {
      return this.obj.diagonalDistances;
    },
    travelDistanceItems() {
      return this.obj.travelDistances;
    },
    commonPathItems() {
      return this.obj.commonPaths;
    },
    obstacleItems() {
      return this.obj.obstacles;
    },
    computedOccupantLoadItems() {
      return this.roomItems.map((item) => {
        return {
          ...item,
          buildingCodeCategoryName: this.getBuildingCodeCategoryName(item),
          buildingCodeName: this.getBuildingCodeName(item),
          area: this.getPolygonAreaInMeter(item),
          oclBuildingRuleName: this.getOclBuildingRuleName(item),
          oclBuildingCodeName: this.getOclBuildingCodeName(item),
          oclValue: this.getOclValue(item),
          occupantNumber: this.calcOccupantNumber(item),
          mneBuildingRuleName: this.getMneBuildingRuleName(item),
          mneCount: this.getMneCount(item),
        };
      });
    },
    computedRoomItems() {
      if (this.roomItems != null)
        return this.roomItems.map((item) => {
          return {
            ...item,
            buildingCodeName: this.getBuildingCodeName(item),
            area: this.getPolygonAreaInMeter(item),
            buildingCodeCategoryName: this.getBuildingCodeCategoryName(item),
            oclBuildingRuleName: this.getOclBuildingRuleName(item),
            oclBuildingCodeName: this.getOclBuildingCodeName(item),
            oclValue: this.getOclValue(item),
            occupantNumber: this.calcOccupantNumber(item),
            mneBuildingRuleName: this.getMneBuildingRuleName(item),
            mneCount: this.getMneCount(item),
          };
        });
    },
    computedExitStairAreaItems() {
      if (this.exitStairAreaItems != null)
        return this.exitStairAreaItems.map((item) => {
          return {
            ...item,
            area: this.getPolygonAreaInMeter(item),
          };
        });
    },
    computedDiagonalDistanceItems() {
      if (this.diagonalDistanceItems != null)
        return this.diagonalDistanceItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedExitStairWidthItems() {
      if (this.exitStairWidthItems != null)
        return this.exitStairWidthItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedExitSeperationItems() {
      if (this.exitSeperationItems != null)
        return this.exitSeperationItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedTravelDistanceItems() {
      if (this.travelDistanceItems != null)
        return this.travelDistanceItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedCommonPathItems() {
      if (this.commonPathItems != null)
        return this.commonPathItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedExitStairDoorItems() {
      if (this.exitStairDoorItems != null)
        return this.exitStairDoorItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedRoomDoorItems() {
      if (this.roomDoorItems != null)
        return this.roomDoorItems.map((item) => {
          return {
            ...item,
            distance: this.getDistanceInMeter(item),
          };
        });
    },
    computedObstacleItems() {
      if (this.roomItems != null)
        return this.obstacleItems.map((item) => {
          return {
            ...item,
            area: this.getPolygonAreaInMeter(item),
          };
        });
    },
  },
  methods: {
    diagonalDistanceClick(item) {
      this.$emit("diagonalDistanceClick", item);
    },
    commonPathClick(item) {
      this.$emit("commonPathClick", item);
    },
    travelDistanceClick(item) {
      this.$emit("travelDistanceClick", item);
    },
    obstacleClick(item) {
      this.$emit("obstacleClick", item);
    },

    exitSeperationClick(item) {
      this.$emit("exitSeperationClick", item);
    },
    exitDoorClick(item) {
      this.$emit("exitDoorClick", item);
    },
    exitStairWidthClick(item) {
      this.$emit("exitStairWidthClick", item);
    },
    exitAreaClick(item) {
      this.$emit("exitAreaClick", item);
    },
    roomClick(item) {
      this.$emit("roomClick", item);
    },
    doorClick(item) {
      this.$emit("doorClick", item);
    },
    calcOccupantNumber(item) {
      try {
        var area = this.getPolygonAreaInMeter(item);

        var occupantNumber = area / item.occupantLoadFactor.value;
        return Math.round(occupantNumber);
      } catch (error) {}
      return "N/A";
    },
    getOclValue(item) {
      try {
        return item.occupantLoadFactor.value;
      } catch (error) {}
      return "N/A";
    },
    getMneBuildingRuleName(item) {
      try {
        return item.minimumNumberOfExit.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    getMneCount(item) {
      try {
        var ocl = this.calcOccupantNumber(item);
        for (
          let i = 0;
          i < item.minimumNumberOfExit.minimumNumberOfExitItems.length;
          i++
        ) {
          //   item.minimumNumberOfExit.minimumNumberOfExitItems[i]
          //     .occupantLoadFactorEnd
          // );
          if (
            ocl >=
              item.minimumNumberOfExit.minimumNumberOfExitItems[i]
                .occupantLoadFactorBegin &&
            ocl <=
              item.minimumNumberOfExit.minimumNumberOfExitItems[i]
                .occupantLoadFactorEnd
          ) {
            return item.minimumNumberOfExit.minimumNumberOfExitItems[i].count;
          }
        }
      } catch (error) {}
      return "N/A";
    },
    getOclBuildingRuleName(item) {
      try {
        return item.occupantLoadFactor.buildingRule.name;
      } catch (error) {}
      return "N/A";
    },
    getOclBuildingCodeName(item) {
      try {
        return item.occupantLoadFactor.buildingCode.name;
      } catch (error) {}
      return "N/A";
    },
    getBuildingCodeCategoryName(item) {
      try {
        return item.buildingCode.buildingCodeCategory.name;
      } catch (error) {}
      return "N/A";
    },
    getBuildingCodeName(item) {
      try {
        return item.buildingCode.name;
      } catch (error) {
        return "N/A";
      }
    },
    getPolygonAreaInMeter(item) {
      var areaInPixel = this.getPolygonArea(item);
      var areaInMeter =
        areaInPixel *
        this.obj.scale.distanceInMeterForOnePixel *
        this.obj.scale.distanceInMeterForOnePixel;
      areaInMeter = Math.round(areaInMeter * 1000) / 1000;

      return areaInMeter;
    },
    getPolygonArea(item) {
      var X = [];
      var Y = [];
      for (let i = 0; i < item.points.length; i++) {
        if (i % 2 == 0) X.push(item.points[i]);
        else Y.push(item.points[i]);
      }
      return this.polygonArea(X, Y, X.length);
    },
    //https://www.geeksforgeeks.org/area-of-a-polygon-with-given-n-ordered-vertices/
    polygonArea(X, Y, n) {
      // Initialize area
      let area = 0.0;

      // Calculate value of shoelace formula
      let j = n - 1;
      for (let i = 0; i < n; i++) {
        area += (X[j] + X[i]) * (Y[j] - Y[i]);

        // j is previous vertex to i
        j = i;
      }

      // Return absolute value
      return Math.abs(area / 2.0);
    },
    getDistanceInMeter(item) {
      var distanceInPixel = this.getDistance(item);
      var distainceInMeter =
        distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
      distainceInMeter = Math.round(distainceInMeter * 1000) / 1000;

      return distainceInMeter;
    },
    // getDistanceForOnePixel(item) {
    //   var distanceInPixel = this.getDistance(item);
    //   var distanceInMeter = item.lengthInMeter;
    //   var distanceInMeterForOnePixel = distanceInMeter / distanceInPixel;
    //   this.obj.scale.distanceInMeterForOnePixel = distanceInMeterForOnePixel;
    //   return this.obj.scale.distanceInMeterForOnePixel;
    // },
    getDistance(item) {
      try {
        var xA = item.points[0];
        var yA = item.points[1];
        var xB = item.points[2];
        var yB = item.points[3];

        var xDiff = xA - xB;
        var yDiff = yA - yB;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
      } catch (error) {}
      return 0;
    },
    refreshCalculation() {
      var self = this;
      for (let i = 0; i < self.roomItems.length; i++) {
        var buildingCodeId = self.roomItems[i].buildingCodeId;
        var buildingRuleId = self.obj.buildingRuleId;
        if (buildingCodeId) {
          self.occupantLoadFactorApi
            .getByBuildingCodeAndBuildingRule(buildingCodeId, buildingRuleId)
            .then((response) => {
              var ocl = response.result;
              if (ocl != null) {
                self.roomItems[i].occupantLoadFactorId = ocl.id;
                self.roomItems[i].occupantLoadFactor = ocl;
              } else {
                self.roomItems[i].occupantLoadFactorId = "";
                self.roomItems[i].occupantLoadFactor = null;
              }
            })
            .catch(({ data }) => {
              // self.toast("Error", helper.getErrorMessage(data), "danger");
            });
        }
        self.minimumNumberOfExitApi
          .getByBuildingRule(buildingRuleId)
          .then((response) => {
            var mne = response.result;
            if (mne != null) {
              self.roomItems[i].minimumNumberOfExitId = mne.id;
              self.roomItems[i].minimumNumberOfExit = mne;
            } else {
              self.roomItems[i].minimumNumberOfExitId = "";
              self.roomItems[i].minimumNumberOfExit = null;
            }
          })
          .catch(({ data }) => {
            // self.toast("Error", helper.getErrorMessage(data), "danger");
          });
      }

      self.paramEgressApi
        .getByBuildingRule(buildingRuleId)
        .then((response) => {
          self.paramExitStairWidth = response.result;
          //self.paramExitStairWidth
          // this.obj.defaultParam
          // if (esw != null) {
          //   self.roomItems[i].minimumNumberOfExitId = mne.id;
          //   self.roomItems[i].minimumNumberOfExit = mne;
          // } else {
          //   self.roomItems[i].minimumNumberOfExitId = "";
          //   self.roomItems[i].minimumNumberOfExit = null;
          // }
        })
        .catch(({ data }) => {
          // self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },
  },
};
</script>

<style lang="sass" scoped>
aside
  width: 15rem
</style>