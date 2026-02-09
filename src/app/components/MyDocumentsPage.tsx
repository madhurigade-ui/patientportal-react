import { useState, useEffect } from 'react';
import { Home, Edit, FileText, Moon, Sun, ArrowLeft, Search, Folder, ClipboardCheck, Download, Eye, File } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useDarkMode } from '@/app/components/DarkModeContext';
import { useDocumentStore, useAuthStore } from '@/stores';


export function MyDocumentsPage() {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<'clinical' | 'completed'>('clinical');
  const [searchQuery, setSearchQuery] = useState('');

  // Zustand stores
  const { user } = useAuthStore();
  const {
    clinicalDocuments,
    completedForms,
    fetchDocuments,
    downloadDocument,
  } = useDocumentStore();

  // Fetch documents on mount
  useEffect(() => {
    if (user?.id) {
      fetchDocuments(user.id);
    }
  }, [user?.id, fetchDocuments]);

  const documents = activeTab === 'clinical' ? clinicalDocuments : completedForms;

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (docId: string, docName: string) => {
    downloadDocument(docId);
    // Show feedback to user
    alert(`Downloading ${docName}...`);
  };

  const handleView = (docName: string) => {
    // In real app, open document viewer
    alert(`Opening ${docName}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header - matches dashboard style */}
      <header className="bg-primary dark:bg-primary text-white px-2 sm:px-4 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/summary')}
            className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-sm sm:text-base font-semibold hidden sm:block">My Documents</span>
          </button>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => navigate('/dashboard/summary')}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/profile-manage')}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="Edit Profile"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors"
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard/summary')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Documents Card */}
        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            {/* Title and Search */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">My Documents</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">View and download your documents</p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, type, or category"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('clinical')}
                  className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                    activeTab === 'clinical'
                      ? 'text-primary dark:text-primary border-b-2 border-primary dark:border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Clinical Documents
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
                    activeTab === 'completed'
                      ? 'text-primary dark:text-primary border-b-2 border-primary dark:border-primary'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Completed Forms
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div>
              {filteredDocuments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Size</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <File className="w-5 h-5 text-red-600 dark:text-red-400" />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{doc.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{doc.type}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{doc.date}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{doc.size}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(doc.name)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="hidden sm:inline">View</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(doc.id, doc.name)}
                                className="flex items-center gap-1"
                              >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500">
                    {activeTab === 'clinical' ? <Folder className="w-full h-full" /> : <ClipboardCheck className="w-full h-full" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery ? 'No documents match your search' : `No ${activeTab === 'clinical' ? 'clinical documents' : 'completed forms'} found`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
