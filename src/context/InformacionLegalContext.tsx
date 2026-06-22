import React, { createContext, useContext, useState, type ReactNode } from 'react';

type InformacionLegalContextType = {
    isOpen: boolean;
    activeTab: 'privacidad' | 'terminos';
    openModal: (tab: 'privacidad' | 'terminos') => void;
    closeModal: () => void;
};

const InformacionLegalContext = createContext<InformacionLegalContextType | undefined>(undefined);

interface InformacionLegalProviderProps {
    children: ReactNode;
}

export const InformacionLegalProvider: React.FC<InformacionLegalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'privacidad' | 'terminos'>('privacidad');

    const openModal = (tab: 'privacidad' | 'terminos' = 'privacidad') => {
        setActiveTab(tab);
        setIsOpen(true);
    };

    const closeModal = () => setIsOpen(false);

    return (
        <InformacionLegalContext.Provider value={{ isOpen, activeTab, openModal, closeModal }}>
            {children}
        </InformacionLegalContext.Provider>
    );
};

export const useInformacionLegal = (): InformacionLegalContextType => {
    const context = useContext(InformacionLegalContext);
    if (!context) {
        throw new Error('useInformacionLegal must be used within a InformacionLegalProvider');
    }
    return context;
};
