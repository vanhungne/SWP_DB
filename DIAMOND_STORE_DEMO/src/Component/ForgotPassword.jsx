import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import '../Scss/Login.scss';

function ForgotPass() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    async function getcode(event) {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/login/forgotpassword", {
                email
            });

            if (response.data.data) {
                Swal.fire({
                    icon: 'success',
                    title: 'Send verify code successful',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    // Redirect to verify registration page
                    navigate(`/reset-password/${email}`);
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Email is not exist or not register yet!',
                });
            }
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'ERROR',
                text: err.message,
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