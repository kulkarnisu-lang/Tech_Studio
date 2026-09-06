import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyConfig, ServiceItem, FAQItem, AdminInquiry, InquiryStatus, AdminActivityLog } from '../types';
import { COMPANY_CONFIG } from '../data/company';
import { SERVICES_DATA } from '../data/services';
import { FAQS_DATA } from '../data/faqs';
import { INITIAL_INQUIRIES } from '../data/sampleInquiries';

const STORAGE_KEYS = {
  COMPANY: 'techstudio_company_config_v1',
  SERVICES: 'techstudio_services_v1',
  FAQS: 'techstudio_faqs_v1',
  INQUIRIES: 'techstudio_inquiries_v1',
  LOGS: 'techstudio_activity_logs_v1',
  AUTH: 'techstudio_admin_auth_v1',
};

const DEFAULT_PASSCODE = 'admin123';

const INITIAL_LOGS: AdminActivityLog[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    action: 'System Initialized',
    details: 'Admin console and Quality Engineering CRM initialized.',
    user: 'Dev Marlow / Sharad',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    action: 'Inquiry Received',
    details: 'New inquiry from Sarah Jenkins (CloudScale AI)',
    user: 'System Webhook',
  },
];

interface AdminContextType {
  // Navigation & View
  isAdminView: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;

  // Authentication
  isAuthenticated: boolean;
  login: (passcode: string) => boolean;
  logout: () => void;

  // Company Profile
  companyConfig: CompanyConfig;
  updateCompanyConfig: (config: CompanyConfig) => void;

  // Services
  services: ServiceItem[];
  updateServices: (services: ServiceItem[]) => void;
  addService: (service: ServiceItem) => void;
  deleteService: (id: string) => void;

  // FAQs
  faqs: FAQItem[];
  updateFaqs: (faqs: FAQItem[]) => void;
  addFaq: (faq: Omit<FAQItem, 'id'>) => void;
  deleteFaq: (id: string) => void;

  // Inquiries / Leads
  inquiries: AdminInquiry[];
  addInquiry: (data: Omit<AdminInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: InquiryStatus) => void;
  updateInquiryNotes: (id: string, notes: string) => void;
  deleteInquiry: (id: string) => void;

  // Activity Logs
  activityLogs: AdminActivityLog[];
  logAction: (action: string, details: string) => void;

  // Reset to Factory
  resetToDefaults: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Determine if URL hash has #admin
  const [isAdminView, setIsAdminView] = useState(() => {
    return window.location.hash === '#admin';
  });

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  });

  // Company Config State
  const [companyConfig, setCompanyConfig] = useState<CompanyConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return COMPANY_CONFIG;
  });

  // Services State
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return SERVICES_DATA;
  });

  // FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return FAQS_DATA;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<AdminInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_INQUIRIES;
  });

  // Logs State
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_LOGS;
  });

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Helpers
  const logAction = (action: string, details: string) => {
    const newLog: AdminActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user: 'Dev Marlow / Sharad',
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev].slice(0, 100);
      try {
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const openAdmin = () => {
    window.location.hash = '#admin';
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeAdmin = () => {
    window.location.hash = '';
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (passcode: string): boolean => {
    if (passcode.trim() === DEFAULT_PASSCODE || passcode.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      logAction('Admin Logged In', 'Authentication successful via admin portal.');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    logAction('Admin Logged Out', 'Session terminated by user.');
  };

  const updateCompanyConfig = (newConfig: CompanyConfig) => {
    setCompanyConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(newConfig));
    } catch {
      // ignore
    }
    logAction('Company Config Updated', `Updated company details and leadership settings.`);
  };

  const updateServices = (newServices: ServiceItem[]) => {
    setServices(newServices);
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(newServices));
    } catch {
      // ignore
    }
    logAction('Services Updated', `Saved service offerings catalog (${newServices.length} items).`);
  };

  const addService = (newService: ServiceItem) => {
    setServices((prev) => {
      const updated = [...prev, newService];
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logAction('Service Added', `Created new service: "${newService.title}".`);
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const target = prev.find((s) => s.id === id);
      const updated = prev.filter((s) => s.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      logAction('Service Deleted', `Removed service "${target?.title || id}".`);
      return updated;
    });
  };

  const updateFaqs = (newFaqs: FAQItem[]) => {
    setFaqs(newFaqs);
    try {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(newFaqs));
    } catch {
      // ignore
    }
    logAction('FAQs Updated', `Updated FAQ entries (${newFaqs.length} questions).`);
  };

  const addFaq = (newFaq: Omit<FAQItem, 'id'>) => {
    const created: FAQItem = {
      ...newFaq,
      id: `faq-${Date.now()}`,
    };
    setFaqs((prev) => {
      const updated = [created, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logAction('FAQ Added', `Added FAQ question: "${newFaq.question.substring(0, 40)}..."`);
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => {
      const target = prev.find((f) => f.id === id);
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      logAction('FAQ Deleted', `Deleted FAQ: "${target?.question.substring(0, 40) || id}..."`);
      return updated;
    });
  };

  const addInquiry = (data: Omit<AdminInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: AdminInquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setInquiries((prev) => {
      const updated = [newInquiry, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logAction('Inquiry Received', `New inquiry from ${data.name} (${data.company || 'Individual'}) regarding ${data.serviceInterest}`);
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus) => {
    setInquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logAction('Inquiry Status Changed', `Marked inquiry ${id} as "${status.toUpperCase()}".`);
  };

  const updateInquiryNotes = (id: string, notes: string) => {
    setInquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, notes } : item));
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logAction('Inquiry Notes Updated', `Updated internal notes for inquiry ${id}.`);
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    logAction('Inquiry Deleted', `Removed inquiry record ${id}.`);
  };

  const resetToDefaults = () => {
    setCompanyConfig(COMPANY_CONFIG);
    setServices(SERVICES_DATA);
    setFaqs(FAQS_DATA);
    setInquiries(INITIAL_INQUIRIES);
    setActivityLogs(INITIAL_LOGS);

    try {
      localStorage.removeItem(STORAGE_KEYS.COMPANY);
      localStorage.removeItem(STORAGE_KEYS.SERVICES);
      localStorage.removeItem(STORAGE_KEYS.FAQS);
      localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
    } catch {
      // ignore
    }
    logAction('Factory Reset', 'All settings and content reset to factory defaults.');
  };

  return (
    <AdminContext.Provider
      value={{
        isAdminView,
        openAdmin,
        closeAdmin,
        isAuthenticated,
        login,
        logout,
        companyConfig,
        updateCompanyConfig,
        services,
        updateServices,
        addService,
        deleteService,
        faqs,
        updateFaqs,
        addFaq,
        deleteFaq,
        inquiries,
        addInquiry,
        updateInquiryStatus,
        updateInquiryNotes,
        deleteInquiry,
        activityLogs,
        logAction,
        resetToDefaults,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
