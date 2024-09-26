// src/Dashboard.js

import React, {useEffect, useState} from 'react';
import Chart from 'react-apexcharts';
import {Picker, View} from "react-native-web";
import {Text} from "react-native-web";
import Dropdown, { FilterType } from "../pages/Dropdown";
import Loading from "./Loading";
import {useLazyQuery} from "@apollo/client";
import {GET_DASHBOARD_DATA} from "../graphql/query/getDashboardData";

const getStartAndEndOfDay = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to 00:00:00.000

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to 23:59:59.999

    return {
        startOfDayTimestamp: startOfDay.toISOString(),
        endOfDayTimestamp: endOfDay.toISOString(),
    };
};

const getStartAndEndOfWeek = () => {
    const today = new Date();

    // Get start of the week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
    startOfWeek.setHours(0, 0, 0, 0); // Set to midnight

    // Set end of the week to the current date and time
    const endOfWeek = today;

    return {
        start: startOfWeek.toISOString(),
        end: endOfWeek.toISOString(),
    };
}

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({});
    const [barChartData, setBarChartData] = useState({});
    const [locationData, setLocationData] = useState({});
    const [userData, setUserData] = useState({});
    const [dateFilter, setDateFilter] = useState({})
    const [filter,setFilter] = useState('Today')

    const startAndEndOfDay = getStartAndEndOfDay();
    const startAndEndOfWeek = getStartAndEndOfWeek();
    const [getDashBoardData] = useLazyQuery(GET_DASHBOARD_DATA, {
        onCompleted: data => {
            setLoading(false);
            setDashboardData(data)
            handleBarChartData(data.task_list)
            handleLocationData(data.location_list)
            handleUserData(data.user_list)
        }
    })

    const handleBarChartData = (data) => {
        const taskCount = data.reduce((acc, { fk_task_name }) => {
            acc[fk_task_name] = (acc[fk_task_name] || 0) + 1;
            return acc;
        }, {});
        const distinctTasks = Object.keys(taskCount);
        const counts = Object.values(taskCount);
        setBarChartData({
            names: distinctTasks,
            counts: counts
        })
    }

    const handleUserData = (data) => {
        const taskCount = data.reduce((acc, { fk_user_name }) => {
            acc[fk_user_name] = (acc[fk_user_name] || 0) + 1;
            return acc;
        }, {});
        const distinctTasks = Object.keys(taskCount);
        const counts = Object.values(taskCount);
        setUserData({
            names: distinctTasks,
            counts: counts
        })
    }

    const handleLocationData = (data) => {
        const taskCount = data.reduce((acc, { fk_location_name }) => {
            acc[fk_location_name] = (acc[fk_location_name] || 0) + 1;
            return acc;
        }, {});
        const distinctTasks = Object.keys(taskCount);
        const counts = Object.values(taskCount);
        setLocationData({
            names: distinctTasks,
            counts: counts
        })
    }

    useEffect(() => {
        const startAndEndOfDay = getStartAndEndOfDay()
        setDateFilter({
            start: startAndEndOfDay.startOfDayTimestamp,
            end: startAndEndOfDay.endOfDayTimestamp
        })
    }, []);

    useEffect(() => {
        setTimeout(() => {
            console.log(dateFilter)
            getDashBoardData({
                variables: {
                    startDate: dateFilter.start,
                    endDate: dateFilter.end,
                }
            })
        },1000)
    },[dateFilter])

    const pieChartOptions = {
        chart: {
            type: 'pie',
        },
        labels: userData.names,
        series: userData.counts,
    };

    const barChartOptions = {
        chart: {
            type: 'bar',
        },
        xaxis: {
            categories: barChartData.names,
        },
        colors: ['#008FFB'],
    };

    const barChartSeries = [
        {
            name: 'Revenue',
            data: barChartData.counts,
        },
    ];

    const handleFilterChange = (value) => {

        setFilter(value)

        if (value === 'Today') {
            setDateFilter({
                start: startAndEndOfDay.startOfDayTimestamp,
                end: startAndEndOfDay.endOfDayTimestamp
            });
        } else {
            setDateFilter({
                start: startAndEndOfWeek.start,
                end: startAndEndOfWeek.end
            });
        }
    };

    return (
        loading ? <Loading/> : (
            <div className="p-4">
                <Dropdown options={FilterType} onSelected={handleFilterChange}/>
                <div className="p-4 bg-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Total Revenue Card */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total Tasks</h2>
                        <p className="text-2xl">{dashboardData.tasks.aggregate.count}</p>
                        <p className="text-gray-500">{filter}</p>
                    </div>

                    {/* Visits Card */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total Locations</h2>
                        <p className="text-2xl">{dashboardData.locations.aggregate.count}</p>
                        <p className="text-gray-500">{filter}</p>
                    </div>

                    {/* Orders Card */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Total Users</h2>
                        <p className="text-2xl">{dashboardData.users.aggregate.count}</p>
                        <p className="text-gray-500">{filter}</p>
                    </div>

                    {/* Revenue Summary Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Tasks Summary</h2>
                        {/* Replace with your actual chart */}
                        <Chart
                            options={barChartOptions}
                            series={barChartSeries}
                            type="bar"
                            width="100%"
                        />
                    </div>

                    {/* Visits by Device Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">Location Summary</h2>
                        <Chart
                            options={{
                                labels: locationData.names,
                                colors: ['#008FFB', '#00E396'],
                            }}
                            series={locationData.counts}
                            type="donut"
                            width="100%"
                        />
                    </div>

                    {/* Browser Usage Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">User Chart</h2>
                        <Chart
                            options={pieChartOptions}
                            series={pieChartOptions.series}
                            type="pie"
                            width="100%"
                        />
                    </div>
                </div>
            </div>
        )
    );
};

export default Dashboard;