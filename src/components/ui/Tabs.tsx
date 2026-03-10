import React from 'react';
import { cn } from '../../utils/cn';

interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="border-b border-border-subtle mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-button whitespace-nowrap transition-colors',
                            activeTab === tab.id
                                ? 'bg-secondary text-background-base font-medium'
                                : 'text-text-secondary hover:text-text-primary hover:bg-background-input'
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};