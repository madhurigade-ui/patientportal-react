import { create } from 'zustand';

// Types
interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'IMAGE' | 'DOC';
  category: 'clinical' | 'form' | 'billing' | 'consent';
  date: string;
  size: string;
  url?: string;
}

interface DocumentState {
  documents: Document[];
  clinicalDocuments: Document[];
  completedForms: Document[];
  billingDocuments: Document[];
  selectedDocument: Document | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
}

interface DocumentActions {
  setDocuments: (documents: Document[]) => void;
  setSelectedDocument: (document: Document | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchDocuments: (patientId: string) => Promise<void>;
  downloadDocument: (documentId: string) => Promise<void>;
  clearDocuments: () => void;
}

type DocumentStore = DocumentState & DocumentActions;

const initialState: DocumentState = {
  documents: [],
  clinicalDocuments: [],
  completedForms: [],
  billingDocuments: [],
  selectedDocument: null,
  isLoading: false,
  error: null,
  searchQuery: '',
};

const categorizeDocuments = (documents: Document[]) => {
  return {
    clinical: documents.filter((doc) => doc.category === 'clinical'),
    forms: documents.filter((doc) => doc.category === 'form' || doc.category === 'consent'),
    billing: documents.filter((doc) => doc.category === 'billing'),
  };
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  ...initialState,

  setDocuments: (documents: Document[]) => {
    const categorized = categorizeDocuments(documents);
    set({
      documents,
      clinicalDocuments: categorized.clinical,
      completedForms: categorized.forms,
      billingDocuments: categorized.billing,
      error: null,
    });
  },

  setSelectedDocument: (document: Document | null) => {
    set({ selectedDocument: document });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  clearDocuments: () => {
    set(initialState);
  },

  fetchDocuments: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock documents data
      const mockDocuments: Document[] = [
        { id: '1', name: 'Treatment Summary', type: 'PDF', category: 'clinical', date: '2024-01-15', size: '245 KB' },
        { id: '2', name: 'X-Ray Report', type: 'PDF', category: 'clinical', date: '2024-01-10', size: '1.2 MB' },
        { id: '3', name: 'Prescription', type: 'PDF', category: 'clinical', date: '2024-01-08', size: '89 KB' },
        { id: '4', name: 'Patient Registration Form', type: 'PDF', category: 'form', date: '2024-01-05', size: '156 KB' },
        { id: '5', name: 'Consent Form', type: 'PDF', category: 'consent', date: '2024-01-05', size: '78 KB' },
        { id: '6', name: 'Medical History Form', type: 'PDF', category: 'form', date: '2024-01-05', size: '234 KB' },
        { id: '7', name: 'Invoice #1234', type: 'PDF', category: 'billing', date: '2024-01-20', size: '45 KB' },
        { id: '8', name: 'Payment Receipt', type: 'PDF', category: 'billing', date: '2024-01-10', size: '32 KB' },
      ];

      const categorized = categorizeDocuments(mockDocuments);
      set({
        documents: mockDocuments,
        clinicalDocuments: categorized.clinical,
        completedForms: categorized.forms,
        billingDocuments: categorized.billing,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: 'Failed to load documents',
        isLoading: false,
      });
    }
  },

  downloadDocument: async (documentId: string) => {
    const { documents } = get();
    const doc = documents.find((d) => d.id === documentId);

    if (!doc) {
      set({ error: 'Document not found' });
      return;
    }

    try {
      // TODO: Replace with actual download logic
      // In real app, fetch document URL and trigger download
      console.log(`Downloading document: ${doc.name}`);

      // Simulate download
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real implementation:
      // const url = doc.url || await api.getDocumentUrl(documentId);
      // window.open(url, '_blank');
    } catch (error) {
      set({ error: 'Failed to download document' });
    }
  },
}));

// Selector hooks
export const useDocuments = () => useDocumentStore((state) => state.documents);
export const useClinicalDocuments = () => useDocumentStore((state) => state.clinicalDocuments);
export const useCompletedForms = () => useDocumentStore((state) => state.completedForms);
export const useBillingDocuments = () => useDocumentStore((state) => state.billingDocuments);
export const useSelectedDocument = () => useDocumentStore((state) => state.selectedDocument);
export const useDocumentLoading = () => useDocumentStore((state) => state.isLoading);
export const useDocumentError = () => useDocumentStore((state) => state.error);
export const useDocumentSearchQuery = () => useDocumentStore((state) => state.searchQuery);

// Filtered documents selector
export const useFilteredDocuments = (category: 'clinical' | 'form' | 'billing') => {
  return useDocumentStore((state) => {
    const query = state.searchQuery.toLowerCase();
    let docs: Document[] = [];

    switch (category) {
      case 'clinical':
        docs = state.clinicalDocuments;
        break;
      case 'form':
        docs = state.completedForms;
        break;
      case 'billing':
        docs = state.billingDocuments;
        break;
    }

    if (!query) return docs;
    return docs.filter((doc) => doc.name.toLowerCase().includes(query));
  });
};
