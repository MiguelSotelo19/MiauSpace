import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../screens/css/Registro.css';
import Swal from 'sweetalert2';
import axios from "axios";
import perfilGenerico from "../assets/perfilGenerico.jpg";
import profile1 from "../assets/profile1.jpg"
import profile2 from "../assets/profile2.jpg"
import profile3 from "../assets/profile3.jpg"

export const Registro = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [currentStep, setCurrentStep] = useState(1);
    const [opacity, setOpacity] = useState(0);
    const [scale, setScale] = useState(0.8);
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        nombre_usuario: '',
        correo: '',
        fecha_nacimiento: '',
        password: '',
        confirmPassword: '',
        foto_perfil: null,
        especie: '',
        edad: '',
        raza: '',
        sexo: '',
        ubicacion: '',
        preferencias: ''
    });


    useEffect(() => {
        setOpacity(1);
        setScale(1);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };



    const skipStep = async () => {
        if (currentStep === 2) {
            try {
                const mascotaId = localStorage.getItem('mascotaId');

                if (!mascotaId) {
                    toast.error('No se encontró el ID de la mascota');
                    return;
                }


                const randomImageBase64 = await getRandomProfileImage();


                await axios.patch(
                    `${API_URL}/mascotas/foto_perfil/${mascotaId}/`,
                    { foto_perfil: randomImageBase64 },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                setFormData(prev => ({
                    ...prev,
                    foto_perfil: randomImageBase64
                }));

                toast.info('Puedes cambiar tu foto más tarde desde tu perfil');
                setCurrentStep(3);
            } catch (error) {
                console.error(error);
                toast.error('No se pudo asignar una imagen de perfil');
            }
        } else if (currentStep === 3) {
            await Swal.fire({
                title: '¡Información guardada!',
                text: 'Puedes completar estos datos más tarde desde tu muro',
                icon: 'info',
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true,
                willClose: () => {
                    navigate('/');
                }
            });
        }
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{5,}$/;
        return regex.test(password);
    };

    const validateUsername = (username) => {
        const regex = /^[a-zA-Z]+$/;
        return regex.test(username);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmitStep1 = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.correo)) {
            toast.error('Por favor ingresa un correo electrónico válido', {
                autoClose: 5000,
                style: {
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                }
            });
            return;
        }

        const fechaNacimiento = new Date(formData.fecha_nacimiento);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaNacimiento > hoy) {
            toast.error('El usuario debe de haber nacido antes de hoy', {
                autoClose: 5000,
                style: {
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                }
            });
            return;
        }

        if (!validateUsername(formData.nombre_usuario)) {
            toast.error('El nombre de usuario solo puede contener letras', {
                autoClose: 5000,
                style: {
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                }
            });
            return;
        }

        if (!validatePassword(formData.password)) {
            toast.error('La contraseña debe contener al menos 5 carácteres, una mayúscula, un número y un carácter especial');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        try {
            const payload = {
                nombre_usuario: formData.nombre_usuario,
                correo: formData.correo,
                password: formData.password,
                fecha_nacimiento: formData.fecha_nacimiento
            };

            const response = await axios.post(`${API_URL}/mascotas/api/`, payload);

            if (response.status === 201) {
                localStorage.setItem('mascotaId', response.data.id);
                localStorage.setItem('mascotaNombre', formData.nombre_usuario);
                toast.success('Cuenta creada exitosamente!');
                setCurrentStep(2);
            } else {
                toast.error('No se pudo crear la cuenta. Inténtalo de nuevo');
                setFormData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                }));
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    if (error.response.data.nombre_usuario) {
                        toast.error('Este nombre de usuario ya existe');
                    } else if (error.response.data.correo) {
                        toast.error('Este correo electrónico ya está registrado');
                    } else {
                        toast.error('Datos inválidos. Verifica la información');
                    }
                } else {
                    toast.error('Error en el servidor. Inténtalo más tarde');
                }
            } else {
                toast.error('No se pudo conectar con el servidor');
            }
            setFormData(prev => ({
                ...prev,
                password: '',
                confirmPassword: ''
            }));
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64Image = await convertToBase64(file);
                setFormData({
                    ...formData,
                    foto_perfil: base64Image
                });
            } catch (error) {
                toast.error('Error al procesar la imagen');
                console.error(error);
            }
        }
    };


    const handleSubmitStep2 = async () => {
        try {
            const mascotaId = localStorage.getItem('mascotaId');

            if (!mascotaId) {
                toast.error('No se encontró el ID de la mascota');
                return;
            }

            if (!formData.foto_perfil) {
                toast.error('Por favor selecciona una imagen');
                return;
            }

            const response = await axios.patch(
                `${API_URL}/mascotas/foto_perfil/${mascotaId}/`,
                {
                    foto_perfil: formData.foto_perfil
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                toast.success('Foto de perfil actualizada correctamente!');
                setCurrentStep(3);
            } else {
                toast.error('Error al actualizar la foto de perfil');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al subir la foto de perfil');
        }
    };

    const handleSubmitStep3 = async (e) => {
        e.preventDefault();

        const campos = ['especie', 'raza', 'ubicacion'];
        for (const campo of campos) {
            if (formData[campo]?.length > 30) {
                toast.error(`El campo ${campo} excede el límite de 30 caracteres`);
                return;
            }
        }

        try {
            const mascotaId = localStorage.getItem('mascotaId');

            if (!mascotaId) {
                toast.error('No se encontró el ID de la mascota');
                return;
            }

            const payload = {
                especie: formData.especie,
                edad: parseInt(formData.edad),
                raza: formData.raza,
                sexo: formData.sexo,
                ubicacion: formData.ubicacion,
                preferencias: formData.preferencias
            };

            const response = await axios.put(
                `${API_URL}/mascotas/actualizar/${mascotaId}/`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {

                await Swal.fire({
                    title: '¡Enhorabuena!',
                    text: 'Tus datos se han guardado. Ahora inicia sesión con tus credenciales',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    willClose: () => {
                        localStorage.removeItem('mascotaId');
                        localStorage.removeItem('mascotaNombre');
                        navigate('/');
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar los datos');
        }
    };

    const getRandomProfileImage = async () => {
        const images = [profile1, profile2, profile3];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const response = await fetch(randomImage);
        const blob = await response.blob();
        return await convertToBase64(blob);
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ top: '20px' }}
                className="toast-container-custom"
            />

            <div className="registro-container d-flex justify-content-center align-items-center min-vh-100">
                <div
                    className="card shadow-lg p-4 mb-5 bg-body rounded"
                    style={{
                        opacity: opacity,
                        transform: `scale(${scale})`,
                        transition: 'all 0.5s ease',
                        width: '90%',
                        maxWidth: '600px',
                        marginTop: '40px'
                    }}
                >
                    <div className="step-indicator text-end mb-3">
                        <span className="text-primary fw-bold">Paso {currentStep} de 3</span>
                    </div>

                    {currentStep === 1 && (
                        <div className="step-content">
                            <h1 className="text-center mb-4">Crea tu cuenta</h1>
                            <form onSubmit={handleSubmitStep1}>
                                <div className="mb-3">
                                    <label htmlFor="nombre_usuario" className="form-label">Nombre de usuario</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_usuario"
                                        name="nombre_usuario"
                                        value={formData.nombre_usuario}
                                        onChange={handleInputChange}
                                        pattern="[a-zA-Z]+"
                                        title="Solo letras están permitidas"
                                        required
                                    />
                                    <small className="text-muted">
                                        Solo letras (no se permiten números, espacios o caracteres especiales)
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="correo" className="form-label">Correo electrónico</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="correo"
                                        name="correo"
                                        value={formData.correo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <small className="text-muted">
                                        Ejemplo: usuario@dominio.com
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fecha_nacimiento" className="form-label">Fecha de nacimiento de la mascota</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_nacimiento"
                                        name="fecha_nacimiento"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleInputChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <small className="text-muted">
                                        Debe contener al menos 5 carácteres, una mayúscula, un número y un carácter especial
                                    </small>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">Repetir contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Crear cuenta</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step-content text-center">
                            <h1 className="mb-4">Añade una foto de perfil</h1>
                            <div className="mb-4 position-relative">
                                <label htmlFor="foto-perfil" className="d-block">
                                    <div className="profile-picture-container mx-auto">
                                        {formData.foto_perfil ? (
                                            <img
                                                src={formData.foto_perfil}
                                                alt="Preview"
                                                className="profile-picture rounded-circle"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="profile-picture-placeholder rounded-circle d-flex justify-content-center align-items-center">
                                                <i className="bi bi-camera fs-1 text-muted"></i>
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="foto-perfil"
                                    className="d-none"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="d-grid mb-3">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSubmitStep2}
                                    disabled={!formData.foto_perfil}
                                >
                                    Subir imagen
                                </button>
                            </div>
                            <div className="text-center">
                                <button
                                    type="button"
                                    className="btn btn-link text-primary text-decoration-underline p-0"
                                    onClick={skipStep}
                                >
                                    Omitir
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step-content">
                            <button
                                type="button"
                                className="btn btn-link text-primary text-decoration-underline p-0 mb-3"
                                onClick={skipStep}
                            >
                                Omitir
                            </button>
                            <h1 className="text-center mb-3">Queremos conocerte</h1>
                            <h3 className="text-center text-muted mb-4">Añade información a tu perfil para que otras mascotas puedan saber de ti</h3>
                            <form onSubmit={handleSubmitStep3}>

                                <div className="mb-3">
                                    <label htmlFor="especie" className="form-label">Especie</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="especie"
                                        name="especie"
                                        value={formData.especie}
                                        onChange={handleInputChange}
                                        maxLength={30}
                                    />
                                    {formData.especie?.length > 30 && (
                                        <small className="text-danger">Excediste el número de letras para este campo</small>
                                    )}
                                </div>


                                <div className="mb-3">
                                    <label htmlFor="edad" className="form-label">Edad (años)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="edad"
                                        name="edad"
                                        value={formData.edad > 0 ? formData.edad : ''}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (!isNaN(value) && value > 0) {
                                                handleInputChange({
                                                    target: {
                                                        name: e.target.name,
                                                        value: value
                                                    }
                                                });
                                            } else if (e.target.value === '') {
                                                handleInputChange(e);
                                            }
                                        }}
                                        min="1"
                                        onKeyDown={(e) => {
                                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onBlur={() => {
                                            if (formData.edad <= 0) {
                                                toast.error('La edad debe ser mayor a 0', {
                                                    autoClose: 3000
                                                });
                                            }
                                        }}
                                    />
                                    {formData.edad <= 0 && (
                                        <small className="text-danger">La edad debe ser mayor a 0</small>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="raza" className="form-label">Raza</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="raza"
                                        name="raza"
                                        value={formData.raza}
                                        onChange={handleInputChange}
                                        maxLength={30}
                                    />
                                    {formData.raza?.length > 30 && (
                                        <small className="text-danger">Excediste el número de letras para este campo</small>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="sexo" className="form-label">Sexo</label>
                                    <select
                                        className="form-select"
                                        id="sexo"
                                        name="sexo"
                                        value={formData.sexo}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Macho">Macho</option>
                                        <option value="Hembra">Hembra</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ubicacion"
                                        name="ubicacion"
                                        value={formData.ubicacion}
                                        onChange={handleInputChange}
                                        maxLength={30}
                                    />
                                    {formData.ubicacion?.length > 30 && (
                                        <small className="text-danger">Excediste el número de letras para este campo</small>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="preferencias" className="form-label">Preferencias</label>
                                    <textarea
                                        className="form-control"
                                        id="preferencias"
                                        name="preferencias"
                                        rows="4"
                                        value={formData.preferencias}
                                        onChange={handleInputChange}
                                        maxLength={80}
                                    ></textarea>
                                    {formData.preferencias?.length > 80 && (
                                        <small className="text-danger">Excediste el número de letras para este campo</small>
                                    )}
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">Registrar información</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};