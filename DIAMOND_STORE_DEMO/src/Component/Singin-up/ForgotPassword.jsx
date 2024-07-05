import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../../Scss/Login.scss';
import { API_URL } from "../../Config/config";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function getcode(event) {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}login/forgotpassword`, {
                email
            });

            if (response.data.data) {
                iziToast.success({
                    title: 'Success',
                    message: 'Send verify code successful',
                    position: 'topRight',
                    timeout: 1500,
                    onClosing: () => {
                        navigate(`/reset-password/${email}`);
                    }
                });
            } else {
                iziToast.error({
                    title: 'Error',
                    message: 'Email does not exist or is not registered yet!',
                    position: 'topRight'
                });
            }
        } catch (err) {
            iziToast.error({
                title: 'Error',
                message: 'Email does not exist or is not registered yet!',
                position: 'topRight'
            });
        }
    }
    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="card shadow-lg p-4" style={{width: '400px'}}>
                <div className="card-body">
                    <h1 className="card-title text-center mb-4">ESTHER DIAMOND</h1>
                    <form onSubmit={getcode}>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="off"/>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <button type="submit" className="btn mt-4"
                                    style={{width: '50%',color:'white',backgroundColor:'blue'}}>
                                Get verify code
                            </button>
                        </div>
                    </form>
                    <hr/>
                </div>
            </div>
        </div>
    );
}

export default ForgotPass;