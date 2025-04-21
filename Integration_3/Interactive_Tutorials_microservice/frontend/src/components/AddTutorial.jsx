import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTutorial = ({ onTutorialAdded }) => {
  const navigate = useNavigate();
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    // Simple structure fields
    steps: [],
    question: '',
    options: ['', ''],
    correctAnswer: '',
    // Complex structure fields
    modules: [{
      title: '',
      content: '',
      questions: [{
        question: '',
        options: ['', ''],
        correctAnswer: ''
      }]
    }]
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Common handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Simple structure handlers
  const handleStepChange = (index, value) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const deleteStep = (index) => {
    const newSteps = [...formData.steps];
    newSteps.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      steps: newSteps
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const deleteOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = [...formData.options];
      newOptions.splice(index, 1);
      
      // Update correctAnswer if deleted option was the correct answer
      const newFormData = {
        ...formData,
        options: newOptions
      };
      
      if (formData.correctAnswer === formData.options[index]) {
        newFormData.correctAnswer = '';
      }
      
      setFormData(newFormData);
    }
  };

  // Complex structure handlers
  const handleModuleChange = (moduleIndex, field, value) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex] = {
      ...newModules[moduleIndex],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const handleQuestionChange = (moduleIndex, questionIndex, field, value) => {
    const newModules = [...formData.modules];
    const question = newModules[moduleIndex].questions[questionIndex];
    newModules[moduleIndex].questions[questionIndex] = {
      ...question,
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const handleModuleOptionChange = (moduleIndex, questionIndex, optionIndex, value) => {
    const newModules = [...formData.modules];
    const options = [...newModules[moduleIndex].questions[questionIndex].options];
    options[optionIndex] = value;
    newModules[moduleIndex].questions[questionIndex] = {
      ...newModules[moduleIndex].questions[questionIndex],
      options
    };
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const addModuleOption = (moduleIndex, questionIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].questions[questionIndex].options.push('');
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const deleteModuleOption = (moduleIndex, questionIndex, optionIndex) => {
    const newModules = [...formData.modules];
    const question = newModules[moduleIndex].questions[questionIndex];
    if (question.options.length > 2) {
      const newOptions = [...question.options];
      newOptions.splice(optionIndex, 1);
      
      // Update correctAnswer if deleted option was the correct answer
      const newQuestion = {
        ...question,
        options: newOptions
      };
      
      if (question.correctAnswer === question.options[optionIndex]) {
        newQuestion.correctAnswer = '';
      }
      
      newModules[moduleIndex].questions[questionIndex] = newQuestion;
      setFormData(prev => ({
        ...prev,
        modules: newModules
      }));
    }
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, {
        title: '',
        content: '',
        questions: [{
          question: '',
          options: ['', ''],
          correctAnswer: ''
        }]
      }]
    }));
  };

  const deleteModule = (moduleIndex) => {
    if (formData.modules.length > 1) {
      const newModules = [...formData.modules];
      newModules.splice(moduleIndex, 1);
      setFormData(prev => ({
        ...prev,
        modules: newModules
      }));
    }
  };

  const addQuestion = (moduleIndex) => {
    const newModules = [...formData.modules];
    newModules[moduleIndex].questions.push({
      question: '',
      options: ['', ''],
      correctAnswer: ''
    });
    setFormData(prev => ({
      ...prev,
      modules: newModules
    }));
  };

  const deleteQuestion = (moduleIndex, questionIndex) => {
    if (formData.modules[moduleIndex].questions.length > 1) {
      const newModules = [...formData.modules];
      newModules[moduleIndex].questions.splice(questionIndex, 1);
      setFormData(prev => ({
        ...prev,
        modules: newModules
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare the data based on the selected mode
      const submissionData = {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        ...(isAdvancedMode
          ? { modules: formData.modules }
          : {
              steps: formData.steps,
              question: formData.question,
              options: formData.options,
              correctAnswer: formData.correctAnswer
            })
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create tutorial');
      }

      const data = await response.json();
      if (onTutorialAdded) {
        onTutorialAdded();
      }
      navigate(`/tutorial/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Tutorial</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={isAdvancedMode}
              onChange={(e) => setIsAdvancedMode(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">Advanced Mode (Multiple Modules)</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {isAdvancedMode ? (
            // Complex structure (modules) form fields
            <div className="space-y-6">
              {formData.modules.map((module, moduleIndex) => (
                <div key={moduleIndex} className="border p-4 rounded-md">
                  <h3 className="text-lg font-medium mb-4">Module {moduleIndex + 1}</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleModuleChange(moduleIndex, 'title', e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      value={module.content}
                      onChange={(e) => handleModuleChange(moduleIndex, 'content', e.target.value)}
                      required
                      className="w-full px-3 py-2 border rounded-md"
                      rows="3"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Questions
                      </label>
                      <button
                        type="button"
                        onClick={() => addQuestion(moduleIndex)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        + Add Question
                      </button>
                    </div>

                    {module.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="border rounded p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium">Question {questionIndex + 1}</h4>
                          {module.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteQuestion(moduleIndex, questionIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete Question
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Text
                          </label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => handleQuestionChange(moduleIndex, questionIndex, 'question', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Options
                            </label>
                            <button
                              type="button"
                              onClick={() => addModuleOption(moduleIndex, questionIndex)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              + Add Option
                            </button>
                          </div>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2 mb-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleModuleOptionChange(moduleIndex, questionIndex, optionIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-md"
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              {question.options.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => deleteModuleOption(moduleIndex, questionIndex, optionIndex)}
                                  className="px-3 py-2 text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correct Answer
                          </label>
                          <select
                            value={question.correctAnswer}
                            onChange={(e) => handleQuestionChange(moduleIndex, questionIndex, 'correctAnswer', e.target.value)}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="">Select correct answer</option>
                            {question.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option || `Option ${optionIndex + 1}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addModule}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add Module
              </button>
            </div>
          ) : (
            // Simple structure form fields
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Steps
                </label>
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder={`Step ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => deleteStep(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addStep}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Step
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder={`Option ${index + 1}`}
                    />
                    {formData.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => deleteOption(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOption}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Option
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select correct answer</option>
                  {formData.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option || `Option ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Creating...' : 'Create Tutorial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTutorial; 