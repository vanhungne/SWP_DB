import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../Config/config";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Form, Row, Col } from 'react-bootstrap';
import '../../Scss/statisticsDashboard.scss';

const StatisticsDashboard = () => {
    const [dailyRevenue, setDailyRevenue] = useState(null);
    const [dailyOrderCount, setDailyOrderCount] = useState(null);
    const [monthlyRevenue, setMonthlyRevenue] = useState(null);
    const [monthlyOrderCount, setMonthlyOrderCount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchStatistics = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            const [dailyRevenueResponse, dailyOrderCountResponse, monthlyRevenueResponse, monthlyOrderCountResponse] = await Promise.all([
                axios.get(`${API_URL}order/daily-revenue?date=${date}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}order/daily-order-count?date=${date}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}order/revenue/monthly?month=${month}&year=${year}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get(`${API_URL}order/count/monthly?month=${month}&year=${year}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            setDailyRevenue(dailyRevenueResponse.data);
            setDailyOrderCount(dailyOrderCountResponse.data);
            setMonthlyRevenue(monthlyRevenueResponse.data.data);
            setMonthlyOrderCount(monthlyOrderCountResponse.data.data);
        } catch (err) {
            setError('Failed to fetch statistics. Please try again.');
            console.error('Error fetching statistics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [date, month, year]);

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const renderStatistic = (value, title, prefix = '') => (
        <div className="custom-dashboard-card h-100">
            <div className="custom-dashboard-card-body d-flex flex-column justify-content-center align-items-center">
                <h5 className="custom-dashboard-card-title mb-3">{title}</h5>
                <p className="custom-dashboard-card-text text-4xl font-bold">
                    {value !== null ? `${prefix}${typeof value === 'number' ? value.toFixed(2) : value}` : 'No information available'}
                </p>
            </div>
        </div>
    );

    return (
        <div className="custom-dashboard-container" style={{marginBottom:'10%'}}>
            <h2 className="custom-dashboard-title" style={{textAlign:'center'}}>Statistics Dashboard</h2>

            <Form className="custom-dashboard-form">
                <Row>
                    <Col xs={12} sm={4} className="custom-dashboard-form-group">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" value={date} onChange={handleDateChange} />
                    </Col>
                    <Col xs={12} sm={4} className="custom-dashboard-form-group">
                        <Form.Label>Month</Form.Label>
                        <Form.Control type="number" min="1" max="12" value={month} onChange={handleMonthChange} />
                    </Col>
                    <Col xs={12} sm={4} className="custom-dashboard-form-group">
                        <Form.Label>Year</Form.Label>
                        <Form.Control type="number" value={year} onChange={handleYearChange} />
                    </Col>
                </Row>
            </Form>

            {loading ? (
                <div className="custom-dashboard-loading">Loading statistics...</div>
            ) : error ? (
                <div className="custom-dashboard-error text-danger">{error}</div>
            ) : (
                <div className="custom-dashboard-content">
                    <Row className="mb-4">
                        <Col>{renderStatistic(dailyRevenue, 'Daily Revenue', '$')}</Col>
                        <Col>{renderStatistic(dailyOrderCount, 'Daily Order Count')}</Col>
                        <Col>{renderStatistic(monthlyRevenue, 'Monthly Revenue', '$')}</Col>
                        <Col>{renderStatistic(monthlyOrderCount, 'Monthly Order Count')}</Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <div className="custom-dashboard-card">
                                <div className="custom-dashboard-card-body">
                                    <h5 className="custom-dashboard-card-title">Revenue Trend</h5>
                                    {monthlyRevenue !== null ? (
                                        <ResponsiveContainer width="100%" height={400}>
                                            <LineChart data={[{name: 'Revenue', value: monthlyRevenue}]}> //ve bieu do duong
                                                <XAxis dataKey="name"/>
                                                <YAxis/>
                                                <CartesianGrid strokeDasharray="3 3"/>  //tạo lới cho đồ thị
                                                <Tooltip/>
                                                <Legend/> //hien thi chu thich cho gia tri
                                                <Line type="monotone" dataKey="value" stroke="#8884d8"/> //biểu đồ đường,su dung value lam gia tri
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p>No revenue data available for the selected period.</p>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    );
};

export default StatisticsDashboard;