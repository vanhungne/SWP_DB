import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_URL } from "../../Config/config";
import './Feedback.scss';

const FeedbackModal = ({ isOpen, onClose, orderId, userId, existingFeedback, onFeedbackSubmit }) => {
    const [rating, setRating] = useState(existingFeedback ? existingFeedback.rating : 0);
    const [comment, setComment] = useState(existingFeedback ? existingFeedback.comment : '');

    useEffect(() => {
        if (existingFeedback) {
            setRating(existingFeedback.rating);
            setComment(existingFeedback.comment);
        }
    }, [existingFeedback]);

    const handleSubmitFeedback = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}feedback/add`, {
                userId: userId,
                orderId: orderId,
                rating: rating,
                comment: comment
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert('Feedback submitted successfully!');
            onFeedbackSubmit(response.data);
            onClose();
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback. Please try again.');
        }
    };

    if (!isOpen) return null;

    if (existingFeedback) {
        return (
            <div className="feedback-modal">
                <div className="feedback-modal-content">
                    <h2>Your Feedback</h2>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= existingFeedback.rating ? 'star active' : 'star'}>
                                <FontAwesomeIcon icon={faStar} />
                            </span>
                        ))}
                    </div>
                    <p className="existing-comment">{existingFeedback.comment}</p>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-modal">
            <div className="feedback-modal-content">
                <h2>Please Rate Your Order</h2>
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={star <= rating ? 'star active' : 'star'}
                        >
                            <FontAwesomeIcon icon={faStar} />
                        </span>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave your comment here..."
                    className="feedback-comment"
                />
                <div className="feedback-buttons">
                    <button onClick={handleSubmitFeedback} className="submit-btn">Submit Feedback</button>
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;