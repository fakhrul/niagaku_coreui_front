<template>
  <div ref="pdfContent" class="pdf-content">
    <CCard>
      <CCardHeader>
        <div class="float-right no-print">
          <a href="#" class="btn btn-sm btn-info ml-1" @click="printContent">
            <CIcon name="cil-print" class="mr-1" /> Print
          </a>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="justify-content-between align-items-center">
          <CCol xs="4" sm="3" md="2">
            <img
              :src="getImageUrl()"
              alt="Logo Syarikat"
              class="img-fluid logo-image"
            />
          </CCol>
          <CCol>
            <h1>{{ quotation.business.name }}</h1>
            <p>{{ "(" + quotation.business.regNo + ")" }}</p>
            <p v-html="formatAddress(quotation.business.address)"></p>
            <p>Tel: {{ quotation.business.phone }}</p>
          </CCol>
        </CRow>
        <hr class="thick-hr" />
        <div class="invoice-details">
          <h3 class="text-center">QUOTATION</h3>
          <CRow>
            <CCol md="6">
              <p>
                <strong>{{ getCustomerName() }}</strong>
              </p>
              <p v-html="formatAddress(getCustomerAddress())"></p>
            </CCol>
            <CCol md="6" class="text-right">
              <p>
                <strong>Quotation No:</strong> {{ quotation.quotationNumber }}
              </p>
              <p><strong>Issue Date:</strong> {{ getQuotationIssuedDate() }}</p>
              <p><strong>Due Date:</strong> {{ getQuotationExpiryDate() }}</p>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <p><strong>Title: </strong> {{ quotation.title }}</p>
            </CCol>
          </CRow>
        </div>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Item & Description</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in quotation.items"
              :key="item.name"
            >
              <td>{{ item.index }}</td>
              <td>
                <p>
                  <strong>{{ item.product.name }}</strong>
                </p>
                <p>{{ item.description }}</p>
              </td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price }}</td>
              <td></td>
            </tr>
            <tr>
              <td><p></p></td>
              <td></td>
            </tr>
            <!-- <tr>
              <td><strong>Total Amount Due</strong></td>
              <td>
                <strong>{{ getTotalAmountDue() }}</strong>
              </td>
            </tr> -->

            <!-- <tr>
              <td>
                <strong>Total Amount </strong>
                {{ stock.sale.loan.bank.name }}
              </td>
              <td>
                <strong>{{ getNetAmountDue() }}</strong>
              </td>
            </tr> -->
          </tbody>
        </table>
        <!--
        <div class="vehicle-details">
          <p><strong>Chassis No:</strong> {{ getVehicleChasisNo() }}</p>
          <p><strong>Engine No:</strong> {{ getVehicleEngineNo() }}</p>
          <p><strong>Regn. No:</strong> {{ getPlateNo() }}</p>
          <p><strong>Model:</strong> {{ getBrandModelNo() }}</p>
        </div>
        <div class="signature text-right">
          <p>For {{ quotation.business.name }}</p>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br /> -->
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
// import html2pdf from "html2pdf.js";
import moment from "moment";

export default {
  name: "WidgetsReportInvoice",
  props: {
    quotation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getQuotationIssuedDate() {
      return moment(this.quotation.issuedDate).format("DD/MM/YYYY");
    },
    getQuotationExpiryDate() {
      return moment(this.quotation.expiryDate).format("DD/MM/YYYY");
    },
    getNetAmountDue() {
      var totalAmount = this.getTotalAmountDue() - this.getTotalLess();
      return totalAmount.toFixed(2);
    },
    getTotalLess() {
      var totalAmount = 0;
      try {
        totalAmount =
          this.stock.sale.depositAmount + this.stock.sale.tradeInAmount;
      } catch (error) {}
      return totalAmount.toFixed(2);
    },
    getTotalAmountDue() {
      var totalAmount = 0;
      try {
        totalAmount = this.stock.sale.saleAmount;
        for (
          var i = 0;
          i < this.stock.adminitrativeCost.adminitrativeCostItems.length;
          i++
        ) {
          totalAmount +=
            this.stock.adminitrativeCost.adminitrativeCostItems[i].amount;
        }
      } catch (error) {}
      return totalAmount.toFixed(2);
    },
    getSellingPrice() {
      try {
        return this.stock.sale.saleAmount.toFixed(2);
      } catch (error) {
        return null;
      }
    },
    getPlateNo() {
      try {
        return this.stock.registration.vehicleRegistrationNumber;
      } catch (error) {
        return "N/A";
      }
    },
    getBrandModelNo() {
      try {
        return (
          this.stock.vehicle.brand.name + " - " + this.stock.vehicle.model.name
        );
      } catch (error) {
        return "N/A";
      }
    },
    getVehicleEngineNo() {
      try {
        return this.stock.vehicle.engineNo;
      } catch (error) {
        return "N/A";
      }
    },
    getVehicleChasisNo() {
      try {
        return this.stock.vehicle.chasisNo;
      } catch (error) {
        return "N/A";
      }
    },
    getCustomerAddress() {
      try {
        return this.quotation.customer.address;
      } catch (error) {
        return "N/A";
      }
    },
    getCustomerName() {
      try {
        return this.quotation.customer.name;
      } catch (error) {
        return "N/A";
      }
    },
    getCustomerIcNumber() {
      try {
        return this.stock.sale.customer.icNumber;
      } catch (error) {
        return "N/A";
      }
    },
    removeTrailingSlash(str) {
      if (str.endsWith("/")) {
        return str.slice(0, -1);
      }
      return str;
    },
    getImageUrl() {
      var url =
        this.removeTrailingSlash(apiUrl) + this.quotation.business.logoUrl;
      console.log("getImageUrl", url);
      return url;
    },
    formatAddress(address) {
      return address.replace(/\n/g, "<br />");
    },
    saveAsPDF() {
      const element = this.$refs.pdfContent;
      const options = {
        margin: [0.5, 0.5, 0.5, 0.5], // Top, right, bottom, left
        filename: "Invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      html2pdf().from(element).set(options).save();
    },
    printContent() {
      const printContents = this.$refs.pdfContent.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;

      window.print();

      document.body.innerHTML = originalContents;
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.thick-hr {
  border: 1px solid #000;
  margin: 10px 0;
}
.logo-image {
  max-width: 100%; /* Adjust the width to fit the print layout */
}
.vehicle-details p,
.signature p {
  margin: 0;
}
.signature {
  margin-top: 30px;
}
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
