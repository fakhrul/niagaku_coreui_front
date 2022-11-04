<template>
  <!-- <div id="scroll-container">
    <div id="large-container"> -->
  <div>
    <div class="btn-container">
      <button @click="zoomIn">Zoom In</button>
      <button @click="zoomOut">Zoom Out</button>
      <!-- <button @click="drawType = ''">Empty</button> -->
      <!-- <button @click="drawType = 'pencil'">Pencil</button>
      <button @click="drawType = 'line'">Line</button>
      <button @click="drawType = 'ellipse'">Ellipse</button> -->
      <!-- <button @click="drawType = 'right'">Right</button>
      <button @click="drawType = 'wrong'">Wrong</button>
      <button @click="drawType = 'move'">Move</button> -->
      <!-- <img :src="imgSrc" alt /> -->
      <button @click="drawType = 'exitSeparation'">Exit Separation (ES)</button>
      <button @click="drawType = 'diagonalDistance'">
        Diagonal Distance (DD)
      </button>
      <button @click="drawType = 'travelDistance'">Travel Distance (TD)</button>
      <button @click="drawType = 'line'">Stair Exit Area</button>
      <button @click="drawType = 'line'">Room Area</button>
      <!-- <button @click="drawType = 'line'">Common Path (CP)</button> -->
      <!-- <button @click="handleAddText">Add Text</button> -->
      <!-- <button @click="handleRotate">Rotate</button> -->
      <button @click="handleClear">Clear</button>
      <button @click="handleSaveBase64">Save</button>
      <button @click="handlePrevStep">Undo</button>
      <button @click="handleNextStep">Redo</button>
    </div>
    <v-stage
      ref="stage"
      :config="stageSize"
      class="stage"
      @mousedown="handleStageMouseDown"
      @mouseup="handleStageMouseUp"
      @mousemove="handleStageMouseMove"
    >
      <v-layer ref="layer">
        <v-image :config="{ image: image }" />
        <!-- <v-rect @mousemove="handleMouseMove" :config="stageSize" /> -->
        <!-- <v-text
          ref="text"
          :config="{
            x: point_x,
            y: point_y,
            text: point_text,
            fontSize: 15,
          }"
        /> -->
        <v-shape
          v-for="(item, index) in shapes"
          :key="item.name"
          :config="item"
        />
        <v-line
          v-for="(item, index) in lines"
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
        <v-ellipse
          v-for="(item, index) in ellipses"
          :key="item.name"
          :config="item"
        />
        <v-text
          ref="text"
          v-for="item in texts"
          :key="item.name"
          :config="item"
        />

        <v-transformer ref="transformer" :config="transfer" />
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
import Konva from "konva";

const width = 8000; //window.innerWidth;
const height = 8000; //window.innerHeight;

export default {
  name: "AreaDrawing",
  data() {
    return {
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
      lines: [
        // {
        //     name: 'line0',
        //     points: [10, 10, 300, 10],
        //     stroke: 'red',
        //     strokeWidth: 3,
        //     lineCap: 'round',
        //     lineJoin: 'round'
        // },
      ],
      exitSeperations: [],
      diagonalDistances: [],
      travelDistances: [],
      ellipses: [],
      shapes: [],
      texts: [
        // {
        //   x: 50,
        //   y: 100,
        //   width: 100,
        //   text: "abcd你好的地方都是佛山市舒服舒服，大丰收",
        //   fill: "red",
        //   name: "text0",
        //   fontSize: 20,
        //   draggable: true
        // },
        // {
        //   x: 10,
        //   y: 100,
        //   width: 100,
        //   text: "abcd",
        //   fill: "green",
        //   name: "text1",
        //   fontSize: 20,
        //   draggable: true
        // }
      ],
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
          ellipses: [],
          shapes: [],
          texts: [],
          exitSeperations: [],
          diagonalDistances: [],
          travelDistances: [],
        },
      ],
      step: 0,
    };
  },
  created() {
    // const image = new window.Image();
    // image.src = "/img/samples/0001.jpg";
    // image.onload = () => {
    //   this.image = image;
    //   // var scaleBy = 1.01;
    //   // var stage = this.$refs.stage.getStage();
    //   // stage.on("wheel", (e) => {
    //   //   e.evt.preventDefault();
    //   //   var oldScale = stage.scaleX();
    //   //   var pointer = stage.getPointerPosition();
    //   //   var mousePointTo = {
    //   //     x: (pointer.x - stage.x()) / oldScale,
    //   //     y: (pointer.y - stage.y()) / oldScale,
    //   //   };
    //   //   var newScale =
    //   //     e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    //   //   stage.scale({ x: newScale, y: newScale });
    //   //   var newPos = {
    //   //     x: pointer.x - mousePointTo.x * newScale,
    //   //     y: pointer.y - mousePointTo.y * newScale,
    //   //   };
    //   //   stage.position(newPos);
    //   // });
    // };
  },
  watch: {
    texts(val) {
      this.$nextTick(() => {
        if (val.length > 0) {
          val.forEach((item, index) => {
            this.initTextNode(this.$refs.text[index].getStage());
          });
        }
      });
    },
    // ellipses: {
    //   handler: function (val, oldVal) {
    //     this.handleSaveHistory();
    //   },
    //   deep: true
    // },
  },
  mounted() {
    console.log(Konva);
    let _this = this;
    this.$nextTick(() => {
      this.$refs.text.forEach((item, index) => {
        _this.initTextNode(_this.$refs.text[index].getStage());
      });
    });

    const image = new window.Image();
    image.src = this.floorPlanUrl;
    image.onload = () => {
      this.image = image;
    };
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
  },
  methods: {
    handleMouseMove(event) {
      const point = this.$refs.stage.getNode().getPointerPosition();
      this.point_x = point.x;
      this.point_y = point.y;
      this.point_text = "x: " + point.x + ", y: " + point.y;
    },
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
          ellipses: [...this.ellipses],
          shapes: [...this.shapes],
          texts: [...this.texts],
          exitSeperations: [...this.exitSeperations],
          diagonalDistances: [...this.diagonalDistances],
          travelDistances: [...this.travelDistances],
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
          ellipses,
          shapes,
          texts,
          exitSeperations,
          diagonalDistances,
          travelDistances,
        } = _cur;
        this.lines = [...lines];
        this.ellipses = [...ellipses];
        this.shapes = [...shapes];
        this.texts = [...texts];
        this.exitSeperations = [...exitSeperations];
        this.diagonalDistances = [...diagonalDistances];
        this.travelDistances = [...travelDistances];
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
          ellipses,
          shapes,
          texts,
          exitSeperations,
          diagonalDistances,
          travelDistances,
        } = _cur;
        this.lines = [...lines];
        this.ellipses = [...ellipses];
        this.shapes = [...shapes];
        this.texts = [...texts];
        this.exitSeperations = [...exitSeperations];
        this.diagonalDistances = [...diagonalDistances];
        this.travelDistances = [...travelDistances];
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
      this.lines = this.shapes = this.texts = this.ellipses = this.rects = [];
      this.exitSeperations = [];
      this.diagonalDistances = [];
      this.travelDistances = [];
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
    handleSaveBase64() {
      var dataURL = this.$refs.stage.getStage().toDataURL();
      console.log(dataURL);
      this.downloadURI(dataURL, "stage.png");
    },
    handleStageMouseDown(e) {
      this.isPaint = true;
      //this.moveFrom = this.$refs.stage.getStage().getPointerPosition();
      this.moveFrom = this.$refs.stage.getStage().getRelativePointerPosition();

      console.log("moveFrom", this.moveFrom);
      if (this.drawType === "move") {
        // 文本可移动
        this.resizeText(e);
      } else if (this.drawType === "pencil") {
        // 自由划线
        // 自由划线
        this.lines.push({
          name: "line" + this.lines.length,
          points: [this.moveFrom.x, this.moveFrom.y],
          stroke: "red",
          strokeWidth: 3,
          lineCap: "round",
          lineJoin: "round",
        });
      } else if (this.drawType === "line") {
        // 画直线
        // 自由划线
        this.lines.push({
          name: "line" + this.lines.length,
          points: [this.moveFrom.x, this.moveFrom.y],
          stroke: "red",
          strokeWidth: 3,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });
      } else if (this.drawType === "exitSeparation") {
        this.exitSeperations.push({
          name: "exitSeperation" + this.exitSeperations.length,
          points: [this.moveFrom.x, this.moveFrom.y],
          stroke: "purple",
          strokeWidth: 30,
          lineCap: "round",
          lineJoin: "round",
          dash: [30, 60],
          //draggable: true,
        });
      } else if (this.drawType === "diagonalDistance") {
        this.diagonalDistances.push({
          name: "diagonalDistance" + this.diagonalDistances.length,
          points: [this.moveFrom.x, this.moveFrom.y],
          stroke: "yellow",
          strokeWidth: 30,
          lineCap: "round",
          lineJoin: "round",
          dash: [30, 60],
          //draggable: true,
        });
      } else if (this.drawType === "travelDistance") {
        this.travelDistances.push({
          name: "travelDistance" + this.travelDistances.length,
          points: [this.moveFrom.x, this.moveFrom.y],
          stroke: "green",
          strokeWidth: 30,
          lineCap: "round",
          lineJoin: "round",
          //draggable: true,
        });
      } else if (this.drawType === "ellipse") {
        // 画椭圆
        this.ellipses.push({
          name: "ellipse" + this.ellipses.length,
          x: this.moveFrom.x,
          y: this.moveFrom.y,
          radius: {
            x: 10,
            y: 2,
          },
          stroke: "red",
          draggable: true,
        });
      } else if (this.drawType === "right") {
        let { x, y } = this.moveFrom;
        this.shapes.push({
          name: "shape" + this.shapes.length,
          sceneFunc: function (ctx, shape) {
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(x - 20, y - 20);
            ctx.lineTo(x - 5, y - 5);
            ctx.lineTo(x + 30, y - 40);
            ctx.stroke();
            // special Konva.js method
            ctx.fillStrokeShape(shape);
          },
          stroke: "red",
          strokeWidth: 4,
          draggable: true,
        });
      } else if (this.drawType === "wrong") {
        let { x, y } = this.moveFrom;
        this.shapes.push({
          name: "shape" + this.shapes.length,
          sceneFunc: function (ctx, shape) {
            ctx.beginPath();
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.moveTo(x - 20, y - 20);
            ctx.lineTo(x, y);
            ctx.moveTo(x - 20, y);
            ctx.lineTo(x, y - 20);
            ctx.stroke();
            // special Konva.js method
            ctx.fillStrokeShape(shape);
          },
          stroke: "red",
          strokeWidth: 4,
          draggable: true,
        });
      } else if (this.drawType == "addText") {
        // let {x, y} = this.moveFrom;
        // this.texts[this.texts.length-1].x = x;
        // this.texts[this.texts.length-1].y = y;
      }
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
      let stage = this.$refs.stage.getStage();
      let layer = this.$refs.layer.getStage();
      // let _moveTo = stage.getPointerPosition();
      let _moveTo = stage.getRelativePointerPosition();

      if (this.drawType === "pencil") {
        this.lines[this.lines.length - 1].points = [
          ...this.lines[this.lines.length - 1].points,
          _moveTo.x,
          _moveTo.y,
        ];
        this.$refs.layer.getStage().batchDraw();
      } else if (this.drawType === "line") {
        // 画圆环
        // console.log('moveTo', _moveTo)
        // console.log([this.moveFrom.x,this.moveFrom.y,  _moveTo.x, _moveTo.y])
        this.lines[this.lines.length - 1].points = [
          this.moveFrom.x,
          this.moveFrom.y,
          _moveTo.x,
          _moveTo.y,
        ];
        // this.$refs.layer.getStage().batchDraw();
      } else if (this.drawType === "exitSeparation") {
        // 画圆环
        // console.log('moveTo', _moveTo)
        // console.log([this.moveFrom.x,this.moveFrom.y,  _moveTo.x, _moveTo.y])
        this.exitSeperations[this.exitSeperations.length - 1].points = [
          this.moveFrom.x,
          this.moveFrom.y,
          _moveTo.x,
          _moveTo.y,
        ];
      } else if (this.drawType === "diagonalDistance") {
        // 画圆环
        // console.log('moveTo', _moveTo)
        // console.log([this.moveFrom.x,this.moveFrom.y,  _moveTo.x, _moveTo.y])
        this.diagonalDistances[this.diagonalDistances.length - 1].points = [
          this.moveFrom.x,
          this.moveFrom.y,
          _moveTo.x,
          _moveTo.y,
        ];
      } else if (this.drawType === "travelDistance") {
        this.travelDistances[this.travelDistances.length - 1].points = [
          this.moveFrom.x,
          this.moveFrom.y,
          _moveTo.x,
          _moveTo.y,
        ];
      } else if (this.drawType === "ellipse") {
        this.ellipses[this.ellipses.length - 1].radius = {
          x: Math.abs(_moveTo.x - this.moveFrom.x),
          y: Math.abs(_moveTo.y - this.moveFrom.y),
        };
        this.$refs.layer.getStage().batchDraw();
      }
    },
    resizeText(e) {
      console.log(e.target);
      // clicked on stage - cler selection
      if (e.target === e.target.getStage()) {
        this.selectedShapeName = "";
        this.updateTransformer();
        return;
      }

      // clicked on transformer - do nothing
      const clickedOnTransformer =
        e.target.getParent().className === "Transformer";
      if (clickedOnTransformer) {
        return;
      }

      // find clicked text by its name
      const name = e.target.name();
      const text = this.texts.find((t) => t.name === name);
      if (text) {
        this.selectedShapeName = name;
      } else {
        this.selectedShapeName = "";
      }
      this.updateTransformer();
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