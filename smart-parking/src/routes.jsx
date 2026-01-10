import { createBrowserRouter } from 'react-router-dom';
import UserLayout from './components/UserLayout';
import ManagerLayout from './components/ManagerLayout';
import Home from './pages/Home';
import DriverDashboard from './pages/DriverDashboard';
import DriverHistory from './pages/DriverHistory';
import DriverLayout from './components/DriverLayout';
import Scan from './pages/Scan';
import SelectVehicle from './pages/SelectVehicle';
import ConfirmParking from './pages/ConfirmParking';

import Retrieve from './pages/Retrieve';
import UserHistory from './pages/UserHistory';
import Settings from './pages/Settings';
import RegisterVehicle from './pages/RegisterVehicle';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ManagerDashboard from './pages/ManagerDashboard';
import AddDriver from './pages/AddDriver';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

export const router = createBrowserRouter([
    {
        path: '/super-admin',
        element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></ProtectedRoute>
    },
    {
        path: '/',
        element: <UserLayout />,
        children: [
            { index: true, element: <ProtectedRoute allowedRoles={['USER']}><Home /></ProtectedRoute> },
            { path: 'scan', element: <ProtectedRoute allowedRoles={['USER']}><Scan /></ProtectedRoute> },
            { path: 'select-vehicle', element: <ProtectedRoute allowedRoles={['USER']}><SelectVehicle /></ProtectedRoute> },
            { path: 'confirm', element: <ProtectedRoute allowedRoles={['USER']}><ConfirmParking /></ProtectedRoute> },

            { path: 'retrieve', element: <ProtectedRoute allowedRoles={['USER']}><Retrieve /></ProtectedRoute> },
            { path: 'history', element: <ProtectedRoute allowedRoles={['USER']}><UserHistory /></ProtectedRoute> },
            { path: 'settings', element: <ProtectedRoute allowedRoles={['USER']}><Settings /></ProtectedRoute> },
            { path: 'register', element: <ProtectedRoute allowedRoles={['USER']}><RegisterVehicle /></ProtectedRoute> },
        ],
    },
    {
        path: '/',
        element: <ManagerLayout />,
        children: [
            {
                path: 'manager',
                element: <ProtectedRoute allowedRoles={['MANAGER', 'SUPER_ADMIN']}><ManagerDashboard /></ProtectedRoute>
            },
            {
                path: 'add-driver',
                element: <ProtectedRoute allowedRoles={['MANAGER', 'SUPER_ADMIN']}><AddDriver /></ProtectedRoute>
            },
            {
                path: 'manager/settings',
                element: <ProtectedRoute allowedRoles={['MANAGER', 'SUPER_ADMIN']}><Settings /></ProtectedRoute>
            },
        ]
    },
    {
        path: '/driver',
        element: <DriverLayout />,
        children: [
            {
                index: true,
                element: <ProtectedRoute allowedRoles={['DRIVER']}><DriverDashboard /></ProtectedRoute>
            },
            {
                path: 'history',
                element: <ProtectedRoute allowedRoles={['DRIVER']}><DriverHistory /></ProtectedRoute>
            },
            {
                path: 'settings',
                element: <ProtectedRoute allowedRoles={['DRIVER']}><Settings /></ProtectedRoute>
            },
        ]
    },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
]);
