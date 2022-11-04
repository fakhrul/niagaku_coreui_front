<template>
  <v-group :config="configGroup">
    <v-rect :config="configArea"> </v-rect>
    <v-label
      :config="{
        x: 5,
        y: 10,
      }"
    >
      <v-text :config="{ text: 'AREA \n(M2)', fill: 'pink' }" />
    </v-label>
    <v-label
      :config="{
        x: 25,
        y: 35,
      }"
    >
      <v-text :config="{ text: areaText, fill: 'blue' }" />
    </v-label>
    <v-rect :config="configOl1"></v-rect>
    <v-label
      :config="{
        x: 55,
        y: 10,
      }"
    >
      <v-text :config="{ text: 'OL \n(M2)(P)', fill: 'pink' }" />
    </v-label>
    <v-label
      :config="{
        x: 70,
        y: 35,
      }"
    >
      <v-text :config="{ text: olnText, fill: 'blue' }" />
    </v-label>

    <v-rect :config="configOlf"></v-rect>
    <v-label
      :config="{
        x: 5,
        y: 60,
      }"
    >
      <v-text :config="{ text: 'OL', fill: 'pink' }" />
    </v-label>

    <v-label
      :config="{
        x: 25,
        y: 75,
      }"
    >
      <v-text :config="{ text: olfText, fill: 'blue' }" /> </v-label
    ><v-rect :config="configExit"></v-rect>
    <v-label
      :config="{
        x: 55,
        y: 60,
      }"
    >
      <v-text :config="{ text: 'EXIT', fill: 'pink' }" />
    </v-label>

    <v-label
      :config="{
        x: 75,
        y: 75,
      }"
    >
      <v-text :config="{ text: exitText, fill: 'blue' }" />
    </v-label>
  </v-group>
</template>

<script>
export default {
  name: "KvRoom",
  components: {},
  props: {
    obj: null,
    distanceInMeterForOnePixel: null,
  },
  data() {
    return {};
  },
  computed: {
    exitText(){
      return this.obj.totalDoorProvided;
    },
    areaText() {
      var area = this.getPolygonAreaInMeter();
      return Math.round(area);
    },
    olfText() {
      try {
        return this.obj.occupantLoadFactor.olfValue;
      } catch (error) {}
      return "N/A";
    },
    olnText() {
      try {
        var area = this.getPolygonAreaInMeter();
        var occupantNumber = area / this.obj.occupantLoadFactor.olfValue;
        return Math.round(occupantNumber);
      } catch (error) {}
      return "N/A";
    },
    configGroup() {
      console.log("this.obj", this.obj);
      return {
        name: this.obj.id + "group",
        id: this.obj.id,
        x: drawing.getCenterOfShape(this.obj.points)[0] - 50,
        y: drawing.getCenterOfShape(this.obj.points)[1] - 50,
        draggable: true,
      };
    },
    configArea() {
      return {
        width: 50,
        height: 50,
        stroke: "red",
        strokeWidth: 1,
        x: 0,
        y: 0,
      };
    },
    configOl1() {
      return {
        width: 50,
        height: 50,
        stroke: "red",
        strokeWidth: 1,
        x: 50,
        y: 0,
      };
    },
    configOlf() {
      return {
        width: 50,
        height: 50,
        stroke: "red",
        strokeWidth: 1,
        x: 0,
        y: 50,
      };
    },
    configExit() {
      return {
        width: 50,
        height: 50,
        stroke: "red",
        strokeWidth: 1,
        x: 50,
        y: 50,
      };
    },
  },
  watch: {
    obj(newVal, oldVal) {
      console.log("obj", newVal);
    },
  },
  methods: {
    getDistanceFromPixelPointInMeter() {},
    getPolygonAreaInMeter() {
      var areaInPixel = this.getPolygonArea();
      var areaInMeter =
        areaInPixel *
        this.distanceInMeterForOnePixel *
        this.distanceInMeterForOnePixel;
      areaInMeter = Math.round(areaInMeter * 1000) / 1000;
      return areaInMeter;
    },
    getPolygonArea() {
      var X = [];
      var Y = [];
      for (let i = 0; i < this.obj.points.length; i++) {
        if (i % 2 == 0) X.push(this.obj.points[i]);
        else Y.push(this.obj.points[i]);
      }
      return this.polygonArea(X, Y, X.length);
    },
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
  },
};
</script>