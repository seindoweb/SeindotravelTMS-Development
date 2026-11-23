import React, { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { Users } from 'lucide-react';
import { api } from '@/libs/http/api';

interface ActiveUsersProps {
    value: number;
    change: number;
    positive: boolean;
}

export default function StatCardActiveUsers() {
    const [activeUsers, setActiveUsers] = useState<ActiveUsersProps>({
        value: 0,
        change: 0,
        positive: true,
    });

    const [loading, setLoading] = useState(false);

    const fetchActiveUsers = async () => {
        setLoading(true);

        try {
            const res = await api.get<ActiveUsersProps>(
                route('dashboard.retrieveActus'),
            );

            setActiveUsers(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <StatCard
            title="Active Users"
            value={activeUsers.value.toLocaleString('id-ID')}
            change={`${activeUsers.change > 0 ? '+' : ''}${activeUsers.change}%`}
            positive={activeUsers.positive}
            icon={Users}
            loading={loading}
        />
    );
}
