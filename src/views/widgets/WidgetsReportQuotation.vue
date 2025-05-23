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
          <CCol>
            <img
              :src="getImageUrl()"
              alt="Logo Syarikat"
              class="img-fluid logo-image"
            />
          </CCol>
          <CCol class="text-right">
            <h1>QUOTATION</h1>
            <h5>{{ quotation.business.name }}</h5>
            <p>{{ "(" + quotation.business.regNo + ")" }}</p>
            <p v-html="formatAddress(quotation.business.address)"></p>
            <!--item.description is rendered from handlekeydown event and rerun format-->
            <p>Tel: {{ quotation.business.phone }}</p>
          </CCol>
        </CRow>
        <hr class="thick-hr" />
        <br />
        <div class="invoice-details">
          <CRow>
            <CCol sm="6">
              <p>
                <strong>{{ getCustomerName() }}</strong>
              </p>
              <p v-html="formatAddress(getCustomerAddress())"></p>

              <p>
                Attn:
                <strong>{{ getCustomerContactPersnoName() }}</strong>
              </p>
            </CCol>
            <CCol sm="6" class="text-right">
              <dl class="row">
                <dt class="col-sm-6">Quotation No:</dt>
                <dd class="col-sm-6">{{ quotation.quotationNumber }}</dd>
                <dt class="col-sm-6">Issue Date:</dt>
                <dd class="col-sm-6">{{ getQuotationIssuedDate() }}</dd>
                <dt class="col-sm-6">Expiry Date:</dt>
                <dd class="col-sm-6">{{ getQuotationExpiryDate() }}</dd>
              </dl>
            </CCol>
          </CRow>
          <CRow v-if="quotation.title">
            <CCol>
              <p><strong>Title: </strong> {{ quotation.title }}</p>
            </CCol>
          </CRow>
        </div>

        <div class="table-wrapper">
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="index-column">#</th>
                <th class="item-column">Item & Description</th>
                <th class="text-center quantity-column">Quantity</th>
                <th class="text-center unit-column">Unit</th>
                <th class="text-right price-column">
                  Price ({{ quotation.business.currency }})
                </th>
                <th class="text-right total-column">
                  Total ({{ quotation.business.currency }})
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in computedQuotationItems" :key="item.name">
                <td class="index-column">{{ item.position }}</td>
                <td class="item-column">
                  <p>
                    <strong>{{ item.product.name }}</strong>
                  </p>
                  <p v-html="formatDescription(item.description)"></p>
                </td>
                <td class="text-center quantity-column">{{ item.quantity }}</td>
                <td class="text-center unit-column">{{ item.unit }}</td>
                <td class="text-right price-column">
                  {{ formatCurrency(item.price) }}
                </td>
                <td class="text-right total-column">
                  {{ formatCurrency(item.totalAmountPerItem) }}
                </td>
              </tr>

              <!-- Grand Total Row -->
              <tr>
                <td colspan="5" class="text-right">
                  <strong>Total</strong>
                </td>
                <td class="text-right">
                  <strong>{{ formatCurrency(grandTotal)  }}</strong>
                </td>
              </tr>
              <tr>
                <td colspan="4" class="text-right">
                  <strong>Tax</strong>
                </td>
                <td class="text-right">
                  <strong>{{ getTaxName() }}</strong>
                </td>
                <td class="text-right">
                  <strong>{{ formatCurrency(grandTaxOnly)  }}</strong>
                </td>
              </tr>

              <tr>
                <td colspan="5" class="text-right">
                  <strong>Total (with Tax)</strong>
                </td>
                <td class="text-right">
                  <strong>{{ formatCurrency(grandTotalWitTax)  }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Terms and Conditions Section -->
        <div v-if="quotation.note" class="terms-and-conditions mt-4">
          <p><strong>Terms and Conditions</strong></p>
          <p v-html="formatNote(quotation.note)"></p>
        </div>

        <div class="report-footer">
          <p>
            {{ quotation.business.name }} | {{ quotation.business.website }} |
            {{ quotation.business.phone }}
          </p>
          <p>
            Powered By
            <img src="/logo.png" alt="Niaga-ku Logo" class="footer-logo" />
            Niaga-Ku.com
          </p>
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
    grandTotalWitTax() {
      return this.grandTotal + this.grandTaxOnly;
    },
    grandTaxOnly() {
      try {
        return (this.quotation.salesTax.rateInPercentage * this.grandTotal) / 100;
      } catch (error) {
        return 0;
      }
    },
    grandTotal() {
      return this.computedQuotationItems
        .reduce((acc, item) => {
          return acc + item.totalAmountPerItem;
        }, 0)
        ;
    },
  },
  mounted() {
    this.forceA4Size();
  },
  methods: {
    formatCurrency(amount) {
    try {
      return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } catch {
      return amount;
    }
  },
    getTaxName() {
      try {
        return this.quotation.salesTax.name;
      } catch (error) {
        return "N/A";
      }
    },
    formatNote(note) {
      return note.replace(/\n/g, "<br />");
    },

    formatDescription(description) {
      // split item.description \n
      return description
        .split("\n") //split into an array
        .map((line) => {
          // check for indentation (e.g., spaces or tabs at the start)
          const indentLevel = (line.match(/^(\s+)/) || [""])[0].length / 4;
          return `<p style="padding-left: ${
            indentLevel * 20
          }px;">${line.trim()}</p>`;
          //wraps in one line and padding for neatness
        })
        .join(""); //join into single html string and pass to <p>
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
    getCustomerContactPersnoName() {
      try {
        return this.quotation.contactName;
      } catch (error) {
        return "N/A";
      }
    },
    getCustomerContactPersnoEmail() {
      try {
        return this.quotation.customer.contactEmail;
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
    removeTrailingSlash(str) {
      return str.endsWith("/") ? str.slice(0, -1) : str;
    },

    getImageUrl() {
      try {
        return (
          this.removeTrailingSlash(apiUrl) + this.quotation.business.logoUrl
        );
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
        const originalTitle = document.title; // Save the current title
        document.title =
          this.quotation.business.shortName +
          "_" +
          this.quotation.quotationNumber; // Set the desired filename

        const printContents = this.$refs.pdfContent.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        document.title = originalTitle; // Restore the original title

        this.$nextTick(() => {
          this.$forceUpdate();
         
        });
      }, 100); // Delay slightly to allow reflow
    },
  },
};
</script>

<style scoped>
.report-footer {
  text-align: center;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #ccc;
}

.report-footer p {
  margin: 5px 0;
  font-size: 14px;
  color: #333;
}

.footer-logo {
  max-width: 20px;
  height: auto;
  filter: grayscale(100%);
}

.logo-image {
  max-width: 200px;
}
.pdf-content > .CRow:first-child {
  margin-bottom: 0; /* Reduce space between header and content */
}
.pdf-content {
  width: 210mm;
  height: 297mm;
  max-height: 297mm;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
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
  page-break-inside: auto;
}

.table tr {
  page-break-inside: auto; /* Prevent page breaks inside table rows */
  page-break-after: auto; /* Allow page breaks after rows */
}

.quantity-column {
  width: 85px;
  text-align: center;
}
.unit-column {
  width: 85px;
  text-align: center;
}

.price-column {
  width: 150px;
  text-align: center;
}

.total-column {
  width: 150px;
  text-align: center;
}

.item-column {
  width: 250px;
}

.index-column {
  width: 50px;
  text-align: center;
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
  .text-right {
    text-align: right;
  }
  .pdf-content {
    width: 100%;
    height: auto;
    margin: 0 auto;
    page-break-inside: avoid;
  }

  .table-wrapper {
    page-break-before: auto;
    /*page-break-inside: avoid;*/
    margin-top: 10px;
  }

  .invoice-details {
    margin-right: 20px; /* Add some bottom margin to the header section */
    margin-left: 20px; /* Add some bottom margin to the header section */
    margin-bottom: 20px; /* Add some bottom margin to the header section */
  }

  .table tr {
    /*page-break-inside: avoid; -- Remove this line */
    page-break-after: auto;
  }

  .table {
    width: 100%;
    /*page-break-inside: auto;  -- Remove this line */
    border-collapse: collapse;
  }

  .no-print {
    display: none !important;
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
