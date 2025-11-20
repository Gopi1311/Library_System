import React, { useState, useEffect } from 'react';
import type { Borrow, User, Book } from '../types';

const Borrows: React.FC = () => {
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [issueForm, setIssueForm] = useState({
    userId: '',
    bookId: '',
    days: 14
  });

  useEffect(() => {
    fetchBorrows();
    fetchUsers();
    fetchAvailableBooks();
  }, []);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/borrow/history');
      const data = await response.json();
      setBorrows(data.borrowDetails || []);
    } catch (error) {
      console.error('Error fetching borrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAvailableBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      const availableBooks = data.filter((book: Book) => book.availableCopies > 0);
      setBooks(availableBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm)
      });

      if (response.ok) {
        setShowIssueForm(false);
        setIssueForm({ userId: '', bookId: '', days: 14 });
        fetchBorrows();
        fetchAvailableBooks();
      }
    } catch (error) {
      console.error('Error issuing book:', error);
    }
  };

  const handleReturnBook = async (borrowId: string) => {
    try {
      const response = await fetch(`/api/borrow/${borrowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'returned' })
      });

      if (response.ok) {
        fetchBorrows();
        fetchAvailableBooks();
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      issued: 'bg-blue-100 text-blue-800',
      returned: 'bg-green-100 text-green-800',
      late: 'bg-red-100 text-red-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Borrow Management</h1>
          <p className="text-gray-600">Manage book borrowing and returns</p>
        </div>
        <button
          onClick={() => setShowIssueForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>📖</span>
          <span>Issue Book</span>
        </button>
      </div>

      {/* Borrow Records */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User & Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {borrows.map((borrow) => (
                <tr key={borrow._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {borrow.user?.name || 'Unknown User'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {borrow.book?.title || 'Unknown Book'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>Issued: {new Date(borrow.issueDate).toLocaleDateString()}</div>
                    <div>Due: {new Date(borrow.dueDate).toLocaleDateString()}</div>
                    {borrow.returnDate && (
                      <div>Returned: {new Date(borrow.returnDate).toLocaleDateString()}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(borrow.status)}>
                      {borrow.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${borrow.fine.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {borrow.status !== 'returned' && (
                      <button
                        onClick={() => handleReturnBook(borrow._id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Mark Returned
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Book Form Modal */}
      {showIssueForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Issue New Book</h2>
              
              <form onSubmit={handleIssueBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select User *
                  </label>
                  <select
                    required
                    value={issueForm.userId}
                    onChange={(e) => setIssueForm({...issueForm, userId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Book *
                  </label>
                  <select
                    required
                    value={issueForm.bookId}
                    onChange={(e) => setIssueForm({...issueForm, bookId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a book...</option>
                    {books.map(book => (
                      <option key={book._id} value={book._id}>
                        {book.title} by {book.author} ({book.availableCopies} available)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Borrow Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={issueForm.days}
                    onChange={(e) => setIssueForm({...issueForm, days: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowIssueForm(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Issue Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Borrows;