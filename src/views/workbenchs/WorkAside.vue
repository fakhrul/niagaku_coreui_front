<template>
  <CCard>
    <CCardBody>
      <CSidebar
        flat
        aside
        :show="$store.state.asideShow"
        @update:show="(val) => $store.commit('set', ['asideShow', val])"
        colorScheme="light"
      >
        <CSidebarClose @click.native="$store.commit('toggle', 'asideShow')" />
        <CTabs tabs class="nav-underline nav-underline-primary">
          <CTab active>
            <template slot="title">
              <CIcon name="cil-list" />
            </template>

            <CListGroup class="list-group-accent">
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
                class="list-group-item-accent-success list-group-item-divider"
                v-for="item in computedRoomItems"
                :key="item.id"
                @click="roomClick(item)"
              >
                <div>
                  Name
                  <strong>{{ item.name }}</strong>
                </div>
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
                class="list-group-item-accent-warning list-group-item-divider"
                v-for="item in computedExitStairWidthItems"
                :key="item.id"
              >
                <div>
                  Name
                  <strong>{{ item.name }}</strong>
                </div>

                <small class="text-muted">
                  Distance (m) &nbsp;&nbsp;{{ item.distance }}
                </small>
              </CListGroupItem>
            </CListGroup>
          </CTab>
          <CTab>
            <template slot="title">
              <CIcon name="cil-speech" />
            </template>
            <CListGroup class="list-group-accent">
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
                Occupant Load
              </CListGroupItem>
              <CListGroupItem
                href="#"
                class="list-group-item-accent-success list-group-item-divider"
                v-for="item in computedOccupantLoadItems"
                :key="item.id"
              >
                <div>
                  Room
                  <strong>{{ item.name }}</strong>
                </div>
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
                <div>
                  <small class="text-muted">
                    Occupant Density (m2/person) &nbsp;&nbsp;{{ item.oclValue }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Occupant Number &nbsp;&nbsp;{{ item.occupantNumber }}
                  </small>
                </div>
                <!-- <div>
              <small class="text-muted">
                Door Exit Rule &nbsp;&nbsp;{{ item.mneBuildingRuleName }}
              </small>
            </div> -->
                <div>
                  <small class="text-muted">
                    Minimum Door &nbsp;&nbsp;{{ item.mneCount }}
                  </small>
                </div>
              </CListGroupItem>

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
                Egress Capacity
              </CListGroupItem>
              <!-- <CListGroupItem
            href="#"
            class="list-group-item-accent-warning list-group-item-divider"
            v-for="item in computedExitStairAreaItems"
            :key="item.id"
          >
            <div>
              Exit Stair Area
              <strong>{{ item.name }}</strong>
            </div>

            <small class="text-muted"> Size &nbsp;&nbsp;{{ item.area }} </small>
          </CListGroupItem> -->
              <CListGroupItem
                href="#"
                class="list-group-item-accent-warning list-group-item-divider"
              >
                <div>
                  <small class="text-muted">
                    Total Exit Stair Width Provided (mm): &nbsp;&nbsp;{{
                      totalStairExitWidthProvided
                    }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Total Occupant Load (person): &nbsp;&nbsp;{{
                      totalOccupantLoad
                    }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Total Exit Stair Width Required Per Person (mm):
                    &nbsp;&nbsp;{{ exitStairWidthParameter }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Total Exit Stair Width Required (mm): &nbsp;&nbsp;{{
                      totalStairExitWidthRequired
                    }}
                  </small>
                </div>
                <div>
                  <small class="text-muted">
                    Is Comply : &nbsp;&nbsp;{{ isStairExitWidthComplied }}
                  </small>
                </div>
              </CListGroupItem>
            </CListGroup>
          </CTab>
        </CTabs>
      </CSidebar>
    </CCardBody>
  </CCard>
</template>

<script>
import OccupantLoadFactorApi from "../../lib/occupantLoadFactorApi";
import MinimumNumberOfExitApi from "../../lib/minimumNumberOfExitApi";
import ParamEgressApi from "../../lib/paramEgressApi";

export default {
  name: "WorkAside",
  data() {
    return {
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      minimumNumberOfExitApi: new MinimumNumberOfExitApi(),
      exitStairWidthApi: new ParamEgressApi(),
    };
  },
  props: {
    obj: {},
  },
  watch: {
    obj(newVal, oldVal) {
      this.rooms = this.obj.rooms;
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
          //console.log(this.computedRoomItems[i].occupantNumber);

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
        //console.log(this.computedExitStairWidthItems[i].distance);

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
    exitStairAreaItems() {
      return this.obj.exitStairAreas;
    },
    exitStairWidthItems() {
      return this.obj.exitStairWidths;
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
      return this.exitStairAreaItems.map((item) => {
        return {
          ...item,
          area: this.getPolygonAreaInMeter(item),
        };
      });
    },
    computedDiagonalDistanceItems() {
      return this.diagonalDistanceItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedExitStairWidthItems() {
      return this.exitStairWidthItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedExitSeperationItems() {
      return this.exitSeperationItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedTravelDistanceItems() {
      return this.travelDistanceItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
    computedCommonPathItems() {
      return this.commonPathItems.map((item) => {
        return {
          ...item,
          distance: this.getDistanceInMeter(item),
        };
      });
    },
  },
  methods: {
    roomClick(item) {
      this.$emit("roomClick", {
        room: item,
      });
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
        // console.log(item);
        for (
          let i = 0;
          i < item.minimumNumberOfExit.minimumNumberOfExitItems.length;
          i++
        ) {
          // console.log(
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
      console.log("distance in on pixel");
      console.log(this.obj.scale.distanceInMeterForOnePixel);
      console.log("area in pixel");
      console.log(areaInPixel);
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

      self.exitStairWidthApi
        .getByBuildingRule(buildingRuleId)
        .then((response) => {
          self.paramExitStairWidth = response.result;
          //self.paramExitStairWidth
          // this.obj.defaultParam
          // console.log(esw);
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
