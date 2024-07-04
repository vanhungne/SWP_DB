import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faComment } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";

const ViewFeedbackStaff = ({ orderId, userId }) => {
    const [feedbackData, setFeedbackData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}feedback/${userId}/${orderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setFeedbackData(response.data);
            } catch (error) {
                console.error('Feedback not found or error occurred:', error);
                setError(error.message || 'An error occurred while fetching feedback');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [orderId, userId]);

    if (loading) {
        return <div>Loading feedback...</div>;
    }

    if (error) {
        return <div>Error loading feedback: {error}</div>;
    }

    if (!feedbackData) {
        return <div>No feedback available for this order.</div>;
    }

    return (
        <div className="order-details-c__card feedback">
            <h2><FontAwesomeIcon icon={faComment}/> Feedback</h2>
            <div className="order-details-c__feedback-content">
                <p><strong>Rating:</strong> {feedbackData.rating} / 5</p>
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= feedbackData.rating ? 'star active' : 'star'}>
                            <FontAwesomeIcon icon={faStar}/>
                        </span>
                    ))}
                </div>
                <p><strong>Comment:</strong> {feedbackData.comment}</p>
            </div>
        </div>
    );
};

export default ViewFeedbackStaff;