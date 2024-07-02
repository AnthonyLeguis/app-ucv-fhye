import '../../CSS/footer.css'
import logo from '../../assets/LogoCentral.svg'

export const Footer = () => {
    return (
        <>
            <footer className='container-fluid d-flex flex-column flex-md-row text-white flex-wrap justify-content-around '>
                <div className='fs-6 text-center fw-bold'>
                    Todos los derechos reservados
                    <div>
                        &copy; {new Date().getFullYear()}
                    </div>
                </div>
                <div className='d-flex flex-column fs-6'>
                    <img src={logo} alt="Logo" className='img_logoFooter align-self-center' />
                    <div className='fw-bold fs-5'>
                        FHyE-APP
                    </div>
                    <h5 className='fs-6 fw-bold text-primary text-end'>
                    Admin
                    </h5>
                </div>
            </footer>
        </>
    )
}
