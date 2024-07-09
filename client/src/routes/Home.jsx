import '../CSS/home.css'
import '../CSS/footer.css'
import img1 from '../assets/vitral1.jpg'
import logo from '../assets/LogoCentral.svg'
const img2 = 'https://i.ibb.co/47fyqtD/fondo-UCV2.jpg';

export const Home = () => {


  return (
    <>
      <section className="d-flex flex-column bg-primary-subtle m-0 p-0 overflow-hidden">
        <div>
          <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner ">
              <div className="carousel-item active" data-bs-interval="10000">
                <div className="carousel-caption d-md-block text-top blur_Efect">
                  <h5>Gestión de personal</h5>
                  <h6>Obtén información sobre tu estado administrativo dentro de la FHyE. <hr />La coordinación administrativa más cera de ti.
                  </h6>
                </div>
                <img src={img1} className="d-block w-100 mx-auto" alt="Vitral fondo" />
              </div>
              <div className="carousel-item" data-bs-interval="10000">
                <img src={img2} className="d-block w-100 mx-auto" alt="Nubes de calder fondo" />
                <div className="carousel-caption d-md-block text-top blur_Efect">
                  <h5>Ingresa al portal</h5>
                  <h6>Mantente al día con tu información administrativa</h6>
                </div>

              </div>

            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <footer className='container-fluid d-flex flex-column flex-md-row text-white flex-wrap justify-content-around m-0'>
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
      </section>

    </>
  )
}
