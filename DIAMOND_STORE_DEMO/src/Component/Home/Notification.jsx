import React from 'react';

const HomeNotification = () => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Thông báo quan trọng</h2>
                <div className="modal-body">
                    <p className="modal-description">
                        <strong>Server đã đóng!</strong>
                    </p>
                    <ul className="modal-list">
                        <li>Mọi chi tiết liên hệ email: <a href="mailto:hungse17002@gmail.com">hungse17002@gmail.com</a></li>
                        <li>Nhắc nhẹ: <span style={{color:"red"}}>Bạn gì đó hãy sống và hành xử tốt hơn.</span></li>
                    </ul>
                    <p className="modal-farewell">Thân ái và tạm biệt</p>
                </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background-color: white;
                    padding: 2rem;
                    border-radius: 8px;
                    max-width: 500px;
                    width: 90%;
                    text-align: left;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .modal-title {
                    color: #dc2626;
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                }
                .modal-body {
                    margin-bottom: 1.5rem;
                }
                .modal-description {
                    color: #1e40af;
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                .modal-list {
                    color: #4b5563;
                    margin-bottom: 1rem;
                    padding-left: 1.5rem;
                }
                .modal-list li {
                    margin-bottom: 0.5rem;
                    font-weight: bold;
                }
                .modal-farewell {
                    color: #4b5563;
                    font-style: italic;
                    text-align: center;
                }
            `}</style>
        </div>
    );
};

export default HomeNotification;