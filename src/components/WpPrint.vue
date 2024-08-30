<template>
  <div>
    <CToaster :autohide="3000">
      <template v-for="info in infoList">
        <CToast
          :key="info.message"
          :show="true"
          :header="info.header"
          :color="info.color"
        >
          {{ info.message }}.
        </CToast>
      </template>
    </CToaster>
    <div>
      <v-stage
        ref="stage"
        :config="stageSize"
        :style="{
          top: 0,
          overflow: 'auto',
        }"
      >
        <v-layer>
          <v-image
            ref="image"
            :config="{
              x: 0,
              y: 0,
              image: image,
            }"
          />
          <KvRoom
            v-for="item in rooms"
            :key="item.code"
            :obj="item"
            :distanceInMeterForOnePixel="distanceInMeterForOnePixel"
          >
          </KvRoom>
        </v-layer>
      </v-stage>
    </div>
  </div>
</template>
<script>
import FloorPlanApi from "@/lib/floorPlanApi";
import OlfMainCategoryApi from "@/lib/olfMainCategoryApi";
import OccupantLoadFactorApi from "@/lib/occupantLoadFactorApi";
import BuildingCodeApi from "@/lib/buildingCodeApi";
import OlfSubCategoryApi from "@/lib/olfSubCategoryApi";
import DeepFloorPlanApi from "@/lib/deepFloorPlanApi";
import RoomApi from "@/lib/roomApi";
import DoorApi from "@/lib/doorApi";
import KvRoom from "./KvRoom.vue";

export default {
  name: "WpPrint",
  components: {
    KvRoom,
  },
  props: {
    obj: null,
  },
  data() {
    return {
      infoList: [],
      api: new FloorPlanApi(),
      olfMainCategoryApi: new OlfMainCategoryApi(),
      occupantLoadFactorApi: new OccupantLoadFactorApi(),
      buildingCodeApi: new BuildingCodeApi(),
      olfSubCategoryApi: new OlfSubCategoryApi(),
      deepFloorPlanApi: new DeepFloorPlanApi(),
      doorApi: new DoorApi(),
      roomApi: new RoomApi(),

      stageSize: {
        width: 3000,
        height: 3000,
        draggable: true,
      },
      image: null,
      rooms: [],
      doors: [],
      exitStairAreas: [],
      exitStairDoors: [],
      exitStairWidths: [],
      exitSeperations: [],
      commonPaths: [],
      travelDistances: [],
      diagonalDistances: [],
      obstacles: [],
      corridorEnds: [],
      deadEnds: [],
    };
  },

  computed: {
    distanceInMeterForOnePixel() {
      console.log("this.obj.scale.distanceInMeterForOnePixel",this.obj.scale.distanceInMeterForOnePixel);
      return this.obj.scale.distanceInMeterForOnePixel;
    },
    floorPlanUrl() {
      var fullUrl = "";
      if (this.obj)
        fullUrl =
          apiUrl + "documents/file/" + this.obj.documentId;

      console.log(fullUrl);
      return fullUrl;
    },
  },
  watch: {
    obj(newVal, oldVal) {
      console.log("obj", newVal);
    },
    drawingMeta(newVal, oldVal) {
      console.log("drawingMeta", newVal);
    },

    floorPlanUrl(newVal, oldVal) {
      const image = new window.Image();
      image.src = this.floorPlanUrl;
      image.crossOrigin = "anonymous";
      image.onload = () => {
        this.image = image;
        this.stageSize.width = image.width * 2;
        this.stageSize.height = image.height * 2;

        this.exitSeperations = this.obj.exitSeperations;
        this.exitStairWidths = this.obj.exitStairWidths;
        this.exitStairDoors = this.obj.exitStairDoors;
        this.diagonalDistances = this.obj.diagonalDistances;
        this.travelDistances = this.obj.travelDistances;
        this.commonPaths = this.obj.commonPaths;
        this.rooms = this.obj.rooms;
        this.obstacles = this.obj.obstacles;
        this.doors = this.obj.doors;
        this.exitStairAreas = this.obj.exitStairAreas;
        this.corridorEnds = this.obj.corridorEnds;
        this.deadEnds = this.obj.deadEnds;
      };
    },
  },
  methods: {
    toast(header, message, color) {
      var self = this;
      self.infoList.push({
        header: header,
        message: message,
        color: color,
      });
    },
  },
};
</script>
