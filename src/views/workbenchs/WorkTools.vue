<template>
  <div>
    <CCard>
      <CCardBody>
        <CButtonGroup
          role="group"
          aria-label="Button group with nested dropdown"
        >
          <CButton @click="scaleClick"  v-c-tooltip="'Scale'"
            ><CImg src="icons/scale.png" width="20"></CImg
          ></CButton>
          <CDropdown variant="btn-group">
            <template #toggler>
              <CHeaderNavLink>
                <CImg
                  src="icons/room.png"
                  width="20"
                  v-c-tooltip="'Room'"
                ></CImg>
              </CHeaderNavLink>
            </template>
            <CDropdownMenu>
              <CDropdownItem href="#" @click="roomRectClick">Rectangle</CDropdownItem>
              <CDropdownItem href="#" @click="roomClick">Polygon</CDropdownItem>
              <!-- <CDropdownItem href="#" @click="analyzeClick('room', 'template')"
                >Template Matching</CDropdownItem
              > -->
              <CDropdownItem href="#" @click="analyzeClick('room', 'color')"
                >Color based</CDropdownItem
              >
              <CDropdownItem href="#" @click="analyzeClick('room', 'thickness')"
                >Wall Thickness</CDropdownItem
              >
              <CDropdownItem href="#" @click="analyzeClick('room', 'ml')"
                >Machine Learning</CDropdownItem
              >
            </CDropdownMenu>
          </CDropdown>

          <CDropdown variant="btn-group">
            <template #toggler>
              <CHeaderNavLink>
                <CImg
                  src="icons/room_door_exit.png"
                  width="20"
                  v-c-tooltip="'Room Exit Door'"
                ></CImg>
              </CHeaderNavLink>
            </template>
            <CDropdownMenu>
              <CDropdownItem href="#" @click="doorVerticalClick">Vertical</CDropdownItem>
              <CDropdownItem href="#" @click="doorHorizontalClick">Horizontal</CDropdownItem>
              <CDropdownItem href="#" @click="doorClick">Two Points</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>

          <CButton @click="stairClick" v-c-tooltip="'Exit Stair Area'"
            ><CImg
              src="icons/exit_stair_area.png"
              width="20"
              
            ></CImg
          ></CButton>
          <CButton @click="stairWidthClick"  v-c-tooltip="'Exit Stair Width'"
            ><CImg
              src="icons/exit_stair_width.png"
              width="20"
             
            ></CImg
          ></CButton>
          <CButton @click="exitDoorClick" v-c-tooltip="'Stair Exit Door'"
            ><CImg
              src="icons/stair_exit_door.png"
              width="20"
              
            ></CImg
          ></CButton>
          <CDropdown variant="btn-group">
            <template #toggler>
              <CHeaderNavLink>
                <CImg
                  src="icons/travel_distance.png"
                  width="20"
                  v-c-tooltip="'Travel Distance'"
                ></CImg>
              </CHeaderNavLink>
            </template>
            <CDropdownMenu>
              <CDropdownItem href="#" @click="travelDistanceClick"
                >Manual</CDropdownItem
              >
              <CDropdownItem href="#" @click="travelDistanceAutoClick"
                >Djistrak Algorithm (Auto)</CDropdownItem
              >
            </CDropdownMenu>
          </CDropdown>
          <CButton @click="commonPathClick" v-c-tooltip="'Common Path'"
            ><CImg
              src="icons/common_path.png"
              width="20"
              
            ></CImg
          ></CButton>
          <CDropdown>
            <template #toggler>
              <CHeaderNavLink>
                <CImg
                  src="icons/obstacle.png"
                  width="20"
                  v-c-tooltip="'Obstacle'"
                ></CImg>
              </CHeaderNavLink>
            </template>
            <CDropdownMenu>
              <CDropdownItem href="#" @click="obstacleClick"
                >Manual</CDropdownItem
              >
              <!-- <CDropdownItem href="#" @click="analyzeClick('wall', 'template')"
              >Template Matching</CDropdownItem
            > -->
              <CDropdownItem href="#" @click="analyzeClick('wall', 'color')"
                >Color based</CDropdownItem
              >
              <CDropdownItem href="#" @click="analyzeClick('wall', 'thickness')"
                >Wall Thickness</CDropdownItem
              >
              <CDropdownItem href="#" @click="analyzeClick('wall', 'ml')"
                >Machine Learning</CDropdownItem
              >
            </CDropdownMenu>
          </CDropdown>
        </CButtonGroup>

      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {
  props: {},
  setup() {
    console.log("as");
  },
  methods: {
    myFunction() {
      console.log("asdas");
    },
    handleToggleShowSettings() {
      this.showSettings = !this.showSettings;
    },
    scaleClick() {
      this.$emit("scaleClick");
    },
    roomClick() {
      this.$emit("roomClick");
    },
    roomRectClick() {
      this.$emit("roomRectClick");
    },
    roomAutoClick() {
      this.$emit("roomAutoClick");
    },
    analyzeClick(category, method) {
      var item = {
        category: category,
        method: method,
      };
      this.$emit("analyzeClick", item);
    },
    stairClick() {
      this.$emit("stairClick");
    },
    stairWidthClick() {
      this.$emit("stairWidthClick");
    },
    exitSeperationClick() {
      this.$emit("exitSeperationClick");
    },
    diagonalDistanceClick() {
      this.$emit("diagonalDistanceClick");
    },
    travelDistanceClick() {
      this.$emit("travelDistanceClick");
    },
    travelDistanceAutoClick() {
      this.$emit("travelDistanceAutoClick");
    },
    commonPathClick() {
      this.$emit("commonPathClick");
    },
    obstacleClick() {
      this.$emit("obstacleClick");
    },
    doorClick() {
      this.$emit("doorClick");
    },
    doorVerticalClick() {
      this.$emit("doorVerticalClick");
    },
    doorHorizontalClick() {
      this.$emit("doorHorizontalClick");
    },
    exitDoorClick() {
      this.$emit("exitDoorClick");
    },
  },

  data() {
    return {
      showSettings: true,
    };
  },

  watch: {},
};
</script>

<style lang="sass" scoped>
aside
  width: 15rem
</style>