<template>
  <div ref="pdfContent" class="pdf-content">
    <CCard>
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

        <div class="table-wrapper">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Item & Description</th>
                <th class="text-center">Quantity</th>
                <th class="text-center">
                  Price ({{ quotation.business.currency }})
                </th>
                <th class="text-center">
                  Total ({{ quotation.business.currency }})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in computedQuotationItems" :key="item.name">
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

              <!-- Grand Total Row -->
              <tr>
                <td colspan="4" class="text-right">
                  <strong>Total</strong>
                </td>
                <td class="text-right">
                  <strong>{{ grandTotal }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms and Conditions Section -->
        <div v-if="quotation.note" class="terms-and-conditions mt-4">
          <h4>Terms and Conditions</h4>
          <p v-html="formatNote(quotation.note)"></p>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "WidgetsReportInvoice",
  props: {
    quotation: {
      type: Object,
      required: true,
    },
  },
  computed: {
    computedQuotationItems() {
      return this.quotation.items.map((item) => {
        return {
          ...item,
          productName: item.product.name,
          totalAmountPerItem: this.getTotalItemPrice(item),
        };
      });
    },
    grandTotal() {
      return this.computedQuotationItems
        .reduce((acc, item) => {
          return acc + item.totalAmountPerItem;
        }, 0)
        .toFixed(2);
    },
  },
  mounted() {
    this.forceA4Size();
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
    getQuotationIssuedDate() {
      return moment(this.quotation.issuedDate).format("DD/MM/YYYY");
    },
    getQuotationExpiryDate() {
      return moment(this.quotation.expiryDate).format("DD/MM/YYYY");
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
    getImageUrl() {
      try {
        return this.quotation.business.logoUrl;
      } catch (error) {
        return "";
      }
    },
    formatAddress(address) {
      return address.replace(/\n/g, "<br />");
    },
    forceA4Size() {
      const pdfContent = this.$refs.pdfContent;
      if (pdfContent) {
        // Ensure the size is recalculated and displayed correctly
        pdfContent.style.width = "210mm";
        pdfContent.style.height = "297mm";
      }
    },
    printContent() {
      this.forceA4Size(); // Ensure the content is set to A4 size
      setTimeout(() => {
        const printContents = this.$refs.pdfContent.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
      }, 100); // Delay slightly to allow reflow
    },
  },
};
</script>

<style scoped>
.pdf-content {
  width: 210mm;
  height: 297mm;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: white;
}

.table-wrapper {
  overflow-x: auto;
  max-width: 100%;
}

.table {
  width: 100%;
  table-layout: fixed;
  word-wrap: break-word;
}

.table td,
.table th {
  white-space: normal; /* Ensure text wraps within cells */
}

@media screen and (max-width: 768px) {
  .pdf-content {
    width: 100%;
    height: auto;
  }
  
  .table-wrapper {
    display: block;
    white-space: nowrap;
  }
}

@media print {
  .pdf-content {
    width: 210mm;
    height: 297mm;
  }
}

.text-right {
  text-align: right;
}

.thick-hr {
  border: 1px solid #000;
  margin: 10px 0;
}

.terms-and-conditions {
  margin-top: 20px;
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
