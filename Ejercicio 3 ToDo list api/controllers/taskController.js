const Task = require('../models/Task');

// Obtener todas las tareas
exports.getAllTasks = async (req, res) => {
  try {
    const query = {};
    if (req.query.estado) {
      query.estado = req.query.estado;
    }
    let tasks = await Task.find(query);
    if (req.query.orden === 'fechaLimite') {
      tasks = tasks.sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite));
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener una tarea por ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear una tarea
exports.createTask = async (req, res) => {
  try {
    const nuevaTarea = new Task(req.body);
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    const tareaActualizada = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tareaActualizada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json(tareaActualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar una tarea (solo si no está asignada a un Sprint)
exports.deleteTask = async (req, res) => {
  const Sprint = require('../models/Sprint');
  try {
    const sprintConTarea = await Sprint.findOne({ tareas: req.params.id });
    if (sprintConTarea) {
      return res.status(400).json({ mensaje: 'No se puede eliminar una tarea asignada a un sprint' });
    }

    const tareaEliminada = await Task.findByIdAndDelete(req.params.id);
    if (!tareaEliminada) return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
