import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TutorialPage from './components/TutorialPage';
import AddTutorial from './components/AddTutorial';
import EditTutorial from './components/EditTutorial';

const App = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = 'http://localhost:3001/login.html';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchTutorials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorials`);
      if (!response.ok) {
        throw new Error('Failed to fetch tutorials');
      }
      const data = await response.json();
      setTutorials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tutorial?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutorials/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete tutorial');
        }
        fetchTutorials();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const getTutorialProgress = (tutorial) => {
    if (tutorial.modules && tutorial.modules.length > 0) {
      return `${tutorial.modules.length} module${tutorial.modules.length !== 1 ? 's' : ''}`;
    } else if (tutorial.steps && tutorial.steps.length > 0) {
      return `${tutorial.steps.length} step${tutorial.steps.length !== 1 ? 's' : ''}`;
    }
    return 'No content';
  };

  const HomePage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-600 text-xl">{error}</div>
        </div>
      );
    }

    return (
      <div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 mb-8 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Interactive Tutorials</h1>
          <p className="text-xl mb-6">
            Create and manage interactive tutorials with videos, steps, and quizzes
          </p>
          <Link
            to="/add"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100"
          >
            Create Your First Tutorial
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Available Tutorials ({tutorials.length})
          </h2>
          {tutorials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No tutorials available. Create your first tutorial!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <div
                  key={tutorial.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{tutorial.title}</h3>
                    <p className="text-gray-600 mb-4">{tutorial.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {getTutorialProgress(tutorial)}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit/${tutorial.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tutorial.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/tutorial/${tutorial.id}`}
                    className="block w-full py-3 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                  >
                    Start Learning
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Interactive Tutorials
              </Link>
              <div className="flex items-center space-x-4">
                <Link
                  to="/add"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Tutorial
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddTutorial onTutorialAdded={fetchTutorials} />} />
            <Route path="/edit/:id" element={<EditTutorial onTutorialUpdated={fetchTutorials} />} />
            <Route path="/tutorial/:id" element={<TutorialPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
