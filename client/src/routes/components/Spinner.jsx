import { PulseLoader } from 'react-spinners'
import '../../CSS/spinner.css'

export const Spinner = () => {
    return (
        <>
            <div className="spinner-overlay"> {/* Contenedor para centrar el spinner */}
                <div className="spinner-container"> {/* Contenedor para el spinner en sí */}
                    <PulseLoader
                        color="#4E98FF" // Color principal, puedes usar tu variable de color
                        loading={true} // Siempre visible mientras se usa
                        size={20} // Tamaño de cada punto del spinner
                        margin={2} // Espacio entre los puntos
                        speedMultiplier={1} // Velocidad de la animación
                    />
                </div>
            </div>
        </>
    )
}
