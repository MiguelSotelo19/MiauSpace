import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BsSearch } from "react-icons/bs";

const Buscador = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        const searchTerm = e.target.value;
        setQuery(searchTerm);

        if (searchTerm.length > 2) {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/amistades/api/buscar_usuarios/?q=${searchTerm}`);
                setResults(response.data);
            } catch (error) {
                console.error("Error buscando usuarios:", error);
                setResults([]);
            }
        } else {
            setResults([]);
        }
    };

    return (
        <div className="relative w-full max-w-lg">
            <div className="d-flex align-items-center border rounded-lg p-2 shadow-md rounded-4">
                <div class="input-group flex-nowrap input-group-lg">
                    <span class="input-group-text" id="addon-wrapping" style={{ fontSize: '20px' }}><BsSearch /></span>
                    <input type="text" 
                    class="form-control" 
                    placeholder="Buscar usuarios..." 
                    aria-label="Username" 
                    aria-describedby="addon-wrapping" 
                    value={query}
                    onChange={handleSearch} />
                </div>

            </div>
            {results.length > 0 && (
                <div className="absolute w-full bg-white shadow-lg mt-2 p-2 rounded-lg max-h-60 overflow-y-auto">
                    {results.map((user) => (
                        <Link
                            to={`/MiauSpace/Perfil/${user.nombre}`}
                            key={user.id}
                            className="block text-black hover:bg-transparent hover:text-black cursor-pointer focus:ring-0"
                        >
                            <div
                                key={user.id}
                                style={{
                                    padding: '4px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    outline: 'none',
                                    transition: 'all 200ms ease',
                                    borderTop: '1px solid #d1d5db',
                                    backgroundColor: 'transparent'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <img
                                    src={user.foto_perfil}
                                    alt={user.nombre}
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        marginRight: '8px'
                                    }}
                                />
                                <span className="font-medium">{user.nombre}</span>
                            </div>

                        </Link>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Buscador;
