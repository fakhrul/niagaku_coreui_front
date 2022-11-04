<template>
  <div>
    <v-stage
      ref="stage"
      :config="stageSize"
      @click="handleStageMouseDown"
      @touchstart="handleStageMouseDown"
    >
      <v-layer ref="layer">
        <v-rect :config="background" />
        <!-- <v-image 
          :config="{
            image: image,
          }"
        /> -->
        <v-line v-for="item in poloygons" :key="item.id" :config="item" />
      </v-layer>
    </v-stage>

    <CRow>
      <CCol>
        <CCard>
          <CCardHeader> <strong> LoadImage </strong> Information </CCardHeader>
          <CCardBody> </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
//https://codesandbox.io/s/elastic-feather-fvwp8?file=/src/App.vue:544-612

import Konva from "konva";

const width = window.innerWidth;
const height = window.innerHeight;

export default {
  name: "LoadImage",
  data: () => {
    return {
      stageSize: {
        width: width,
        height: height,
      },
      background: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        fillPatternImage: null,
        name: "background",
      },
      poloygons: [
        {
          x: 0,
          y: 0,
          points: [23, 20, 23, 160, 70, 160, 70, 20],
          closed: true,
          scaleX: 1,
          scaleY: 1,
          stroke: "black",
          name: "polo1",
        },
        {
          x: 0,
          y: 0,
          points: [70, 20, 70, 160, 150, 160, 150, 20],
          closed: true,
          scaleX: 1,
          scaleY: 1,
          stroke: "red",
          name: "polo2",
        },
        {
          x: 0,
          y: 0,
          points: [150, 20, 150, 160, 200, 160, 200, 20],
          closed: true,
          scaleX: 1,
          scaleY: 1,
          stroke: "blue",
          name: "polo3",
        },
      ],
      anchors: [],
      selectedShapeName: "",
      image: null,
    };
  },
  watch: {},
  created() {
    const image = new Image();
    image.src =
      "https://cdn.discordapp.com/attachments/832020533221523506/865645385580806144/road.jpg";
    image.onload = () => {
      this.image = image;
      // set image only when it is loaded
      var stage = this.$refs.stage.getStage();
      this.stageSize.height = this.image.height;
      this.stageSize.width = this.image.width;
      stage.draw();

      this.background.height = this.stageSize.height;
      this.background.width = this.stageSize.width;
      this.background.fillPatternImage = image;
      this.$refs.layer.getNode().batchDraw();
    };
  },
  mounted() {},
  computed: {},
  methods: {
    polyTransformer() {
      console.log("creating");
      let stage = this.$refs.stage.getNode();
      const selectedPoly = stage.findOne("." + this.selectedShapeName);

      let points = selectedPoly.points();
      let anchor;
      for (let i = 0; i <= points.length - 2; i = i + 2) {
        anchor = new Konva.Circle({
          x: points[i],
          y: points[i + 1],
          radius: 5,
          fill: "black",
          stroke: "black",
          draggable: true,
        });
        this.anchors.push(anchor);
        this.$refs.layer.getNode().add(anchor);
        anchor.on("dragmove", () => this.updatePoly(selectedPoly));
      }
      selectedPoly.on("dragmove", () => this.updateAnchors());
    },
    updatePoly(poly) {
      console.log("moving");
      let points = [];
      for (let i = 0; i < this.anchors.length; i++) {
        points = [...points, this.anchors[i].x(), this.anchors[i].y()];
        poly.points(points);
        this.$refs.layer.getNode().batchDraw();
      }
    },
    polyTransformerDetach() {
      if (this.anchors.length) {
        console.log("destroying");

        for (let i = 0; i < this.anchors.length; i++) {
          this.anchors[i].destroy();
        }
        this.anchors = [];
        this.$refs.layer.getNode().batchDraw();
      }
    },
    updateAnchors() {
      console.log("updating");
      let stage = this.$refs.stage.getNode();
      const selectedPoly = stage.findOne("." + this.selectedShapeName);
      let points = selectedPoly.points();
      let j = 0;
      for (let i = 0; i < this.anchors.length; i++) {
        console.log(this.anchors[i].x());
        this.anchors[i].x(points[j]);
        this.anchors[i].y(points[j + 1]);
        j = j + 2;
      }

      this.$refs.layer.getNode().batchDraw();
    },
    handleStageMouseDown(e) {
      // clicked on stage - clear selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.polyTransformerDetach();
        return;
      }
      const name = e.target.name();
      if (this.selectedShapeName !== name) {
        if (this.selectedShapeName !== "") {
          this.polyTransformerDetach();
        }
        const rect = this.poloygons.find((r) => r.name === name);
        if (rect) {
          this.selectedShapeName = name;
        } else {
          this.selectedShapeName = "";
        }
        console.log("selected shape: " + this.selectedShapeName);
        this.polyTransformer();
      }
    },
  },
};
</script>
