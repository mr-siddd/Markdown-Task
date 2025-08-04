declare global {
  interface Window {
    electronAPI: {
      saveNotes: (notes: any[]) => Promise<any>;
      loadNotes: () => Promise<any[]>;
    };
  }
}

export {};
