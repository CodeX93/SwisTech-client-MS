const mongoose = require('mongoose');

const pendingRecordSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientContactNo: { type: String, required: true },
  coName: { type: String, default: '-' },  // Optional field with default value
  coPhoneNumber: { type: String, default: '-' },  // Optional field with default value
  plotNo: { type: String, required: true },
  streetNo: { type: String, required: true },
  sector: { type: String, required: true },
  scheme: { type: String, required: true },
  plotSize: { type: String, required: true },  // Required field
  fee: { type: Number, required: true },
  proposedDate: { type: Date, required: true },
  fwDoneOn: { type: Date },  // Optional field
  proposedReportDate: { type: Date },
  deliveryDate: { type: Date },
  fieldWorkDone: { type: Date },
  paidOn: { type: Date },  // Optional field
  reportDelivery: { type: Date },
  srNo: { type: String },
  testFee: { type: Number }  // Optional field
});

module.exports = mongoose.model('PendingRecord', pendingRecordSchema);
