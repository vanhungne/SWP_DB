import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faComment } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from "../../Config/config";
import Feedback from "./Feedback";

const ViewFeedback = ({ orderId, userId, orderStatus }) => {
    const [feedbackData, setFeedbackData] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
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
                if (error.response && error.response.status === 404) {
                    console.log('No feedback found for this order.');
                    setFeedbackData(null);
                } else {
                    console.error('Error occurred while fetching feedback:', error);
                    setError('An error occurred while fetching feedback. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [orderId, userId]);

    const handleLeaveFeedback = () => {
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackSubmit = (newFeedback) => {
        setFeedbackData(newFeedback);
    };

    if (loading) {
        return <div>Loading feedback...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="order-details-c__card feedback">
            <h2><FontAwesomeIcon icon={faComment}/> Feedback</h2>
            {feedbackData ? (
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
            ) : orderStatus === 'CONFIRMED' ? (
                <button onClick={handleLeaveFeedback} className="order-details-c__feedback-btn">
                    Leave Feedback
                </button>
            ) : (
                <p>Feedback can be left once the order is confirmed.</p>
            )}
            <Feedback
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                orderId={orderId}
                userId={userId}
                existingFeedback={feedbackData}
                onFeedbackSubmit={handleFeedbackSubmit}
            />
        </div>
    );
};

export default ViewFeedback;