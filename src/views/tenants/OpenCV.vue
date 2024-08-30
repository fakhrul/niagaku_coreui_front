<template>
  <div>
    <CRow>
      <CCol sm="12">
        <h1>Open CV</h1>
        <div>
          <CRow>
            <CCol sm="6">
              <video id="videoInput"></video></CCol>

            <CCol sm="6"><canvas id="canvasOutput"></canvas></CCol>
          </CRow>
        </div>
        <div>
          <img :src="imgData" width="100px" height="100px" />
          <img :src="imgDataFilter" width="100px" height="100px" />
        </div>
        <div>
          <img :src="imgDataOpenCv" width="100px" height="100px" />
        </div>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import cv from "../../opencv";
import Jimp from "jimp";

export default {
  name: "OpenCV",
  data: () => {
    return {
      imgData: null,
      imgDataFilter: null,
      imgDataOpenCv: null,
    };
  },
  mounted() {
    let video = document.getElementById("videoInput"); // video is the id of video tag
    video.width = 320;
    video.height = 240;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
        let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
        let cap = new cv.VideoCapture(video);

        const FPS = 30;
        function processVideo() {
          try {
            let begin = Date.now();
            // start processing.
            cap.read(src);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
            cv.imshow("canvasOutput", dst);
            // schedule the next one.
            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
          } catch (err) {
            console.error(err);
          }
        }

        // schedule the first one.
        setTimeout(processVideo, 0);
      })
      .catch(function (err) {
        console.log("An error occurred! " + err);
      });

    this.loadImages();
  },

  computed: {},
  methods: {
    async loadImages() {
      // reference: https://docs.opencv.org/4.x/dc/de6/tutorial_js_nodejs.html
      //https://www.npmjs.com/package/opencv

      Jimp.read("./img/lena.jpg")
        .then((image) => {
          var imgDataFilter = image.clone().greyscale(); // set greyscale
          image.getBase64Async(Jimp.MIME_JPEG).then((newImage) => {
            this.imgData = newImage;
          });

          imgDataFilter.getBase64Async(Jimp.MIME_JPEG).then((newImage) => {
            this.imgDataFilter = newImage;
          });

          var src = cv.matFromImageData(image.bitmap);
          let dst = new cv.Mat();
          let M = cv.Mat.ones(5, 5, cv.CV_8U);
          let anchor = new cv.Point(-1, -1);
          cv.dilate(
            src,
            dst,
            M,
            anchor,
            1,
            cv.BORDER_CONSTANT,
            cv.morphologyDefaultBorderValue()
          );
          var openCvJimp = new Jimp({
            width: dst.cols,
            height: dst.rows,
            data: Buffer.from(dst.data),
          });

          openCvJimp.getBase64Async(Jimp.MIME_JPEG).then((newImage) => {
            this.imgDataOpenCv = newImage;
          });
        })
        .catch((err) => {
          console.log("err", err);
          // Handle an exception.
        });

      // var jimpSrc = await Jimp.read("/img/lena.jpg");
      // console.log("jimpSrc", jimpSrc.bitmap);
      // const response = await fetch("https://reqres.in/api/users")
      // const { data: users } = await response.json()
      // this.users = users
    },
  },
};
</script>
