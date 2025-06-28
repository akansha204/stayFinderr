"use client";
import { useState } from 'react';
import HostSidebar from '@/components/HostSidebar';
import CreateListingTab from '@/components/dashboard/CreateListingTab';
import ManageListingsTab from '@/components/dashboard/ManageListingsTab';

export default function HostDashboardPage() {
    const [activeTab, setActiveTab] = useState('create');

    const renderContent = () => {
        switch (activeTab) {
            case 'create':
                return <CreateListingTab />;
            case 'manage':
                return <ManageListingsTab />;
            default:
                return <CreateListingTab />;
        }
    };

    return (
        <HostSidebar activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </HostSidebar>
    );
}
