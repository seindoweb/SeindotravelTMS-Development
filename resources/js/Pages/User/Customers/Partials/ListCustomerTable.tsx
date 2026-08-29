import { api } from '@/libs/http/api';
import { Paginate, User } from '@/types';
import React, { useEffect, useState } from 'react'

export default function ListCustomerTable() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState<Paginate<User> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPage = async (urlOrPage: string | number = 1) => {
        setLoading(true);
        try {
            const res =
                typeof urlOrPage === "string"
                    ? await api.get<Paginate<User>>(urlOrPage, {
                          search: search,
                      })
                    : await api.get<Paginate<User>>(
                          route("settings.locations.region.retrieveData"),
                          {
                              page: urlOrPage,
                              search: search,
                          },
                      );
            setPage(res);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const items = page?.data ?? [];
  return (
    <div>ListCustomerTable</div>
  )
}
