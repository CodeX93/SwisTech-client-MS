const mongoose = require('mongoose');

const clientRecordSchema = new mongoose.Schema({
  srNo: { type: Number, required: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  co: { type: String, default: '-' },  // Optional, default to '-'
  coPhone: { type: String, default: '-' },  // Optional, default to '-'
  plotNo: { type: String, required: true },
  streetNo: { type: String, required: true },
  sector: { type: String, required: true },
  scheme: { type: String, required: true },
  plotSize: { type: String, required: true },  // Plot size is required
  testFee: { type: Number, default: 0 },  // Optional, default to 0
  paidOn: { type: Date, required: true },
  proposedFieldWork: { type: Date, required: true },
  fieldWorkDone: { type: Date },  // Optional, can be null
  proposedReportDate: { type: Date, required: true },
  reportDelivery: { type: Date, required: true },
});

const ClientRecord = mongoose.model('ClientRecord', clientRecordSchema);

module.exports = ClientRecord;
