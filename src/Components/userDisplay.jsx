import axios from '../axios.js';
import React, { useEffect, useRef, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const UserDisplay = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(null);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filters, setFilters] = useState({
        id: '',
        name: '',
        email: '',
        phonenumber: ''
    });
    const [showColumn, setShowColumn] = useState({
        id: true,
        name: true,
        email: true,
        phonenumber: true,
    });

    const FetchUsers = async () => {
        if (loading) return; 

        setLoading(true);
        try {
            const response = await axios.get(`/get-users?page=${page}&limit= 9`); 
            setUsers((prevUsers) => {
                const newUsers = response.data.filter(
                    (user) => !prevUsers.some((existingUser) => existingUser.id === user.id)
                );
                return [...prevUsers, ...newUsers];
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        FetchUsers();
    }, [page]); 

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loading) {
                setPage((prev) => prev + 1); 
            }
        });

        if (loadingRef.current) {
            observer.observe(loadingRef.current);
        }

        return () => {
            if (loadingRef.current) {
                observer.unobserve(loadingRef.current);
            }
        };
    }, [loading]);


    useEffect(() => {
        let filtered = users;
        if (filters.id) {
            filtered = filtered.filter((user) =>
                user.id.toString().includes(filters.id)
            );
        }
        if (filters.name) {
            filtered = filtered.filter((user) =>
                user.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        if (filters.email) {
            filtered = filtered.filter((user) =>
                user.email.toLowerCase().includes(filters.email.toLowerCase())
            );
        }
        if (filters.phonenumber) {
            filtered = filtered.filter((user) =>
                user.phonenumber.includes(filters.phonenumber)
            );
        }
        setFilteredUsers(filtered);
    }, [filters, users]); 

    const toggleColumn = (column) => {
        setShowColumn((prev) => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const handleFilterChange = (column, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [column]: value
        }));
    };

    return (
        <div>
            <h1>User Details</h1>
            <div style={{ display: 'flex' }}>
                <p>Hide column: </p>
                <label>
                    <input type='checkbox' checked={showColumn.id} onChange={() => { toggleColumn('id') }} />
                    ID
                </label>
                <label>
                    <input type='checkbox' checked={showColumn.name} onChange={() => { toggleColumn('name') }} />
                    Name
                </label>
                <label>
                    <input type='checkbox' checked={showColumn.email} onChange={() => { toggleColumn('email') }} />
                    Email
                </label>
                <label>
                    <input type='checkbox' checked={showColumn.phonenumber} onChange={() => { toggleColumn('phonenumber') }} />
                    Phone Number
                </label>
            </div>

            <MDBTable hover style={{ border: '5px solid gray' }}>
                <MDBTableHead>
                    <tr>
                        {showColumn.id && <th scope='col'>ID <input
                            placeholder="Filter by ID"
                            value={filters.id}
                            onChange={(e) => handleFilterChange('id', e.target.value)}
                        /> </th>}
                        {showColumn.name && <th scope='col'>Name <input
                            placeholder="Filter by name"
                            value={filters.name}
                            onChange={(e) => handleFilterChange('name', e.target.value)} />
                        </th>}
                        {showColumn.email && <th scope='col'>Email <input
                            placeholder="Filter by email"
                            value={filters.email}
                            onChange={(e) => handleFilterChange('email', e.target.value)} />
                        </th>}
                        {showColumn.phonenumber && <th scope='col'>Phone Number <input
                            type='number'
                            placeholder="Filter by phone number"
                            value={filters.phonenumber}
                            onChange={(e) => handleFilterChange('phonenumber', e.target.value)} />
                        </th>}
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            {showColumn.id && <th scope='row'>{user.id}</th>}
                            {showColumn.name && <td>{user.name}</td>}
                            {showColumn.email && <td>{user.email}</td>}
                            {showColumn.phonenumber && <td>{user.phonenumber}</td>}
                        </tr>
                    ))}
                </MDBTableBody>
            </MDBTable>

            {loading && (
                <div>
                    <p>Loading more...</p>
                </div>
            )}

            <div ref={loadingRef} style={{ height: '10px' }}></div>
        </div>
    );
};

export default UserDisplay;
