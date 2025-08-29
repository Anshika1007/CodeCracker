import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CodingSheetPage = () => {
    const { sheetId } = useParams();
    const [codingSheet, setCodingSheet] = useState(null);
    const [error, setError] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [updatedQuestion, setUpdatedQuestion] = useState({});
    
    // 👇 Add question form states
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        questionTitle: "",
        difficulty: "Easy",
        platform: "",
        url: "",
    });

    const fetchCodingSheet = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:5000/api/coding-sheets/${sheetId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCodingSheet(response.data);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch coding sheet");
        }
    };

    useEffect(() => {
        fetchCodingSheet();
    }, [sheetId]);

    const handleAddQuestion = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `http://localhost:5000/api/coding-sheets/${sheetId}/add-questions`,
                { questions: [newQuestion] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewQuestion({ questionTitle: "", difficulty: "Easy", platform: "", url: "" });
            setShowAddForm(false);
            fetchCodingSheet();
        } catch (err) {
            console.error("Error adding question:", err);
            alert("Failed to add question.");
        }
    };

    const handleEdit = (question) => {
        setEditingQuestion(question._id);
        setUpdatedQuestion({...question});
    };

    const handleSaveEdit = async (questionId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/coding-sheets/${sheetId}/questions/${questionId}`,
                updatedQuestion,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEditingQuestion(null);
            fetchCodingSheet();
        } catch (err) {
            console.error("Error updating question:", err);
            alert("Failed to update the question.");
        }
    };

    const handleDelete = async (questionId) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/coding-sheets/${sheetId}/questions/${questionId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCodingSheet();
        } catch (err) {
            console.error("Error deleting question:", err);
            alert("Failed to delete the question.");
        }
    };

    if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;
    if (!codingSheet) return <div className="text-center mt-6">Loading...</div>;

    return (
        <div className="min-h-screen bg-[var(--secondary)] p-6">
          <div className="max-w-4xl mx-auto bg-[var(--primary)] shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-2">{codingSheet.title}</h1>
            <p className="text-[var(--text)] opacity-80 mb-4">{codingSheet.description}</p>
      
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-2xl font-semibold text-[var(--text)]">Questions</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-all"
              >
                {showAddForm ? "Cancel" : "+ Add Question"}
              </button>
            </div>
      
            {showAddForm && (
              <div className="bg-[var(--secondary)] p-4 rounded-lg mb-6 space-y-2">
                <input
                  type="text"
                  placeholder="Question Title"
                  value={newQuestion.questionTitle}
                  onChange={(e) => setNewQuestion({ ...newQuestion, questionTitle: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <input
                  type="text"
                  placeholder="Platform"
                  value={newQuestion.platform}
                  onChange={(e) => setNewQuestion({ ...newQuestion, platform: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="URL"
                  value={newQuestion.url}
                  onChange={(e) => setNewQuestion({ ...newQuestion, url: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={handleAddQuestion}
                  className="w-full bg-[var(--highlight)] hover:opacity-90 text-white font-bold py-2 px-4 rounded"
                >
                  Add Question
                </button>
              </div>
            )}
      
            <ul className="space-y-4">
              {codingSheet.questions.map((q, index) => (
                <li
                  key={q._id || index}
                  className="p-4 bg-[var(--secondary)] rounded-lg shadow-md flex justify-between items-center"
                >
                  <div>
                    {editingQuestion === q._id ? (
                      <div>
                        <input
                          type="text"
                          value={updatedQuestion.questionTitle}
                          onChange={(e) =>
                            setUpdatedQuestion({ ...updatedQuestion, questionTitle: e.target.value })
                          }
                          className="px-2 py-1 border rounded-md mr-2"
                        />
                        <input
                          type="text"
                          value={updatedQuestion.platform}
                          onChange={(e) =>
                            setUpdatedQuestion({ ...updatedQuestion, platform: e.target.value })
                          }
                          className="px-2 py-1 border rounded-md mr-2"
                        />
                        <input
                          type="text"
                          value={updatedQuestion.url}
                          onChange={(e) =>
                            setUpdatedQuestion({ ...updatedQuestion, url: e.target.value })
                          }
                          className="px-2 py-1 border rounded-md"
                        />
                        <button
                          onClick={() => handleSaveEdit(q._id)}
                          className="ml-2 px-3 py-1 bg-[var(--highlight)] text-white rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-[var(--text)]">{q.questionTitle}</h3>
                        <p className="text-sm text-[var(--text)] opacity-80">
                          Difficulty:{" "}
                          <span
                            className={`font-bold ${
                              q.difficulty === "Easy"
                                ? "text-green-500"
                                : q.difficulty === "Medium"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {q.difficulty}
                          </span>{" "}
                          | Platform:{" "}
                          <span className="font-bold text-[var(--accent)]">{q.platform}</span>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {editingQuestion === q._id ? null : (
                      <>
                        <button
                          onClick={() => handleEdit(q)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md"
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {q.url && (
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg shadow-md hover:opacity-90 transition-all"
                      >
                        Solve
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
      
};

export default CodingSheetPage;
