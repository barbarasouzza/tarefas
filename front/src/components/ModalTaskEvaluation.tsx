import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  name: string;
}

interface ModalTaskEvaluationProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const ModalTaskEvaluation: React.FC<ModalTaskEvaluationProps> = ({
  isOpen,
  onClose,
  userName,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskRatings, setTaskRatings] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchEvaluationTasks = async () => {
        try {
          const response = await fetch(`http://localhost:8000/tasks/for-evaluation?username=${userName}`);
          if (!response.ok) throw new Error('Erro ao buscar tarefas para avaliação');
          const data = await response.json();
          setTasks(data);
        } catch (err) {
          console.error('Erro ao buscar tarefas:', err);
          setError('Não foi possível carregar as tarefas para avaliação.');
        }
      };

      fetchEvaluationTasks();
    }
  }, [isOpen, userName]);

  const handleRatingChange = (taskId: number, rating: number) => {
    setTaskRatings((prev) => ({
      ...prev,
      [taskId]: rating,
    }));
  };

  const handleSubmit = async () => {
    const entries = Object.entries(taskRatings);

    if (entries.length !== tasks.length) {
      setError('Você precisa avaliar todas as tarefas!');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      for (const [taskId, rating] of entries) {
        await fetch("http://localhost:8000/evaluations/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            task_id: parseInt(taskId),
            username: userName,
            rating: rating,
          }),
        });
      }

      alert("Avaliações enviadas com sucesso!");
      onClose();
    } catch (err) {
      console.error("Erro ao enviar avaliações:", err);
      setError("Erro ao enviar avaliações. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllRated = tasks.length > 0 && tasks.every((task) => taskRatings[task.id]);

  return isOpen ? (
  <div className="modal-eval-overlay">
    <div className="modal-eval-content">
      <h2>Avalie as tarefas, {userName}:</h2>

      {tasks.map((task) => (
        <div key={task.id} className="modal-eval-task">
          <h3>{task.name}</h3>
          <div className="modal-eval-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (taskRatings[task.id] || 0) ? 'modal-eval-star filled' : 'modal-eval-star'}
                onClick={() => handleRatingChange(task.id, star)}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="modal-eval-error-message">{error}</p>}

      <div className="modal-eval-button-container">
        <button
          onClick={handleSubmit}
          className="modal-eval-button"
          disabled={!isAllRated || isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Finalizar'}
        </button>
        <button onClick={onClose} className="modal-eval-button">
          Cancelar
        </button>
      </div>
    </div>
  </div>
) : null;

};

export default ModalTaskEvaluation;
