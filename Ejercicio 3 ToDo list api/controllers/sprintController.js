const Sprint = require('../models/Sprint');
const Task = require('../models/Task');

exports.getAllSprints = async (req, res) => {
  try {
    const sprints = await Sprint.find().populate('tareas');
    res.json(sprints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSprintById = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id).populate('tareas');
    if (!sprint) return res.status(404).json({ mensaje: 'Sprint no encontrado' });
    res.json(sprint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSprint = async (req, res) => {
  try {
    const nuevoSprint = new Sprint(req.body);
    const sprintGuardado = await nuevoSprint.save();
    res.status(201).json(sprintGuardado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateSprint = async (req, res) => {
  try {
    const sprintActualizado = await Sprint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sprintActualizado) return res.status(404).json({ mensaje: 'Sprint no encontrado' });
    res.json(sprintActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteSprint = async (req, res) => {
  try {
    const sprintEliminado = await Sprint.findByIdAndDelete(req.params.id);
    if (!sprintEliminado) return res.status(404).json({ mensaje: 'Sprint no encontrado' });
    res.json({ mensaje: 'Sprint eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTaskToSprint = async (req, res) => {
  try {
    const tarea = await Task.findById(req.params.taskId);
    if (!tarea) return res.status(404).json({ mensaje: 'Tarea no encontrada' });

    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) return res.status(404).json({ mensaje: 'Sprint no encontrado' });

    if (!sprint.tareas.includes(tarea._id)) {
      sprint.tareas.push(tarea._id);
      await sprint.save();
    }
    res.json({ mensaje: 'Tarea agregada al sprint', sprint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
