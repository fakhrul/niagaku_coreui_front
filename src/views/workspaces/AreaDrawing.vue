<template>
  <!-- <div id="scroll-container">
    <div id="large-container"> -->
  <div>
    <div class="btn-container">
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
      <!-- <button @click="drawType = ''">Empty</button> -->
      <!-- <button @click="drawType = 'pencil'">Pencil</button>-->
      <!-- <button @click="drawTypeSelect('line')">Line</button> -->
      <!-- <button @click="drawTypeSelect('polygon')">Polygon</button> -->

      <!--  <button @click="drawTypeSelect('ellipse')">Ellipse</button> -->
      <!-- <button @click="drawTypeSelect('right')">Right</button>
      <button @click="drawTypeSelect('wrong')">Wrong</button>
      <button @click="drawTypeSelect('move')">Move</button> -->
      <!-- <img :src="imgSrc" alt /> -->
      <!-- <button @click="drawTypeSelect('exitSeperation')">
        Exit Seperation (ES)
      </button>
      <button @click="drawTypeSelect('diagonalDistance')">
        Diagonal Distance (DD)
      </button>
      <button @click="drawTypeSelect('travelDistance')">
        Travel Distance (TD)
      </button>
      <button @click="drawTypeSelect('commonPath')">Common Path (CP)</button>
      <button @click="drawTypeSelect('stairExit')">Stair Exit Area</button>
      <button @click="drawTypeSelect('room')">Room Area</button>
      <button @click="drawTypeSelect('obstacle')">Obstacle</button>
      <button @click="drawTypeSelect('door')">Door</button>
      <button @click="drawTypeSelect('scale')">Scale</button> -->
      <!-- <button @click="drawTypeSelect('line')">Common Path (CP)</button> -->
      <!-- <button @click="handleAddText">Add Text</button> -->
      <!-- <button @click="handleRotate">Rotate</button> -->
      <button @click="handleClear">Clear</button>
      <button @click="handleSaveBase64">Export</button>
      <button @click="handlePrevStep">Undo</button>
      <button @click="handleNextStep">Redo</button>
      <button @click="handleSave">Save</button>

    </div>
    <div class="btn-container">
 
      <button @click="drawTypeSelect('scale')">Scale</button>
      <button @click="drawTypeSelect('room')">Room Area</button>
      <button @click="drawTypeSelect('stairExit')">Exit Stair Area (ESA)</button>
      <button @click="drawTypeSelect('exitStairWidth')">
        Exit Stair Width (ESW)
      </button>

      <button @click="drawTypeSelect('exitSeparation')">
        Exit Seperation (ES)
      </button>
      <button @click="drawTypeSelect('diagonalDistance')">
        Diagonal Distance (DD)
      </button>
      <button @click="drawTypeSelect('travelDistance')">
        Travel Distance (TD)
      </button>
      <button @click="drawTypeSelect('commonPath')">Common Path (CP)</button>
      <button @click="drawTypeSelect('obstacle')">Obstacle</button>
      <button @click="drawTypeSelect('door')">Room Door Exit</button>

    </div>
    <div>
      <input type="color" v-model="stroke" />
      <input type="number" v-model.number="strokeWidth" />
      <button @click="handleDone">Done</button>
    </div>
    <!--  <div style="margin-top: 3px" v-for="item in scales" :key="item.name">
      {{ item.name }}
      {{ getDistance(item) }} pixel =
      <input placeholder="In Meter" type="text" v-model="item.lengthInMeter" />
      m , 1 pixel = {{ getDistanceForOnePixel(item) }} meter
       <img
        @click="deleteMarker(item.id)"
        style="padding-left: 5px"
        width="20px"
        height="20px"
        src="https://uploads.codesandbox.io/uploads/user/3aeccaa8-9715-47e0-9dae-ba7c2affc15e/3Jdi-delete.png"
      /> 
    </div>-->
    <div style="margin-top: 3px">
      {{ getDistance(obj.scale) }} pixel =
      <input
        placeholder="In Meter"
        type="text"
        v-model="obj.scale.lengthInMeter"
      />
      m , 1 pixel = {{ getDistanceForOnePixel(obj.scale) }} meter
    </div>
    <!-- <div style="margin-top: 3px" v-for="item in rooms" :key="item.name">
      {{ item.name }}
      {{ getPolygonArea(item) }} pixel sq, = {{ getPolygonAreaInMeter(item) }} m
      sq
    </div>

    <div
      style="margin-top: 3px"
      v-for="item in diagonalDistances"
      :key="item.name"
    >
      {{ item.name }}
      {{ getDistance(item) }} pixel, {{ getDistanceInMeter(item) }} m
    </div> -->
    <!-- <v-stage
      ref="stage"
      :config="stageSize"
      class="stage"
      @mousedown="handleStageMouseDown"
      @mouseup="handleStageMouseUp"
      @mousemove="handleStageMouseMove"
    > -->
    <v-stage
      ref="stage"
      :config="stageSize"
      class="stage"
      @click="handleStageMouseClick"
    >
      <v-layer ref="layer">
        <v-image
          :config="{ image: image }"
          @mousemove="handleMouseMove"
        />
        <!-- <v-image
          :config="{ image: image }"
          @click="handleMouseClick"
          @mousemove="handleMouseMove"
        /> -->
        <!-- <v-rect @mousemove="handleMouseMove" :config="stageSize" /> -->
        <v-text
          ref="text"
          :config="{
            x: point_x,
            y: point_y,
            text: point_text,
            fontSize: 15,
          }"
        />
        <!-- <v-shape
          v-for="(item, index) in shapes"
          :key="item.name"
          :config="item"
        /> -->
        <v-line
          v-for="(item, index) in lines"
          :key="item.name"
          :config="item"
        />
        <v-line :config="obj.scale" />

        <!-- <v-line
          v-for="(item, index) in scales"
          :key="item.name"
          :config="item"
        /> -->
        <v-line
          v-for="(item, index) in polygons"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in rooms"
          :key="item.name"
          :config="item"
        />
        <!-- <v-group
          v-for="(item, index) in rooms"
          :key="item.name"
          @transform="handleGroupTransform"
        >
          <v-line :config="item" />
         
          <v-rect
            :config="{
              width: item.width,
              height: item.height,
              fill: item.fill,
              strokeScaleEnabled: false,
            }"
          />
           <v-text
            :config="{
              text: `w: ${item.posW} h: ${item.posH} \n y: ${item.y} x: ${item.x}`,
              strokeScaleEnabled: false,
            }"
            ref="text"
          /> 
          <v-text
            :config="{
              text: `Room : ${item.name}`,
              strokeScaleEnabled: false,
            }"
            ref="text"
          />
        </v-group> -->

        <v-line
          v-for="(item, index) in obstacles"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in doors"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in exitStairAreas"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in exitStairWidths"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in exitSeperations"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in diagonalDistances"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in travelDistances"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in commonPaths"
          :key="item.name"
          :config="item"
        />
        <v-text
          ref="text"
          v-for="item in texts"
          :key="item.name"
          :config="item"
        />
        <v-circle
          @click="handleClickOnPolygonNode"
          v-for="item in anchors"
          :key="item.id"
          :config="{
            id: item.id,
            x: item.x,
            y: item.y,
            radius: 4,
            fill: 'white',
            stroke: item.stroke,
            draggable: true,
          }"
        />
        <!-- poligon end -->
        <v-transformer ref="transformer" :config="transfer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Konva from "konva";
import FloorPlanApi from "../../lib/floorPlanApi";

const width = 8000; //window.innerWidth;
const height = 8000; //window.innerHeight;

export default {
  name: "AreaDrawing",
  data() {
    return {
      stroke: "black",
      strokeWidth: 4,
      stageSize: { width: width, height: height },
      image: null,
      point_text: "",
      point_x: 0,
      point_y: 0,

      //

      drawType: "",
      imageConfig: {
        name: "image0",
        width: 0,
        height: 0,
        image: null,
      },
      lines: [],
      scales: [],
      polygons: [],
      exitSeperations: [],
      exitStairWidths: [],
      diagonalDistances: [],
      travelDistances: [],
      exitStairAreas: [],
      commonPaths: [],
      rooms: [],
      obstacles: [],
      doors: [],
      texts: [],
      anchors: [],
      points: [],
      isPolygonFinished: false,
      closed: false,
      posArr: [],
      transfer: {
        enabledAnchors: ["middle-left", "middle-right"],
        // set minimum width of text
        boundBoxFunc: function (oldBox, newBox) {
          newBox.width = Math.max(30, newBox.width);
          return newBox;
        },
      },
      selectedShapeName: "",
      isPaint: false, // 开始画
      moveFrom: {
        x: 0,
        y: 0,
      },
      moveTo: {
        x: 0,
        y: 0,
      },
      rotated: 0,
      isAddTexting: false,
      stageHistory: [
        {
          lines: [],
          scales: [],
          polygons: [],
          commonPaths: [],
          rooms: [],
          obstacles: [],
          doors: [],
          texts: [],
          exitSeperations: [],
          exitStairWidths:[],
          diagonalDistances: [],
          travelDistances: [],
          exitStairAreas: [],
        },
      ],
      step: 0,
      drawingState: "",
      mouseClickPoint: [],
      api: new FloorPlanApi(),
    };
  },
  created() {
    const image = new window.Image();
    image.src = this.floorPlanUrl;

    image.onload = () => {
      this.image = image;
    };
  },
  watch: {},
  mounted() {
 
    if (this.obj.scale == null) {
      this.obj.scale = {
        lengthInMeter: 0,
      };
    }
    console.log(this.obj);
    this.lines = this.obj.lines;
    this.scales = this.obj.scales;
    this.polygons = this.obj.polygons;
    this.exitSeperations = this.obj.exitSeperations;
    this.exitStairWidths = this.obj.exitStairWidths;

this.diagonalDistances = this.obj.diagonalDistances;
    this.travelDistances = this.obj.travelDistances;
    this.commonPaths = this.obj.commonPaths;
    this.rooms = this.obj.rooms;
    this.obstacles = this.obj.obstacles;
    this.doors = this.obj.doors;
    this.exitStairAreas = this.obj.exitStairAreas;
  },
  props: {
    obj: {},
  },
  computed: {
    floorPlanUrl() {
      var self = this;
      return (
        process.env.VUE_APP_API_URL + "documents/file/" + self.obj.documentId
      );
    },

    drawingObject() {
      var self = this;
      return self.obj;
    },
  },
  methods: {
    getPolygonAreaInMeter(item) {
      var areaInPixel = this.getPolygonArea(item);
      return areaInPixel * this.obj.scale.distanceInMeterForOnePixel;
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
      return distanceInPixel * this.obj.scale.distanceInMeterForOnePixel;
    },
    getDistanceForOnePixel(item) {
      var distanceInPixel = this.getDistance(item);
      var distanceInMeter = item.lengthInMeter;
      var distanceInMeterForOnePixel = distanceInMeter / distanceInPixel;
      this.obj.scale.distanceInMeterForOnePixel = distanceInMeterForOnePixel;
      return this.obj.scale.distanceInMeterForOnePixel;
    },
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
    // deleteScale(name) {
    //   let loc = this.getByValue(this.list, name);
    //   this.scales.splice(loc, 1);
    //   let count = 1;
    //   this.scales.forEach(function(item, index) {
    //     item.id = count;
    //     count++;
    //   });
    // },
    // getByValue(arr, value) {
    //   for (var i = 0, iLen = arr.length; i < iLen; i++) {
    //     if (arr[i].id == value) return i;
    //   }
    // },

    drawTypeSelect(draw) {
      this.drawType = draw;
      this.drawingState = "";

      if (this.drawType === "line") {
        this.stroke = "black";
      }
      if (this.drawType === "scale") {
        this.stroke = "black";
        //exitStairWidth
      } else if (this.drawType === "exitStairWidth") {
        this.stroke = "black";
      } else if (this.drawType === "exitSeparation") {
        this.stroke = "red";
      } else if (this.drawType === "polygon") {
        this.stroke = "pink";
      } else if (this.drawType === "diagonalDistance") {
        this.stroke = "green";
      } else if (this.drawType === "travelDistance") {
        this.stroke = "blue";
      } else if (this.drawType === "commonPath") {
        this.stroke = "purple";
      } else if (this.drawType === "room") {
        this.stroke = "brown";
      } else if (this.drawType === "stairExit") {
        this.stroke = "yellow";
      } else if (this.drawType === "obstacle") {
        this.stroke = "orange";
      } else if (this.drawType === "doors") {
        this.stroke = "red";
      }
    },
    handleGroupTransform(e) {},
    handleMouseMove(event) {
      // let stage = this.$refs.stage.getStage();
      // let layer = this.$refs.layer.getStage();
      // let _moveTo = stage.getRelativePointerPosition();
      // if (this.drawType === "line") {
      //   this.lines[this.lines.length - 1].points = [
      //     this.mouseClickPoint[this.mouseClickPoint.length - 1].x,
      //     this.mouseClickPoint[this.mouseClickPoint.length - 1].y,
      //     _moveTo.x,
      //     _moveTo.y,
      //   ];
      // } else {
      // }
    },
    handleDone() {
      this.drawingState = "end";
      if (this.drawType === "polygon") {
        this.handleDrawPolygon();
      } else if (this.drawType === "travelDistance") {
        this.handleDrawTravelDistance();
      } else if (this.drawType === "commonPath") {
        this.handleDrawCommonPath();
      } else if (this.drawType === "room") {
        this.handleDrawRoom();
      } else if (this.drawType === "stairExit") {
        this.handleDrawStairExit();
      } else if (this.drawType === "obstacle") {
        this.handleDrawObstacle();
      } else if (this.drawType === "door") {
        this.handleDrawDoor();
      }
    },
    handleStageMouseClick(event) {
      if (this.drawType === "line") {
        this.handleDrawLine();
      } else if (this.drawType === "scale") {
        this.handleDrawScale();
        
      } else if (this.drawType === "exitStairWidth") {
        this.handleDrawExitStairWidth();
      } else if (this.drawType === "exitSeparation") {
        this.handleDrawExitSeperation();
      } else if (this.drawType === "polygon") {
        this.handleDrawPolygon();
      } else if (this.drawType === "diagonalDistance") {
        this.handleDrawDiagonalDistance();
      } else if (this.drawType === "travelDistance") {
        this.handleDrawTravelDistance();
      } else if (this.drawType === "commonPath") {
        this.handleDrawCommonPath();
      } else if (this.drawType === "room") {
        this.handleDrawRoom();
      } else if (this.drawType === "stairExit") {
        this.handleDrawStairExit();
      } else if (this.drawType === "obstacle") {
        this.handleDrawObstacle();
      } else if (this.drawType === "door") {
        this.handleDrawDoor();
      }
    },
    handleClickOnPolygonNode(event) {
      const id = event.target.id();
      const item = this.anchors.find((i) => i.id === id);
      const index = this.anchors.indexOf(item);

      if (index === 0) {
        this.closed = true;
        this.isPolygonFinished = true;
        this.anchors[this.anchors.length - 1].stroke = "black";
      }
    },
    handleDrawPolygon() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.polygons.push({
          name: "polygon" + this.polygons.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.polygons[this.polygons.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawStairExit() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.exitStairAreas.push({
          name: "stairExit" + this.exitStairAreas.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitStairAreas[this.exitStairAreas.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawDoor() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.doors.push({
          name: "door" + this.doors.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.doors[this.doors.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawObstacle() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.obstacles.push({
          name: "obstacle" + this.obstacles.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.obstacles[this.obstacles.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawRoom() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.rooms.push({
          name: "room" + this.rooms.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: true,
          fill: "rgb(58, 141, 243, 0.3)",
        });
        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.rooms[this.rooms.length - 1].points.push(x, y);
      } else if (this.drawingState == "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawCommonPath() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "purple",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.commonPaths.push({
          name: "commonPath" + this.commonPaths.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.commonPaths[this.commonPaths.length - 1].points.push(x, y);
        this.handleSaveHistory();
      } else if (this.drawingState === "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawTravelDistance() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.travelDistances.push({
          name: "travelDistance" + this.travelDistances.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          closed: false,
          // lineCap: "round",
          // lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "progress";
      } else if (this.drawingState === "progress") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.travelDistances[this.travelDistances.length - 1].points.push(x, y);
        this.handleSaveHistory();
      } else if (this.drawingState === "end") {
        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },

    handleDrawDiagonalDistance() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.diagonalDistances.push({
          name: "diagonalDistance" + this.diagonalDistances.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.diagonalDistances[this.diagonalDistances.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawExitStairWidth() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.exitStairWidths.push({
          name: "exitStairWidth" + this.exitStairWidths.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitStairWidths[this.exitStairWidths.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        console.log("END2");
        this.handleSaveHistory();
        console.log("END");
      }
    },
    handleDrawExitSeperation() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.exitSeperations.push({
          name: "exitSeparation" + this.exitSeperations.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.exitSeperations[this.exitSeperations.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        console.log("END2");
        this.handleSaveHistory();
        console.log("END");
      }
    },
    handleDrawScale() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });
        this.obj.scale = {
          name: "scale",
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          draggable: true,
        };
        // this.scales.push({
        //   name: "scale" + this.scales.length,
        //   points: [x, y],
        //   stroke: this.stroke,
        //   strokeWidth: this.strokeWidth,
        //   lineCap: "round",
        //   lineJoin: "round",
        //   draggable: true,
        // });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.obj.scale.points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];
        // this.scales[this.scales.length - 1].points = [
        //   this.mouseClickPoint[0].x,
        //   this.mouseClickPoint[0].y,
        //   x,
        //   y,
        // ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    handleDrawLine() {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      const x = mousePos.x;
      const y = mousePos.y;
      if (this.drawingState === "") {
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });
        this.mouseClickPoint.push({
          x: x,
          y: y,
        });

        this.lines.push({
          name: "line" + this.lines.length,
          points: [x, y],
          stroke: this.stroke,
          strokeWidth: this.strokeWidth,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });

        this.drawingState = "end";
      } else if (this.drawingState === "end") {
        if (this.anchors.length > 0) {
          this.anchors[this.anchors.length - 1].stroke = "black";
        }
        this.anchors.push({
          id: Math.round(Math.random() * 10000).toString(),
          x: x,
          y: y,
          stroke: "green",
        });

        this.lines[this.lines.length - 1].points = [
          this.mouseClickPoint[0].x,
          this.mouseClickPoint[0].y,
          x,
          y,
        ];

        this.anchors = [];
        this.mouseClickPoint = [];
        this.drawingState = "";
        this.handleSaveHistory();
      }
    },
    clear(event) {
      this.closed = false;
      this.isPolygonFinished = false;

      this.points = [];
      this.anchors = [];
    },
    // handleMouseMove(event) {
    //   const point = this.$refs.stage.getNode().getPointerPosition();
    //   this.point_x = point.x;
    //   this.point_y = point.y;
    //   this.point_text = "x: " + point.x + ", y: " + point.y;
    // },
    zoomIn() {
      this.scaleBy(0.1);
    },
    zoomOut() {
      this.scaleBy(-0.1);
    },
    scaleBy(scale) {
      //var scaleBy = scale;
      var stage = this.$refs.stage.getStage();
      var oldScale = stage.scaleX();
      // var pointer = stage.getPointerPosition();

      // var mousePointTo = {
      //   x: (pointer.x - stage.x()) / oldScale,
      //   y: (pointer.y - stage.y()) / oldScale,
      // };

      // var newScale =
      //   e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      var newScale = oldScale + scale; // oldScale + scale;
      stage.scale({ x: newScale, y: newScale });

      // var newPos = {
      //   x: pointer.x - mousePointTo.x * newScale,
      //   y: pointer.y - mousePointTo.y * newScale,
      // };
      // stage.position(newPos);
    },

    handleSaveHistory() {
      this.step += 1;
      this.stageHistory = [
        ...this.stageHistory,
        {
          lines: [...this.lines],
          scales: [...this.scales],
          polygons: [...this.polygons],
          rooms: [...this.rooms],
          obstacles: [...this.obstacles],
          doors: [...this.doors],
          texts: [...this.texts],
          exitSeperations: [...this.exitSeperations],
          exitStairWidths: [...this.exitStairWidths],
          diagonalDistances: [...this.diagonalDistances],
          travelDistances: [...this.travelDistances],
          commonPaths: [...this.commonPaths],
          exitStairAreas: [...this.exitStairAreas],
        },
      ];
      console.log("history", this.stageHistory);
    },
    handlePrevStep() {
      if (this.step == 0) {
        return;
      } else {
        this.step = this.step - 1;
        let _cur = this.stageHistory[this.step];
        console.log(_cur);
        const {
          lines,
          scales,
          polygons,
          commonPaths,
          rooms,
          obstacles,
          doors,
          texts,
          exitSeperations,
          exitStairWidths,
          diagonalDistances,
          travelDistances,
          exitStairAreas,
        } = _cur;
        this.lines = [...lines];
        this.scales = [...scales];
        this.polygons = [...polygons];
        this.rooms = [...rooms];
        this.obstacles = [...obstacles];
        this.doors = [...doors];
        this.commonPaths = [...commonPaths];
        // this.shapes = [...shapes];
        this.texts = [...texts];
        this.exitSeperations = [...exitSeperations];
        this.exitStairWidths = [...exitStairWidths];
        this.diagonalDistances = [...diagonalDistances];
        this.travelDistances = [...travelDistances];
        this.exitStairAreas = [...exitStairAreas];
      }
    },
    handleNextStep() {
      if (this.step == this.stageHistory.length - 1) {
        return;
      } else {
        this.step = this.step + 1;
        console.log(this.step);
        let _cur = this.stageHistory[this.step];
        console.log(_cur);
        const {
          lines,
          scales,
          polygons,
          commonPaths,
          rooms,
          doors,
          obstacles,
          texts,
          exitStairWidths,
          exitSeperations,
          diagonalDistances,
          travelDistances,
          exitStairAreas,
        } = _cur;
        this.lines = [...lines];
        this.scales = [...scales];
        this.polygons = [...polygons];
        this.commonPaths = [...commonPaths];
        this.doors = [...doors];
        this.obstacles = [...obstacles];
        this.rooms = [...rooms];
        this.texts = [...texts];
        this.exitStairWidths = [...exitStairWidths];
        this.exitSeperations = [...exitSeperations];
        this.diagonalDistances = [...diagonalDistances];
        this.travelDistances = [...travelDistances];
        this.exitStairAreas = [...exitStairAreas];
      }
    },
    initBg() {
      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.src = "http://image.cqfee.top/a.jpg";
      // image.src='http://image.cqfee.top/123.png'
      image.onload = () => {
        // set image only when it is loaded
        let _w = this.$refs.stage.getStage().width(); // stage宽
        let _h = (image.height * _w) / image.width; // stage高是图片等比例放大的高
        this.stageSize.height = _h;
        this.imageConfig.width = _w;
        this.imageConfig.height = _h;
        this.imageConfig.image = image;
      };
    },
    handleClear() {
      this.lines = this.polygons = this.texts = [];
      this.exitSeperations = [];
      this.exitStairWidths = [];
      this.diagonalDistances = [];
      this.travelDistances = [];
      this.commonPaths = [];
      this.rooms = [];
      this.doors = [];
      this.obstacles = [];
      this.exitStairAreas = [];
      this.scales = [];
      // this.init();
    },
    handleRotate() {
      this.rotated++;
      let _rotation = (this.rotated % 4) * 90;

      const image = new window.Image();
      image.crossOrigin = "anonymous";
      image.src = "http://image.cqfee.top/a.jpg";
      // image.src='http://image.cqfee.top/123.png'
      image.onload = () => {
        // set image only when it is loaded
        let w = image.width;
        let h = image.height;
        if (_rotation == 90 || _rotation == 270) {
          this.imageConfig.image = image;

          let _w = this.$refs.stage.getStage().attrs.width; // stage宽
          this.imageConfig.width = (_w * w) / h;
          this.imageConfig.height = _w;

          let _h = (w * _w) / h; // stage高是图片等比例放大的高

          this.stageSize.width = _w;
          this.stageSize.height = _h;

          this.imageConfig = {
            ...this.imageConfig,
            x: this.stageSize.width / 2,
            y: this.stageSize.height / 2,
            rotation: _rotation,
            offset: {
              x: this.stageSize.width / 2,
              y: this.stageSize.height / 2,
            },
          };
        } else {
          let _w = this.stageSize.width; // stage宽
          let _h = (h * _w) / w; // stage高是图片等比例放大的高
          this.stageSize.height = _h;
          this.imageConfig = {
            image,
            width: _w,
            height: _h,
            x: this.stageSize.width / 2,
            y: this.stageSize.height / 2,
            rotation: _rotation,
            offset: {
              x: this.stageSize.width / 2,
              y: this.stageSize.height / 2,
            },
          };
        }
      };
    },
    handleAddText() {
      this.drawType = "addText";
      this.isAddTexting = true;
      let _name = "text" + this.texts.length;
      this.texts.push({
        name: _name,
        x: 200,
        y: 300,
        width: 200,
        text: "Insert text here...",
        fill: "red",
        fontSize: 20,
        draggable: true,
      });
      this.handleSaveHistory();
    },
    handleSave() {
      var self = this;
      self.obj.lines = this.lines;
      self.obj.scales = this.scales;
      self.obj.polygons = this.polygons;
      self.obj.rooms = this.rooms;
      self.obj.doors = this.doors;
      self.obj.obstacles = this.obstacles;
      self.obj.exitSeperations = this.exitSeperations;
      self.obj.exitStairWidths = this.exitStairWidths;
      self.obj.diagonalDistances = this.diagonalDistances;
      self.obj.travelDistances = this.travelDistances;
      self.obj.commonPaths = this.commonPaths;
      self.obj.exitStairAreas = this.exitStairAreas;
      this.api
        .update(self.obj)
        .then((response) => {
          console.log("save");
          // self.$router.push({ path: "/tenant/floorPlanlist" });
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
          // console.log(data);
        });
    },
    handleSaveBase64() {
      var dataURL = this.$refs.stage.getStage().toDataURL();
      console.log(dataURL);
      this.downloadURI(dataURL, "stage.png");
    },
    handleStageMouseDown(e) {
      this.isPaint = true;
      this.moveFrom = this.$refs.stage.getStage().getRelativePointerPosition();
      console.log("moveFrom", this.moveFrom);
    },
    handleRoomMouseDown(e) {
      const mousePos = this.$refs.stage.getStage().getRelativePointerPosition();
      console.log(mousePos.x, mousePos.y);
    },
    handleStageMouseUp(e) {
      this.isPaint = false;
      // this.moveTo = this.$refs.stage.getStage().getPointerPosition();
      this.moveTo = this.$refs.stage.getStage().getRelativePointerPosition();

      console.log(this.moveTo);
      let _moveTo = this.moveTo;

      console.log(1, e.target.name());
      if (e.target.name() == "image0") {
        return;
      } else {
        this.handleSaveHistory();
      }
    },
    handleStageMouseMove() {
      if (!this.isPaint) {
        return;
      }
      //   let stage = this.$refs.stage.getStage();
      //   let layer = this.$refs.layer.getStage();
      //   // let _moveTo = stage.getPointerPosition();
      //   let _moveTo = stage.getRelativePointerPosition();

      //   if (this.drawType === "pencil") {
      //     this.lines[this.lines.length - 1].points = [
      //       ...this.lines[this.lines.length - 1].points,
      //       _moveTo.x,
      //       _moveTo.y,
      //     ];
      //     this.$refs.layer.getStage().batchDraw();
      //   } else if (this.drawType === "line") {
      //     // 画圆环
      //     // console.log('moveTo', _moveTo)
      //     // console.log([this.moveFrom.x,this.moveFrom.y,  _moveTo.x, _moveTo.y])
      //     this.lines[this.lines.length - 1].points = [
      //       this.moveFrom.x,
      //       this.moveFrom.y,
      //       _moveTo.x,
      //       _moveTo.y,
      //     ];
      //     // this.$refs.layer.getStage().batchDraw();
      //     // } else if (this.drawType === "exitSeperation") {
      //     //   // 画圆环
      //     //   // console.log('moveTo', _moveTo)
      //     //   // console.log([this.moveFrom.x,this.moveFrom.y,  _moveTo.x, _moveTo.y])
      //     //   this.exitSeperations[this.exitSeperations.length - 1].points = [
      //     //     this.moveFrom.x,
      //     //     this.moveFrom.y,
      //     //     _moveTo.x,
      //     //     _moveTo.y,
      //     //   ];
      //     // } else if (this.drawType === "diagonalDistance") {
      //     //   // 画圆环
      //     //   // console.log('moveTo', _moveTo)
      //     //   // console.log([this.moveFrom.x,this.moveFrom.y,  _moveTo.x, _moveTo.y])
      //     //   this.diagonalDistances[this.diagonalDistances.length - 1].points = [
      //     //     this.moveFrom.x,
      //     //     this.moveFrom.y,
      //     //     _moveTo.x,
      //     //     _moveTo.y,
      //     //   ];
      //     // } else if (this.drawType === "travelDistance") {
      //     //   this.travelDistances[this.travelDistances.length - 1].points = [
      //     //     this.moveFrom.x,
      //     //     this.moveFrom.y,
      //     //     _moveTo.x,
      //     //     _moveTo.y,
      //     //   ];
      // //   } else if (this.drawType === "ellipse") {
      // //     this.ellipses[this.ellipses.length - 1].radius = {
      // //       x: Math.abs(_moveTo.x - this.moveFrom.x),
      // //       y: Math.abs(_moveTo.y - this.moveFrom.y),
      // //     };
      // //     this.$refs.layer.getStage().batchDraw();
      // //   }
      // // },
      // resizeText(e) {
      //   console.log(e.target);
      //   // clicked on stage - cler selection
      //   if (e.target === e.target.getStage()) {
      //     this.selectedShapeName = "";
      //     this.updateTransformer();
      //     return;
      //   }

      //   // clicked on transformer - do nothing
      //   const clickedOnTransformer =
      //     e.target.getParent().className === "Transformer";
      //   if (clickedOnTransformer) {
      //     return;
      //   }

      //   // find clicked text by its name
      //   const name = e.target.name();
      //   const text = this.texts.find((t) => t.name === name);
      //   if (text) {
      //     this.selectedShapeName = name;
      //   } else {
      //     this.selectedShapeName = "";
      //   }
      //   this.updateTransformer();
    },
    updateTransformer() {
      // here we need to manually attach or detach Transformer node
      const transformerNode = this.$refs.transformer.getStage();
      const stage = transformerNode.getStage();
      const { selectedShapeName } = this;
      const selectedNode = stage.findOne("." + selectedShapeName);
      // do nothing if selected node is already attached
      if (selectedNode === transformerNode.node()) {
        return;
      }

      if (selectedNode) {
        // attach to another node
        transformerNode.attachTo(selectedNode);
        // textNode 随着transform宽度增加而增加
        selectedNode.on("transform", function () {
          // reset scale, so only with is changing by transformer
          selectedNode.setAttrs({
            width: selectedNode.width() * selectedNode.scaleX(),
            scaleX: 1,
          });
        });
      } else {
        // remove transformer
        transformerNode.detach();
      }
      transformerNode.getLayer().batchDraw();
    },
    initTextNode(textNode) {
      let _this = this;
      console.log(123, "init");
      textNode.on("dblclick", () => {
        console.log("dbclick");
        // hide text node and transformer:
        textNode.hide();
        if (textNode.text() == "请在此双击输入文本内容...") {
          textNode.text("");
        }
        // tr.hide();
        this.$refs.transformer.getStage().hide();
        _this.$refs.layer.getStage().draw();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = textNode.absolutePosition();

        // then lets find position of stage container on the page:
        var stageBox = this.$refs.stage
          .getStage()
          .container()
          .getBoundingClientRect();

        // so position of textarea will be the sum of positions above:
        var areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y + document.documentElement.scrollTop,
        };

        // create textarea and style it
        var textarea = document.createElement("textarea");
        document.body.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = textNode.text();
        textarea.style.position = "absolute";
        textarea.style.top = areaPosition.y + "px";
        textarea.style.left = areaPosition.x + "px";
        textarea.style.zIndex = 99999999;
        textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + "px";
        textarea.style.fontSize = textNode.fontSize() + "px";
        textarea.style.border = "none";
        textarea.style.padding = "0px";
        textarea.style.margin = "0px";
        textarea.style.overflow = "hidden";
        textarea.style.background = "none";
        textarea.style.outline = "none";
        textarea.style.resize = "none";
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = "left top";
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        var rotation = textNode.rotation();
        var transform = "";
        if (rotation) {
          transform += "rotateZ(" + rotation + "deg)";
        }

        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (isFirefox) {
          px += 2 + Math.round(fontSize / 20);
        }
        transform += "translateY(-" + px + "px)";

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = "auto";
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + "px";

        textarea.focus();

        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener("click", handleOutsideClick);
          textNode.show();

          // tr.show();
          // tr.forceUpdate();
          _this.$refs.transformer.getStage().show();
          _this.$refs.transformer.getStage().forceUpdate();
          _this.$refs.layer.getStage().draw();
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
          }
          // some extra fixes on different browsers
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          var isFirefox =
            navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
          }

          var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
          if (isEdge) {
            newWidth += 1;
          }
          textarea.style.width = newWidth + "px";
        }

        textarea.addEventListener("keydown", function (e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });

        textarea.addEventListener("keydown", function (e) {
          var scale = textNode.getAbsoluteScale().x;
          setTextareaWidth(textNode.width() * scale);
          textarea.style.height = "auto";
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + "px";
        });

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            removeTextarea();
          }
        }

        setTimeout(() => {
          window.addEventListener("click", handleOutsideClick);
        });
      });
    },
    downloadURI(uri, name) {
      this.imgSrc = uri;
      // var img = document.createElement("img");
      // img.src=uri;
      // document.createElement(img);
      // var link = document.createElement("img");
      // link.download = name;
      // link.href = uri;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    },
    handleDrawEllipse() {
      this.drawType = "ellipse";
      let _w = this.$refs.stage.getStage().width();
      let _h = this.$refs.stage.getStage().height();
      var canvas = document.createElement("canvas");
      canvas.width = _w;
      canvas.height = _h;
      console.log(1, canvas.height);
      // created canvas we can add to layer as "Konva.Image" element
      var image = new Konva.Image({
        image: canvas,
        x: _w,
        y: _h,
        stroke: "green",
        shadowBlur: 5,
      });
      this.$refs.layer.getStage().add(image);
      this.$refs.stage.getStage().draw();

      let stage = this.$refs.stage.getStage();
      let layer = this.$refs.layer.getStage();
      // Good. Now we need to get access to context element
      var context = canvas.getContext("2d");
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 5;

      var isPaint = false;
      var lastPointerPosition;
      var mode = "brush";

      // now we need to bind some events
      // we need to start drawing on mousedown
      // and stop drawing on mouseup
      image.on("mousedown touchstart", function () {
        isPaint = true;
        // lastPointerPosition = stage.getPointerPosition();
        lastPointerPosition = stage.getRelativePointerPosition();
        console.log("s", lastPointerPosition);
      });

      stage.addEventListener("mouseup touchend", function () {
        isPaint = false;
      });

      // and core function - drawing
      stage.addEventListener("mousemove touchmove", function () {
        if (!isPaint) {
          return;
        }
        console.log("222");
        if (mode === "brush") {
          context.globalCompositeOperation = "source-over";
        }
        if (mode === "eraser") {
          context.globalCompositeOperation = "destination-out";
        }
        context.beginPath();

        var localPos = {
          x: lastPointerPosition.x - image.x(),
          y: lastPointerPosition.y - image.y(),
        };
        context.moveTo(localPos.x, localPos.y);
        // var pos = stage.getPointerPosition();
        var pos = stage.getRelativePointerPosition();

        localPos = {
          x: pos.x - image.x(),
          y: pos.y - image.y(),
        };
        context.lineTo(localPos.x, localPos.y);
        context.closePath();
        context.stroke();

        lastPointerPosition = pos;
        layer.batchDraw();
      });
    },
  },
};
</script>

<style>
/* body {
  overflow-x: scroll;
} */
.stage {
  width: 100vw;
  height: 100vh;
  overflow: auto;
}
#large-container {
  width: 3000px;
  height: 3000px;
  overflow: hidden;
}

#scroll-container {
  width: calc(100% - 22px);
  height: calc(100vh - 22px);
  overflow: auto;
  margin: 10px;
  border: 1px solid grey;
}
/* body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  height: 100%;
  overflow: auto;
} */
/* .containercustom {
  width: 100vw;
  height: 100vh;
} */
</style>