const Backlog = require('../models/Backlog');
const Task = require('../models/Task');


exports.getBacklog = async (req, res) => {
  try {
    const backlog = await Backlog.findOne().populate('tareas');
    if (!backlog) return res.status(404).json({ mensaje: 'No existe backlog' });
    res.json(backlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createBacklog = async (req, res) => {
  try {
    const existente = await Backlog.findOne();
    if (existente) return res.status(400).json({ mensaje: 'Ya existe un backlog' });

    const nuevoBacklog = new Backlog({ tareas: [] });
    const guardado = await nuevoBacklog.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.addTaskToBacklog = async (req, res) => {
  try {
    const tarea = await Task.findById(req.params.taskId);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    const backlog = await Backlog.findOne();
    if (!backlog) return res.status(404).json({ mensaje: 'Backlog no encontrado' });

   
    if (!backlog.tareas.includes(tarea._id)) {
      backlog.tareas.push(tarea._id);
      await backlog.save();
    }

    res.json({ mensaje: 'Tarea agregada al backlog', backlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
