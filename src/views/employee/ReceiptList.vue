<template>
  <div class="wrapper">
    <!-- <CRow form class="form-group">
      <CCol >
        <CImg
          :src="getImageUrl()"
          class="mb-2"
          thumbnail
        ></CImg>
      </CCol>
    </CRow> -->

    <CRow form class="form-group">
      <CCol sm="12">
        <WidgetsUploadImage :billImageUrl="billImageUrl" @uploaded="uploaded" />
      </CCol>
    </CRow>
    <CRow>
      <CCol v-for="(days, month) in groupedReceipts" :key="month" sm="12">
        <CCard>
          <CCardHeader>{{ month }}</CCardHeader>
          <CCardBody>
            <div v-for="(receipts, day) in days" :key="day">
              <h4>{{ day }}</h4>
              <CRow>
                <CCol v-for="receipt in receipts" :key="receipt.id"  xl="2" md="4" sm="6" xs="12" class="mb-4">
                  <!-- <img
                    :src="getImageUrl(receipt)"
                    alt="Receipt Image"
                    width="100%"
                  /> -->

                  <CImg
                    :src="getImageUrl(receipt)"
                    class="mb-2"
                    thumbnail
                    width="100px"
                    @click="onImageClick(receipt)"
                  ></CImg>

                  <CButton color="danger" @click="deleteReceipt(receipt.id)"
                    >Delete</CButton
                  >
                </CCol>
              </CRow>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <!-- <CCard>
      <CCardHeader>Add New Receipt</CCardHeader>
      <CCardBody>
        <CInput v-model="newReceipt.date" placeholder="Date (YYYY-MM-DD)" />
        <CInput v-model="newReceipt.imageUrl" placeholder="Image URL" />
        <CButton color="primary" @click="addReceipt">Add</CButton>
      </CCardBody>
    </CCard> -->
  </div>
</template>

<script>
import ReceiptApi from "@/lib/receiptApi";
import moment from "moment";
import WidgetsUploadImage from "../widgets/WidgetsUploadImage.vue";

export default {
  name: "ReceiptList",
  components: {
    WidgetsUploadImage,
  },
  data() {
    return {
      uploadedFiles: [],
      billImageUrl: "",
      documentId: null,
      receipts: [],
      newReceipt: {
        documentUrl: "",
      },
      api: new ReceiptApi(),
    };
  },
  mounted() {
    var self = this;
    self.refreshTable();
  },
  computed: {
    groupedReceipts() {
      return this.receipts.reduce((acc, receipt) => {
        const [year, month, day] = receipt.date.split("-");
        const monthKey = `${year}-${month}`;
        if (!acc[monthKey]) {
          acc[monthKey] = {};
        }
        if (!acc[monthKey][day]) {
          acc[monthKey][day] = [];
        }
        acc[monthKey][day].push(receipt);
        return acc;
      }, {});
    },
  },
  methods: {
    getImageUrl(item) {
      var url =
        process.env.VUE_APP_API_URL + "documents/file/" + item.documentId;
      console.log(url);
      return url;
    },
    uploaded(data) {
      var self = this;
      self.uploadedFiles = data.uploadedFiles;
      self.api
        .createReceiptImage(self.uploadedFiles)
        .then((response) => {
          self.refreshTable();
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });

      // var self = this;
      // self.uploadedFiles = data.uploadedFiles;
      // if (self.uploadedFiles.length > 0) {
      //   this.documentId = self.uploadedFiles[0].id;
      //   this.loadImage();
      // }
      // console.log(data);
    },

    addReceipt() {},
    deleteReceipt(id) {},

    refreshTable() {
      var self = this;
      self.api
        .getList()
        .then((response) => {
          self.receipts = response.result;
          console.log(self.receipts);
        })
        .catch(({ data }) => {
          self.toast("Error", helper.getErrorMessage(data), "danger");
        });
    },

    onEdit(item) {
      var self = this;
      self.$router.push({
        path: `/employee/Receipt/${item.id}`,
      });
    },
    onDeleteConfirmation(status, evt, accept) {
      var self = this;
      if (accept) {
        this.api
          .delete(self.itemToDelete.id)
          .then((response) => {
            self.refreshTable();
          })
          .catch(({ data }) => {
            self.toast("Error", helper.getErrorMessage(data), "danger");
            // console.log(data);
          });
      }
      self.itemToDelete = {};
    },
    showDeleteConfirmation(item) {
      var self = this;
      self.itemToDelete = item;
      self.warningModal = true;
    },
    addNew() {
      this.$router.push({ path: "/employee/Receipt" });
    },
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
