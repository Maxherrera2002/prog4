const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  estado: {
    type: String,
    enum: ['pendiente', 'en progreso', 'completado'],
    default: 'pendiente'
  },
  fechaLimite: { type: Date, required: true },
  color: { type: String }
});

module.exports = mongoose.model('Task', TaskSchema);
