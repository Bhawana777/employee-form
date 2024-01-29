import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {useLocation, useNavigate} from 'react-router-dom';
import Select from 'react-select';
import '../css/style.css';

function Home (){
    const location=useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageData, setImageData] = useState(null);
    const [showStartButton, setShowStartButton] = useState(true);
    const [showAttachButton, setShowAttachButton] = useState(true);
    const [showCaptureButton, setShowCaptureButton] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [joinDate, setJoinDate] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [currency, setCurrency] = useState('');
    const [employeeData, setEmployeeData] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [statesOptions, setStateOptions] = useState([]);
    //const [currencyOptions, setCurrencyOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    useEffect(() => {
        // Fetch employee data from the backend when the component mounts
        fetchEmployeeData();
        fetchCountriesData();
    }, []);
    useEffect(() => {
        if (selectedCountry) {
            fetchStatesData(selectedCountry.value);
            fetchCurrenciesData(selectedCountry.value);
        }
    }, [selectedCountry]);
    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:3000/api/get-employeeData");
            const responseData = response.data;
            
            if (responseData.success) {
                const employeeDataArray = responseData.data;
                setEmployeeData(employeeDataArray);
            } else {
                console.error('Error fetching employee data:', responseData.msg);
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };
    const fetchCountriesData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:3002/api/get-countries");
            const data = response.data;
            
            if (data.success) {
                const countryOptions = data.data.map(country => ({
                    label: country.name,
                    value: country.code
                }));
                
                setCountryOptions(countryOptions);
         } else {
                console.error('Error fetching country data:', data.msg);
            }
        } catch (error) {
            console.error('Error fetching countries data:', error);
        }
    };
    const fetchStatesData = async (countryCode) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3002/api/get-states?code=${countryCode}`);
            const data = response.data;

            if (data.success) {
                const states = data.data.map(state => ({
                    label: state.name,
                    value: state.code
                }));
                setStateOptions(states);
            } else {
                console.error('Error fetching state data:', data.msg);
            }
        } catch (error) {
            console.error('Error fetching states data:', error);
        }
    };
    const fetchCurrenciesData = async (countryCode) => {
        try {
            const response = await axios.get(`http://127.0.0.1:3002/api/get-currency?code=${countryCode}`);
            const data = response.data;

            if (data.success) {
                //const currencies = [{
                //    label: data.data,
                //    value: data.data
                //}];
                //setCurrencyOptions(currencies);
                setCurrency(data.data);
            } else {
                console.error('Error fetching currency data:', data.msg);
            }
        } catch (error) {
            console.error('Error fetching currency data:', error);
        }
    };
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const countryValue = country.value;
        const stateValue = state.value;
        //const currencyValue = currency.value;
            console.log("Sending data to backend:", { firstName, joinDate, countryValue, stateValue, currency, imageData });
            const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('joinDate', joinDate);
        formData.append('country', countryValue);
        formData.append('state', stateValue);
        formData.append('currency', currency);
        
        // Check if imageData is available
        if (imageData) {
            const blob = await fetch(imageData).then(response => response.blob());
            formData.append('photo', blob, 'photo.jpg');
        } else if (document.getElementById('fileInput').files.length > 0) {
            const file = document.getElementById('fileInput').files[0];
            formData.append('photo', file);
        }
            await axios.post("http://localhost:8000/home", formData)
            //console.log(data); 
            setSubmitted(true);
        } catch (error) {
            console.error('Error saving employee data:', error);
        }
    };
    
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setShowStartButton(false);
            setShowAttachButton(false);
            setShowCaptureButton(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setShowStartButton(true);
        setShowAttachButton(true);
        setShowCaptureButton(false);
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/jpeg');
        setImageData(imageDataURL);
        stopCamera();
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageData(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="homepage">

            <h1>Hello {location.state.id} and welcome to the home</h1>
            <form className="form" action="POST" onSubmit={handleSubmit}>
                <div className="form-body">
                    <div className="username">
                    <label className="form__label" htmlFor="firstName">First Name </label>
                    <input className="form__input" type="text" id="firstName" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/> 
                    </div>
                    <div className="lastname">
                        <label className="form__label" htmlFor="joinDate">Employee Joining Date</label>
                        <input type="date" id="joinDate" className="form__input" value={joinDate} onChange={(e) => setJoinDate(e.target.value)} />
                    </div>
                    <div className="email">
                    <label className="form__label" htmlFor="country">Country</label>
                    <Select id="country" options={countryOptions || []} value={selectedCountry} onChange={(selectedOption) => {setCountry(selectedOption);setSelectedCountry(selectedOption);}}/>
                    
                     </div>
                    <div className="password">
                    <label className="form__label" htmlFor="country">State</label>
                        <Select id="state" options={statesOptions || []} value={state} onChange={(selectedOption) => setState(selectedOption)}/>
                    </div>
                    <div className="confirm-password">
                <label className="form__label" htmlFor="currency">Currency</label>
                <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} readOnly />
            </div>
                 <div className="camera">
                    <label className="form__label" htmlFor="country">Photo</label>
                <video ref={videoRef} autoPlay />
                {showStartButton && <button onClick={startCamera}>Start Camera</button>}
                {showCaptureButton && <button onClick={captureImage}>Capture Image</button>}
                {showAttachButton && <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} />}
            </div> 
            {imageData && (
                <div className="captured-image">
                    <h2>Captured Image</h2>
                    <img src={imageData} alt="Captured" />
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>
                    <input type="submit" className="btn" value="Submit" />
            </form>
            {submitted && (
            <div className="employee-grid">
                <h2>Employee Data</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Joining Date</th>
                            <th>Country</th>
                            <th>State</th>
                            <th>Currency</th>
                            <th>Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeData.map((employee, index) => (
                            <tr key={index}>
                                <td>{employee.id}</td>
                                <td>{employee.firstName}</td>
                                <td>{employee.joinDate}</td>
                                <td>{employee.country}</td>
                                <td>{employee.state}</td>
                                <td>{employee.currency}</td>
                                <td>{employee.photo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}

export default Home