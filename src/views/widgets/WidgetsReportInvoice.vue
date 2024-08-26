<template>
  <div ref="pdfContent" class="pdf-content">
    <CCard >
      <CCardHeader class="no-print">
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
            <h1>{{ invoice.business.name }}</h1>
            <p>{{ "(" + invoice.business.regNo + ")" }}</p>
            <p v-html="formatAddress(invoice.business.address)"></p>
            <p>Tel: {{ invoice.business.phone }}</p>
          </CCol>
        </CRow>
        <hr class="thick-hr" />
        <div class="invoice-details">
          <h3 class="text-center">INVOICE</h3>
          <CRow>
            <CCol md="6">
              <p>
                <strong>{{ getCustomerName() }}</strong>
              </p>
              <p v-html="formatAddress(getCustomerAddress())"></p>
            </CCol>
            <CCol md="6" class="text-right">
              <p>
                <strong>Invoice No:</strong> {{ invoice.invoiceNumber }}
              </p>
              <p><strong>Issue Date:</strong> {{ getInvoiceIssuedDate() }}</p>
              <p><strong>Due Date:</strong> {{ getInvoiceExpiryDate() }}</p>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <p><strong>Title: </strong> {{ invoice.title }}</p>
            </CCol>
          </CRow>
        </div>

        <table class="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Item & Description</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Price ({{ invoice.business.currency }})</th>
              <th class="text-center">Total ({{ invoice.business.currency }})</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in computedInvoiceItems" :key="item.name">
              <td>{{ item.position }}</td>
              <td>
                <p>
                  <strong>{{ item.product.name }}</strong>
                </p>
                <p>{{ item.description }}</p>
              </td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-right">{{ item.price.toFixed(2) }}</td>
              <td class="text-right">
                {{ item.totalAmountPerItem.toFixed(2) }}
              </td>
            </tr>

            <!-- <tr>
              <td><strong>Total Amount Due</strong></td>
              <td>
                <strong>{{ getTotalAmountDue() }}</strong>
              </td>
            </tr> -->

            <!-- Grand Total Row -->
            <tr>
              <td colspan="4" class="text-right">
                <strong>Total</strong>
              </td>
              <td class="text-right">
                <strong>{{ grandTotal }}</strong>
              </td>
            </tr>
            <!-- <tr>
              <td>
                <strong>Total Amount </strong>
                {{ stock.sale.loan.bank.name }}
              </td>
              <td>
                <strong>{{ getNetAmountDue() }}</strong>
              </td>
            </tr>  -->
          </tbody>
        </table>
        <!-- Terms and Conditions Section -->
        <div v-if="invoice.note" class="terms-and-conditions mt-4">
          <h4>Terms and Conditions</h4>
          <p v-html="formatNote(invoice.note)"></p>
        </div>

     
        <!--
        <div class="vehicle-details">
          <p><strong>Chassis No:</strong> {{ getVehicleChasisNo() }}</p>
          <p><strong>Engine No:</strong> {{ getVehicleEngineNo() }}</p>
          <p><strong>Regn. No:</strong> {{ getPlateNo() }}</p>
          <p><strong>Model:</strong> {{ getBrandModelNo() }}</p>
        </div>-->
        <!-- <div class="signature text-right">
          <p>{{ invoice.business.name }}</p>
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />  -->
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
    invoice: {
      type: Object,
      required: true,
    },
  },
  computed: {
    computedInvoiceItems() {
      return this.invoice.items.map((item) => {
        return {
          ...item,
          productName: item.product.name,
          totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      // Calculate the grand total by summing up the total amount per item
      return this.computedInvoiceItems
        .reduce((acc, item) => {
          return acc + item.totalAmountPerItem;
        }, 0)
        .toFixed(2);
    },
  },
  methods: {
    formatNote(note) {
      return note.replace(/\n/g, "<br />");
    },
    getTotalItemPrice(item) {
      try {
        return item.quantity * item.price;
      } catch (error) {
        return 0;
      }
    },

    getInvoiceIssuedDate() {
      return moment(this.invoice.issuedDate).format("DD/MM/YYYY");
    },
    getInvoiceExpiryDate() {
      return moment(this.invoice.expiryDate).format("DD/MM/YYYY");
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
        return this.invoice.customer.address;
      } catch (error) {
        return "N/A";
      }
    },
    getCustomerName() {
      try {
        return this.invoice.customer.name;
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
    getImageChopUrl() {
      var url =
        this.removeTrailingSlash(apiUrl) + this.invoice.business.companyChopUrl;
      return url;
    },
    getImageUrl() {
      var url =
        this.removeTrailingSlash(apiUrl) + this.invoice.business.logoUrl;
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
.text-right {
  text-align: right;
}

.thick-hr {
  border: 1px solid #000;
  margin: 10px 0;
}

.logo-image {
  max-width: 100%;
}

.vehicle-details p,
.signature p {
  margin: 0;
}

.signature {
  margin-top: 30px;
}

.terms-and-conditions {
  margin-top: 20px;
}

.signature-section {
  margin-top: 40px;
  text-align: left;
}

.signature-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
}

.signature-space {
  border-bottom: 1px solid #000;
  width: 200px;
  height: 25px; /* Adjust height for signature space */
  margin-right: 30px; /* Space between signature and chop */
}

.chop-image {
  width: 100px; /* Adjust size as needed */
  height: auto;
}

.creator-info {
  margin-top: 20px;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
